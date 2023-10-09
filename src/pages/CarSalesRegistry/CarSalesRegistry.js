import React, { useEffect, useState, useMemo, useRef } from "react";
import { AgGridReact } from "ag-grid-react";
import {
  Button,
  Form,
  Input,
  InputNumber,
  Select,
  DatePicker,
  Modal,
  Timeline
} from "antd";
import { SettingOutlined, InsertRowBelowOutlined, EditOutlined } from "@ant-design/icons";
import "ag-grid-community/styles/ag-grid.css";
import "ag-grid-community/styles/ag-theme-balham.css";

//nestrada RichSelect
import { ModuleRegistry } from "@ag-grid-community/core";
import { ClientSideRowModelModule } from "@ag-grid-community/client-side-row-model";
import { RichSelectModule } from "@ag-grid-enterprise/rich-select";

import moment from "moment";
import "../style.css";

import { Link } from "react-router-dom";

// nestrada
ModuleRegistry.registerModules([ClientSideRowModelModule, RichSelectModule]);

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

  const [columnDefs] = useState([
    {
      field: "vehicle",
      headerName: "Vehicle",
      cellEditor: "agRichSelectCellEditor",
      cellEditorParams: {
        values: numberplates,
        filterList: true,
        searchType: "match",
        allowTyping: true,
        valueListMaxHeight: 220,
      },
    },
    {
      field: "salestatus",
      headerName: "Status",
      cellEditor: "agSelectCellEditor",
      cellEditorParams: {
        values: [
          "New request received",
          "Evaluation has begun",
          "Received a rating",
          "Car sale has begun",
          "Car sale has completed",
          "Buyer has received a sales contract",
          "Sold - Contract received from buyer",
          "Vehicle has been delivered to buyer",
        ],
      },
    },
    { field: "appraiser", headerName: "Appraiser" },
    { field: "netoprice", headerName: "Neto price" },
    { field: "vatrate", headerName: "VAT rate" },
    { field: "fullprice", headerName: "Full price" },
    { field: "date", headerName: "Date", cellDataType: "dateString" },
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

  const filterOption = (input, option) =>
    (option?.label ?? "").toLowerCase().includes(input.toLowerCase());

  //Modal
  const [isModalOpen1, setIsModalOpen1] = useState(false);
  const [isModalOpen2, setIsModalOpen2] = useState(false);
  const [isModalOpen3, setIsModalOpen3] = useState(false);

  const handleFormSubmit = () => {
    if (salesFormValid) {
      const dateValue = salesFormData.date
        ? salesFormData.date.format("YYYY-MM-DD")
        : "";
      const newsalesData = { ...salesFormData, date: dateValue };
      setsalesRowData([...salesRowData, newsalesData]);
      setsalesFormData({});

      setIsModalOpen2(false);
    }
  };

  // const showModal = () => {
  //   setIsModalOpen(true);
  // };
  // const handleOk = () => {
  //   setIsModalOpen(false);
  // };
  // const handleCancel = () => {
  //   setIsModalOpen(false);
  // };


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
        <Button
          icon={<SettingOutlined />}
          onClick={() => setIsModalOpen1(true)}
        ></Button>

        <Modal
          title="VAT value"
          htmlType="submit"
          open={isModalOpen1}
          okText="Set Default VAT Value"
          onOk={() => setIsModalOpen1(false)}
          onCancel={() => setIsModalOpen1(false)}
        >
          <Form>
            <Form.Item label="Default VAT rate: ">
              <InputNumber
                type="number"
                controls={false}
                min={0}
                max={100}
                suffix="%"
              />
            </Form.Item>
          </Form>
        </Modal>

        <Button
          icon={<InsertRowBelowOutlined />}
          onClick={() => setIsModalOpen2(true)}
        >
          Add
        </Button>

        <Modal
          title="Add Record"
          open={isModalOpen2}
          onOk={handleFormSubmit}
          okButtonProps={{
            disabled: !salesFormValid,
          }}
          onCancel={() => setIsModalOpen2(false)}
        >
          <div style={{ display: "flex", gap: "50px"}}>
            <Form className="form">
              <Form.Item label="Vehicle">
                <Select
                  showSearch
                  optionFilterProp="children"
                  filterOption={filterOption}
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
              <Form.Item label="Status">
                <Select
                  value={salesFormData.salestatus}
                  onChange={(value) =>
                    setsalesFormData({ ...salesFormData, salestatus: value })
                  }
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
                />
              </Form.Item>
              <Form.Item label="Appraiser">
                <Input
                  value={salesFormData.appraiser}
                  onChange={(e) =>
                    setsalesFormData({
                      ...salesFormData,
                      appraiser: e.target.value,
                    })
                  }
                />
              </Form.Item>
              <Form.Item label="Date">
                <DatePicker
                  value={salesFormData.date}
                  onChange={(date) =>
                    setsalesFormData({ ...salesFormData, date: date })
                  }
                />
              </Form.Item>
            </Form>

            <Timeline
              items={[
                { children: "New request received", color: "green" },
                { children: "Evaluation has begun", color: "gray", },
                { children: "Received a rating", color: "gray" },
                { children: "Car sale has begun", color: "gray", },
                { children: "Car sale has completed", color: "gray" },
                { children: "Buyer has received a sales contract", color: "gray", },
                { children: "Sold - Contract received from buyer", color: "gray", },
                { children: "Vehicle has been delivered to buyer", color: "gray" },
                { children: "Canceled", color: "red", },

              ]}
            ></Timeline>
          </div>
        </Modal>
        

        <Button icon={<EditOutlined />} onClick={() => setIsModalOpen3(true)}>
          Edit Record
        </Button>

        <Modal title="fuck you" open={isModalOpen3}  onOk={() => setIsModalOpen3(false)} onCancel={() => setIsModalOpen3(false)}>
          <Form>
            <Form.Item>

            </Form.Item>
          </Form>
        </Modal>

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
            rowSelection="multiple"
            onCellValueChanged={handleCellValueChanged}
            pagination={true}
            paginationPageSize={50}
          ></AgGridReact>
        </div>
      </div>
    </>
  );
}

export default CarSalesRegistry;
