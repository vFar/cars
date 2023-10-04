import React, { useState } from "react";
import { AgGridReact } from "ag-grid-react";
import { Button, Form, Input, InputNumber, Select, DatePicker } from "antd";
import "./App.css";

import { BrowserRouter, Routes, Route } from 'react-router-dom';
import CarRegistry from './pages/CarRegistry.js';
import CarSalesRegistry  from './pages/CarSalesRegistry.js';

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
    <>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<CarRegistry />} />
          <Route path="CarSalesRegistry" element={<CarSalesRegistry />} />
        </Routes>
      </BrowserRouter>
    </>
  );
}

export default App;
