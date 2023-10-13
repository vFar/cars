import React from "react";
import "./style.css";
import { Link } from "react-router-dom";
import { Layout, Button, Card} from "antd";

import ReactECharts from 'echarts-for-react';
import * as echarts from 'echarts/core';

import Navbar from './Navbar.js';

const options = {
  grid: { top: 8, right: 8, bottom: 24, left: 36 },
  xAxis: {
    type: 'category',
    data: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
  },
  yAxis: {
    type: 'value',
  },
  series: [
    {
      data: [500, 1000, 1500, 2000, 2000, 2000, 100],
      type: 'line',
      smooth: true,
    },
    {
      data: [100, 200, 300, 400, 500],
      type: 'bar',
      smooth: true,
    },
    {
      data: [100, 200, 500, 400, 500],
      type: 'line',
      smooth: true,
    },
  ],
  tooltip: {
    trigger: 'axis',
  },
};

function ECharts() {
  return (
    <>
      <Navbar/>
      <Card className="diagramCards">
      <ReactECharts option={options} notMerge={true} />
      </Card>
    </>
  );
}

export default ECharts;
