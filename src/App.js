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
  const [form] = Form.useForm();
  const [formLayout, setFormLayout] = useState('horizontal');
  const onFormLayoutChange = ({ layout }) => {
    setFormLayout(layout);
  };
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

  const formItemLayout =
    formLayout === 'horizontal'
      ? {
          labelCol: {
            span: 4,
          },
          wrapperCol: {
            span: 14,
          },
        }
      : null;
  const buttonItemLayout =
    formLayout === 'horizontal'
      ? {
          wrapperCol: {
            span: 14,
            offset: 4,
          },
        }
      : null;
  return (
    
  <div>
    <div className="ag-theme-alpine" style={{width: '1650px', height: '200px'}}>
      <AgGridReact rowData={rowData} columnDefs={columnDefs}></AgGridReact>
      <AgGridReact rowData={rowData} columnDefs={columnDefs}></AgGridReact>
      </div>
      <Form
      {...formItemLayout}
      layout={formLayout}
      form={form}
      initialValues={{
        layout: formLayout,
      }}
      onValuesChange={onFormLayoutChange}
      style={{
        maxWidth: formLayout === 'inline' ? 'none' : 600,
      }}
    >
      <Form.Item label="Form Layout" name="layout">
        <Radio.Group value={formLayout}>
          <Radio.Button value="horizontal">Horizontal</Radio.Button>
          <Radio.Button value="vertical">Vertical</Radio.Button>
          <Radio.Button value="inline">Inline</Radio.Button>
        </Radio.Group>
      </Form.Item>
      <Form.Item label="Field A">
        <Input placeholder="input placeholder" />
      </Form.Item>
      <Form.Item label="Field B">
        <Input placeholder="input placeholder" />
      </Form.Item>
      <Form.Item {...buttonItemLayout}>
        <Button type="primary">Submit</Button>
      </Form.Item>
    </Form>
    </div>
  );
}

export default App;
