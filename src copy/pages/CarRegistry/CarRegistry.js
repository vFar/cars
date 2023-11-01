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
  Popconfirm,
  Modal,
  message,
} from "antd";
import "ag-grid-community/styles/ag-grid.css";
import "ag-grid-community/styles/ag-theme-balham.css";

import dayjs from "dayjs";

import "../style.css";
import { InsertRowBelowOutlined, EditOutlined } from "@ant-design/icons";
import Navbar from "../Navbar.js";

function CarRegistry() {
  const salesRowData = localStorage.getItem("salesRowData");
  const carRowData = localStorage.getItem("rowData");

  if (!salesRowData) {
    const initialSalesRowData = [];
    localStorage.setItem("salesRowData", JSON.stringify(initialSalesRowData));
  }

  if(!carRowData){
    const initialRowData = [];
    localStorage.setItem("rowData", JSON.stringify(initialRowData));
  }

  const [form] = Form.useForm();
  const [editData, setEditData] = useState(null);
  const [isElectric, setIsElectric] = useState(false);
  const [formData, setFormData] = useState();
  const [rowData, setRowData] = useState(() => {
    const savedRowData = localStorage.getItem("rowData");
    return savedRowData ? JSON.parse(savedRowData) : [];
  });

  const [messageApi, contextHolder] = message.useMessage();

  const numberplates = rowData.map((row) => row.numberplate);
  localStorage.setItem("numberplates", JSON.stringify(numberplates));

  useEffect(() => {
    localStorage.setItem("rowData", JSON.stringify(rowData));
  }, [rowData]);

  const handleFormSubmit = () => {
    const yearValue = formData.year.format("YYYY");
    const newData = { ...formData, year: yearValue };
  
    const isDuplicateVIN = rowData.some((row) => row.VIN === newData.VIN);
    const isDuplicateNumberPlate = rowData.some(
      (row) => row.numberplate === newData.numberplate
    );
  
    if (isDuplicateVIN) {
      messageApi.open({
        type: "error",
        content: "VIN codes must be unique! (Non-repeating)",
      });
    } else if (isDuplicateNumberPlate) {
      messageApi.open({
        type: "error",
        content: "Number plates must be unique! (Non-repeating)",
      });
    } else {
      messageApi.open({
        type: "success",
        content: "New record has been successfully added",
      });
  
      setRowData([{ ...newData, status: "Available" }, ...rowData]);
      setIsModalOpen1(false);
      form.resetFields();
    }
  };

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

  
  const testingColors = {
    'status-available': params => params.value === 'Available',
    'status-sold-car': params => params.value === 'Sold',
    'status-reserved': params => params.value === 'Reserved',
  }

  const testingRenderer = (params) => {
    return <span className="status-element">{params.value}</span>;
  }

  const [columnDefs] = useState([
    {
      field: "VIN",
      cellDataType: "text",
    },
    {
      field: "numberplate",
      headerName: "Number plate",
    },
    { field: "brand", headerName: "Brand", sortable: true },
    { field: "model", headerName: "Model", sortable: true },
    { field: "year", headerName: "Year", sortable: true },
    {
      field: "color",
    },
    {
      field: "engine",
      headerName: "Engine",
      sortable: true,
    },
    {
      field: "enginecapacity",
      headerName: "Engine capacity (L)",
      cellDataType: "number",
    },
    {
      field: "gearbox",
      headerName: "Gearbox",
      sortable: true,
    },
    {
      field: "bodytype",
      headerName: "Body type",
      sortable: true,
    },
    {
      field: "status",
      headerName: "Status",
      sortable: true,
      valueGetter: (params) => {
        if (params.data.status) {
          return params.data.status;
        }
        return "Available";
      },
      cellClassRules: testingColors,
      cellRenderer: testingRenderer,
    },
  ]);

  const defaultColDef = useMemo(() => {
    return {
      flex: 1,
    };
  }, []);

  const gridRef = useRef();

  const handleEdit = () => {
    const selectedRows = gridRef.current.api.getSelectedRows();

    if (selectedRows.length === 1) {
      setEditData(selectedRows[0]);
      setIsModalOpen2(true);
    }
  };

  const [isDirty, setIsDirty] = useState(false);

  const handleEditSubmit = () => {

    const updatedData = rowData.map((row) =>
      row.VIN === editData.VIN ? { ...editData } : row
    );

    setRowData(updatedData);
    localStorage.setItem("rowData", JSON.stringify(updatedData));
    setIsModalOpen2(false);

    messageApi.open({
      type: "success",
      content: "Record has been successfully updated",
    });

    setIsDirty(false);
  };

  const handleEditModalCancel = () => {
    setIsModalOpen2(false);
    // Reset the isDirty flag when the modal is closed
    setIsDirty(false);
  };

  const handleInputChange = (field, value) => {
    setEditData({ ...editData, [field]: value });
    setIsDirty(true); 
  };



  const handleEngineChange = (value) => {
    if (value === "Electric") {
      setIsElectric(true);
      setFormData({ ...formData, engine: value, enginecapacity: null });
    } else {
      setIsElectric(false);
      setFormData({ ...formData, engine: value });
    }
  };


  const handleEditEngineChange = (value) => {
    if (value === "Electric") {
      setIsElectric(true);
      setEditData({ ...editData, engine: value, enginecapacity: null });
    } else {
      setIsElectric(false);
      setEditData({ ...editData, engine: value });
    }
  };

  const onRemoveSelected = () => {
    const selectedData = gridRef.current.api.getSelectedRows();
    gridRef.current.api.applyTransaction({ remove: selectedData });

    setRowData((prevData) => {
      const updatedData = prevData.filter((row) => !selectedData.includes(row));

      localStorage.setItem("rowData", JSON.stringify(updatedData));

      return updatedData;
    });

    messageApi.open({
      type: 'warning',
      content: 'Record has been deleted'
    });
  };

  //Modal
  const [isModalOpen1, setIsModalOpen1] = useState(false);
  const [isModalOpen2, setIsModalOpen2] = useState(false);
  const handleCloseModal = () => {
    // Сбросить значения формы при закрытии модального окна
    form.resetFields();

    // Закрыть модальное окно
    setIsModalOpen1(false);
  };
  const [deleteDisabled, setDeleteDisabled] = useState(true);
  const [editDisabled, setEditDisabled] = useState(true);

  const onSelectionChanged = useCallback(() => {
    const selectedRows = gridRef.current.api.getSelectedRows();
    if (selectedRows.length >= 1) {
      let isDeleteDisabled = false;
      let isEditDisabled = false;
      
      //expertimental "Sold", maybe sold cars can be deleted from car registry (???)
      for (const row of selectedRows) {
        if (row.status === 'Reserved' || row.status === 'Sold') {
          isDeleteDisabled = true;
          isEditDisabled = true;
          break;
        }
      }
  
      setDeleteDisabled(isDeleteDisabled);
      setEditDisabled(isEditDisabled);
    } else {
      setDeleteDisabled(true);
      setEditDisabled(true);
    }
  }, []);

  //datepicker year
  const minYear = 1900;
  const maxYear = dayjs().year();

  const disabledDate = (current) => {
    return current && (current.year() < minYear || current.year() > maxYear);
  };

  //double click edit
  const onRowDoubleClicked = () => {
    handleEdit()
    setIsModalOpen2(true)
  }
  return (
    <>
      <Navbar />

      {contextHolder}
      <Popconfirm
        title="Delete the record"
        description="Are you sure you want to delete record/s?"
        okText="Yes"
        cancelText="No"
        onConfirm={onRemoveSelected}
      >
        <Button danger disabled={deleteDisabled}>
          Delete Record
        </Button>
      </Popconfirm>

      <Button
        icon={<InsertRowBelowOutlined />}
        onClick={() => setIsModalOpen1(true)}
      >
        Add
      </Button>

      <Modal
        title="Add Record"
        maskClosable={false}
        keyboard={false}
        open={isModalOpen1}
        onOk={onFinish}
        okText="Add Record"
        cancelText="Cancel"
        onCancel={handleCloseModal}
      >
        <Form form={form} layout="vertical" className="form" name="basic">
          <div>
            <Form.Item
              label="VIN"
              name="VIN"
              rules={[
                {
                  required: true,
                  message: "Please input VIN!",
                },
              ]}
            >
              <Input
                maxLength="17"
                minLength="5"
                onInput={(e) => (e.target.value = e.target.value.toUpperCase())}
                onChange={(e) =>
                  setFormData({ ...formData, VIN: e.target.value })
                }
              />
            </Form.Item>

            <Form.Item
              label="Brand"
              name="Brand"
              rules={[
                {
                  required: true,
                  message: "Please input brand!",
                },
              ]}
            >
              <Input
                maxLength={20}
                onChange={(e) =>
                  setFormData({ ...formData, brand: e.target.value })
                }
              />
            </Form.Item>

            <Form.Item
              label="Year"
              name="Year"
              rules={[
                {
                  required: true,
                  message: "Please input year!",
                },
              ]}
            >
              <DatePicker
                style={{ width: "100%" }}
                picker="year"
                placeholder=""
                onChange={(date) => setFormData({ ...formData, year: date })}
                disabledDate={disabledDate}
              />
            </Form.Item>

            <Form.Item
              label="Engine"
              name="Engine"
              rules={[
                {
                  required: true,
                  message: "Please input engine!",
                },
              ]}
            >
              <Select
                onChange={(value) => handleEngineChange(value)}
                options={[
                  {
                    value: "Gasoline/gas",
                    label: "Gasoline/gas",
                  },
                  {
                    value: "Gasoline",
                    label: "Gasoline",
                  },
                  {
                    value: "Diesel",
                    label: "Diesel",
                  },
                  {
                    value: "Hybrid",
                    label: "Hybrid",
                  },
                  {
                    value: "Electric",
                    label: "Electric",
                  },
                ]}
              />
            </Form.Item>

            <Form.Item
              label="Gearbox"
              name="Gearbox"
              rules={[
                {
                  required: true,
                  message: "Please input gearbox!",
                },
              ]}
            >
              <Select
                onChange={(value) =>
                  setFormData({ ...formData, gearbox: value })
                }
                options={[
                  {
                    value: "Manual",
                    label: "Manual",
                  },
                  {
                    value: "Automatic",
                    label: "Automatic",
                  },
                ]}
              />
            </Form.Item>
          </div>

          <div>
            <Form.Item
              label="Number plate"
              name="Numberplate"
              rules={[
                {
                  required: true,
                  message: "Please input number plate!",
                },
              ]}
            >
              <Input
                maxLength="8"
                onInput={(e) => (e.target.value = e.target.value.toUpperCase())}
                onChange={(e) =>
                  setFormData({ ...formData, numberplate: e.target.value })
                }
              />
            </Form.Item>

            <Form.Item
              label="Model"
              name="Model"
              rules={[
                {
                  required: true,
                  message: "Please input model!",
                },
              ]}
            >
              <Input
                maxLength={20}
                onChange={(e) =>
                  setFormData({ ...formData, model: e.target.value })
                }
              />
            </Form.Item>

            <Form.Item
              label="Color"
              name="Color"
              rules={[
                {
                  required: true,
                  message: "Please choose color!",
                },
              ]}
            >
              <Select
                listHeight={240}
                onChange={(value) => setFormData({ ...formData, color: value })}
                options={[
                  {
                    value: "White",
                    label: "White",
                  },
                  {
                    value: "Black",
                    label: "Black",
                  },
                  {
                    value: "Brown",
                    label: "Brown",
                  },
                  {
                    value: "Yellow",
                    label: "Yellow",
                  },
                  {
                    value: "Light blue",
                    label: "Light blue",
                  },
                  {
                    value: "Blue",
                    label: "Blue",
                  },
                  {
                    value: "Silver",
                    label: "Silver",
                  },
                  {
                    value: "Green",
                    label: "Green",
                  },
                  {
                    value: "Red",
                    label: "Red",
                  },
                  {
                    value: "Dark red",
                    label: "Dark red",
                  },
                  {
                    value: "Purple",
                    label: "Purple",
                  },
                  {
                    value: "Gray",
                    label: "Gray",
                  },
                  {
                    value: "Orange",
                    label: "Orange",
                  },
                ]}
              />
            </Form.Item>

            <Form.Item
              label="Engine capacity (L)"
              name="Enginecapacity"
              rules={[
                {
                  required: !isElectric,
                  message: "Please input engine capacity!",
                },
              ]}
            >
              <InputNumber
                type="decimal"
                style={{ width: "100%" }}
                controls={false}
                min={0.1}
                max={10}
                maxLength={3}
                onChange={(value) =>
                  setFormData({ ...formData, enginecapacity: value })
                }
                disabled={isElectric}
              />
            </Form.Item>

            <Form.Item
              label="Body type"
              name="Bodytype"
              rules={[
                {
                  required: true,
                  message: "Please choose body type!",
                },
              ]}
            >
              <Select
                onChange={(value) =>
                  setFormData({ ...formData, bodytype: value })
                }
                listHeight={200}
                options={[
                  {
                    value: "Off-road",
                    label: "Off-road",
                  },
                  {
                    value: "Hatchback",
                    label: "Hatchback",
                  },
                  {
                    value: "Cabriolet",
                    label: "Cabriolet",
                  },
                  {
                    value: "Coupe",
                    label: "Coupe",
                  },
                  {
                    value: "Universal",
                    label: "Universal",
                  },
                  {
                    value: "Pickup",
                    label: "Pickup",
                  },
                  {
                    value: "Sedan",
                    label: "Sedan",
                  },
                  {
                    value: "Minibus",
                    label: "Minibus",
                  },
                  {
                    value: "SUV",
                    label: "SUV",
                  },
                  {
                    value: "Other",
                    label: "Other",
                  },
                ]}
              />
            </Form.Item>
          </div>
        </Form>
      </Modal>

      <Button
        icon={<EditOutlined />}
        disabled={editDisabled}
        onClick={handleEdit}
      >
        Edit
      </Button>

      <Modal
        keyboard={false}
        maskClosable={false}
        title="Edit Record"
        open={isModalOpen2}
        okText={"Save"}
        cancelText={"Cancel"}
        onOk={handleEditSubmit}
        onCancel={handleEditModalCancel}
        okButtonProps={{ disabled: !isDirty }}
      >
        <Form className="form" layout="vertical">
          <div>
            <Form.Item label="VIN">
              <Input
                maxLength="17"
                minLength="5"
                onInput={(e) => (e.target.value = e.target.value.toUpperCase())}
                value={editData ? editData.VIN : ""}
                // onChange={(e) =>
                //   setEditData({ ...editData, VIN: e.target.value })
                // }
                onChange={(e) => handleInputChange("VIN", e.target.value)}
                disabled
              />
            </Form.Item>

            <Form.Item label="Brand">
              <Input
                maxLength={20}
                value={editData ? editData.brand : ""}
                onChange={(e) => handleInputChange("brand", e.target.value)}
              />
            </Form.Item>

            <Form.Item label="Year">
              <DatePicker
                style={{ width: "100%" }}
                picker="year"
                placeholder=""
                value={editData ? dayjs(editData.year, "YYYY") : null}
                onChange={(date) =>
                  handleInputChange("year", date ? date.format("YYYY") : null)
                }
                disabledDate={disabledDate}
              />
            </Form.Item>

            <Form.Item label="Engine">
              <Select
                value={editData ? editData.engine : ""}
                onChange={(value) => handleEditEngineChange(value)}
                // onChange={(value) =>
                //   setEditData({ ...editData, engine: value })
                // }
                options={[
                  {
                    value: "Gasoline/gas",
                    label: "Gasoline/gas",
                  },
                  {
                    value: "Gasoline",
                    label: "Gasoline",
                  },
                  {
                    value: "Diesel",
                    label: "Diesel",
                  },
                  {
                    value: "Hybrid",
                    label: "Hybrid",
                  },
                  {
                    value: "Electric",
                    label: "Electric",
                  },
                ]}
              />
            </Form.Item>

            <Form.Item label="Gearbox">
              <Select
                value={editData ? editData.gearbox : ""}
                onChange={(value) => handleInputChange("gearbox", value)}
                options={[
                  {
                    value: "Manual",
                    label: "Manual",
                  },
                  {
                    value: "Automatic",
                    label: "Automatic",
                  },
                ]}
              />
            </Form.Item>
          </div>

          <div>
            <Form.Item label="Number plate">
              <Input
                maxLength="8"
                onInput={(e) => (e.target.value = e.target.value.toUpperCase())}
                value={editData ? editData.numberplate : ""}
                onChange={(e) => handleInputChange("numberplate", e.target.value)}
              />
            </Form.Item>

            <Form.Item label="Model">
              <Input
                maxLength={20}
                value={editData ? editData.model : ""}
                onChange={(e) => handleInputChange("model", e.target.value)}
              />
            </Form.Item>

            <Form.Item label="Color">
              <Select
                value={editData ? editData.color : ""}
                onChange={(value) => handleInputChange("color", value)}
                listHeight={240}
                options={[
                  {
                    value: "White",
                    label: "White",
                  },
                  {
                    value: "Black",
                    label: "Black",
                  },
                  {
                    value: "Brown",
                    label: "Brown",
                  },
                  {
                    value: "Yellow",
                    label: "Yellow",
                  },
                  {
                    value: "Light blue",
                    label: "Light blue",
                  },
                  {
                    value: "Blue",
                    label: "Blue",
                  },
                  {
                    value: "Silver",
                    label: "Silver",
                  },
                  {
                    value: "Green",
                    label: "Green",
                  },
                  {
                    value: "Red",
                    label: "Red",
                  },
                  {
                    value: "Dark red",
                    label: "Dark red",
                  },
                  {
                    value: "Purple",
                    label: "Purple",
                  },
                  {
                    value: "Gray",
                    label: "Gray",
                  },
                  {
                    value: "Orange",
                    label: "Orange",
                  },
                ]}
              />
            </Form.Item>
            <Form.Item label="Engine capacity (L)">
              <InputNumber
                type="number"
                style={{ width: "100%" }}
                controls={false}
                min={0.1}
                max={10}
                value={editData ? editData.enginecapacity : ""}
                onChange={(value) => handleInputChange("enginecapacity", value)}
                disabled={isElectric}
              />
            </Form.Item>
            <Form.Item label="Body type">
              <Select
                value={editData ? editData.bodytype : ""}
                onChange={(value) => handleInputChange("bodytype", value)}
                listHeight={200}
                options={[
                  {
                    value: "Off-road",
                    label: "Off-road",
                  },
                  {
                    value: "Hatchback",
                    label: "Hatchback",
                  },
                  {
                    value: "Cabriolet",
                    label: "Cabriolet",
                  },
                  {
                    value: "Coupe",
                    label: "Coupe",
                  },
                  {
                    value: "Universal",
                    label: "Universal",
                  },
                  {
                    value: "Pickup",
                    label: "Pickup",
                  },
                  {
                    value: "Sedan",
                    label: "Sedan",
                  },
                  {
                    value: "Minibus",
                    label: "Minibus",
                  },
                  {
                    value: "SUV",
                    label: "SUV",
                  },
                  {
                    value: "Other",
                    label: "Other",
                  },
                ]}
              />
            </Form.Item>
          </div>
        </Form>
      </Modal>

      <div className="ag-theme-balham" style={{ height: "80vh", width: "100" }}>
        <AgGridReact
          ref={gridRef}
          rowData={rowData}
          columnDefs={columnDefs}
          defaultColDef={defaultColDef}
          rowSelection={"multiple"}
          pagination={true}
          paginationPageSize={50}
          onSelectionChanged={onSelectionChanged}
          onRowDoubleClicked={onRowDoubleClicked}
          animateRows={true}
          rowHeight={35}
        ></AgGridReact>
      </div>
    </>
  );
}

export default CarRegistry;
