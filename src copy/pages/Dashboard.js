import React, { useState, useMemo, useRef, useEffect } from "react";
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

  //if statements for localstorage, if these dont exist before page load, there will be error about using them in diagrams
  if (!savedsalesRowData) {
    const initialSalesRowData = [];
    localStorage.setItem("salesRowData", JSON.stringify(initialSalesRowData));
  }

  if (!savedcarRowData) {
    const initialRowData = [];
    localStorage.setItem("rowData", JSON.stringify(initialRowData));
  }

  //Masīvā ievieto pirmos 5 ierakstus par mašīnām, kam statuss ir 'Available' jeb pieejams un tad izgriež ārā pirmos 5 ierakstus
  const firstFiveAvailableRows = savedcarRowData.filter((row) => row.status === "Available").slice(0, 5);

  //DayJS atribūti, kas atrod tekošo gadu
  const curYear = dayjs().year();
  const lasYear = dayjs().year() - 1;

  const [barYear, setBarYear] = useState(null);

  const carssoldMonthly = (year) => {
    if (year === undefined) {
      year = dayjs().year(); //nepieciešams, lai ielasītu datus par tekošo gadu kā noklusējumu
    }

    const counts = Array.from({ length: 12 }, () => 0);
    for (let i = 0; i < savedsalesRowData.length; i++) {
      const element = savedsalesRowData[i];
      if ( //if sazarojums, kas meklē rindas ar 'pārdots' statusiem un VAI rindai ir datums, KAM ir gads (tekošais gads vai tekošā gada-1)
        (element.salestatus === "Sold - Contract received from buyer" || element.salestatus === "Vehicle has been delivered to buyer") &&
        element.date.startsWith(`${year}-`)
      ) {
        const month = parseInt(element.date.slice(5, 7), 10); // Izgriež mēnesi no datuma
        counts[month - 1]++; // Meklē attiecīgo mēnesi diagrammā
      }
    }

    setBarYear(counts);
  };

  useEffect(() => {
    carssoldMonthly(); // UseEffects izsauc funkcija, lai jau ielādējot lapu, tiek rādīti dati par tekošo gadu pēc noklusējuma
  }, []);

  const mostfrequentBrand = () => {
    var newVar = [];

    //For cikls atgriež datus no 'Car Registry'
    for (let i = 0; i < savedcarRowData.length; i++) {
      const element = savedcarRowData[i];
      //No atgrieztiem datiem, paņem tikai mašīnas marku un ieliek to newVar mainīgā
      newVar = [...newVar, element.brand];
    }

    //forEach saskaita dublikātus
    const counts = [];
    newVar.forEach(function (x) {
      counts[x] = (counts[x] || 0) + 1;
    });

    //Dublikāto skaitu masīvu sadala
    var name = Object.keys(counts);
    var value = Object.values(counts);
    var data = [];

    for (let i = 0; i < name.length; i++) {
      data = [...data, { value: value[i], name: name[i] }];
    }

    data = [...data].sort((a, b) => b.value - a.value);
    data = data.slice(0, 5);

    //for ciklā ieliek sadalītos datus vienā masīvā (append) un pēc tam sakārto un izgriež pedējos 5 elementus
    return data;
  };

  const enginetypecount = () => {
    var newVar = [];

    //Cikls, lai pārietu cauri visiem datiem no localstorage par 'Car Registry'
    for (let i = 0; i < savedcarRowData.length; i++) {
      const element = savedcarRowData[i];
      //Ieliek newVar mainīgā visus datus par motora tipu
      newVar = [...newVar, element.engine];
    }

    //ForEach cikls, kas saskaita visus dublikātus
    const counts = [];
    newVar.forEach(function (x) {
      counts[x] = (counts[x] || 0) + 1;
    });

    //Ievieto atsevišķos mainīgos keys un values
    var name = Object.keys(counts);
    var value = Object.values(counts);
    var data = [];

    //For cikls papildina data mainīgo ar informāciju
    for (let i = 0; i < name.length; i++) {
      data = [...data, { value: value[i], name: name[i] }];
    }

    //Atgriež datus
    return data;
  };
  
  //Diagrammas veidošana, lietojot ECharts For React
  //Tekošā gada un pagaišēja gada pārdošanas dati pēc skaita par katru mēnesi (CurrentYear, CurrentYear-1 lietojot DayJS)
  const options1 = {
    grid: { top: 8, right: 8, bottom: 24, left: 36 },
    xAxis: {
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
        //dati tiek ielādēti caur useState, jo tas ļauj lietotājam mainīt datus pa gadiem
        data: barYear,
        type: "bar",
        smooth: true,
        color: "rgb(64,150,255)",
      },
    ],
    tooltip: {
      trigger: "axis",
    },
  };

  //Sektoru diagramma priekš visbiežāk automašīnu markas
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

  //Sektoru diagramma priekš motora tipa skaita
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

  //noklusējamie atribūti *visām* kolonnām, flex 1 atbild, lai visas kolonnas ir proporcionāli vienādas
  const defaultColDef = useMemo(() => {
    return {
      flex: 1,
      suppressMovable: true,
    };
  }, []);

  //AG-Grid kolonna veidošana un savienošanās ar ag-grid API
  const gridRef = useRef();
  const [columnDefs] = useState([
    { field: "numberplate" },
    { field: "brand", headerName: "Brand" },
    { field: "model", headerName: "Model" },
    { field: "year", headerName: "Year" },
    { field: "engine", headerName: "Engine" },
    { field: "bodytype", headerName: "Body type" },
  ]);

  //funkcija, kas pāriet cauri 'Car Registry' datiem un izvelk rindas, kam statuss ir 'Available', domāts, lai
  //uzskaitītu visas pieejamās mašīnas (kuram pārdošanas process nav sācies un mašīna ir pieejama)
  const availableCars = () => {
    var status = 0;
    for (let i = 0; i < savedcarRowData.length; i++) {
      const element = savedcarRowData[i];
      if (element.status === "Available") status++;
    }
    return status;
  };

  //funkcija, kas pāriet cauri 'Car Registry' datiem un izvelk rindas, kam statuss ir 'Sold', domāts, lai
  //uzskaitītu visas pārdotās mašīnas (kuram pārdošanas process ir beidzies un mašīna ir pārdota)
  const soldCars = () => {
    var status = 0;
    for (let i = 0; i < savedcarRowData.length; i++) {
      const element = savedcarRowData[i];
      if (element.status === "Sold") status++;
    }
    return status;
  };

  //funkcija, kas pāriet cauri 'Car Registry' datiem un izvelk rindas, kam statuss ir 'Reserved', domāts, lai
  //uzskaitītu visas rezervētās mašīnas (kuras iet cauri pārdošanas procesam)
  const reservedCars = () => {
    var status = 0;

    //for skaitītāja cikls, kas skaita rezervētās mašīnas pa status++
    for (let i = 0; i < savedcarRowData.length; i++) {
      const element = savedcarRowData[i];
      if (element.status === "Reserved") status++;
    }
    return status;
  };

  const monthlyProfit = () => {
    var formattedProfit = 0;
    const todayDate = dayjs().format("YYYY-MM");
    const salesInCurrentMonth = savedsalesRowData.filter((sale) =>
      sale.date.startsWith(todayDate)
    );
    const totalFullPrice = salesInCurrentMonth.reduce(
      (total, sale) => total + sale.fullprice,
      0
    );

    formattedProfit = formatNumber(totalFullPrice);

    return `€${formattedProfit}`;
  };

  //funkcija, kas konvertē monthlyprofit() datus uz tūkstošiem un miljoniem
  const formatNumber = (number) => {
    if (number < 1000) {
      return number.toFixed(0);
    } else if (number < 1000000) {
      return (number / 1000).toFixed(1) + "K";
    } else {
      return (number / 1000000).toFixed(1) + "M";
    }
  };

  return (
    <>
      <Navbar />
      <div className="page-container">
        <Row className="statusCardRow">
          <Col>
            <Card className="dashboardCards">
              <Row style={{ justifyContent: "space-between" }}>
                <Col>
                  <Title
                    level={5}
                    style={{ fontSize: "13px", padding: 0, margin: 0 }}
                    type="secondary"
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
            <Card className="dashboardCards">
              <Row style={{ justifyContent: "space-between" }}>
                <Col>
                  <Title
                    level={5}
                    style={{ fontSize: "13px", margin: 0, padding: 0 }}
                    type="secondary"
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
            <Card className="dashboardCards">
              <Row style={{ justifyContent: "space-between" }}>
                <Col>
                  <Title
                    level={5}
                    style={{ fontSize: "13px", margin: 0, padding: 0 }}
                    type="secondary"
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
            <Card className="dashboardCards">
              <Row style={{ justifyContent: "space-between" }}>
                <Col>
                  <Title
                    level={5}
                    style={{ fontSize: "13px", margin: 0, padding: 0 }}
                    type="secondary"
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

        <Row className="pieRow">
          <Col>
            <Card className="diagramCards">
              <div className="pieChartTitle" style={{ textAlign: "center" }}>
                <Title level={3}>Engine Type Distribution</Title>
              </div>
              <ReactECharts option={options3} style={{ height: 400 }} />
            </Card>
          </Col>

          <Col>
            <Card className="diagramCards">
              <div className="pieChartTitle" style={{ textAlign: "center" }}>
                <Title level={3}>Top Vehicle Brands</Title>
              </div>
              <ReactECharts option={options2} style={{ height: 400 }} />
            </Card>
          </Col>
        </Row>

        <Row className="saleCountGrid">
          <Col>
            <Card className="fullCard">
              <div style={{ display: "flex", flexDirection: "column" }}>
                <div className="barChartTitle">
                  <Title level={3}>Sale Count Statistics</Title>
                </div>

                <Radio.Group
                  buttonStyle="solid"
                  className="radioYearSwitch"
                  optionType="button"
                  onChange={(e) => carssoldMonthly(e.target.value)}
                  defaultValue={curYear}
                  options={[
                    {
                      value: curYear,
                      label: curYear,
                    },
                    {
                      value: lasYear,
                      label: lasYear,
                    },
                  ]}
                />
              </div>
              <ReactECharts option={options1} />
            </Card>
          </Col>
        </Row>

        <Row>
          <Col>
            <Card className="fullCard">
              <div className="pieChartTitle" style={{ textAlign: "center" }}>
                <Title level={3}>Newest Available Automobiles</Title>
              </div>

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
