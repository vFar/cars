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
import { InsertRowBelowOutlined, EditOutlined, FilterOutlined } from "@ant-design/icons";
import Navbar from "../Navbar.js";
import ButtonGroup from "antd/es/button/button-group.js";

function CarRegistry() {
  const salesRowData = localStorage.getItem("salesRowData");
  const carRowData = localStorage.getItem("rowData");
  const gridStyle = useMemo(() => ({ height: "calc(100% - 152px)", width: "100%" }), []);

  //pārbauda pirms katra lapas ielādes
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

  // atjaunina AG-Grid ar jauniem datiem
  useEffect(() => {
    localStorage.setItem("rowData", JSON.stringify(rowData));
  }, [rowData]);

  const handleFormSubmit = () => {
    // Izdzēš liekās atstarpes visiem Input laukiem, ja tas nepieciešams
    Object.keys(formData).forEach((key) => {
      if (formData[key] && typeof formData[key] === "string") {
        formData[key] = formData[key].trim();
      }
    });

    // pārbauda vai visi Input ievades lauki ir tukši pēc lieko atstarpu izdzēšanas
    const isAnyFieldEmpty = Object.values(formData).some(
      (value) => value === ""
    );

    // ja viens no laukiem ir tukšs, tad izvada paziņojumu
    if (isAnyFieldEmpty) {
      messageApi.open({
        type: "error",
        content:
          "All form fields are required and cannot be empty or contain only whitespaces.",
      });
      return; // Atceļ jaunu ierakstu Form iesniegšanu
    }


    const yearValue = formData.year.format("YYYY");
    // nepieciešamas, lai sekmīgi ieliktu DatePicker gadu
    const newData = { ...formData, year: yearValue };


    // nepieļaut lietotājam ievadīt automašīnas datus, kam vienāds VIN un numurzīme
    const isDuplicateVIN = rowData.some((row) => row.VIN === newData.VIN);
    const isDuplicateNumberPlate = rowData.some((row) => row.numberplate === newData.numberplate);

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
        content: "New vehicle record has been successfully added",
      });

      // atjaunina localStorage ar jauniem datiem un iestata statusu uz pieejamu pēc noklusējuma
      setRowData([{ ...newData, status: "Available" }, ...rowData]);
      setIsModalOpen1(false);

      setEditDisabled(true);
      setDeleteDisabled(true);

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

  //Masīvi priekš automašīnu krāsām, virsbūves un motora tipiem
  const allVehicleBodyTypes = ['Off-road', 'Hatchback', 'Cabriolet', 'Coupe', 'Universal', 'Pickup', 'Sedan', 'Minibus', 'SUV', 'Other'];
  const allVehicleColors = ['White', 'Black', 'Brown', 'Yellow', 'Light Blue', 'Blue', 'Silver', 'Light Green', 'Green', 'Dark Green', 'Dark Red', 'Red', 'Purple', 'Gray', 'Orange', 'Other'];
  const allVehicleEngineTypes = ['Gasoline/gas', 'Gasoline', 'Diesel', 'Hybrid', 'Electric'];


  const statusFieldColors = {
    'status-available': params => params.value === 'Available',
    'status-sold-car': params => params.value === 'Sold',
    'status-reserved': params => params.value === 'Reserved',
  }

  //Custom kolonnas renderer, lai ieliktu statusus zem <span> tag un piešķirt tam CSS class
  const statusFieldRenderer = (params) => {
    return <span className="status-element">{params.value}</span>;
  }

  //AG-Grid kolonnas
  const [columnDefs] = useState([
    {
      field: "VIN", headerTooltip: "An example of a car's Vehicle Identification Number (VIN) is 4Y1SL65848Z411439",
      cellDataType: "text",
    },
    {
      field: "numberplate", headerTooltip: "'J4NIS' is an example of a custom license plate, whereas 'LV-3441' represents a non-customized plate in most countries",
      headerName: "Number plate",
    },
    { field: "brand", headerName: "Brand" },
    { field: "model", headerName: "Model" },
    { field: "year", headerName: "Year", cellStyle: { justifyContent: 'center' }, },
    {
      field: "color"
    },
    {
      field: "engine",
      headerName: "Engine",
    },
    {
      field: "enginecapacity",
      headerName: "Engine capacity (L)",
      headerClass: "ag-right-aligned-header",
      cellDataType: "number",
      cellStyle: { justifyContent: 'right' },
    },
    {
      field: "gearbox",
      headerName: "Gearbox",
    },
    {
      field: "bodytype", 
      headerName: "Body type",
    },
    {
      field: "status",
      headerName: "Status",
      headerTooltip: "Cars that have been reserved cannot be altered as they are currently in the process of being sold",
      valueGetter: (params) => {
        if (params.data.status) {
          return params.data.status;
        }
        return "Available";
      },
      cellClassRules: statusFieldColors,
      cellRenderer: statusFieldRenderer,
    },
  ]);

  // Noklusējuma atribūti visām kolonnām
  const defaultColDef = useMemo(() => {
    return {
      flex: 1,
      resizable: true,
      sortable: true,
      maxWidth: 250,
      width: 125,
      minWidth: 100,
      tooltipShowDelay: 300,
    };
  }, []);

  const gridRef = useRef();

  //Iegūst datus no izvēlētā ieraksta caur AG-Grid getSelectedRows();
  const handleEdit = () => {
    const selectedRows = gridRef.current.api.getSelectedRows();

    if (selectedRows.length === 1) {
      setEditData(selectedRows[0]);
      setIsModalOpen2(true);
    }
  };

  const [isDirty, setIsDirty] = useState(false);

  //funkcija, kas nodrošina ieraksta rediģēšanu
  const handleEditSubmit = () => {
    // Izdzēš liekās atstarpes visiem Input laukiem, ja tas nepieciešams
    Object.keys(editData).forEach((key) => {
      if (editData[key] && typeof editData[key] === "string") {
        editData[key] = editData[key].trim();
      }
    });

    // pārbauda vai visi Input lauki ir tīri no liekām atstarpēm
    const isAnyFieldEmpty = Object.values(editData).some((value) => value === "");
    
    //Izvada kļūdas paziņojumu, ja kaut viens Input lauks nav tīrs
    if (isAnyFieldEmpty) {
      messageApi.open({
        type: "error",
        content:
          "All form fields are required and cannot be empty or contain only whitespaces.",
      });
      return; // Atceļ rediģēšanas Formas iesniegšanu
    }

    // pārbauda vai motora tips nav elektrisks un vai motora tilpuma Input lauks ir tukšs
    if ( editData.engine !== "Electric" && (editData.enginecapacity === undefined || editData.enginecapacity === null || editData.enginecapacity === "")) {
      messageApi.open({
        type: "error",
        content: "Engine capacity is required for non-electric engine types.",
      });
      return; // Atceļ rediģēšanas Formas iesniegšanu
    }


    const updatedData = rowData.map((row) =>
      row.VIN === editData.VIN ? { ...editData } : row
    );

    setRowData(updatedData);
    localStorage.setItem("rowData", JSON.stringify(updatedData));
    setIsModalOpen2(false);

    setEditDisabled(true);
    setDeleteDisabled(true);

    messageApi.open({
      type: "success",
      content: "Record has been successfully updated",
    });

    setIsDirty(false);
  };

  const handleEditModalCancel = () => {
    setIsModalOpen2(false);
    // Atiestata isDirty useState uz false, kad aizver Modal
    setIsDirty(false);
  };

  //funkcija, kas atjaunina editData useState un pataisa Form par dirty (lai ieslēgtu 'Save' pogu)
  const handleInputChange = (field, value) => {
    setEditData({ ...editData, [field]: value });
    setIsDirty(true); 
  };


  //Funkcija, kas nosaka vai motora tips ir elektrisks, kad ievieto jaunu ierakstu
  const handleEngineChange = (value) => {
    //pārbaude, jo elektriskam motoram nav motora tilpuma, toties iestata to par null
    if (value === "Electric") {
      setIsElectric(true);
      setFormData({ ...formData, engine: value, enginecapacity: null });
    } else {
      setIsElectric(false);
      setFormData({ ...formData, engine: value });
    }
  };


  //Funckija, kas nosaka vai motora tips ir elektrisks, kad rediģē esošo ierakstu
  const handleEditEngineChange = (value) => {
    //pārbaude, jo elektriskam motoram nav motora tilpuma, toties iestata to par null
    if (value === "Electric") {
      setIsElectric(true);
      setEditData({ ...editData, engine: value, enginecapacity: null });
    } else {
      setIsElectric(false);
      setEditData({ ...editData, engine: value });
    }
    setIsDirty(true); // iestata Form dirty (lai ieslēgtu 'Save' pogu)
  };

  //funkcija nodrošina ieraksta dzēšanu
  const onRemoveSelected = () => {
    const selectedData = gridRef.current.api.getSelectedRows();
    
    //atjaunina localStorage
    setRowData((prevData) => {
      const updatedData = prevData.filter((row) => !selectedData.includes(row));
  
      localStorage.setItem("rowData", JSON.stringify(updatedData));
      return updatedData;
    });
  
    messageApi.open({
      type: "warning",
      content: "Vehicle record has been deleted",
    });
  };

  //Modal
  const [isModalOpen1, setIsModalOpen1] = useState(false);
  const [isModalOpen2, setIsModalOpen2] = useState(false);
  
  //funkcija, kas aizver modal un atiestata visus Form datus
  const handleCloseModal = () => {
    form.resetFields();
    setIsModalOpen1(false);
  };

  const [deleteDisabled, setDeleteDisabled] = useState(true);
  const [editDisabled, setEditDisabled] = useState(true);

  const onSelectionChanged = useCallback(() => {
    const selectedRows = gridRef.current.api.getSelectedRows();
    if (selectedRows.length >= 1) {
      let isDeleteDisabled = false;
      let isEditDisabled = false;
      
      //izslēdz CRUD pogas priekš ierakstu dzēšanas un rediģēšanas
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

    if(selectedRows.length > 1)
      setEditDisabled(true)

  }, []);

  //DatePicker noteikumi par gada izvēli ( 1900 līdz tekošam gadam )
  const minYear = 1900;
  const maxYear = dayjs().year();

  const disabledDate = (current) => {
    return current && (current.year() < minYear || current.year() > maxYear);
  };

  //funkcija, kas ļauj rediģēt ierakstu caur dubult-klikšķa uz rindas
  const onRowDoubleClicked = () => {
    const selectedRows = gridRef.current.api.getSelectedRows();

    if (selectedRows.length === 1 && selectedRows[0].status === 'Available') {
      handleEdit();
      setIsModalOpen2(true);
    }
  }

  return (
    <>
      {contextHolder}
      <Navbar />
      <div style={{ display: "flex", justifyContent: "flex-start" }}>
        <ButtonGroup>
          <Button
            icon={<InsertRowBelowOutlined />}
            onClick={() => setIsModalOpen1(true)}
          >
            Add
          </Button>

          <Modal
            title="Add Vehicle"
            maskClosable={false}
            keyboard={false}
            open={isModalOpen1}
            onOk={onFinish}
            okText="Add Vehicle"
            cancelText="Quit"
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
                    onInput={(e) =>
                      (e.target.value = e.target.value.toUpperCase())
                    }
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
                    onChange={(date) =>
                      setFormData({ ...formData, year: date })
                    }
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
                    options={allVehicleEngineTypes.map((engineType) => ({
                      label: engineType,
                      value: engineType,
                    }))}
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
                    onInput={(e) =>
                      (e.target.value = e.target.value.toUpperCase())
                    }
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
                    onChange={(value) =>
                      setFormData({ ...formData, color: value })
                    }
                    options={allVehicleColors.map((colors) => ({
                      label: colors,
                      value: colors,
                    }))}
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
                    options={allVehicleBodyTypes.map((bodyType) => ({
                      label: bodyType,
                      value: bodyType,
                    }))}
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
            title="Edit Vehicle"
            open={isModalOpen2}
            okText={"Save"}
            cancelText={"Quit"}
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
                    onInput={(e) =>
                      (e.target.value = e.target.value.toUpperCase())
                    }
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
                    maxLength={12}
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
                      handleInputChange(
                        "year",
                        date ? date.format("YYYY") : null
                      )
                    }
                    disabledDate={disabledDate}
                  />
                </Form.Item>

                <Form.Item label="Engine">
                  <Select
                    value={editData ? editData.engine : ""}
                    onChange={(value) => handleEditEngineChange(value)}
                    options={allVehicleEngineTypes.map((engineType) => ({
                      label: engineType,
                      value: engineType,
                    }))}
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
                    onInput={(e) =>
                      (e.target.value = e.target.value.toUpperCase())
                    }
                    value={editData ? editData.numberplate : ""}
                    onChange={(e) =>
                      handleInputChange("numberplate", e.target.value)
                    }
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
                    options={allVehicleColors.map((colors) => ({
                      label: colors,
                      value: colors,
                    }))}
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
                    onChange={(value) =>
                      handleInputChange("enginecapacity", value)
                    }
                    disabled={isElectric}
                  />
                </Form.Item>
                <Form.Item label="Body type">
                  <Select
                    value={editData ? editData.bodytype : ""}
                    onChange={(value) => handleInputChange("bodytype", value)}
                    listHeight={200}
                    options={allVehicleBodyTypes.map((bodyType) => ({
                      label: bodyType,
                      value: bodyType,
                    }))}
                  />
                </Form.Item>
              </div>
            </Form>
          </Modal>

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
        </ButtonGroup>
      </div>

      <div className="ag-theme-balham" style={gridStyle}>
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
          alwaysShowVerticalScroll={true}
        ></AgGridReact>
      </div>
    </>
  );
}

export default CarRegistry;
