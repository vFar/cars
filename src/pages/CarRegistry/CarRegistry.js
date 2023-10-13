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
  Layout,
  Modal,
} from "antd";
import "ag-grid-community/styles/ag-grid.css";
import "ag-grid-community/styles/ag-theme-balham.css";
import moment from "moment";
import "../style.css";
import { InsertRowBelowOutlined, EditOutlined } from "@ant-design/icons";
import Navbar from '../Navbar.js';

import {
  BarChartOutlined,
  ShoppingFilled,
  CarFilled,
  InfoCircleFilled,
} from "@ant-design/icons";
import { Link } from "react-router-dom";
import ECharts from "../ECharts";

function CarRegistry() {
  const [formValid, setFormValid] = useState(false);
  const [formData, setFormData] = useState(() => {
    const savedData = localStorage.getItem("formData");
    const parsedData = savedData ? JSON.parse(savedData) : {};
    if (parsedData.year) {
      parsedData.year = moment(parsedData.year);
    }
    return parsedData;
  });
  const [rowData, setRowData] = useState(() => {
    const savedRowData = localStorage.getItem("rowData");
    return savedRowData ? JSON.parse(savedRowData) : [];
  });

  const numberplates = rowData.map((row) => row.numberplate);

  localStorage.setItem("numberplates", JSON.stringify(numberplates));

  useEffect(() => {
    localStorage.setItem("formData", JSON.stringify(formData));
  }, [formData]);

  useEffect(() => {
    localStorage.setItem("rowData", JSON.stringify(rowData));
  }, [rowData]);

  const handleFormSubmit = () => {
    if (formValid) {
      const yearValue = formData.year ? formData.year.format("YYYY") : "";
      const newData = { ...formData, year: yearValue };
      setRowData([...rowData, newData]);
      setFormData({});
      setIsModalOpen1(false);
    }
  };

  const [columnDefs] = useState([
    {
      field: "VIN",
      cellDataType: "text",
    },
    {
      field: "numberplate",
      headerName: "Number plate",
    },
    { field: "brand", headerName: "Brand", sortable: true},
    { field: "model", headerName: "Model", sortable: true},
    { field: "year", headerName: "Year", sortable: true},
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
      resizeable: true,
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
      sortable: true,
      valueGetter: (params) => {
        if (params.data.status) {
          return params.data.status;
        }
        return "Available";
      },
    },
  ]);
  useEffect(() => {
    checkFormValidity();
  });

  const checkFormValidity = () => {
    const {
      VIN,
      numberplate,
      brand,
      model,
      year,
      color,
      engine,
      enginecapacity,
      gearbox,
      bodytype,
    } = formData;

    const isFormValid =
      VIN &&
      numberplate &&
      brand &&
      model &&
      year &&
      color &&
      engine &&
      enginecapacity &&
      gearbox &&
      bodytype;

    setFormValid(isFormValid);
  };

  const defaultColDef = useMemo(() => {
    return {
      flex: 1,
    };
  }, []);

  const gridRef = useRef();

  const onRemoveSelected = useCallback(() => {
    const selectedData = gridRef.current.api.getSelectedRows();
    gridRef.current.api.applyTransaction({ remove: selectedData });

    const updatedRowData = rowData.filter((row) => !selectedData.includes(row));
    localStorage.setItem("rowData", JSON.stringify(updatedRowData));
  }, [rowData]);

  //Modal
  const [isModalOpen1, setIsModalOpen1] = useState(false);
  const [isModalOpen2, setIsModalOpen2] = useState(false);

  const [deleteDisabled, setDeleteDisabled] = useState(true);
  const [editDisabled, setEditDisabled] = useState(true);


  const onSelectionChanged = useCallback(() => {
    const selectedRows = gridRef.current.api.getSelectedRows();
    if(selectedRows.length >= 1)
      setDeleteDisabled(false)

    if(selectedRows.length > 1)
      setEditDisabled(true)

    if(selectedRows.length < 1)
      setEditDisabled(true)
      setDeleteDisabled(true)
    
    if(selectedRows.length === 1)
      setEditDisabled(false)
      setDeleteDisabled(false)

    if(selectedRows.length === 0)
      setDeleteDisabled(true)
  }, []);
  return (
    <>
      <Navbar/>
      
      <Popconfirm
        title="Delete the record"
        description="Are you sure you want to delete record/s?"
        okText="Yes"
        cancelText="No"
        onConfirm={onRemoveSelected}
      >
      <Button danger disabled={deleteDisabled}>Delete Record</Button>
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
        onOk={handleFormSubmit}
        okText="Add Record"
        cancelText="Cancel"
        okButtonProps={{
          disabled: !formValid,
        }}
        onCancel={() => setIsModalOpen1(false)}
      >
        <Form layout="vertical" className="form">
          <div>
          <Form.Item label="VIN">
            <Input
              maxLength="17"
              minLength="5"
              onInput={(e) => (e.target.value = e.target.value.toUpperCase())}
              value={formData.VIN}
              onChange={(e) =>
                setFormData({ ...formData, VIN: e.target.value })
              }
            />
          </Form.Item>

          <Form.Item label="Brand">
            <Input
              maxLength={20}
              value={formData.brand}
              onChange={(e) =>
                setFormData({ ...formData, brand: e.target.value })
              }
            />
          </Form.Item>

          <Form.Item label="Year">
            <DatePicker
              picker="year"
              placeholder=""
              value={formData.year}
              onChange={(date) => setFormData({ ...formData, year: date })}
            />
          </Form.Item>

          <Form.Item label="Engine">
            <Select
              value={formData.engine}
              onChange={(value) => setFormData({ ...formData, engine: value })}
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
              value={formData.gearbox}
              onChange={(value) => setFormData({ ...formData, gearbox: value })}
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
              value={formData.numberplate}
              onChange={(e) =>
                setFormData({ ...formData, numberplate: e.target.value })
              }
            />
          </Form.Item>

          <Form.Item label="Model">
            <Input
              maxLength={20}
              value={formData.model}
              onChange={(e) =>
                setFormData({ ...formData, model: e.target.value })
              }
            />
          </Form.Item>

          <Form.Item label="Color">
            <Select
              listHeight={240}
              value={formData.color}
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

          <Form.Item label="Engine capacity (L)">
            <InputNumber
              type="decimal"
              style={{width: '100%'}}
              controls={false}
              min={0.1}
              max={10}
              value={formData.enginecapacity}
              onChange={(value) =>
                setFormData({ ...formData, enginecapacity: value })
              }
            />
          </Form.Item>
          

          <Form.Item label="Body type">
            <Select
              value={formData.bodytype}
              onChange={(value) =>
                setFormData({ ...formData, bodytype: value })
              }
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
              ]}
            />
          </Form.Item>
          </div>
        </Form>
      </Modal>
      

      <Button icon={<EditOutlined />} disabled={editDisabled} onClick={() => setIsModalOpen2(true)}>
          Edit
        </Button>

      <Modal
        keyboard={false}
        maskClosable={false}
        title="Edit Record"
        open={isModalOpen2}
        okText={"Save"}
        cancelText={"Cancel"}
        onOk={() => setIsModalOpen2(false)}
        onCancel={() => setIsModalOpen2(false)}
      >
        <Form className="form" layout="vertical">
          <div>
          <Form.Item label="VIN">
            <Input
              maxLength="17"
              minLength="5"
              onInput={(e) => (e.target.value = e.target.value.toUpperCase())}
            />
          </Form.Item>

          <Form.Item label="Brand">
            <Input
              maxLength={20}
            />
          </Form.Item>

          <Form.Item label="Year">
            <DatePicker
              style={{width: '100%'}}
              picker="year"
              placeholder=""
            />
          </Form.Item>



          <Form.Item label="Engine">
            <Select
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
            />
          </Form.Item>
          
          <Form.Item label="Model">
            <Input
              maxLength={20}
            />
          </Form.Item>

          <Form.Item label="Color">
            <Select
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
              style={{width: '100%'}}
              controls={false}
              min={0.1}
              max={10}
            />
          </Form.Item>
          <Form.Item label="Body type">
            <Select
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
              ]}
            />
          </Form.Item>

          </div>
        </Form>
      </Modal>

      <div
        className="ag-theme-balham"
        style={{ height: "80vh", width: "100%"}}
      >
        <AgGridReact
          ref={gridRef}
          rowData={rowData}
          columnDefs={columnDefs}
          defaultColDef={defaultColDef}
          rowSelection={"multiple"}
          pagination={true}
          paginationPageSize={20}
          onSelectionChanged={onSelectionChanged}
        ></AgGridReact>
      </div>
    </>
  );
}

export default CarRegistry;
