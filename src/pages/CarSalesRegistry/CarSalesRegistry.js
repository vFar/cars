import React, { useEffect, useState, useMemo, useRef } from "react";
import { AgGridReact } from "ag-grid-react";
import PdfDocument from "../PdfDocument";
import { PDFDownloadLink } from "@react-pdf/renderer";
import {
  Button,
  Form,
  Input,
  InputNumber,
  Select,
  DatePicker,
  Modal,
  Timeline,
} from "antd";
import {
  SettingOutlined,
  InsertRowBelowOutlined,
  EditOutlined,
} from "@ant-design/icons";
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
const { RangePicker } = DatePicker;
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
      const newSalesData = { ...salesFormData, date: dateValue };

      setsalesRowData((prevData) => [...prevData, newSalesData]);
      setsalesFormData({});
      setIsModalOpen2(false);

      setFilteredSalesRowData((prevData) => [...prevData, newSalesData]);
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
  const allStatuses = [
    "New request received",
    "Evaluation has begun",
    "Received a rating",
    "Car sale has begun",
    "Car sale has completed",
    "Buyer has received a sales contract",
    "Sold - Contract received from buyer",
    "Vehicle has been delivered to buyer",
    "Canceled",
  ];

  const [selectedStatus, setSelectedStatus] = useState(allStatuses[0]);

  const updateAvailableStatuses = (selected) => {
    const selectedIndex = allStatuses.indexOf(selected);

    if (selectedIndex === -1) {
      return allStatuses;
    }

    const availableStatuses = [
      allStatuses[selectedIndex - 1],
      allStatuses[selectedIndex],
      allStatuses[selectedIndex + 1],
    ].filter((status) => status !== undefined);

    if (!availableStatuses.includes(allStatuses[8])) {
      availableStatuses.push(allStatuses[8]);
    }

    return availableStatuses;
  };

  const [availableStatuses, setAvailableStatuses] = useState(
    updateAvailableStatuses(selectedStatus)
  );

  const handleStatusChange = (value) => {
    setSelectedStatus(value);
    setAvailableStatuses(updateAvailableStatuses(value));
  };
  const [filteredSalesRowData, setFilteredSalesRowData] =
    useState(salesRowData);

  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const handleDateRangeChange = (dates, dateStrings) => {
    setStartDate(dateStrings[0]);
    setEndDate(dateStrings[1]);
    const filteredData = salesRowData.filter((row) => {
      const date = moment(row.date, "YYYY-MM-DD");
      return date.isBetween(dateStrings[0], dateStrings[1], null, "[]");
    });

    setFilteredSalesRowData(filteredData);
  };
  const [selectedRowForEdit, setSelectedRowForEdit] = useState(null);
  const [editedRowData, setEditedRowData] = useState(null);
  const updateLocalStorageData = (data) => {
    localStorage.setItem("salesRowData", JSON.stringify(data));
  };

  const filteredDataWithStatus = filteredSalesRowData.filter((item) => {
    return (
      item.salestatus === "Sold - Contract received from buyer" ||
      item.salestatus === "Vehicle has been delivered to buyer"
    );
  });
  const rowCount = filteredDataWithStatus.length;

  const totalFullPrice = filteredDataWithStatus.reduce((total, item) => {
    return total + parseFloat(item.fullprice);
  }, 0);

  const isDataChanged = (editedData, originalData) => {
    return (
      editedData.vehicle !== originalData.vehicle ||
      editedData.salestatus !== originalData.salestatus ||
      editedData.appraiser !== originalData.appraiser ||
      editedData.netoprice !== originalData.netoprice ||
      editedData.vatrate !== originalData.vatrate ||
      editedData.fullprice !== originalData.fullprice ||
      editedData.date !== originalData.date
    );
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
          <div style={{ display: "flex", gap: "50px" }}>
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
                  placeholder="Status"
                  value={selectedStatus}
                  onChange={(value) => {
                    setSelectedStatus(value);
                    handleStatusChange(value);
                    setsalesFormData({ ...salesFormData, salestatus: value });
                  }}
                >
                  {availableStatuses.map((status) => (
                    <Select.Option key={status} value={status}>
                      {status}
                    </Select.Option>
                  ))}
                </Select>
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
                { children: "Evaluation has begun", color: "gray" },
                { children: "Received a rating", color: "gray" },
                { children: "Car sale has begun", color: "gray" },
                { children: "Car sale has completed", color: "gray" },
                {
                  children: "Buyer has received a sales contract",
                  color: "gray",
                },
                {
                  children: "Sold - Contract received from buyer",
                  color: "gray",
                },
                {
                  children: "Vehicle has been delivered to buyer",
                  color: "gray",
                },
                { children: "Canceled", color: "red" },
              ]}
            ></Timeline>
          </div>
        </Modal>

        <Button
          icon={<EditOutlined />}
          onClick={() => {
            setIsModalOpen3(true);
            setEditedRowData(selectedRowForEdit);
          }}
        >
          Edit Record
        </Button>

        <Modal
          title="Edit Record"
          open={isModalOpen3}
          onOk={() => {
            if (isDataChanged(editedRowData, selectedRowForEdit)) {
              const updatedData = filteredSalesRowData.map((row) =>
                row === selectedRowForEdit ? editedRowData : row
              );
              setFilteredSalesRowData(updatedData);
              updateLocalStorageData(updatedData);
            }
            setIsModalOpen3(false);
          }}
          onCancel={() => {
            setIsModalOpen3(false);
          }}
        >
          <div style={{ display: "flex" }}>
            <Form
              initialValues={selectedRowForEdit}
              onValuesChange={(changedValues) => {
                setEditedRowData((prevData) => ({
                  ...prevData,
                  ...changedValues,
                }));
              }}
            >
              <Form.Item label="Vehicle" name="vehicle">
                <Select
                  showSearch
                  optionFilterProp="children"
                  filterOption={filterOption}
                  options={numberplates.map((numberplate) => ({
                    value: numberplate,
                    label: numberplate,
                  }))}
                />
              </Form.Item>

              <Form.Item label="Status" name="salestatus">
                <Select
                  value={selectedStatus}
                  onChange={(value) => {
                    setSelectedStatus(value);
                    handleStatusChange(value);
                   
                  }}
                >
                  {availableStatuses.map((status) => (
                    <Select.Option key={status} value={status}>
                      {status}
                    </Select.Option>
                  ))}
                </Select>
              </Form.Item>

              <Form.Item label="Appraiser" name="appraiser">
                <Input
            
                />
              </Form.Item>

              <Form.Item label="Neto price" name="netoprice">
                <Input
                  disabled
                  addonBefore="€"
                  type="number"
                 
                />
              </Form.Item>

              <Form.Item label="VAT Rate ">
                <Input
                  disabled
                  addonAfter="%"
                  type="number"
                  
                />
              </Form.Item>

              <Form.Item label="Full price" name="fullprice">
                <Input
                  disabled
                  addonBefore="€"
                  type="number"
                  
    
                />
              </Form.Item>
            </Form>

            <Timeline
              items={[
                { children: "New request received", color: "green" },
                { children: "Evaluation has begun", color: "gray" },
                { children: "Received a rating", color: "gray" },
                { children: "Car sale has begun", color: "gray" },
                { children: "Car sale has completed", color: "gray" },
                {
                  children: "Buyer has received a sales contract",
                  color: "gray",
                },
                {
                  children: "Sold - Contract received from buyer",
                  color: "gray",
                },
                {
                  children: "Vehicle has been delivered to buyer",
                  color: "gray",
                },
                { children: "Canceled", color: "red" },
              ]}
            ></Timeline>
          </div>
        </Modal>
        <RangePicker
          style={{ marginBottom: "16px" }}
          onChange={handleDateRangeChange}
        />
        <Button>
          <PDFDownloadLink
            document={
              <PdfDocument
                data={filteredDataWithStatus}
                startDate={startDate}
                endDate={endDate}
                rowCount={rowCount}
                totalFullPrice={totalFullPrice}
              />
            }
            fileName="sales_data.pdf"
          >
            {({ loading }) =>
              loading ? "Loading document..." : "Download PDF"
            }
          </PDFDownloadLink>
        </Button>
        <div
          className="ag-theme-balham"
          style={{ height: "80vh", width: "100%" }}
        >
          <AgGridReact
            ref={gridRef}
            rowData={filteredSalesRowData}
            columnDefs={columnDefs}
            defaultColDef={defaultColDef}
            editType={"fullRow"}
            rowSelection="multiple"
            pagination={true}
            paginationPageSize={50}
            onRowSelected={(event) => {
              if (event.node.isSelected()) {
                setSelectedRowForEdit(event.data);
              } else {
                setSelectedRowForEdit(null);
              }
            }}
          ></AgGridReact>
        </div>
      </div>
    </>
  );
}

export default CarSalesRegistry;
