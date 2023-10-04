import React from "react";
import "./App.css";

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
