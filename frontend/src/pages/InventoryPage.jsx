import React, { useEffect, useState } from "react";
import { getInventory } from "../api/api";
import { Table } from "antd";
import { useFilters } from "../context/FilterContext"; // ✅ Correct import

const InventoryPage = () => {
  const { selectedRegion, selectedLocation } = useFilters();
  const [inventory, setInventory] = useState([]);

  useEffect(() => {
    getInventory(selectedRegion, selectedLocation)
      .then((data) => {
        setInventory(Array.isArray(data) ? data : []); // Use data directly
      })
      .catch((error) => console.error("Error fetching inventory:", error));
  }, [selectedRegion, selectedLocation]); // Refetch when region/location changes

  const columns = [
    { title: "Location", dataIndex: "location_name", key: "location_name" },
    { title: "Product", dataIndex: "product_name", key: "product_name" },
    { title: "Quantity", dataIndex: "quantity", key: "quantity" },
  ];

  return (
    <div style={{ padding: "20px", maxWidth: "800px", margin: "0 auto" }}>
      <h2 style={{ fontSize: "24px", fontWeight: "bold", marginBottom: "20px" }}>
        🏪 Inventory Dashboard
      </h2>
      <Table 
        dataSource={inventory}  // Already an array; fallback not needed if inventory is set to []
        columns={columns} 
        rowKey={(record) => `${record.location_id}-${record.product_id}`} 
      />
    </div>
  );
};

export default InventoryPage;
