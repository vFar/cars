import React from "react";
import { Link } from 'react-router-dom';

import { BarChartOutlined , ShoppingFilled, CarFilled, InfoCircleFilled } from "@ant-design/icons";
import { Layout, Button } from 'antd';


import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faReact } from "@fortawesome/free-brands-svg-icons";


const { Header } = Layout;


function App() {
  return (
    <>
      <Layout>
        <Header className="dashboardSider">
          <Link to="/">

          <FontAwesomeIcon className="dashboardBtn App-logo" size="2x" icon={faReact}/>

          </Link>

          <div style={{ display: "flex", gap: "50px" }}>
            <Link to="/carregistry">
              <Button
                icon={<CarFilled />}
                type="primary"
                className="dashboardBtn"
              >
                Car Registry
              </Button>
            </Link>

            <Link to="/salesregistry">
              <Button
                icon={<ShoppingFilled />}
                className="dashboardBtn"
                type="primary"
              >
                Sale Registry
              </Button>
            </Link>

            <Link to="/echarts">
              <Button
                icon={<BarChartOutlined />}
                className="dashboardBtn"
                type="primary"
              >
                Diagrams
              </Button>
            </Link>
          </div>
        </Header>
      </Layout>
    </>
  );
}

export default App;
