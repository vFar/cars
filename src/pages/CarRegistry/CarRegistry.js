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

import {
  BarChartOutlined,
  ShoppingFilled,
  CarFilled,
  InfoCircleFilled,
} from "@ant-design/icons";
import { Link } from "react-router-dom";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faReact } from "@fortawesome/free-brands-svg-icons";

const { Header } = Layout;

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
    { field: "brand", headerName: "Brand" },
    { field: "model", headerName: "Model" },
    { field: "year", headerName: "Year" },
    {
      field: "color",
    },
    {
      field: "engine",
      headerName: "Engine",
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
    },
    {
      field: "bodytype",
      headerName: "Body type",
    },
    {
      field: "status",
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

  const [disabled, setDisabled] = useState(true);
  const [editDisabled, setEditDisabled] = useState(false);


  const onSelectionChanged = useCallback(() => {
    const selectedRows = gridRef.current.api.getSelectedRows();
    if(selectedRows.length >= 1){
      setDisabled(false)
    }else{
      setDisabled(true)
    }

    if(selectedRows.length > 1)
    setEditDisabled(true)
    
    if(selectedRows.length === 1)
    setEditDisabled(false)
  }, []);
  return (
    <>
      <Layout>
        <Header className="dashboardSider">
          <Link to="/">
          <FontAwesomeIcon className="dashboardBtn App-logo" size="2x" icon={faReact}/>

          </Link>

          <div style={{ display: "flex", gap: "50px" }}>
            <Link to="/carregistry">
              <Button
                icon={<CarFilled />}
                type="primary"
                className="dashboardBtn activeLink"
              >
                Car Registry
              </Button>
            </Link>

            <Link to="/salesregistry">
              <Button
                icon={<ShoppingFilled />}
                className="dashboardBtn"
                type="primary"
              >
                Sale Registry
              </Button>
            </Link>

            <Link to="/echarts">
              <Button
                icon={<BarChartOutlined />}
                className="dashboardBtn"
                type="primary"
              >
                Diagrams
              </Button>
            </Link>
          </div>
        </Header>
      </Layout>

      <Popconfirm
        title="Delete the record"
        description="Are you sure you want to delete record/s?"
        okText="Yes"
        cancelText="No"
        onConfirm={onRemoveSelected}
      >
      <Button danger disabled={disabled}>Delete Record</Button>
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
        <Form className="form">
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
          <Form.Item label="Brand">
            <Input
              maxLength={20}
              value={formData.brand}
              onChange={(e) =>
                setFormData({ ...formData, brand: e.target.value })
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
          <Form.Item label="Year">
            <DatePicker
              picker="year"
              placeholder=""
              value={formData.year}
              onChange={(date) => setFormData({ ...formData, year: date })}
            />
          </Form.Item>
          <Form.Item label="Color">
            <Select
              listHeight={450}
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
          <Form.Item label="Engine capacity (L)">
            <InputNumber
              type="decimal"
              controls={false}
              style={{ width: "150px" }}
              min={0.1}
              max={10}
              value={formData.enginecapacity}
              onChange={(value) =>
                setFormData({ ...formData, enginecapacity: value })
              }
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
        <Form className="form">
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
          <Form.Item label="Brand">
            <Input
              maxLength={20}
              value={formData.brand}
              onChange={(e) =>
                setFormData({ ...formData, brand: e.target.value })
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
          <Form.Item label="Year">
            <DatePicker
              picker="year"
              placeholder=""
              value={formData.year}
              onChange={(date) => setFormData({ ...formData, year: date })}
            />
          </Form.Item>
          <Form.Item label="Color">
            <Select
              listHeight={420}
              
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
          <Form.Item label="Engine capacity (L)">
            <InputNumber
              type="number"
              controls={false}
              min={0.1}
              max={10}
              value={formData.enginecapacity}
              onChange={(value) =>
                setFormData({ ...formData, enginecapacity: value })
              }
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
        </Form>
      </Modal>

      <div
        className="ag-theme-balham"
        style={{ height: "80vh", width: "100%" }}
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
