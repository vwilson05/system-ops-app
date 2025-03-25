import React, { useEffect } from "react";
import { Menu, Select } from "antd";
import { Link } from "react-router-dom";
import { ShopOutlined, DollarOutlined, InboxOutlined, DashboardOutlined, BarChartOutlined } from "@ant-design/icons";
import { useFilters } from "../context/FilterContext"; // ✅ Correct import

const { Option } = Select;

const Navbar = () => {
  const {
    selectedRegion,
    setSelectedRegion,
    selectedLocation,
    setSelectedLocation,
    regions,
    locations,
  } = useFilters();

  // ✅ Ensure regions and locations are always arrays (prevents .map() error)
  const safeRegions = Array.isArray(regions) ? regions : [];
  const safeLocations = Array.isArray(locations) ? locations : [];

  // ✅ Debugging: Check if data is loading
  useEffect(() => {
    console.log("Regions:", safeRegions);
    console.log("Locations:", safeLocations);
    console.log("Selected Region:", selectedRegion);
    console.log("Selected Location:", selectedLocation);
  }, [safeRegions, safeLocations, selectedRegion, selectedLocation]);

  // ✅ Handle region change (resets location)
  const handleRegionChange = (value) => {
    setSelectedRegion(value === "all" ? null : value);
    setSelectedLocation(null); // Reset location when region changes
  };

  // ✅ Handle location change
  const handleLocationChange = (value) => {
    setSelectedLocation(value === "all" ? null : value);
  };

  return (
    <Menu mode="horizontal" theme="dark">
      <Menu.Item key="dashboard" icon={<DashboardOutlined />}>
        <Link to="/">Dashboard</Link>
      </Menu.Item>
      <Menu.Item key="inventory" icon={<ShopOutlined />}>
        <Link to="/inventory">Inventory</Link>
      </Menu.Item>
      <Menu.Item key="sales" icon={<DollarOutlined />}>
        <Link to="/sales">Sales</Link>
      </Menu.Item>
      <Menu.Item key="orders" icon={<InboxOutlined />}>
        <Link to="/orders">Orders</Link>
      </Menu.Item>
      <Menu.Item key="pricing" icon={<BarChartOutlined />}>
        <Link to="/pricing-adjustments">Pricing Adjustments</Link>
      </Menu.Item>
      <Menu.Item key="demand" icon={<BarChartOutlined />}>
        <Link to="/demand-predictions">Demand Predictions</Link>
      </Menu.Item>

      {/* ✅ Region Selector */}
      <Menu.Item key="region">
        <Select
          value={selectedRegion || "all"}
          onChange={handleRegionChange}
          style={{ width: 150 }}
        >
          <Option value="all">🌎 All Regions</Option>
          {safeRegions.map((region) => (
            <Option key={region.region_id} value={region.region_id}>
              {region.name}
            </Option>
          ))}
        </Select>
      </Menu.Item>

      {/* ✅ Location Selector */}
      <Menu.Item key="location">
        <Select
          value={selectedLocation || "all"}
          onChange={handleLocationChange}
          style={{ width: 150 }}
        >
          <Option value="all">📍 All Locations</Option>
          {safeLocations
            .filter((loc) => !selectedRegion || loc.region_id === selectedRegion) // ✅ Filter locations based on selected region
            .map((loc) => (
              <Option key={loc.location_id} value={loc.location_id}>
                {loc.location_name}
              </Option>
            ))}
        </Select>
      </Menu.Item>
    </Menu>
  );
};

export default Navbar;
