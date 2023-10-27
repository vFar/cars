import React from "react";
import { Link, useLocation } from "react-router-dom";
import { Layout, Button } from "antd";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faReact } from "@fortawesome/free-brands-svg-icons";
import {
  faCar,
  faCartShopping,
  faHouse,
} from "@fortawesome/free-solid-svg-icons";

const { Header } = Layout;

function Dashboard() {
  const location = useLocation();
  const { pathname } = location;
  const splitLocation = pathname.split("/");

  return (
    <>
      <Layout style={{backgroundColor: '#fafafa'}}>
        <Header className="dashboardHeader">
          <Link to="/" className="Link-logo">
            <FontAwesomeIcon className="dashboardBtn App-logo" icon={faReact} />
          </Link>

          <div style={{ display: "flex", gap: "50px" }}>
            <Link to="/">
              <Button
                icon={<FontAwesomeIcon icon={faHouse} />}
                type="primary"
                className={
                  splitLocation[1] === ""
                    ? "dashboardBtn activeLink"
                    : "dashboardBtn"
                }
              >
                Dashboard
              </Button>
            </Link>

            <Link to="/carregistry">
              <Button
                icon={<FontAwesomeIcon icon={faCar} />}
                type="primary"
                className={
                  splitLocation[1] === "carregistry"
                    ? "dashboardBtn activeLink"
                    : "dashboardBtn"
                }
              >
                Car Registry
              </Button>
            </Link>

            <Link to="/salesregistry">
              <Button
                icon={<FontAwesomeIcon icon={faCartShopping} />}
                className={
                  splitLocation[1] === "salesregistry"
                    ? "dashboardBtn activeLink"
                    : "dashboardBtn"
                }
                type="primary"
              >
                Sale Registry
              </Button>
            </Link>
          </div>
        </Header>
      </Layout>
    </>
  );
}

export default Dashboard;
