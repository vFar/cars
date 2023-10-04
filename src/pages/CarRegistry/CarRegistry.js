import React, { useEffect, useState, useMemo, useRef } from "react";
import { AgGridReact } from "ag-grid-react";
import { Button, Form, Input, InputNumber, Select, DatePicker } from "antd";
import "ag-grid-community/styles/ag-grid.css";
import "ag-grid-community/styles/ag-theme-alpine.css";
import moment from "moment";
import numericCellEditor from "./numericCellEditor.jsx";

import { Link } from "react-router-dom";

function CarRegistry() {
  const [formValid, setFormValid] = useState(false);
  const [formData, setFormData] = useState(() => {
    const savedData = localStorage.getItem("formData");
    const parsedData = savedData ? JSON.parse(savedData) : {};
    if (parsedData.gads) {
      parsedData.gads = moment(parsedData.gads);
    }
    return parsedData;
  });
  const [rowData, setRowData] = useState(() => {
    const savedRowData = localStorage.getItem("rowData");
    return savedRowData ? JSON.parse(savedRowData) : [];
  });

  useEffect(() => {
    localStorage.setItem("formData", JSON.stringify(formData));
  }, [formData]);

  useEffect(() => {
    localStorage.setItem("rowData", JSON.stringify(rowData));
  }, [rowData]);

  const handleFormSubmit = () => {
    if (formValid) {
      const yearValue = formData.gads ? formData.gads.format("YYYY") : "";
      const newData = { ...formData, gads: yearValue };
      setRowData([...rowData, newData]);
      setFormData({});
      console.log(rowData);
    }
  };

  const [columnDefs] = useState([
    { field: "VIN", cellEditorParams: { maxLength: 17, minLength: 5 } },
    { field: "numurzīme", cellEditorParams: { maxLength: 16, minLength: 2 } },
    { field: "marka" },
    { field: "modelis" },
    { field: "gads" },
    {
      field: "krāsa",
      cellEditor: "agSelectCellEditor",
      cellEditorParams: {
        values: [
          "Balta",
          "Melna",
          "Brūna",
          "Dzeltena",
          "Gaiši zila",
          "Zila",
          "Sudraba",
          "Zaļa",
          "Sarkana",
          "Tumši sarkana",
          "Violeta",
          "Pelēka",
          "Oranža",
        ],
      },
    },
    {
      field: "motors",
      cellEditor: "agSelectCellEditor",
      cellEditorParams: {
        values: ["Benzīns/gāze", "Benzīns", "Dīzelis", "Hibrīds", "Elektrisks"],
      },
    },
    { field: "motoratilpums", cellEditor: numericCellEditor },
    {
      field: "ātrumkārba",
      cellEditor: "agSelectCellEditor",
      cellEditorParams: { values: ["Manuāls", "Automāts"] },
    },
    {
      field: "virsbūve",
      cellEditor: "agSelectCellEditor",
      cellEditorParams: {
        values: [
          "Apvidus",
          "Hečbeks",
          "Kabriolets",
          "Kupeja",
          "Universālis",
          "Pikaps",
          "Sedans",
          "Mikroautobuss",
        ],
      },
    },
  ]);
  useEffect(() => {
    checkFormValidity();
  });

  const checkFormValidity = () => {
    const {
      VIN,
      numurzīme,
      marka,
      modelis,
      gads,
      krāsa,
      motors,
      motoratilpums,
      ātrumkārba,
      virsbūve,
    } = formData;

    const isFormValid =
      VIN &&
      numurzīme &&
      marka &&
      modelis &&
      gads &&
      krāsa &&
      motors &&
      motoratilpums &&
      ātrumkārba &&
      virsbūve;

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

  return (
    <>
      <div>
        <Form layout="inline">
          <Form.Item>
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
              placeholder="Numurzīme"
              onInput={(e) => (e.target.value = e.target.value.toUpperCase())}
              value={formData.numurzīme}
              onChange={(e) =>
                setFormData({ ...formData, numurzīme: e.target.value })
              }
            />
          </Form.Item>
          <Form.Item>
            <Input
              placeholder="Marka"
              value={formData.marka}
              onChange={(e) =>
                setFormData({ ...formData, marka: e.target.value })
              }
            />
          </Form.Item>
          <Form.Item>
            <Input
              placeholder="Modelis"
              value={formData.modelis}
              onChange={(e) =>
                setFormData({ ...formData, modelis: e.target.value })
              }
            />
          </Form.Item>
          <Form.Item>
            <DatePicker
              picker="year"
              placeholder={"Gads"}
              value={formData.gads}
              onChange={(date) => setFormData({ ...formData, gads: date })}
            />
          </Form.Item>
          <Form.Item>
            <Select
              style={{ width: 120 }}
              listHeight={450}
              placeholder="Krāsa"
              value={formData.krāsa}
              onChange={(value) => setFormData({ ...formData, krāsa: value })}
              options={[
                {
                  value: "Balta",
                  label: "Balta",
                },
                {
                  value: "Melna",
                  label: "Melna",
                },
                {
                  value: "Brūna",
                  label: "Brūna",
                },
                {
                  value: "Dzeltena",
                  label: "Dzeltena",
                },
                {
                  value: "Gaiši zila",
                  label: "Gaiši zila",
                },
                {
                  value: "Zila",
                  label: "Zila",
                },
                {
                  value: "Sudraba",
                  label: "Sudraba",
                },
                {
                  value: "Zaļa",
                  label: "Zaļa",
                },
                {
                  value: "Sarkana",
                  label: "Sarkana",
                },
                {
                  value: "Tumši sarkana",
                  label: "Tumši sarkana",
                },
                {
                  value: "Violeta",
                  label: "Violeta",
                },
                {
                  value: "Pelēka",
                  label: "Pelēka",
                },
                {
                  value: "Oranža",
                  label: "Oranža",
                },
              ]}
            />
          </Form.Item>
          <Form.Item style={{ width: 150 }}>
            <Select
              placeholder="Dzinējs"
              value={formData.motors}
              onChange={(value) => setFormData({ ...formData, motors: value })}
              options={[
                {
                  value: "Benzīns/gāze",
                  label: "Benzīns/gāze",
                },
                {
                  value: "Benzīns",
                  label: "Benzīns",
                },
                {
                  value: "Dīzelis",
                  label: "Dīzelis",
                },
                {
                  value: "Hibrīds",
                  label: "Hibrīds",
                },
                {
                  value: "Elektrisks",
                  label: "Elektrisks",
                },
              ]}
            />
          </Form.Item>
          <Form.Item>
            <InputNumber
              type="number"
              style={{ width: "150px" }}
              min={0.1}
              max={10}
              placeholder="Motora tilpums"
              value={formData.motoratilpums}
              onChange={(value) =>
                setFormData({ ...formData, motoratilpums: value })
              }
            />
          </Form.Item>
          <Form.Item>
            <Select
              placeholder="Ātrumkārbas tips"
              value={formData.ātrumkārba}
              onChange={(value) =>
                setFormData({ ...formData, ātrumkārba: value })
              }
              options={[
                {
                  value: "Manuāls",
                  label: "Manuāls",
                },
                {
                  value: "Automāts",
                  label: "Automāts",
                },
              ]}
            />
          </Form.Item>
          <Form.Item>
            <Select
              placeholder="Virsbūves tips"
              value={formData.virsbūve}
              onChange={(value) =>
                setFormData({ ...formData, virsbūve: value })
              }
              options={[
                {
                  value: "Apvidus",
                  label: "Apvidus",
                },
                {
                  value: "Hečbeks",
                  label: "Hečbeks",
                },
                {
                  value: "Kabriolets",
                  label: "Kabriolets",
                },
                {
                  value: "Kupeja",
                  label: "Kupeja",
                },
                {
                  value: "Universālis",
                  label: "Universālis",
                },
                {
                  value: "Pikaps",
                  label: "Pikaps",
                },
                {
                  value: "Sedans",
                  label: "Sedans",
                },
                {
                  value: "Minivens",
                  label: "Minivens",
                },
                {
                  value: "Mikroautobuss",
                  label: "Mikroautobuss",
                },
              ]}
            />
          </Form.Item>

          <Form.Item>
            <Button
              type="primary"
              htmlType="submit"
              onClick={handleFormSubmit}
              disabled={!formValid}
            >
              OK
            </Button>
          </Form.Item>
        </Form>

        <div className="ag-theme-alpine" style={{ height: 200, width: 1650 }}>
          <AgGridReact
            ref={gridRef}
            rowData={rowData}
            columnDefs={columnDefs}
            defaultColDef={defaultColDef}
            editType={"fullRow"}
            onCellValueChanged={handleCellValueChanged}
          ></AgGridReact>
        </div>

        <Link
          to="/CarSalesRegistry"
          className="btn"
          style={{ backgroundColor: "red" }}
        >
          <Button type="primary">Pārdošanas reģistrs</Button>
        </Link>
      </div>
    </>
  );
}

export default CarRegistry;
