import React from "react";
import './style.css';
import { Link } from 'react-router-dom'
import { BarChartOutlined , ShoppingFilled, CarFilled, InfoCircleFilled } from "@ant-design/icons";
import { Layout, Button } from 'antd';
const { Header } = Layout;

function App() {
  return (
    <>
        <Layout>
        <Header className="dashboardSider">
          <Link to="/">
            <Button
              icon={<InfoCircleFilled />}
              className="dashboardBtn"
              size={"large"}
              type="primary"
            >
              Dashboard
            </Button>
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
                className="dashboardBtn activeLink"
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
