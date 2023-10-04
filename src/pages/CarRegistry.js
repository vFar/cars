import React, { useState } from "react";
import { AgGridReact } from "ag-grid-react";
import { Button, Form, Input, InputNumber, Select, DatePicker } from "antd";
import "../App.css";

import "ag-grid-community/styles/ag-grid.css";
import "ag-grid-community/styles/ag-theme-alpine.css";

import { Link } from "react-router-dom";

function CarRegistry() {
  const [rowData] = useState([
    {
      VIN: "VF7XS9HUC9Z003648",
      numurzīme: "00000L",
      marka: "Toyota",
      modelis: "A22",
      gads: "2009",
      krāsa: "balta",
      motors: "benzīns",
      motoratilpums: "12",
      ātrumkārba: "manuāls",
      virsbūve: "Pikaps",
    },
  ]);

  const [columnDefs] = useState([
    { field: "VIN" },
    { field: "numurzīme" },
    { field: "marka" },
    { field: "modelis" },
    { field: "gads" },
    { field: "krāsa" },
    { field: "motors" },
    { field: "motoratilpums" },
    { field: "ātrumkārba" },
    { field: "virsbūve" },
  ]);

  return (
    <>
      <div>
        <Form layout="inline">
          <Form.Item>
            <Input
              maxLength="17"
              placeholder="VIN"
              onInput={(e) => (e.target.value = e.target.value.toUpperCase())}
            />
          </Form.Item>
          <Form.Item>
            <Input
              maxLength="8"
              placeholder="Numurzīme"
              onInput={(e) => (e.target.value = e.target.value.toUpperCase())}
            />
          </Form.Item>
          <Form.Item>
            <Input placeholder="Marka" />
          </Form.Item>
          <Form.Item>
            <Input placeholder="Modelis" />
          </Form.Item>
          <Form.Item>
            <DatePicker picker="year" placeholder={"Gads"} />
          </Form.Item>
          <Form.Item>
            <Select
              style={{ width: 120 }}
              listHeight={450}
              placeholder="Krāsa"
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
            />
          </Form.Item>
          <Form.Item>
            <Select
              placeholder="Ātrumkārbas tips"
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
            <Button type="primary" htmlType="submit">
              OK
            </Button>
          </Form.Item>
        </Form>

        <div className="ag-theme-alpine" style={{ height: 200, width: 1650 }}>
          <AgGridReact rowData={rowData} columnDefs={columnDefs}></AgGridReact>
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
