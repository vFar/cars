import React from "react";
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import CarRegistry from './pages/CarRegistry/CarRegistry.js';
import CarSalesRegistry  from './pages/CarSalesRegistry/CarSalesRegistry.js';
import Dashboard from './pages/Dashboard.js';


function App() {
  return (
    <>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Dashboard />} />
          <Route path="salesregistry" element={<CarSalesRegistry />} />
          <Route path="carregistry" element={<CarRegistry />} />
        </Routes>
      </BrowserRouter>
    </>
  );
}

export default App;
