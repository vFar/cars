import React, { useState } from "react";
import { AgGridReact } from "ag-grid-react";
import { Button, Form, Input, InputNumber, Select, DatePicker } from "antd";
import '../App.css';

import "ag-grid-community/styles/ag-grid.css";
import "ag-grid-community/styles/ag-theme-alpine.css";

// import { BrowserRouter, Routes, Route } from 'react-router-dom';
// import CarRegistry from './pages/CarRegistry.js';
// import CarSalesRegistry  from './pages/CarSalesRegistry.js';

function CarSalesRegistry() {
  const dateFormatList = ["DD/MM/YYYY", "DD/MM/YY", "DD-MM-YYYY", "DD-MM-YY"];

  return (
    <>
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
            <DatePicker format={dateFormatList} placeholder={"Gads"}/>
          </Form.Item>
          <Form.Item>
            <Button type="primary">OK</Button>
          </Form.Item>
        </Form>

        {/* <AgGridReact rowData={rowData} columnDefs={columnDefs}></AgGridReact> */}

        <Button type="primary">Ģenerēt PDF</Button>
    </>
  );
}

export default CarSalesRegistry;
