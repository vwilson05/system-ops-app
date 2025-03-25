import React from "react";
import { getSales, createSale, getLocations, getProducts } from "../api/api";
import { Table, Select, Button, Form } from "antd";
import { useFilters } from "../context/FilterContext"; // ✅ Import filtering context
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";

const { Option } = Select;

const SalesPage = () => {
  const [form] = Form.useForm();
  const { selectedRegion, selectedLocation } = useFilters(); // ✅ Get filtering selections
  const queryClient = useQueryClient();

  // ✅ Fetch Sales (using selectedRegion and selectedLocation as query keys)
  const { data: sales = [] } = useQuery({
    queryKey: ["sales", selectedRegion, selectedLocation],
    queryFn: async () => {
      const salesData = await getSales(selectedRegion, selectedLocation);
      return Array.isArray(salesData) ? salesData : [];
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

  // ✅ Fetch Products
  const { data: products = [] } = useQuery({
    queryKey: ["products"],
    queryFn: async () => {
      const productsData = await getProducts();
      return Array.isArray(productsData) ? productsData : [];
    },
  });

  // ✅ Create Sale Mutation
  const createSaleMutation = useMutation({
    mutationFn: createSale,
    onSuccess: () => {
      queryClient.invalidateQueries(["sales"]);
      form.resetFields();
    },
  });

  // ✅ Handle Sale Submission (Convert Name → ID)
  const handleSubmit = (values) => {
    createSaleMutation.mutate({
      location_id: values.location_id,
      product_id: values.product_id,
      quantity: values.quantity,
      total_price: values.total_price,
    });
  };

  // ✅ Table Columns
  const columns = [
    { title: "Location", dataIndex: "location_name", key: "location_name" }, 
    { title: "Product", dataIndex: "product_name", key: "product_name" },
    { title: "Quantity", dataIndex: "quantity", key: "quantity" },
    { title: "Total Price", dataIndex: "total_price", key: "total_price" },
    { 
      title: "Sales Date", 
      dataIndex: "timestamp", 
      key: "timestamp",
      render: (timestamp) => timestamp ? new Date(timestamp).toLocaleString() : "N/A"
    },
  ];

  return (
    <div style={{ padding: "20px", maxWidth: "900px", margin: "0 auto" }}>
      <h2 style={{ fontSize: "24px", fontWeight: "bold", marginBottom: "20px" }}>💰 Sales Tracking</h2>

      {/* ✅ Sales Form */}
      <Form form={form} layout="inline" onFinish={handleSubmit} style={{ marginBottom: "20px" }}>
        {/* ✅ Location Dropdown */}
        <Form.Item name="location_id" rules={[{ required: true, message: "Select a location" }]}>
          <Select placeholder="Select Location" style={{ width: 200 }}>
            {locations.map((location) => (
              <Option key={location.location_id} value={location.location_id}>
                {location.location_name}
              </Option>
            ))}
          </Select>
        </Form.Item>

        {/* ✅ Product Dropdown */}
        <Form.Item name="product_id" rules={[{ required: true, message: "Select a product" }]}>
          <Select placeholder="Select Product" style={{ width: 200 }}>
            {products.map((product) => (
              <Option key={product.product_id} value={product.product_id}>
                {product.product_name}
              </Option>
            ))}
          </Select>
        </Form.Item>

        <Form.Item name="quantity" rules={[{ required: true }]}>
          <Select placeholder="Quantity" style={{ width: 150 }}>
            {[...Array(10)].map((_, i) => (
              <Option key={i + 1} value={i + 1}>
                {i + 1}
              </Option>
            ))}
          </Select>
        </Form.Item>

        <Form.Item name="total_price" rules={[{ required: true }]}>
          <Select placeholder="Total Price" style={{ width: 150 }}>
            {[5, 10, 20, 50, 100, 200].map((price) => (
              <Option key={price} value={price}>
                ${price}
              </Option>
            ))}
          </Select>
        </Form.Item>

        <Form.Item>
          <Button type="primary" htmlType="submit">
            Add Sale
          </Button>
        </Form.Item>
      </Form>

      {/* ✅ Sales Table */}
      <Table 
        dataSource={sales.map((sale) => ({
          ...sale,
          key: sale.sale_id,
        }))}  
        columns={columns} 
        rowKey="sale_id"
      />
    </div>
  );
};

export default SalesPage;
