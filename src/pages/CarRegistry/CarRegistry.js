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
} from "antd";
import "ag-grid-community/styles/ag-grid.css";
import "ag-grid-community/styles/ag-theme-balham.css";
import moment from "moment";
import "../style.css";

import { Link } from "react-router-dom";

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
      console.log(rowData);
    }
  };

  const [columnDefs] = useState([
    {
      field: "VIN",
      cellDataType: "text",
      cellEditorParams: { maxLength: 17, minLength: 5 },
    },
    {
      field: "numberplate",
      headerName: "Number plate",
      cellEditorParams: { maxLength: 10, minLength: 2 },
    },
    { field: "brand", headerName: "Brand" },
    { field: "model", headerName: "Model" },
    { field: "year", headerName: "Year", cellEditorParams: { maxLength: 4 } },
    {
      field: "color",
      cellEditor: "agSelectCellEditor",
      cellEditorParams: {
        values: [
          "White",
          "Black",
          "Brown",
          "Yellow",
          "Light blue",
          "Blue",
          "Silver",
          "Green",
          "Red",
          "Dark red",
          "Purple",
          "Gray",
          "Orange",
        ],
      },
    },
    {
      field: "engine",
      headerName: "Engine",
      cellEditor: "agSelectCellEditor",
      cellEditorParams: {
        values: ["Gasoline/gas", "Gasoline", "Diesel", "Hybrid", "Electric"],
      },
    },
    {
      field: "enginecapacity",
      headerName: "Engine capacity (L)",
      cellDataType: "number",
    },
    {
      field: "gearbox",
      headerName: "Gearbox",
      cellEditor: "agSelectCellEditor",
      cellEditorParams: { values: ["Manual", "Automatic"] },
    },
    {
      field: "bodytype",
      headerName: "Body type",
      cellEditor: "agSelectCellEditor",
      cellEditorParams: {
        values: [
          "Off-road",
          "Hatchback",
          "Cabriolet",
          "Coupe",
          "Universal",
          "Pickup",
          "Sedan",
          "Minibus",
        ],
      },
    },
    {
      field: "status",
      valueGetter: (params) => {
        if (params.data.status) {
          return params.data.status;
        }
        return "Available";
      },
      cellEditor: "agSelectCellEditor",
      cellEditorParams: {
        values: ["Available", "Sold"],
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
    setRowData(updatedData);
  };

  const onRemoveSelected = useCallback(() => {
    const selectedData = gridRef.current.api.getSelectedRows();
    gridRef.current.api.applyTransaction({ remove: selectedData });

    const updatedRowData = rowData.filter((row) => !selectedData.includes(row));
    localStorage.setItem("rowData", JSON.stringify(updatedRowData));
  }, [rowData]);

  return (
    <>
      <nav className="navbar">
        <Link to="/salesregistry" className="btn">
          <Button type="primary">Sale Registry</Button>
        </Link>

        <Link to="/echarts" className="btn">
          <Button type="primary">Echarts</Button>
        </Link>

        <Popconfirm
          title="Delete the record"
          description="Are you sure you want to delete record/s?"
          okText="Yes"
          cancelText="No"
          onConfirm={onRemoveSelected}
        >
          <Button danger>Delete Record</Button>
        </Popconfirm>
      </nav>
      <div>
        <Form layout="inline" className="form">
          <Form.Item style={{ width: "150px" }}>
            <Input
              maxLength="17"
              minLength="5"
              placeholder="VIN"
              onInput={(e) => (e.target.value = e.target.value.toUpperCase())}
              value={formData.VIN}
              onChange={(e) =>
                setFormData({ ...formData, VIN: e.target.value })
              }
            />
          </Form.Item>
          <Form.Item>
            <Input
              maxLength="8"
              placeholder="Number plate"
              onInput={(e) => (e.target.value = e.target.value.toUpperCase())}
              value={formData.numberplate}
              onChange={(e) =>
                setFormData({ ...formData, numberplate: e.target.value })
              }
            />
          </Form.Item>
          <Form.Item>
            <Input
              placeholder="Brand"
              value={formData.brand}
              onChange={(e) =>
                setFormData({ ...formData, brand: e.target.value })
              }
            />
          </Form.Item>
          <Form.Item>
            <Input
              placeholder="Model"
              value={formData.model}
              onChange={(e) =>
                setFormData({ ...formData, model: e.target.value })
              }
            />
          </Form.Item>
          <Form.Item>
            <DatePicker
              picker="year"
              placeholder={"Year"}
              value={formData.year}
              onChange={(date) => setFormData({ ...formData, year: date })}
            />
          </Form.Item>
          <Form.Item>
            <Select
              style={{ width: 120 }}
              listHeight={450}
              placeholder="Color"
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
          <Form.Item style={{ width: 150 }}>
            <Select
              placeholder="Engine"
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
          <Form.Item>
            <InputNumber
              type="number"
              controls={false}
              style={{ width: "150px" }}
              min={0.1}
              max={10}
              placeholder="Engine capacity (L)"
              value={formData.enginecapacity}
              onChange={(value) =>
                setFormData({ ...formData, enginecapacity: value })
              }
            />
          </Form.Item>
          <Form.Item>
            <Select
              placeholder="Gearbox"
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
          <Form.Item>
            <Select
              placeholder="Body type"
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

          <Form.Item>
            <Button
              className="btn2"
              type="primary"
              htmlType="submit"
              onClick={handleFormSubmit}
              disabled={!formValid}
            >
              Add record
            </Button>
          </Form.Item>
        </Form>

        <div
          className="ag-theme-balham"
          style={{ height: "80vh", width: "100%" }}
        >
          <AgGridReact
            ref={gridRef}
            rowData={rowData}
            columnDefs={columnDefs}
            defaultColDef={defaultColDef}
            editType={"fullRow"}
            rowSelection={"multiple"}
            onCellValueChanged={handleCellValueChanged}
            pagination={true}
            paginationPageSize={20}
          ></AgGridReact>
        </div>
      </div>
    </>
  );
}

export default CarRegistry;
