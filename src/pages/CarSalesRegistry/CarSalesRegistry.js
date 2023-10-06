import React, {
  useEffect,
  useState,
  useMemo,
  useRef,
  useCallback,
} from "react";
import { AgGridReact } from "ag-grid-react";
import { Button, Form, Input, Select, DatePicker, InputNumber } from "antd";
import { Link } from "react-router-dom";
import "../style.css";

import "ag-grid-community/styles/ag-grid.css";
import "ag-grid-community/styles/ag-theme-balham.css";
import moment from "moment";
import numericCellEditor from "./numericCellEditor.jsx";

function CarSalesRegistry() {
  const [salesFormValid, setsalesFormValid] = useState(false);
  const [salesFormData, setsalesFormData] = useState(() => {
    const salesSavedData = localStorage.getItem("salesFormData");
    const salesParsedData = salesSavedData ? JSON.parse(salesSavedData) : {};
    if (salesParsedData.date) {
      salesParsedData.date = moment(salesParsedData.date);
    }
    return salesParsedData;
  });
  const [salesRowData, setsalesRowData] = useState(() => {
    const savedsalesRowData = localStorage.getItem("salesRowData");
    return savedsalesRowData ? JSON.parse(savedsalesRowData) : [];
  });

  useEffect(() => {
    localStorage.setItem("salesFormData", JSON.stringify(salesFormData));
  }, [salesFormData]);

  useEffect(() => {
    localStorage.setItem("salesRowData", JSON.stringify(salesRowData));
  }, [salesRowData]);

  const savedNumberplates = localStorage.getItem("numberplates");
  const numberplates = savedNumberplates ? JSON.parse(savedNumberplates) : [];

  const handleFormSubmit = () => {
    if (salesFormValid) {
      const dateValue = salesFormData.date
        ? salesFormData.date.format("YYYY-MM-DD")
        : "";
      const newsalesData = { ...salesFormData, date: dateValue };
      setsalesRowData([...salesRowData, newsalesData]);
      setsalesFormData({});
      console.log(salesRowData);
    }
  };

  const [columnDefs] = useState([
    {
      field: "vehicle",
      headerName: "Vehicle",
      cellEditor: "agSelectCellEditor",
      cellEditorParams: {
        values: numberplates,
      },
    },
    {
      field: "salestatus",
      headerName: "Status",
      cellEditor: "agSelectCellEditor",
      cellEditorParams: {
        values: ["qeqeqeqe", "bbbbbbbbbbbbbb"],
      },
    },
    { field: "appraiser", headerName: "Appraiser" },
    { field: "netoprice", headerName: "Neto price"},
    { field: "vatrate", headerName: "VAT rate" },
    { field: "fullprice", headerName: "Full price" },
    { field: "date", headerName: "Date" },
  ]);
  useEffect(() => {
    checksalesFormValidity();
  });

  const checksalesFormValidity = () => {
    const {
      vehicle,
      salestatus,
      appraiser,
      date,
    } = salesFormData;

    const issalesFormValid =
      vehicle &&
      salestatus &&
      appraiser &&
      date;

    setsalesFormValid(issalesFormValid);
  };

  const defaultColDef = useMemo(() => {
    return {
      flex: 1,
      editable: true,
      cellDataType: false,
    };
  }, []);

  const gridRef = useRef();

  const handleCellValueChanged = () => {
    const updatedData = gridRef.current.api
      .getModel()
      .rowsToDisplay.map((rowNode) => {
        return rowNode.data;
      });
    setsalesRowData(updatedData);
  };

  return (
    <>
      <nav className="navbar">
        <Link to="/" className="btn">
          <Button type="primary">Vehicle Registry</Button>
        </Link>

        <Link to="/echarts" className="btn">
          <Button type="primary">Echarts</Button>
        </Link>

        <Button type="primary">Generate PDF Document</Button>
      </nav>
      <Form layout="inline">
        <Form.Item>
          <InputNumber
            type="number"
            style={{ width: 145 }}
            controls={false}
            min={0}
            max={100}
            suffix="%"
            placeholder="Default VAT rate"
          />
        </Form.Item>

        <Form.Item>
          <Button type="primary" htmlType="submit">
            OK
          </Button>
        </Form.Item>
      </Form>

      <Form layout="inline" className="form">
        <Form.Item>
          <Select
            placeholder="Vehicle"
            value={salesFormData.vehicle}
            onChange={(value) =>
              setsalesFormData({ ...salesFormData, vehicle: value })
            }
            options={numberplates.map((numberplate) => ({
              value: numberplate,
              label: numberplate,
            }))}
          />
        </Form.Item>
        <Form.Item>
          <Select
            placeholder="Status"
            style={{ width: 260 }}
            value={salesFormData.salestatus}
            options={[
              {
                value: "New request received",
                label: "New request received",
              },
              {
                value: "Evaluation has begun",
                label: "Evaluation has begun",
              },
              {
                value: "Received a rating",
                label: "Received a rating",
              },
              {
                value: "Car sale has begun",
                label: "Car sale has begun",
              },
              {
                value: "Car sale has completed",
                label: "Car sale has completed",
              },
              {
                value: "Buyer has received a sales contract",
                label: "Buyer has received a sales contract",
              },
              {
                value: "Sold - Contract received from buyer",
                label: "Sold - Contract received from buyer",
              },
              {
                value: "Vehicle has been delivered to buyer",
                label: "Vehicle has been delivered to buyer",
              },
              {
                value: "Canceled",
                label: "Canceled",
              },
            ]}
            onChange={(value) =>
              setsalesFormData({ ...salesFormData, status: value })
            }
          />
        </Form.Item>
        <Form.Item>
          <Input
            placeholder="Appraiser"
            onChange={(e) =>
              setsalesFormData({ ...salesFormData, appraiser: e.target.value })
            }
            value={salesFormData.appraiser}
          />
        </Form.Item>

        {/* <Form.Item>
          <InputNumber
            placeholder="Neto"
            controls={false}
            type="decimal"
            min={0}
            prefix="€"
            value={salesFormData.netoprice}
            formatter={(value) => value.replace(/\B(?=(\d{3})+(?!\d))/g, ",")}
            onChange={(value) =>
              setsalesFormData({ ...salesFormData, netoprice: value })
            }
          ></InputNumber>
        </Form.Item>

        <Form.Item>
          <InputNumber
            controls={false}
            placeholder="VAT"
            min={0}
            max={100}
            suffix="%"
            value={salesFormData.vatrate}
            onChange={(value) =>
              setsalesFormData({ ...salesFormData, vatrate: value })
            }
          />
        </Form.Item> */}

        <Form.Item>
          <DatePicker
            placeholder={"Date"}
            value={salesFormData.date}
            defaultValue={moment()}
            onChange={(date) =>
              setsalesFormData({ ...salesFormData, date: date })
            }
          />
        </Form.Item>
        <Form.Item>
          <Button
            onClick={handleFormSubmit}
            disalbed={!salesFormValid}
            type="primary"
          >
            OK
          </Button>
        </Form.Item>
      </Form>

      <div
        className="ag-theme-balham"
        style={{ height: "80vh", width: "100%" }}
      >
        <AgGridReact
          ref={gridRef}
          rowData={salesRowData}
          columnDefs={columnDefs}
          defaultColDef={defaultColDef}
          editType={"fullRow"}
          onCellValueChanged={handleCellValueChanged}
          pagination={true}
          paginationPageSize={20}
        ></AgGridReact>
      </div>
    </>
  );
}

export default CarSalesRegistry;
