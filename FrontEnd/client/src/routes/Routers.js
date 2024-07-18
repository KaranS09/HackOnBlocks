import React from "react";

import { Routes, Route, Navigate } from "react-router-dom";

import Home from "../pages/home";
import Login from "../pages/Login";
import Wallet from "../pages/wallet";
import Market from "../pages/Market";
import Contact from "../pages/Contact";
import SellerProfile from "../pages/SellerProfile";
import Create from "../pages/Create";
import EditProfile from "../pages/EditProfile";
import Payment from "../pages/Payment";

const Routers = () => {
  return (
    <Routes>
      <Route path="/" element={<Navigate to="/home" />} />
      <Route path="/home" element={<Home />} />
      <Route path="/market" element={<Market />} />
      <Route path="/login" element={<Login />} />
      <Route path="/wallet" element={<Wallet />} />
      <Route path="/contact" element={<Contact />} />
      <Route path="/seller" element={<SellerProfile />} />
      <Route path="/edit" element={<EditProfile />} />
      <Route path="/create" element={<Create />} />
      <Route path="/payment" element={<Payment />} />
    </Routes>
  );
};

export default Routers;
