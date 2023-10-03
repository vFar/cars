import React, { useState } from "react";
import { AgGridReact } from "ag-grid-react";
import { Button, Form, Input, InputNumber, Select, DatePicker } from "antd";
import "./App.css";

import "ag-grid-community/styles/ag-grid.css";
import "ag-grid-community/styles/ag-theme-alpine.css";

function App() {
  const [formData, setFormData] = useState({});
  const [rowData, setRowData] = useState([]);

  const dateFormatList = ["DD/MM/YYYY", "DD/MM/YY", "DD-MM-YYYY", "DD-MM-YY"];

  const handleFormSubmit = () => {
    const yearValue = formData.gads ? formData.gads.format("YYYY") : "";
    const newData = { ...formData, gads: yearValue };
    setRowData([...rowData, newData]);
    setFormData({});
    console.log(rowData);
  };

  const [columnDefs] = useState([
    { field: "marka" },
    { field: "modelis" },
    { field: "gads" },
    { field: "numurzīme" },
    { field: "krāsa" },
    { field: "motors" },
    { field: "motoratilpums" },
    { field: "ātrumkārba" },
  ]);

  return (
    <div>
      <Form layout="inline">
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
            value={formData.gads}
            onChange={(date) => setFormData({ ...formData, gads: date })}
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
          <Select
            value={formData.krāsa}
            onChange={(value) => setFormData({ ...formData, krāsa: value })}
            style={{ width: 120 }}
            listHeight={400}
            placeholder="Krāsa"
            options={[
              {
                value: "Balta",
                label: "Balta",
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
            value={formData.motors}
            onChange={(value) => setFormData({ ...formData, motors: value })}
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
            value={formData.motoratilpums}
            onChange={(value) =>
              setFormData({ ...formData, motoratilpums: value })
            }
            type="number"
            style={{ width: "150px" }}
            min={0.1}
            max={10}
            placeholder="Motora tilpums"
          />
        </Form.Item>
        <Form.Item>
          <Select
          value={formData.ātrumkārba}
          onChange={(value) => setFormData({...formData, ātrumkārba: value})}
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
          <Button type="primary" htmlType="submit" onClick={handleFormSubmit}>
            OK
          </Button>
        </Form.Item>
      </Form>

      <div
        className="ag-theme-alpine"
        style={{ width: "1650px", height: "200px" }}
      >
        <AgGridReact rowData={rowData} columnDefs={columnDefs}></AgGridReact>

        <Form layout="inline">
          <Form.Item>
            <Select
              placeholder="Izvēlies automašīnu"
              options={[
                //VAJAG SELECTOT NUMURZĪMI
                {
                  value: "jack",
                  label: "Jack",
                },
                {
                  value: "lucy",
                  label: "Lucy",
                },
                {
                  value: "tom",
                  label: "Tom",
                },
              ]}
            />
          </Form.Item>
          <Form.Item>
            <Select
              placeholder="Statuss"
              options={[
                {
                  value: "Labs",
                  label: "Labs",
                },
                {
                  value: "Slikts",
                  label: "Slikts",
                },
                {
                  value: "Vidējs",
                  label: "Vidējs",
                },
              ]}
            />
          </Form.Item>
          <Form.Item>
            <Input placeholder="Novērtētājs" />
          </Form.Item>
          <Form.Item>
            <Input placeholder="Pārdošanas cena (EUR)" />
          </Form.Item>
          <Form.Item>
            <DatePicker format={dateFormatList} />
          </Form.Item>
          <Form.Item>
            <Button type="primary">OK</Button>
          </Form.Item>
        </Form>

        <AgGridReact rowData={rowData} columnDefs={columnDefs}></AgGridReact>

        <Button type="primary">Ģenerēt PDF</Button>
      </div>
    </div>
  );
}

export default App;
