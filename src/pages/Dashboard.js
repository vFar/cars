import React from "react";

import CarRegistry from '../pages/CarRegistry/CarRegistry.js';
import CarSalesRegistry  from '../pages/CarSalesRegistry/CarSalesRegistry.js';
import ECharts  from '../pages/ECharts.js';


import { Link } from 'react-router-dom';
import { Button } from 'antd';


function App() {
  return (
    <>
        <Link to="/salesregistry" className="btn">
          <Button type="primary">Sale Registry</Button>
        </Link>

        <Link to="/echarts" className="btn">
          <Button type="primary">Echarts</Button>
        </Link>

        <Link to="/carregistry" className="btn">
          <Button type="primary">Vehicle Registry</Button>
        </Link>
    </>
  );
}

export default App;
