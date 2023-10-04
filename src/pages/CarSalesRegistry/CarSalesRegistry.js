import React, { useState } from "react";
import { AgGridReact } from "ag-grid-react";
import { Button, Form, Input, InputNumber, Select, DatePicker } from "antd";
import { Link } from 'react-router-dom';

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
              style={{width: 260}}
              options={[
                {
                  value: "Saņemts jauns pieprasījums",
                  label: "Saņemts jauns pieprasījums",
                },
                {
                  value: "Uzsākta vērtēšana",
                  label: "Uzsākta vērtēšana",
                },
                {
                  value: "Saņemts novērtējums",
                  label: "Saņemts novērtējums",
                },
                {
                  value: "Sākās automašīnu tirdzniecība",
                  label: "Sākās automašīnu tirdzniecība",
                },
                {
                  value: "Automašīnu tirdzniecība pabeigta",
                  label: "Automašīnu tirdzniecība pabeigta",
                },
                {
                  value: "Pārdošanas līgums nosūtīts pircējam",
                  label: "Pārdošanas līgums nosūtīts pircējam",
                },
                {
                  value: "Pārdots - līgums atpakaļ no pircēja",
                  label: "Pārdots - līgums atpakaļ no pircēja",
                },
                {
                  value: "Automašīna piegādāta pircējam",
                  label: "Automašīna piegādāta pircējam",
                },
                {
                  value: "Atcelts",
                  label: "Atcelts",
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

        <Link
          to="/"
          className="btn"
          style={{ backgroundColor: "red" }}
        >
          <Button type="primary">Automašīnu reģistrs</Button>
        </Link>
    </>
  );
}

export default CarSalesRegistry;
