import React, { useEffect, useState, useMemo, useRef } from "react";
import { AgGridReact } from "ag-grid-react";
import { Button, Form, Input, InputNumber, Select, DatePicker } from "antd";
import "ag-grid-community/styles/ag-grid.css";
import "ag-grid-community/styles/ag-theme-balham.css";
import moment from "moment";
import "../style.css";

import { Link } from "react-router-dom";

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
    { field: "netoprice", headerName: "Neto price" },
    { field: "vatrate", headerName: "VAT rate" },
    { field: "fullprice", headerName: "Full price" },
    { field: "date", headerName: "Date" },
  ]);
  useEffect(() => {
    checksalesFormValidity();
  });

  const checksalesFormValidity = () => {
    const { vehicle, salestatus, appraiser, date } = salesFormData;

    const issalesFormValid = vehicle && salestatus && appraiser && date;

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
      <div>
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
              value={salesFormData.salestatus}
              onChange={(value) =>
                setsalesFormData({ ...salesFormData, salestatus: value })
              }
              options={[
                {
                  value: "adsads",
                  label: "asdasdasd",
                },
                {
                  value: "tererre",
                  label: "rrtrtere",
                },
              ]}
            />
          </Form.Item>
          <Form.Item>
            <Input
              placeholder="Appraiser"
              value={salesFormData.appraiser}
              onChange={(e) =>
                setsalesFormData({
                  ...salesFormData,
                  appraiser: e.target.value,
                })
              }
            />
          </Form.Item>
          <Form.Item>
            <DatePicker
              placeholder={"Date"}
              value={salesFormData.date}
              onChange={(date) =>
                setsalesFormData({ ...salesFormData, date: date })
              }
            />
          </Form.Item>

          <Form.Item>
            <Button
              type="primary"
              htmlType="submit"
              onClick={handleFormSubmit}
              disabled={!salesFormValid}
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
      </div>
    </>
  );
}

export default CarSalesRegistry;
