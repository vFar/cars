import React, { useState, useCallback } from "react";
import { AgGridReact } from "ag-grid-react";
import { Button, Form, Input, Select, DatePicker, InputNumber } from "antd";
import { Link } from 'react-router-dom';
import "./style.css";


import "ag-grid-community/styles/ag-grid.css";
import "ag-grid-community/styles/ag-theme-alpine.css";

// import { BrowserRouter, Routes, Route } from 'react-router-dom';
// import CarRegistry from './pages/CarRegistry.js';
// import CarSalesRegistry  from './pages/CarSalesRegistry.js';

function CarSalesRegistry() {
  const dateFormatList = ["DD/MM/YYYY", "DD/MM/YY", "DD-MM-YYYY", "DD-MM-YY"];

  // const onRemoveSelected = useCallback(() => {
  //   const selectedData = gridRef.current.api.getSelectedRows();
  //   gridRef.current.api.applyTransaction({ remove: selectedData });
  // }, []);

  return (
    <>

  <nav className="navbar">
        <Link
          to="/salesregistry"
          className="btn"
        >
          <Button  type="primary">Sale Registry</Button>
        </Link>

        <Link
          to="/echarts"
          className="btn"
        >
          <Button  type="primary">Echarts</Button>
        </Link>


        {/* <Button onClick={onRemoveSelected}>
            Remove Selected
        </Button> */}
      </nav>
      <Form layout="inline">
        <Form.Item>
          <InputNumber style={{width: 125}}
            controls={false}        
            min={0}
            max={100}
            formatter={(value) => `${value}%`}
            parser={(value) => value.replace("%", "")} 
            placeholder="Default VAT rate"
          />  
        </Form.Item>

        <Form.Item>
          <Button type="primary" htmlType="submit">
            OK
          </Button>
        </Form.Item>
      </Form>

      <Form layout="inline">
        <Form.Item>
          <Select
            placeholder="Select vehicle"
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
            placeholder="Status"
            style={{ width: 260 }}
            options={[
              {
                value: "New request received",
                label: "New request received",
              },
              {
                value: "Evaluation has begun",
                label: "Evaluation has begun",
              },
              {
                value: "Received a rating",
                label: "Received a rating",
              },
              {
                value: "Car sale has begun",
                label: "Car sale has begun",
              },
              {
                value: "Car sale has completed",
                label: "Car sale has completed",
              },
              {
                value: "Buyer has received a sales contract",
                label: "Buyer has received a sales contract",
              },
              {
                value: "Sold - Contract received from buyer",
                label: "Sold - Contract received from buyer",
              },
              {
                value: "Vehicle has been delivered to buyer",
                label: "Vehicle has been delivered to buyer",
              },
              {
                value: "Canceled",
                label: "Canceled",
              },
            ]}
          />
        </Form.Item>
        <Form.Item>
          <Input placeholder="Appraiser" />
        </Form.Item>

        <Form.Item>
          <InputNumber
            placeholder="Neto"
            controls={false}
            min={0}
            formatter={(value) =>
              `€ ${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ",")
            }
          ></InputNumber>
        </Form.Item>

        <Form.Item>
          <InputNumber
          controls={false}
            min={0}
            max={100}
            formatter={(value) => `${value}%`}
            parser={(value) => value.replace("%", "")}
          />
        </Form.Item>

        <Form.Item>
          <DatePicker format={dateFormatList} placeholder={"Date"} />
        </Form.Item>
        <Form.Item>
          <Button type="primary">OK</Button>
        </Form.Item>
      </Form>

      {/* <AgGridReact rowData={rowData} columnDefs={columnDefs} ref={gridRef}></AgGridReact> */}

      <Button type="primary">Generate PDF Document</Button>

      <Link to="/" className="btn" style={{ backgroundColor: "red" }}>
        <Button type="primary">Vehicle Registry</Button>
      </Link>
    </>
  );
}

export default CarSalesRegistry;
