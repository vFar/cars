import React from "react";
import "./App.css";

import { BrowserRouter, Routes, Route } from 'react-router-dom';
import CarRegistry from './pages/CarRegistry/CarRegistry.js';
import CarSalesRegistry  from './pages/CarSalesRegistry/CarSalesRegistry.js';

import ECharts  from './pages/ECharts.js';


function App() {
  return (
    <>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<CarRegistry />} />
          <Route path="salesregistry" element={<CarSalesRegistry />} />

          <Route path="echarts" element={<ECharts />} />
        </Routes>
      </BrowserRouter>
    </>
  );
}

export default App;
