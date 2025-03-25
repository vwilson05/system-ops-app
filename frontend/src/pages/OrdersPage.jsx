import React, { useState } from "react";
import { getOrders, createOrder, getSuppliers, getLocations } from "../api/api";
import { Table, Select, Button, Form, Modal, Tag } from "antd";
import { EyeOutlined } from "@ant-design/icons";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useFilters } from "../context/FilterContext";

const { Option } = Select;

const OrdersPage = () => {
  const { selectedRegion, selectedLocation } = useFilters();
  const [form] = Form.useForm();
  const [modalVisible, setModalVisible] = useState(false);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const queryClient = useQueryClient();

  // ✅ Fetch Orders with filtering: include selectedRegion and selectedLocation in the query key and pass them to getOrders
  const { data: orders = [] } = useQuery({
    queryKey: ["orders", selectedRegion, selectedLocation],
    queryFn: async () => {
      const ordersData = await getOrders(selectedRegion, selectedLocation);
      return Array.isArray(ordersData) ? ordersData : [];
    },
  });

  // ✅ Fetch Suppliers
  const { data: suppliers = [] } = useQuery({
    queryKey: ["suppliers"],
    queryFn: async () => {
      const suppliersData = await getSuppliers();
      return Array.isArray(suppliersData) ? suppliersData : [];
    },
  });

  // ✅ Fetch Locations
  const { data: locations = [] } = useQuery({
    queryKey: ["locations"],
    queryFn: async () => {
      const locationsData = await getLocations();
      return Array.isArray(locationsData) ? locationsData : [];
    },
  });

  // ✅ Create Order Mutation
  const createOrderMutation = useMutation({
    mutationFn: createOrder,
    onSuccess: () => {
      queryClient.invalidateQueries(["orders", selectedRegion, selectedLocation]);
      form.resetFields();
    },
  });

  // ✅ Handle Order Submission
  const handleSubmit = (values) => {
    createOrderMutation.mutate({
      supplier_id: values.supplier_id,
      location_id: values.location_id,
      status: values.status,
    });
  };

  // ✅ Show Order Details in Modal
  const showOrderDetails = (order) => {
    setSelectedOrder(order);
    setModalVisible(true);
  };

  // ✅ Orders Table Columns
  const columns = [
    { title: "Order ID", dataIndex: "order_id", key: "order_id" },
    { title: "Supplier", dataIndex: "supplier_name", key: "supplier_name" },
    { title: "Location", dataIndex: "location_name", key: "location_name" },
    {
      title: "Ordered On",
      dataIndex: "created_at",
      key: "created_at",
      render: (timestamp) =>
        timestamp ? new Date(timestamp).toLocaleString() : "N/A",
    },
    {
      title: "Status",
      dataIndex: "status",
      key: "status",
      render: (text) => (
        <Tag
          color={
            text === "Pending"
              ? "orange"
              : text === "Shipped"
              ? "blue"
              : "green"
          }
        >
          {text}
        </Tag>
      ),
    },
    {
      title: "Actions",
      key: "actions",
      render: (_, record) => (
        <Button icon={<EyeOutlined />} onClick={() => showOrderDetails(record)}>
          View
        </Button>
      ),
    },
  ];

  return (
    <div style={{ padding: "20px", maxWidth: "900px", margin: "0 auto" }}>
      <h2 style={{ fontSize: "28px", fontWeight: "bold", marginBottom: "20px" }}>
        📦 Order Management
      </h2>

      {/* ✅ Order Form */}
      <Form
        form={form}
        layout="inline"
        onFinish={handleSubmit}
        style={{ marginBottom: "20px" }}
      >
        {/* ✅ Supplier Dropdown */}
        <Form.Item
          name="supplier_id"
          rules={[{ required: true, message: "Supplier required" }]}
        >
          <Select placeholder="Select Supplier" style={{ width: 200 }}>
            {suppliers.map((supplier) => (
              <Option key={supplier.supplier_id} value={supplier.supplier_id}>
                {supplier.name}
              </Option>
            ))}
          </Select>
        </Form.Item>

        {/* ✅ Location Dropdown */}
        <Form.Item
          name="location_id"
          rules={[{ required: true, message: "Location required" }]}
        >
          <Select placeholder="Select Location" style={{ width: 200 }}>
            {locations.map((location) => (
              <Option key={location.location_id} value={location.location_id}>
                {location.location_name}
              </Option>
            ))}
          </Select>
        </Form.Item>

        {/* ✅ Status Dropdown */}
        <Form.Item
          name="status"
          rules={[{ required: true, message: "Select Status" }]}
        >
          <Select placeholder="Status" style={{ width: 150 }}>
            <Option value="Pending">Pending</Option>
            <Option value="Shipped">Shipped</Option>
            <Option value="Delivered">Delivered</Option>
          </Select>
        </Form.Item>

        <Form.Item>
          <Button type="primary" htmlType="submit">
            Create Order
          </Button>
        </Form.Item>
      </Form>

      {/* ✅ Orders Table */}
      <Table
        dataSource={orders.map((o) => ({ ...o, key: o.order_id }))}
        columns={columns}
      />

      {/* ✅ Order Details Modal */}
      <Modal
        title="Order Details"
        open={modalVisible}
        onCancel={() => setModalVisible(false)}
        footer={[
          <Button key="close" onClick={() => setModalVisible(false)}>
            Close
          </Button>,
        ]}
      >
        {selectedOrder && (
          <div>
            <p>
              <strong>Order ID:</strong> {selectedOrder.order_id}
            </p>
            <p>
              <strong>Supplier:</strong> {selectedOrder.supplier_name}
            </p>
            <p>
              <strong>Location:</strong> {selectedOrder.location_name}
            </p>
            <p>
              <strong>Status:</strong>{" "}
              <Tag>{selectedOrder.status}</Tag>
            </p>
          </div>
        )}
      </Modal>
    </div>
  );
};

export default OrdersPage;
