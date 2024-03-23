import React from "react";
import { Route, Routes } from "react-router-dom";
import App from "../App";
import Orders from "../components/dashboard/orders/Order";
import Admin from "../components/dashboard/Admin";
import ProcurementPage from "../ProcurementPage/ProcurementPage";
import Users from "../components/dashboard/users/Users";

export const Router = () => {
  return (
    <>
      <Routes>
        <Route path="/" element={<App />} />
        <Route path="/admin" element={<Admin />} />
        <Route path="/orders" element={<Orders />} />
        <Route path="/users" element={<Users />} />

        <Route
          path="/procurement3yiukjeg5-47/5408456-856"
          element={<ProcurementPage />}
        />
      </Routes>
    </>
  );
};
