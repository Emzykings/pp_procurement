import React, { useState, useEffect } from "react";
import { Table, Spin, Input, Button } from "antd";
import { NavLink } from "react-router-dom";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import axios from "axios";
import { CSVLink } from "react-csv";

const { Search } = Input;

const columns = [
  {
    title: "Procurement Officer",
    dataIndex: "procurement_officer",
  },
  {
    title: "Product",
    dataIndex: "product",
  },
  {
    title: "Quantity",
    dataIndex: "quantity",
  },
  {
    title: "Selling Price",
    dataIndex: "selling_price",
  },
  {
    title: "Cost Price",
    dataIndex: "cost_price",
  },
  {
    title: "Quantity Bought",
    dataIndex: "quantity_bought",
  },
  {
    title: "Profit",
    dataIndex: "profit",
  },
  {
    title: "Created_at",
    dataIndex: "created_at",
  },
];

const Orders = () => {
  const [isLoading, setIsLoading] = useState(true);
  const [orders, setOrders] = useState([]);
  const [searchDate, setSearchDate] = useState("");
  const [filteredOrders, setFilteredOrders] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get(
          "https://spiritual-anglerfish-sodbridge.koyeb.app/api/orders/all/"
        );
        console.log("Response data:", response.data);

        setOrders(response.data.results);
      } catch (error) {
        console.error("Error fetching orders:", error);
      } finally {
        setIsLoading(false);
      }
    };
    fetchData();
  }, []);

  useEffect(() => {
    const filteredData = orders.filter((order) =>
      order.created_at.includes(searchDate)
    );
    setFilteredOrders(filteredData);
  }, [searchDate, orders]);

  return (
    <>
      {isLoading ? (
        <Spin />
      ) : (
        <div>
          <nav className="box bg-[#fff] h-[100px] px-[40px] sticky top-0 z-10">
            <div className="text-[#000] pt-[35px] text-[25px] font-[700]">
              <NavLink to="/admin">
                <h1>
                  <ArrowBackIcon /> All Orders
                </h1>
              </NavLink>
            </div>
          </nav>
          <div className="px-[40px] my-4 flex justify-end gap-3 items-center">
            <div>
              <Search
                placeholder="Search by date (YYYY-MM-DD)"
                allowClear
                enterButton="Search"
                size="large"
                onChange={(event) => setSearchDate(event.target.value)}
              />
            </div>
            <div>
              {filteredOrders.length > 0 && (
                <Button>
                  <CSVLink
                    data={filteredOrders}
                    filename={"filtered_orders.csv"}
                    className="ant-btn ant-btn-primary ant-btn-lg"
                    target="_blank"
                  >
                    Download CSV
                  </CSVLink>
                </Button>
              )}
            </div>
          </div>
          <Table
            columns={columns}
            dataSource={filteredOrders}
            className="px-[40px]"
          />
        </div>
      )}
    </>
  );
};

export default Orders;
