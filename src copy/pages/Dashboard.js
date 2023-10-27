import React, { useState, useMemo, useRef } from "react";
import "./style.css";
import { Row, Col, Card, Typography, Radio } from "antd";

import Navbar from "./Navbar.js";
import Footer from "./Footer.js";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faCarOn,
  faEuroSign,
  faPiggyBank,
  faSquareCheck,
} from "@fortawesome/free-solid-svg-icons";
import dayjs from "dayjs";

import "ag-grid-community/styles/ag-grid.css";
import "ag-grid-community/styles/ag-theme-material.css";
import { AgGridReact } from "ag-grid-react";

import ReactECharts from "echarts-for-react";

const { Title } = Typography;
const Dashboard = () => {
  const savedsalesRowData = JSON.parse(localStorage.getItem("salesRowData"));
  const savedcarRowData = JSON.parse(localStorage.getItem("rowData"));

  const firstFiveAvailableRows = savedcarRowData
    .filter((row) => row.status === "Available")
    .slice(0, 5);

  const carssoldMonthly = (bool) => {
    var newVar = [];

    for (let i = 0; i < savedsalesRowData.length; i++) {
      const element = savedsalesRowData[i];
      if (element.date !== "") {
        newVar = [...newVar, element.date.slice(0, -3)];
      }
    }

    const counts = [];
    newVar.forEach(function (x) {
      counts[x] = (counts[x] || 0) + 1;
    });

    var returnval;
    if (bool) {
      returnval = Object.keys(counts);
    } else {
      returnval = Object.values(counts);
    }
    return returnval;
  };

  const mostfrequentBrand = () => {
    var newVar = [];
    for (let i = 0; i < savedcarRowData.length; i++) {
      const element = savedcarRowData[i];
      newVar = [...newVar, element.brand];
    }

    const counts = [];
    newVar.forEach(function (x) {
      counts[x] = (counts[x] || 0) + 1;
    });

    var name = Object.keys(counts);
    var value = Object.values(counts);
    var data = [];

    for (let i = 0; i < name.length; i++) {
      data = [...data, { value: value[i], name: name[i] }];
    }

    data = [...data].sort((a, b) => b.value - a.value);
    data = data.slice(0, 5);

    return data;
  };

  const enginetypecount = () => {
    var newVar = [];
    for (let i = 0; i < savedcarRowData.length; i++) {
      const element = savedcarRowData[i];
      newVar = [...newVar, element.engine];
    }

    const counts = [];
    newVar.forEach(function (x) {
      counts[x] = (counts[x] || 0) + 1;
    });

    var name = Object.keys(counts);
    var value = Object.values(counts);
    var data = [];

    for (let i = 0; i < name.length; i++) {
      data = [...data, { value: value[i], name: name[i] }];
    }

    return data;
  };

  const options1 = {
    grid: { top: 8, right: 8, bottom: 24, left: 36 },
    xAxis: {
      type: "category",
      data: [
        "January",
        "February",
        "March",
        "April",
        "May",
        "June",
        "July",
        "August",
        "September",
        "October",
        "November",
        "December",
      ],
    },
    yAxis: {
      type: "value",
    },
    series: [
      {
        data: carssoldMonthly(false),
        type: "bar",
        smooth: true,
        color: "rgb(64,150,255)",
      },
    ],
    tooltip: {
      trigger: "axis",
    },
  };

  const options2 = {
    tooltip: {
      trigger: "item",
    },
    series: [
      {
        type: "pie",
        radius: ["45%", "75%"],
        avoidLabelOverlap: false,
        itemStyle: {
          borderRadius: 10,
          borderColor: "#fff",
          borderWidth: 10,
        },
        label: {
          color: "gray",
          fontSize: 15,
          zIndex: 999,
        },
        labelLine: {
          smooth: 0.2,
          length: 30,
          length2: 20,
        },
        data: mostfrequentBrand(),
      },
    ],
    color: "rgb(64,150,255)",
  };

  const options3 = {
    tooltip: {
      trigger: "item",
    },

    series: [
      {
        type: "pie",
        radius: ["45%", "75%"],
        avoidLabelOverlap: false,
        itemStyle: {
          borderRadius: 10,
          borderColor: "#fff",
          borderWidth: 10,
        },
        label: {
          color: "gray",
          fontSize: 15,
        },
        labelLine: {
          smooth: 0.5,
          length: 20,
          length2: 20,
        },
        data: enginetypecount(),
      },
    ],
    color: "#4096FF",
  };

  const defaultColDef = useMemo(() => {
    return {
      flex: 1,
      suppressMovable: true,
    };
  }, []);

  const gridRef = useRef();
  const [columnDefs] = useState([
    {
      field: "numberplate",
    },
    {
      field: "brand",
      headerName: "Brand",
    },
    { field: "model", headerName: "Model" },
    { field: "year", headerName: "Year" },
    { field: "engine", headerName: "Engine" },
    {
      field: "bodytype",
      headerName: "Body type",
    },
  ]);

  const availableCars = () => {
    var status = 0;
    for (let i = 0; i < savedcarRowData.length; i++) {
      const element = savedcarRowData[i];
      if (element.status === "Available") status++;
    }
    return status;
  };

  const soldCars = () => {
    var status = 0;
    for (let i = 0; i < savedcarRowData.length; i++) {
      const element = savedcarRowData[i];
      if (element.status === "Sold") status++;
    }
    return status;
  };

  const reservedCars = () => {
    var status = 0;
    for (let i = 0; i < savedcarRowData.length; i++) {
      const element = savedcarRowData[i];
      if (element.status === "Reserved") status++;
    }
    return status;
  };

  const monthlyProfit = () => {
    // //in development, can be coded after salesregistry is done ( status and fullprice records are needed )
    // var test = 0;
    // const todayDate = dayjs().format('YYYY-MM-DD')
    // for (let i = 0; i < savedsalesRowData.length; i++) {
    //   const element = savedsalesRowData[i];
    // }
    // return test;
  };

  return (
    <>
      <Navbar />
      <div
        style={{
          maxWidth: "1300px",
          height: "100%",
          display: "flex",
          justifyContent: "center",
          margin: "0 auto",
          flexDirection: "column",
        }}
      >
        <Row
          style={{
            width: "100%",
            marginTop: "70px",
            display: "flex",
            justifyContent: "space-between",
          }}
        >
          <Col>
            {/* 1st card - how many cars are sold (carregistry grid > status('sold')) */}
            <Card className="dashboardCards">
              <Row style={{ justifyContent: "space-between" }}>
                <Col>
                  <Title
                    level={5}
                    style={{
                      color: "#9ca3af",
                      fontSize: "13px",
                      margin: 0,
                      padding: 0,
                    }}
                  >
                    Complete Car Sales
                  </Title>

                  <Title level={2} style={{ margin: 0, padding: 0 }}>
                    {soldCars()}
                  </Title>
                </Col>

                <Col>
                  <FontAwesomeIcon
                    icon={faPiggyBank}
                    className="dashboardCardIcon fa-fw"
                  />
                </Col>
              </Row>
            </Card>
          </Col>

          <Col>
            {/* 2nd card - ja dayjs() menesis sakrit ar date ieks salesregistry, tad panem ta rindas fullprice un saskaita visu kopa (income profit)*/}
            {/* Monthly income profit */}
            <Card className="dashboardCards">
              <Row style={{ justifyContent: "space-between" }}>
                <Col>
                  <Title
                    level={5}
                    style={{
                      color: "#9ca3af",
                      fontSize: "13px",
                      margin: 0,
                      padding: 0,
                    }}
                  >
                    Monthly Income Profit
                  </Title>

                  <Title level={2} style={{ margin: 0, padding: 0 }}>
                    {monthlyProfit()}
                  </Title>
                </Col>

                <Col>
                  <FontAwesomeIcon
                    icon={faEuroSign}
                    className="dashboardCardIcon fa-fw"
                  />
                </Col>
              </Row>
            </Card>
          </Col>

          <Col>
            {/* 3rd card - how many cars are 'reserved' */}
            <Card className="dashboardCards">
              <Row style={{ justifyContent: "space-between" }}>
                <Col>
                  <Title
                    level={5}
                    style={{
                      color: "#9ca3af",
                      fontSize: "13px",
                      margin: 0,
                      padding: 0,
                    }}
                  >
                    Total Reserved Cars
                  </Title>

                  <Title level={2} style={{ margin: 0, padding: 0 }}>
                    {reservedCars()}
                  </Title>
                </Col>

                <Col>
                  <FontAwesomeIcon
                    icon={faSquareCheck}
                    className="dashboardCardIcon fa-fw"
                  />
                </Col>
              </Row>
            </Card>
          </Col>

          <Col>
            {/* 3rd card - how many cars are available (carregistry grid > status ('available')) */}
            {/* Total Available Cars */}
            <Card className="dashboardCards">
              <Row style={{ justifyContent: "space-between" }}>
                <Col>
                  <Title
                    level={5}
                    style={{
                      color: "#9ca3af",
                      fontSize: "13px",
                      margin: 0,
                      padding: 0,
                    }}
                  >
                    Total Available Cars
                  </Title>

                  <Title level={2} style={{ margin: 0, padding: 0 }}>
                    {availableCars()}
                  </Title>
                </Col>

                <Col>
                  <FontAwesomeIcon
                    icon={faCarOn}
                    className="dashboardCardIcon fa-fw"
                  />
                </Col>
              </Row>
            </Card>
          </Col>
        </Row>

        <Row
          style={{
            width: "100%",
            marginTop: "50px",
            display: "flex",
            justifyContent: "space-between",
          }}
        >
          <Col>
            <Card className="diagramCards">
              <Title
                level={3}
                style={{
                  color: "black",
                  padding: 0,
                  textAlign: "center",
                  margin: 0,
                  marginBottom: 40,
                }}
              >
                Engine Type Distribution
              </Title>
              <ReactECharts option={options3} style={{ height: 400 }} />
            </Card>
          </Col>

          <Col>
            <Card className="diagramCards">
              <Title
                level={3}
                style={{
                  color: "black",
                  padding: 0,
                  textAlign: "center",
                  margin: 0,
                  marginBottom: 40,
                }}
              >
                Top Vehicle Brands
              </Title>

              <ReactECharts option={options2} style={{ height: 400 }} />
            </Card>
          </Col>
        </Row>

        <Row
          style={{
            width: "100%",
            margin: "50px 0",
          }}
        >
          <Col>
            <Card className="fullCard">
              <div style={{ display: "flex", flexDirection: "column" }}>
                <Title
                  level={3}
                  style={{
                    color: "black",
                    margin: 0,
                    padding: 0,
                    textAlign: "center",
                  }}
                >
                  Sale count statistics
                </Title>

                <Radio.Group
                  buttonStyle="solid"
                  style={{ alignSelf: "flex-end", margin: "40px 0" }}
                  optionType="button"
                  options={[
                    {
                      value: dayjs().year(),
                      label: dayjs().year(),
                    },
                    {
                      value: dayjs().year() - 1,
                      label: dayjs().year() - 1,
                    },
                  ]}
                  defaultValue={dayjs().year()}
                />
              </div>
              <ReactECharts option={options1} />
            </Card>
          </Col>
        </Row>

        <Row>
          <Col>
            <Card className="fullCard">
              <Title
                level={3}
                style={{
                  color: "black",
                  marginBottom: 60,
                  padding: 0,
                  textAlign: "center",
                }}
              >
                Newest Available Automobiles
              </Title>

              <div className="ag-theme-material" style={{ height: 300 }}>
                <AgGridReact
                  columnDefs={columnDefs}
                  rowData={firstFiveAvailableRows}
                  defaultColDef={defaultColDef}
                  ref={gridRef}
                  animateRows={true}
                ></AgGridReact>
              </div>
            </Card>
          </Col>
        </Row>
      </div>

      <Footer />
    </>
  );
};

export default Dashboard;
