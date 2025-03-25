import React, { useEffect, useState } from "react";
import { getOrders, getSales, getInventory } from "../api/api";
import {
  ResponsiveContainer,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
  BarChart,
  Bar,
  AreaChart,
  Area,
  LineChart,
  Line,
} from "recharts";
import { Card, Typography, Button, Modal, Table } from "antd";
import { useFilters } from "../context/FilterContext";

const { Title } = Typography;

const DashboardPage = () => {
  const [orders, setOrders] = useState([]);
  const [sales, setSales] = useState([]);
  const [inventory, setInventory] = useState([]);
  const [liveOrders, setLiveOrders] = useState([]);
  const [lastDayOrders, setLastDayOrders] = useState([]);
  const [ordersModalVisible, setOrdersModalVisible] = useState(false);
  const { selectedRegion, selectedLocation } = useFilters();

  useEffect(() => {
    // Fetch Orders
    getOrders(selectedRegion, selectedLocation)
      .then((data) => {
        console.log("Fetched Orders Data:", data);
        if (!Array.isArray(data)) {
          console.error("⚠️ Data is not an array!", data);
          return;
        }
        setOrders(data);

        // Orders in the last 72 hours
        const seventyTwoHoursAgo = new Date().getTime() - 72 * 60 * 60 * 1000;
        const recentOrders = data.filter(
          (order) => new Date(order.created_at).getTime() > seventyTwoHoursAgo
        );
        setLastDayOrders(recentOrders);
      })
      .catch((err) => console.error("Error fetching orders:", err));

    // Fetch Sales
    getSales(selectedRegion, selectedLocation)
      .then((data) => {
        setSales(Array.isArray(data) ? data : [data]);
      })
      .catch((err) => console.error("Error fetching sales:", err));

    // Fetch Inventory
    getInventory(selectedRegion, selectedLocation)
      .then((data) => {
        setInventory(Array.isArray(data) ? data : [data]);
      })
      .catch((err) => console.error("Error fetching inventory:", err));

    // Live Orders Data (Mock Stream)
    const interval = setInterval(() => {
      setLiveOrders((prevOrders) => [
        ...prevOrders,
        { timestamp: new Date().toLocaleTimeString(), count: prevOrders.length + 1 },
      ]);
    }, 5000);

    return () => clearInterval(interval);
  }, [selectedRegion, selectedLocation]);

  // Orders by Status Over Time (using created_at for date)
  const orderStatusData = orders.map((order) => ({
    date: order.created_at ? new Date(order.created_at).toLocaleDateString() : "Unknown",
    Pending: order.status === "Pending" ? 1 : 0,
    Shipped: order.status === "Shipped" ? 1 : 0,
    Delivered: order.status === "Delivered" ? 1 : 0,
  }));

  // Sales Revenue & Average Order Value
  const totalRevenue = sales.reduce((acc, sale) => acc + sale.total_price, 0);
  const avgOrderValue = sales.length > 0 ? (totalRevenue / sales.length).toFixed(2) : 0;

  // Additional Metric: Net Operating Income (NOI)
  const fixedOperatingExpense = .3; // For prototype purposes
  const netOperatingIncome = totalRevenue * fixedOperatingExpense;

  // Additional Metric: Month-over-Month Revenue Growth (random for prototype)
  const momRevenueGrowth = ((Math.random() * 20) - 10).toFixed(2);

  // Overstocked Products: items with quantity > 400
  const overstockedProducts = inventory
    .filter((item) => item.quantity > 400)
    .map((item) => ({
      name: `Product ${item.product_id}`,
      quantity: item.quantity,
    }));

  // Low Stock Products: items with quantity < 20
  const lowStockProducts = inventory
    .filter((item) => item.quantity < 20)
    .map((item) => ({
      name: `Product ${item.product_id}`,
      quantity: item.quantity,
    }));

  // Define columns for the modal table displaying orders processed in the last 72 hours
  const ordersModalColumns = [
    { title: "Order ID", dataIndex: "order_id", key: "order_id" },
    { title: "Supplier", dataIndex: "supplier_name", key: "supplier_name" },
    { title: "Location", dataIndex: "location_name", key: "location_name" },
    {
      title: "Ordered On",
      dataIndex: "created_at",
      key: "created_at",
      render: (text) => (text ? new Date(text).toLocaleString() : "N/A"),
    },
    { title: "Status", dataIndex: "status", key: "status" },
  ];

  return (
    <div style={{ padding: "20px", display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))", gap: "20px" }}>

      {/* Total Sales Revenue */}
      <Card title="💰 Total Revenue">
        <h2 style={{ fontSize: "48px", fontWeight: "bold", textAlign: "center" }}>
          ${totalRevenue.toFixed(2)}
        </h2>
        <p>Average Order Value: ${avgOrderValue}</p>
      </Card>

      {/* Net Operating Income (NOI) */}
      <Card title="🏢 Net Operating Income (NOI)">
        <div style={{ textAlign: "center" }}>
          <h2 style={{ fontSize: "48px", fontWeight: "bold", margin: "20px 0" }}>
            ${netOperatingIncome.toFixed(2)}
          </h2>
          <p>(Revenue - Operating Expenses)</p>
        </div>
      </Card>

      {/* Month-over-Month Revenue Growth */}
      <Card title="📈 MoM Revenue Growth">
        <div style={{ textAlign: "center" }}>
          <h2 style={{ fontSize: "48px", fontWeight: "bold", margin: "20px 0" }}>
            {momRevenueGrowth}%
          </h2>
          <p>Revenue change compared to last month</p>
        </div>
      </Card>

      {/* Orders Processed in Last 72 Hours */}
      <Card title="📦 Orders Processed (Last 72 Hours)">
        <div style={{ textAlign: "center" }}>
          <h2 style={{ fontSize: "48px", fontWeight: "bold", margin: "20px 0" }}>
            {lastDayOrders.length}
          </h2>
          <p>Total orders in the last 72 hours</p>
          <Button type="primary" onClick={() => setOrdersModalVisible(true)}>
            View Orders
          </Button>
        </div>
      </Card>

      {/* Overstocked Products */}
      <Card title="⚠️ Overstocked Products">
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={overstockedProducts}>
            <XAxis dataKey="name" />
            <YAxis />
            <Tooltip />
            <Legend />
            <Bar dataKey="quantity" fill="#8884d8" />
          </BarChart>
        </ResponsiveContainer>
      </Card>

      {/* Low Stock Alert */}
      <Card title="🚨 Low Stock Alert">
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={lowStockProducts}>
            <XAxis dataKey="name" />
            <YAxis />
            <Tooltip />
            <Legend />
            <Bar dataKey="quantity" fill="#ff4d4f" />
          </BarChart>
        </ResponsiveContainer>
      </Card>

      {/* Orders by Status Over Time */}
      <Card title="Orders by Status Over Time">
        <ResponsiveContainer width="100%" height={300}>
          <AreaChart data={orderStatusData}>
            <XAxis dataKey="date" />
            <YAxis />
            <Tooltip />
            <Legend />
            <Area type="monotone" dataKey="Pending" stroke="#FFBB28" fill="#FFBB28" />
            <Area type="monotone" dataKey="Shipped" stroke="#0088FE" fill="#0088FE" />
            <Area type="monotone" dataKey="Delivered" stroke="#00C49F" fill="#00C49F" />
          </AreaChart>
        </ResponsiveContainer>
      </Card>

      {/* Live Order Activity */}
      <Card title="Live Order Activity">
        <ResponsiveContainer width="100%" height={300}>
          <LineChart data={liveOrders}>
            <XAxis dataKey="timestamp" />
            <YAxis />
            <Tooltip />
            <Legend />
            <Line type="monotone" dataKey="count" stroke="#FF8042" />
          </LineChart>
        </ResponsiveContainer>
      </Card>

      {/* Orders Modal */}
      <Modal
        title="Orders Processed in Last 72 Hours"
        visible={ordersModalVisible}
        onCancel={() => setOrdersModalVisible(false)}
        footer={[
          <Button key="close" onClick={() => setOrdersModalVisible(false)}>
            Close
          </Button>,
        ]}
        width={800}
      >
        <Table
          dataSource={lastDayOrders.map((order) => ({ ...order, key: order.order_id }))}
          columns={ordersModalColumns}
          pagination={{ pageSize: 5 }}
        />
      </Modal>
    </div>
  );
};

export default DashboardPage;
