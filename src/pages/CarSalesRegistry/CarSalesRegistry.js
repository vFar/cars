import React, {
  useEffect,
  useState,
  useMemo,
  useRef,
  useCallback,
} from "react";
import { AgGridReact } from "ag-grid-react";
import {
  Button,
  Form,
  Input,
  InputNumber,
  Select,
  DatePicker,
  Modal,
  Timeline,
  Layout,
  Popconfirm,
} from "antd";
import {
  SettingOutlined,
  InsertRowBelowOutlined,
  EditOutlined,
} from "@ant-design/icons";
import "ag-grid-community/styles/ag-grid.css";
import "ag-grid-community/styles/ag-theme-balham.css";


import moment from "moment";
import "../style.css";

import { Link } from "react-router-dom";
import Navbar from '../Navbar.js';

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
      sortable: true,
      filter: "agTextColumnFilter",
    },
    {
      field: "salestatus",
      headerName: "Status",
      sortable: true,
    },
    {
      field: "appraiser",
      headerName: "Appraiser",
      sortable: true,
      filter: "agTextColumnFilter",
    },
    { field: "netoprice", headerName: "Neto price", sortable: true },
    { field: "vatrate", headerName: "VAT rate", sortable: true },
    { field: "fullprice", headerName: "Full price", sortable: true },
    {
      field: "date",
      headerName: "Date",
      cellDataType: "dateString",
      sortable: true,
    },
  ]);
  useEffect(() => {
    checksalesFormValidity();
  });

  const checksalesFormValidity = () => {
    const { vehicle, appraiser } = salesFormData;
    const issalesFormValid = vehicle && appraiser;
    setsalesFormValid(issalesFormValid);
  };

  const defaultColDef = useMemo(() => {
    return {
      flex: 1,
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

  const [deleteDisabled, setDeleteDisabled] = useState(true);
  const [editDisabled, setEditDisabled] = useState(true);

  const onSelectionChanged = useCallback(() => {
    const selectedRows = gridRef.current.api.getSelectedRows();

    if (selectedRows.length >= 1) setDeleteDisabled(false);

    if (selectedRows.length > 1) setEditDisabled(true);

    if (selectedRows.length < 1) setEditDisabled(true);
    setDeleteDisabled(true);

    if (selectedRows.length === 1) setEditDisabled(false);
    setDeleteDisabled(false);

    if (selectedRows.length === 0) setDeleteDisabled(true);
  }, []);

  const editFormSubmit = () =>{
    console.log('test')
    setIsModalOpen3(false);
  }

  return (
    <>
      <Navbar/>

      <div>
        <Button
          icon={<SettingOutlined />}
          onClick={() => setIsModalOpen1(true)}
        ></Button>

        <Modal
          title="VAT value"
          keyboard={false}
          maskClosable={false}
          htmlType="submit"
          open={isModalOpen1}
          onOk={() => setIsModalOpen1(false)}
          okText="Set"
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
          keyboard={false}
          maskClosable={false}
          open={isModalOpen2}
          onOk={handleFormSubmit}
          okText="Add"
          okButtonProps={{
            disabled: !salesFormValid,
          }}
          onCancel={() => setIsModalOpen2(false)}
        >
          <div style={{ display: "flex", gap: "50px" }}>
            <Form className="form" layout="vertical">
              <div>
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
              </div>
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
              ]}
            ></Timeline>
          </div>
        </Modal>

        <Button
          icon={<EditOutlined />}
          disabled={editDisabled}
          onClick={() => setIsModalOpen3(true)}
        >
          Edit
        </Button>

        <Popconfirm
          title="Cancel sale"
          description="Are you sure you want to cancel car sale?"
          okText="Yes"
          cancelText="No"
        >
          <Button danger disabled={deleteDisabled}>
            Cancel Sale
          </Button>
        </Popconfirm>

        <Modal
          keyboard={false}
          maskClosable={false}
          title="Edit Record"
          open={isModalOpen3}
          okText={"Save"}
          cancelText={"Quit"}
          onOk={() => setIsModalOpen3(false)}
          onCancel={() => setIsModalOpen3(false)}
          footer={(_, { OkBtn, CancelBtn }) => (
            <>
              <Popconfirm
                title="Cancel sale"
                description="Are you sure you want to cancel car sale?"
                okText="Yes"
                cancelText="No"
                onConfirm={editFormSubmit}
              >
                <Button danger>
                  Cancel Sale
                </Button>
              </Popconfirm>
              <CancelBtn />
              <OkBtn />
            </>
          )}
        >
          <div style={{ display: "flex", gap: "80px" }}>
            <Form className="form" layout="vertical">
              <div>
                <Form.Item label="Vehicle">
                  <Select
                    name="vehicleEdit"
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

                <Form.Item label="Neto ">
                  <Input
                    disabled
                    addonBefore="€"
                    type="number"
                    value={salesFormData.neto}
                    onChange={(e) =>
                      setsalesFormData({
                        ...salesFormData,
                        netoprice: e.target.value,
                      })
                    }
                  />
                </Form.Item>

                <Form.Item label="VAT Rate ">
                  <Input
                    disabled
                    addonAfter="%"
                    type="number"
                    value={salesFormData.neto}
                    onChange={(e) =>
                      setsalesFormData({
                        ...salesFormData,
                        netoprice: e.target.value,
                      })
                    }
                  />
                </Form.Item>

                <Form.Item label="Full price">
                  <Input
                    disabled
                    addonBefore="€"
                    type="number"
                    value={salesFormData.neto}
                    onChange={(e) =>
                      setsalesFormData({
                        ...salesFormData,
                        netoprice: e.target.value,
                      })
                    }
                  />
                </Form.Item>
              </div>
            </Form>

            <div style={{ display: "flex", alignItems: "center" }}>
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
                ]}
              ></Timeline>
            </div>
          </div>
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
            rowSelection="multiple"
            pagination={true}
            paginationPageSize={50}
            onSelectionChanged={onSelectionChanged}
          ></AgGridReact>
        </div>
      </div>
    </>
  );
}

export default CarSalesRegistry;
