import React, { useState } from "react";
import { AgGridReact } from "ag-grid-react";
import { Button, Form, Input, InputNumber, Select, DatePicker } from 'antd';


import { BrowserRouter, Routes, Route } from 'react-router-dom';
import CarRegistry from './pages/CarRegistry.js';
import CarSalesRegistry  from './pages/CarSalesRegistry.js';

function App() {  
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
