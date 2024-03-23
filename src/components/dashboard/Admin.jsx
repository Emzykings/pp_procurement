import React, { useState, useEffect } from "react";
import SideBar from "./SideBar";
import Content from "./Content";
import "../../App.css";
import { Spin } from "antd";

const Admin = () => {
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      await new Promise((resolve) => setTimeout(resolve, 700));
      setIsLoading(false);
    };
    fetchData();
  }, []);
  return (
    <>
      {isLoading ? (
        <Spin />
      ) : (
        <div
          style={{ fontFamily: "Figtree" }}
          className="flex fixed w-[100%] h-[100vh] bg-[#000]"
        >
          <SideBar />
          <Content />
        </div>
      )}
    </>
  );
};

export default Admin;
