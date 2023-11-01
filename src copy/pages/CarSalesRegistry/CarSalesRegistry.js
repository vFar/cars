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
  const saleRowData = localStorage.getItem("salesRowData");
  const carRowData = localStorage.getItem("rowData");

  if (!saleRowData) {
    const initialSalesRowData = [];
    localStorage.setItem("salesRowData", JSON.stringify(initialSalesRowData));
  }

  if(!carRowData){
    const initialRowData = [];
    localStorage.setItem("rowData", JSON.stringify(initialRowData));
  }

  const [editForm] = Form.useForm();
  const [addForm] = Form.useForm();

  var timelineChildren = [
    { children: "New request received"},
    { children: "Evaluation has begun" },
    { children: "Received a rating" },
    { children: "Car sale has begun" },
    { children: "Car sale has completed" },
    {
      children: "Buyer has received a sales contract",
    },
    {
      children: "Sold - Contract received from buyer",
    },
    {
      children: "Vehicle has been delivered to buyer",
    },
  ];

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
    params.value === 'Car sale has begun' || params.value === 'Car sale has completed' || params.value === 'Buyer has received a sales contract', 
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


  const currencyFormatter = (params) => {
    if (params.value === null || params.value === undefined) {
      return null;
    } else {
      return `€ ${formatNumber(params.value)}`;
    };
  }
  
  const formatNumber = (number) => {
    return Math.floor(number)
      .toString()
      .replace(/(\d)(?=(\d{3})+(?!\d))/g, '$1,');
  };

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
    {
      field: "netoprice",
      headerName: "Neto price",
      sortable: true,
      // valueFormatter: (params) => {
      //   // if (
      //   //   params.value === null ||
      //   //   params.value === undefined ||
      //   //   params.value === ""
      //   // ) {
      //   //   return null;
      //   // } else {
      //   //   return `€ ${params.value}`;
      //   // }
      // },
      valueFormatter: currencyFormatter,
    },
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
    { field: "fullprice", headerName: "Full price", sortable: true, valueFormatter: currencyFormatter },
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
    const carRowData = JSON.parse(localStorage.getItem("rowData"));
    const dateValue = salesFormData.date
      ? salesFormData.date.format("YYYY-MM-DD")
      : "";
    const newsalesData = { ...salesFormData, date: dateValue, vatrate: userDefinedVATRate, salestatus: 'New request received' };

    setsalesRowData([newsalesData, ...salesRowData]);
    setFilteredSalesRowData((prevData) => [newsalesData, ...prevData]);


    const selectedVehicle = carRowData.find(
      (vehicle) => vehicle.numberplate === salesFormData.vehicle
    );
  
    if (selectedVehicle) {
      // Update the status of the selected vehicle to 'Reserved'
      selectedVehicle.status = 'Reserved';
  
      // Update the car registry data in localStorage
      localStorage.setItem("rowData", JSON.stringify(carRowData));
    }

    messageApi.open({
      type: 'success',
      content: 'New sale record has been successfully added'
    });

    addForm.resetFields();

    setIsModalOpen2(false);
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

  const updateAvailableStatuses = (status) => {
    const selectedIndex = allStatuses.indexOf(status);

    if (selectedIndex === -1) {
      return allStatuses;
    }

    const availableStatuses = [
      allStatuses[selectedIndex - 1],
      allStatuses[selectedIndex],
      allStatuses[selectedIndex + 1],
    ].filter((status) => status !== undefined);

    return availableStatuses;
  };

  // const [availableStatuses, setAvailableStatuses] = useState(
  //   updateAvailableStatuses(selectedStatus)
  // );
  const [availableStatuses, setAvailableStatuses] = useState(updateAvailableStatuses('New request received'));


  const updateVehicleStatus = (numberplate, newStatus) => {
    const carRowData = JSON.parse(localStorage.getItem("rowData"));

    // Find the vehicle with the matching numberplate
    const updatedCarRowData = carRowData.map((vehicle) => {
      if (vehicle.numberplate === numberplate) {
        return { ...vehicle, status: newStatus };
      }
      return vehicle;
    });

    // Update the car registry data in localStorage
    localStorage.setItem("rowData", JSON.stringify(updatedCarRowData));
  };
  
  const handleStatusChange = (value) => {
    if (availableStatuses.includes(value)) {
      setCurrentEditStatus(value);
      setEditData({ ...editData, salestatus: value });

      if (value === "Sold - Contract received from buyer" || value === "Vehicle has been delivered to buyer") {
        // Update the vehicle status to "Sold"
        const selectedVehicle = selectedRowForEdit.vehicle;
        updateVehicleStatus(selectedVehicle, "Sold");
      }
    }
  };



  const [filteredSalesRowData, setFilteredSalesRowData] = useState(salesRowData);

  //RangePicker for PDF (not working)
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
        //NEEDS REWORKING!!!!!!!!
        // const multiSelectedRow = gridRef.current.api.getSelectedRows();
        // if ((multiSelectedRow.salestatus === 'Canceled') || (multiSelectedRow.salestatus === 'Vehicle has been delivered to buyer')) {
        //   setEditDisabled(true);
        //   setDeleteDisabled(true);
        // } else {
        //   setEditDisabled(false);
        //   setDeleteDisabled(false);
        // }
        // // setEditDisabled(true);
        // // setDeleteDisabled(false);
        // break;
    }
  }, []);

  const getAvailableNumberplates = () => {
    const carRowData = JSON.parse(localStorage.getItem("rowData"));
    const availableNumberplates = carRowData
      .filter(
        (row) =>
          row.status === "Available"
      )
      .map((row) => row.numberplate);

    return availableNumberplates;
  };

  const cancelSaleBtn = () => {
    const carRowData = JSON.parse(localStorage.getItem("rowData"));
    const selectedRows = gridRef.current.api.getSelectedRows();
    if (selectedRows.length > 0) {
      const updatedCarRowData = [...carRowData];

      selectedRows.forEach((row) => {
        const selectedVehicle = updatedCarRowData.find(
          (vehicle) => vehicle.numberplate === row.vehicle
        );

        if (selectedVehicle) {
          selectedVehicle.status = "Available";
        }
      });

      localStorage.setItem("rowData", JSON.stringify(updatedCarRowData));
      const updatedData = filteredSalesRowData.map((row) => {
        if (selectedRows.includes(row)) {
          return {
            ...row,
            salestatus: "Canceled",
          };
        }
        return row;
      });

      setFilteredSalesRowData(updatedData);
      updateLocalStorageData(updatedData);

      messageApi.open({
        type: "warning",
        content: "Sale has been canceled!",
      });
    }
  };

  const cancelSaleEditBtn = () => {
    const carRowData = JSON.parse(localStorage.getItem("rowData"));
    if (selectedRowForEdit) {
      const updatedCarRowData = [...carRowData];
  
      const selectedVehicle = updatedCarRowData.find(
        (vehicle) => vehicle.numberplate === selectedRowForEdit.vehicle
      );
  
      if (selectedVehicle) {
        selectedVehicle.status = 'Available';
      }
  
      localStorage.setItem("rowData", JSON.stringify(updatedCarRowData));
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
  
      setIsModalOpen3(false);
    }
  };

  const onRowDoubleClicked = (event) => {
    const selectedRows = gridRef.current.api.getSelectedRows();
    if (
      event.data.salestatus !== "Canceled" &&
      event.data.salestatus !== "Vehicle has been delivered to buyer"
    ) {
      setIsModalOpen3(true);
      setSelectedRowForEdit(event.data);

      if (selectedRows.length === 1) {
        setEditData(selectedRows[0]);
        setIsModalOpen3(true);
        //handleEdit so that neto is disabled when double-clicking
        handleEdit();
      }
    }
  };

  const onFormFinish = () => {
    addForm
      .validateFields()
      .then(() => {
        handleFormSubmit();
      })
      .catch((error) => {
        console.error("Validation form error:", error);
      });
  };

  const onEditFinish = () => {
    editForm
      .validateFields()
      .then(() => {
        handleEditSubmit();
      })
      .catch((error) => {
        console.error("Validation edit error:", error);
      });
  };
  
  const handleEditSubmit = () => {
    // const selectedRows = gridRef.current.api.getSelectedRows();
    // const selectedSale = selectedRows[0];

    // if (selectedRowForEdit && editData) {
    //   let updatedFullPrice = editData.fullprice;

    //   if (editData.salestatus === 'Car sale has completed') {

    //     updatedFullPrice = editData.netoprice * ( 100 + editData.vatrate ) / 100;
    //   }

    //   const updatedData = salesRowData.map((row) =>
    //     row === selectedRowForEdit ? { ...row, ...editData, fullprice: updatedFullPrice } : row
    //   );

    //   setsalesRowData(updatedData);
    //   setFilteredSalesRowData(updatedData);

    //   setIsModalOpen3(false);
    // }
    const selectedRows = gridRef.current.api.getSelectedRows();
    const selectedSale = selectedRows[0];
  
    if (selectedRowForEdit && editData) {
      let updatedFullPrice = editData.fullprice;
  
      // Check if the status is "Buyer has received a sales contract"
      if (editData.salestatus === 'Buyer has received a sales contract') {
        // Set the date to today's date with the format "YYYY-MM-DD"
        const today = dayjs().format("YYYY-MM-DD");
        editData.date = today;
      }
  
      if (editData.salestatus === 'Car sale has completed') {
        updatedFullPrice = editData.netoprice * (100 + editData.vatrate) / 100;
      }
  
      const updatedData = salesRowData.map((row) =>
        row === selectedRowForEdit ? { ...row, ...editData, fullprice: updatedFullPrice } : row
      );
  
      setsalesRowData(updatedData);
      setFilteredSalesRowData(updatedData);
  
      setIsModalOpen3(false);
    }
  };
  
  const [currentEditStatus, setCurrentEditStatus] = useState('New request received');
  const [isVehicleSelectionDisabled, setIsVehicleSelectionDisabled] = useState(false);
  const [isNetoInputDisabled, setIsNetoInputDisabled] = useState(false);

  const [timelineColor, setTimelineColor] = useState('gray');

  const handleEdit = () => {
    const selectedRows = gridRef.current.api.getSelectedRows();
    const timelineColors = () => {
      const selectedIndex = allStatuses.indexOf(selectedRows[0].salestatus);
      
      for (let i = 0; i < timelineChildren.length; i++) {
        if(selectedIndex >= i){
          timelineChildren[i] = {children: timelineChildren[i].children, color: "#6E6EE8"}
          setTimelineColor()
        } else { 
          timelineChildren[i] = {children: timelineChildren[i].children, color: "gray"}
          setTimelineColor()
        }
      }
      
      return timelineChildren
    }

    setTimelineColor(timelineColors())
    console.log(timelineColor)
    if (selectedRows.length === 1) {
      const selectedSale = selectedRows[0];
      setEditData(selectedRows[0]);
      setCurrentEditStatus(selectedRows[0].salestatus); // Set the current edit status

      if (selectedSale.salestatus !== 'New request received') {
        setIsVehicleSelectionDisabled(true);
      } else {
        setIsVehicleSelectionDisabled(false);
      }

      if(selectedSale.salestatus === 'Received a rating'){
        setIsNetoInputDisabled(false)
      } else {
        setIsNetoInputDisabled(true);
      }


      setAvailableStatuses(updateAvailableStatuses(selectedRows[0].salestatus));
      setIsModalOpen3(true);
    }
  };

  const handleCloseModal = () => {
    addForm.resetFields();
    editForm.resetFields();
    setIsModalOpen2(false);
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
          onOk={onFormFinish}
          okText="Add"
          onCancel={handleCloseModal}
        >
          <div style={{ display: "flex", gap: "130px" }}>
            <Form form={addForm} className="form" layout="vertical">
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
              items={timelineChildren}
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
          width={750}
          keyboard={false}
          maskClosable={false}
          title="Edit Record"
          open={isModalOpen3}
          okText={"Save"}
          cancelText={"Quit"}
          onOk={onEditFinish}
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
          <div style={{ display: "flex", gap: "160px" }}>
            <Form form={editForm} className="form" layout="vertical">
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
                    disabled={isVehicleSelectionDisabled}
                  />
                </Form.Item>

                <Form.Item label="Status">
                  <Select
                    value={currentEditStatus} // Use the current edit status
                    onChange={(value) => handleStatusChange(value)}
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

                <Form.Item
                  label="Neto"
                  name="neto"
                  rules={[
                    {
                      required: !isNetoInputDisabled,
                      message: "Please input neto!",
                    },
                  ]}
                >
                  <Input
                    addonBefore="€"
                    type="number"
                    value={editData ? editData.netoprice : ""}
                    onChange={(e) =>
                      setEditData({ ...editData, netoprice: e.target.value })
                    }
                    disabled={isNetoInputDisabled}
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

                {/* <Form.Item label="Full price">
                  <Input
                    disabled
                    addonBefore="€"
                    type="number"
                    value={editData ? editData.netoprice : ""}
                    onChange={(e) =>
                      setEditData({ ...editData, fullprice: e.target.value })
                    }
                  />
                </Form.Item> */}
              </div>
            </Form>

            <div style={{ display: "flex", alignItems: "center" }}>
              <Timeline
                items={timelineColor}
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
            rowSelection="single"
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
