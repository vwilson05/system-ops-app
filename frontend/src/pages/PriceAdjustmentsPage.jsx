import React, { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { getInventory, getSales } from "../api/api";
import { Table, Card, Select, Row, Col } from "antd";
import { useFilters } from "../context/FilterContext";

const { Option } = Select;

const PricingAdjustmentsPage = () => {
  const [filterType, setFilterType] = useState("All");
  const { selectedRegion, selectedLocation } = useFilters();

  // Fetch inventory data using the current filters
  const { data: inventory = [] } = useQuery({
    queryKey: ["inventory", selectedRegion, selectedLocation],
    queryFn: async () => {
      const data = await getInventory(selectedRegion, selectedLocation);
      return Array.isArray(data) ? data : [];
    },
  });

  // Fetch sales data using the current filters
  const { data: sales = [] } = useQuery({
    queryKey: ["sales", selectedRegion, selectedLocation],
    queryFn: async () => {
      const data = await getSales(selectedRegion, selectedLocation);
      return Array.isArray(data) ? data : [];
    },
  });

  // Aggregate sales by product_id (summing across all locations)
  const salesByProduct = {};
  sales.forEach((sale) => {
    const productId = sale.product_id;
    const qty = sale.quantity || 0;
    salesByProduct[productId] = (salesByProduct[productId] || 0) + qty;
  });

  // Combine inventory with sales and generate recommendations (including location info)
  const recommendations = inventory.map((item) => {
    const productId = item.product_id;
    const productName = item.product_name;
    const availableStock = item.quantity;
    const location = item.location_name; // include location info
    const salesCount = salesByProduct[productId] || 0;
    let recommendation = "Maintain Price";

    // Simple mock logic:
    if (availableStock > 300 && salesCount < 10) {
      recommendation = "Reduce Price";
    } else if (availableStock < 50 && salesCount > 20) {
      recommendation = "Increase Price";
    }

    return {
      key: `${productId}-${item.location_id}`, // Unique key per product-location
      product_id: productId,
      product_name: productName,
      location, // include location in the row
      inventory: availableStock,
      salesCount,
      recommendation,
    };
  });

  // Filter recommendations based on the selected recommendation filter
  const filteredRecommendations = recommendations.filter((item) => {
    return filterType === "All" ? true : item.recommendation === filterType;
  });

  // Define table columns, including a new Location column
  const columns = [
    { title: "Product ID", dataIndex: "product_id", key: "product_id" },
    { title: "Product Name", dataIndex: "product_name", key: "product_name" },
    { title: "Location", dataIndex: "location", key: "location" },
    { title: "Inventory", dataIndex: "inventory", key: "inventory" },
    { title: "Sales (Recent)", dataIndex: "salesCount", key: "salesCount" },
    { title: "Recommendation", dataIndex: "recommendation", key: "recommendation" },
  ];

  return (
    <div style={{ padding: "20px" }}>
      <Card title="Pricing Adjustments Recommendations">
        {/* Recommendation Filter Dropdown */}
        <Row style={{ marginBottom: "20px" }}>
          <Col span={6}>
            <Select
              value={filterType}
              onChange={setFilterType}
              style={{ width: "100%" }}
            >
              <Option value="All">All Recommendations</Option>
              <Option value="Reduce Price">Reduce Price</Option>
              <Option value="Increase Price">Increase Price</Option>
              <Option value="Maintain Price">Maintain Price</Option>
            </Select>
          </Col>
        </Row>
        <Table
          dataSource={filteredRecommendations}
          columns={columns}
          pagination={{ pageSize: 10 }}
        />
      </Card>
    </div>
  );
};

export default PricingAdjustmentsPage;
