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
  Popconfirm,
  message
} from "antd";
import {
  SettingOutlined,
  InsertRowBelowOutlined,
  EditOutlined,
} from "@ant-design/icons";
import "ag-grid-community/styles/ag-grid.css";
import "ag-grid-community/styles/ag-theme-balham.css";
import { PDFDownloadLink } from "@react-pdf/renderer";
import PdfDocument from "../PdfDocument.js";
import "../style.css";
import Navbar from '../Navbar.js';
import dayjs from "dayjs";
import isBetween from "dayjs/plugin/isBetween";
dayjs.extend(isBetween);


const { RangePicker } = DatePicker;

function CarSalesRegistry() {
  const [form] = Form.useForm();
  const [editData, setEditData] = useState(null);

  const [salesFormData, setsalesFormData] = useState();
  const [salesRowData, setsalesRowData] = useState(() => {
    const savedsalesRowData = localStorage.getItem("salesRowData");
    return savedsalesRowData ? JSON.parse(savedsalesRowData) : [];
  });

  useEffect(() => {
    localStorage.setItem("salesRowData", JSON.stringify(salesRowData));
  }, [salesRowData]);

  const savedNumberplates = localStorage.getItem("numberplates");
  const numberplates = savedNumberplates ? JSON.parse(savedNumberplates) : [];

  const [messageApi, contextHolder] = message.useMessage();
  const [defaultVATRate, setDefaultVATRate] = useState(21);
  const [userDefinedVATRate, setUserDefinedVATRate] = useState(21);

  const testingColors = {
    'status-pending': params => params.value === 'New request received' || params.value === 'Evaluation has begun' || params.value === 'Received a rating' || 
    params.value === 'Car sale has begun' || params.value === 'Car sale completed' || params.value === 'Buyer has received a sales contract', 
    'status-sold-sale': params => params.value === 'Sold - Contract received from buyer' || params.value === 'Vehicle has been delivered to buyer',
    'status-canceled': params => params.value === 'Canceled',
  }

  const testingRenderer = (params) => {
    return <span className="status-element">{params.value}</span>;
  }

  // "New request received",
  // "Evaluation has begun",
  // "Received a rating",
  // "Car sale has begun",
  // "Car sale has completed",
  // "Buyer has received a sales contract",
  // "Sold - Contract received from buyer",
  // "Vehicle has been delivered to buyer",
  // "Canceled",



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
      valueGetter: (params) => {
        if (params.data.salestatus) {
          return params.data.salestatus;
        }
        return "New request received";
      },
      cellClassRules: testingColors,
      cellRenderer: testingRenderer,
    },
    {
      field: "appraiser",
      headerName: "Appraiser",
      sortable: true,
      filter: "agTextColumnFilter",
    },
    { field: "netoprice", headerName: "Neto price", sortable: true },
    {
      field: "vatrate",
      headerName: "VAT rate",
      sortable: true,
      valueGetter: (params) => {
        return params.data.vatrate || defaultVATRate;
      },
      valueFormatter: (params) => {
        return `${params.value || defaultVATRate}%`;
      },
    },
    { field: "fullprice", headerName: "Full price", sortable: true },
    {
      field: "date",
      headerName: "Date",
      cellDataType: "dateString",
      sortable: true,
    },
  ]);

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
    const dateValue = salesFormData.date
      ? salesFormData.date.format("YYYY-MM-DD")
      : "";
    const newsalesData = { ...salesFormData, date: dateValue, vatrate: userDefinedVATRate, salestatus: 'New request received' };

    setsalesRowData([newsalesData, ...salesRowData]);
    // setFilteredSalesRowData((prevData) => [newSalesData, ...prevData]);
    // setIsModalOpen2(false);

    setFilteredSalesRowData((prevData) => [newsalesData, ...prevData]);

    messageApi.open({
      type: 'success',
      content: 'New sale record has been successfully added'
    });

    form.resetFields();

    setIsModalOpen2(false);

    // const dateValue = salesFormData.date
    //   ? salesFormData.date.format("YYYY-MM-DD")
    //   : "";
    // const newSalesData = { ...salesFormData, date: dateValue };
    // const updatedSalesData = [newSalesData, ...salesRowData];

    // setsalesRowData(updatedSalesData);
    // setFilteredSalesRowData(updatedSalesData); // Update filtered data as well
    // setIsModalOpen2(false);
  };

  const allStatuses = [
    "New request received",
    "Evaluation has begun",
    "Received a rating",
    "Car sale has begun",
    "Car sale has completed",
    "Buyer has received a sales contract",
    "Sold - Contract received from buyer",
    "Vehicle has been delivered to buyer",
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

  const [filteredSalesRowData, setFilteredSalesRowData] = useState(salesRowData);

  //RangePicker for PDF
  const [downloadDisabled, setDownloadDisabled] = useState(true);

  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const handleDateRangeChange = (dates, dateStrings) => {
    setStartDate(dateStrings[0]);
    setEndDate(dateStrings[1]);
    const filteredData = salesRowData.filter((row) => {
      const date = dayjs(row.date, "YYYY-MM-DD");
      return date.isBetween(dateStrings[0], dateStrings[1], null, "[]");
    });
    setFilteredSalesRowData(filteredData);
  };

  useEffect(() => {
    if (startDate !== "" && endDate !== ""){
      setDownloadDisabled(false);
    }else{
      setDownloadDisabled(true);
    }
  }, [startDate, endDate]);




  const [selectedRowForEdit, setSelectedRowForEdit] = useState(null);
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

  const [deleteDisabled, setDeleteDisabled] = useState(true);
  const [editDisabled, setEditDisabled] = useState(true);

  const onSelectionChanged = useCallback(() => {
    const selectedRows = gridRef.current.api.getSelectedRows();
    
    switch (selectedRows.length) {
      case 0:
        setEditDisabled(true);
        setDeleteDisabled(true);
        break;
      case 1:
        const singleSelectedRow = selectedRows[0];
        if ((singleSelectedRow.salestatus === 'Canceled') || (singleSelectedRow.salestatus === 'Vehicle has been delivered to buyer')) {
          setEditDisabled(true);
          setDeleteDisabled(true);
        } else {
          setEditDisabled(false);
          setDeleteDisabled(false);
        }
        break;
      default:
        setEditDisabled(true);
        setDeleteDisabled(false);
        break;
    }
  }, []);

  const cancelSaleBtn = () => {
    // const selectedRows = gridRef.current.api.getSelectedRows();

    // if (selectedRows.length > 0) {
    //   const updatedData = filteredSalesRowData.map((row) => {
    //     if (selectedRows.includes(row)) {
    //       return {
    //         ...row,
    //         salestatus: "Canceled",
    //       };
    //     }
    //     return row;
    //   });

    //   setFilteredSalesRowData(updatedData);
    //   updateLocalStorageData(updatedData);

    //   messageApi.open({
    //     type: "warning",
    //     content: "Sale has been canceled!",
    //   });
    // }
  };

  const cancelSaleEditBtn = () => {
    if (selectedRowForEdit) {
      const updatedSale = {
        ...selectedRowForEdit,
        salestatus: 'Canceled',
      };
  
      const updatedData = filteredSalesRowData.map((row) =>
        row === selectedRowForEdit ? updatedSale : row
      );
  
      setFilteredSalesRowData(updatedData);
      updateLocalStorageData(updatedData);

    
      messageApi.open({
        type: "success",
        content: "Sale has been canceled!",
      });

      setIsModalOpen3(false)
    }
    //backend for canceling a sale through modal
  };

  const onRowDoubleClicked = () => {
    setIsModalOpen3(true)
  }

  const onFinish = () => {
    form
      .validateFields()
      .then(() => {
        handleFormSubmit();
      })
      .catch((error) => {
        console.error("Validation error:", error);
      });
  };

  
  const handleEditSubmit = () => {
    if (selectedRowForEdit && editData) {
      const updatedData = salesRowData.map((row) =>
        row === selectedRowForEdit ? { ...row, ...editData } : row
      );

      setsalesRowData(updatedData);
      setFilteredSalesRowData(updatedData);

      setIsModalOpen3(false);
    }
  };

  const handleEdit = () => {
    const selectedRows = gridRef.current.api.getSelectedRows();
    if (selectedRows.length === 1) {
      setEditData(selectedRows[0]);
      setIsModalOpen3(true);
    }
  };

  const handleCloseModal = () => {
    form.resetFields();
    setIsModalOpen2(false);
  };

  const getAvailableNumberplates = () => {
    const usedNumberplates = salesRowData.map((row) => row.vehicle);
    return numberplates.filter((numberplate) => !usedNumberplates.includes(numberplate));
  };

  return (
    <>
      <Navbar />
      {contextHolder}
      <div>
        <Button
          icon={<SettingOutlined />}
          onClick={() => setIsModalOpen1(true)}
        ></Button>

        <Modal
          title="VAT value"
          keyboard={false}
          maskClosable={false}
          open={isModalOpen1}
          onOk={() => {
            setUserDefinedVATRate(defaultVATRate);
            setIsModalOpen1(false);
          }}
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
                maxLength={4}
                suffix="%"
                value={defaultVATRate}
                onChange={(value) => setDefaultVATRate(value)}
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
          width={600}
          title="Add Record"
          keyboard={false}
          maskClosable={false}
          open={isModalOpen2}
          onOk={onFinish}
          okText="Add"
          onCancel={handleCloseModal}
        >
          <div style={{ display: "flex", gap: "130px" }}>
            <Form form={form} className="form" layout="vertical">
              <div style={{ width: 210 }}>
                <Form.Item
                  label="Vehicle"
                  name="vehicle"
                  rules={[
                    {
                      required: true,
                      message: "Please select vehicle!",
                    },
                  ]}
                >
                  <Select
                    showSearch
                    optionFilterProp="children"
                    filterOption={filterOption}
                    onChange={(value) =>
                      setsalesFormData({ ...salesFormData, vehicle: value })
                    }
                    options={getAvailableNumberplates().map((numberplate) => ({
                      value: numberplate,
                      label: numberplate,
                    }))}
                  />
                </Form.Item>
                <Form.Item
                  label="Appraiser"
                  name="appraiser"
                  rules={[
                    {
                      required: true,
                      message: "Please input appraiser!",
                    },
                  ]}
                >
                  <Input
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
          onClick={handleEdit}
        >
          Edit
        </Button>

        <Popconfirm
          title="Cancel sale"
          description="Are you sure you want to cancel car sale?"
          okText="Yes"
          cancelText="No"
          onConfirm={cancelSaleBtn}
        >
          <Button danger disabled={deleteDisabled}>
            Cancel Sale
          </Button>
        </Popconfirm>

        <Modal
          width={700}
          keyboard={false}
          maskClosable={false}
          title="Edit Record"
          open={isModalOpen3}
          okText={"Save"}
          cancelText={"Quit"}
          onOk={handleEditSubmit}
          onCancel={() => setIsModalOpen3(false)}
          footer={(_, { OkBtn, CancelBtn }) => (
            <>
              <Popconfirm
                title="Cancel sale"
                description="Are you sure you want to cancel car sale?"
                okText="Yes"
                cancelText="No"
                onConfirm={cancelSaleEditBtn}
              >
                <Button danger disabled={deleteDisabled}>
                  Cancel Sale
                </Button>
              </Popconfirm>
              <CancelBtn />
              <OkBtn />
            </>
          )}
        >
          <div style={{ display: "flex", gap: "130px" }}>
            <Form className="form" layout="vertical">
              <div style={{ width: 280 }}>
                <Form.Item label="Vehicle">
                  <Select
                    value={editData ? editData.vehicle : ""}
                    onChange={(value) =>
                      setEditData({ ...editData, vehicle: value })
                    }
                    showSearch
                    optionFilterProp="children"
                    filterOption={filterOption}
                    options={numberplates.map((numberplate) => ({
                      value: numberplate,
                      label: numberplate,
                    }))}
                  />
                </Form.Item>

                <Form.Item label="Status">
                  <Select
                    value={editData ? editData.salestatus : ""}
                    onChange={(value) => {
                      setSelectedStatus(value);
                      handleStatusChange(value);
                      setEditData({ ...editData, salestatus: value });
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
                    value={editData ? editData.appraiser : ""}
                    onChange={(e) =>
                      setEditData({ ...editData, appraiser: e.target.value })
                    }
                  />
                </Form.Item>

                <Form.Item label="Neto ">
                  <Input
                    disabled
                    addonBefore="€"
                    type="number"
                    value={editData ? editData.netoprice : ""}
                    onChange={(e) =>
                      setEditData({ ...editData, netoprice: e.target.value })
                    }
                  />
                </Form.Item>

                <Form.Item label="VAT Rate ">
                  <InputNumber
                    style={{ width: 280 }}
                    defaultValue={21}
                    disabled
                    addonAfter="%"
                    type="number"
                    value={editData ? editData.vatrate : ""}
                    onChange={(value) =>
                      setEditData({ ...editData, vatrate: value })
                    }
                  />
                </Form.Item>

                <Form.Item label="Full price">
                  <Input
                    disabled
                    addonBefore="€"
                    type="number"
                    value={editData ? editData.netoprice : ""}
                    onChange={(e) =>
                      setEditData({ ...editData, fullprice: e.target.value })
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

        <RangePicker onChange={handleDateRangeChange} />
        <Button disabled={downloadDisabled}>
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
            {({ loading }) => (loading ? "Download PDF" : "Download PDF")}
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
            rowSelection="multiple"
            pagination={true}
            paginationPageSize={50}
            onSelectionChanged={onSelectionChanged}
            animateRows={true}
            rowHeight={35}
            onRowSelected={(event) => {
              if (event.node.isSelected()) {
                setSelectedRowForEdit(event.data);
              } else {
                setSelectedRowForEdit(null);
              }
            }}
            onRowDoubleClicked={onRowDoubleClicked}
          ></AgGridReact>
        </div>
      </div>
    </>
  );
}

export default CarSalesRegistry;
