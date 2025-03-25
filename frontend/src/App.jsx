import React from "react";
import { Route, Routes } from "react-router-dom"; 
import InventoryPage from "./pages/InventoryPage.jsx";
import SalesPage from "./pages/SalesPage.jsx";
import OrdersPage from "./pages/OrdersPage.jsx";
import PriceAdjustmentsPage from "./pages/PriceAdjustmentsPage.jsx";
import DemandPredictionsPage from "./pages/DemandPredictionsPage.jsx";
import Navbar from "./components/Navbar.jsx";
import DashboardPage from "./pages/DashboardPage";
import { ConfigProvider, theme } from "antd";

const App = () => {
  return (
    <ConfigProvider theme={{ algorithm: theme.darkAlgorithm }}>
      <Navbar />
      <Routes>  
        <Route path="/" element={<DashboardPage />} />
        <Route path="/dashboard" element={<DashboardPage />} />
        <Route path="/inventory" element={<InventoryPage />} />
        <Route path="/sales" element={<SalesPage />} />
        <Route path="/orders" element={<OrdersPage />} />
        <Route path="/pricing-adjustments" element={<PriceAdjustmentsPage />} />
        <Route path="/demand-predictions" element={<DemandPredictionsPage />} />
      </Routes>
    </ConfigProvider>
  );
};

export default App;
