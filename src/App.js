import React, { useState } from "react";
import { AgGridReact } from "ag-grid-react";
import { Button, Form, Input, Radio } from 'antd';
import './App.css';

import "ag-grid-community/styles/ag-grid.css";
import "ag-grid-community/styles/ag-theme-alpine.css";

function App() {  
  const [rowData] = useState([
    { marka: "Toyota", gads: "2099", modelis: "A22", numurzīme:'00000L', krasa: 'balta', motors: 'benzīns', motoratilpums: '12', atrumkarbatips: 'manuāls'},
    { marka: "Toyota", gads: "2099", modelis: "A22", numurzīme:'00000L', krasa: 'balta', motors: 'benzīns', motoratilpums: '12', atrumkarbatips: 'manuāls'},
    { marka: "Toyota", gads: "2099", modelis: "A22", numurzīme:'00000L', krasa: 'balta', motors: 'benzīns', motoratilpums: '12', atrumkarbatips: 'manuāls'},
  ]);

  const [columnDefs] = useState([
    { field: "marka" },
    { field: "gads" },
    { field: "modelis" },
    { field: "numurzīme" },
    { field: "krasa" },
    { field: "motors" },
    { field: "motoratilpums" },
    { field: "atrumkarbatips" }

    
  ]);

  return (
    
  <div>
    <Form
      layout='inline'
    >
      <Form.Item>
        <Input placeholder="Marka" />
      </Form.Item>
      <Form.Item>
        <Input placeholder="Gads" />
      </Form.Item>
      <Form.Item>
        <Input placeholder="Modelis" />
      </Form.Item>
      <Form.Item>
        <Input placeholder="Numurzīme" />
      </Form.Item>
      <Form.Item>
        <Input placeholder="Krasa" />
      </Form.Item>
      <Form.Item>
        <Input placeholder="Motors" />
      </Form.Item>
      <Form.Item>
        <Input placeholder="Motora tilpums" />
      </Form.Item>
      <Form.Item>
        <Input placeholder="Ātrumkarbas tips" />
      </Form.Item>
      <Form.Item>
        <Button type="primary">OK</Button>
      </Form.Item>
    </Form>
    
    <div className="ag-theme-alpine" style={{width: '1650px', height: '200px'}}>
      <AgGridReact rowData={rowData} columnDefs={columnDefs}></AgGridReact>
      <AgGridReact rowData={rowData} columnDefs={columnDefs}></AgGridReact>
      </div>
    </div>
  );
}

export default App;
