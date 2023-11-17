import React from "react";
import { Layout } from "antd";


function Footer() {
  return (
    <>
      <Layout style={{backgroundColor: '#fafafa', bottom: 0}}>
            <div className="footer">
                Vehicle Registry System &copy; 2023
            </div>
      </Layout>
    </>
  );
}

export default Footer;
