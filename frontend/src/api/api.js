import axios from "axios";

// ✅ Correct API base URL for backend (points to /api)
const API_BASE_URL = "/api";

// Create dedicated axios instances for each endpoint, matching your FastAPI router prefixes

const suppliersApi = axios.create({
  baseURL: `${API_BASE_URL}/suppliers`,
  headers: { "Content-Type": "application/json" },
});

const locationsApi = axios.create({
  baseURL: `${API_BASE_URL}/locations`,
  headers: { "Content-Type": "application/json" },
});

const regionsApi = axios.create({
  baseURL: `${API_BASE_URL}/regions`,
  headers: { "Content-Type": "application/json" },
});

const productsApi = axios.create({
  baseURL: `${API_BASE_URL}/products`,
  headers: { "Content-Type": "application/json" },
});

const inventoryApi = axios.create({
  baseURL: `${API_BASE_URL}/inventory`,
  headers: { "Content-Type": "application/json" },
});

const salesApi = axios.create({
  baseURL: `${API_BASE_URL}/sales`,
  headers: { "Content-Type": "application/json" },
});

const ordersApi = axios.create({
  baseURL: `${API_BASE_URL}/orders`,
  headers: { "Content-Type": "application/json" },
});

// ✅ Helper function to attach filter params safely
const withFilters = (regionId, locationId) => {
  const params = {};
  if (regionId) params.region_id = regionId;
  if (locationId) params.location_id = locationId;
  return { params };
};

// ✅ Generic function to safely fetch data with error handling using a provided axios instance
const safeGet = async (axiosInstance, url, config = {}) => {
  try {
    const response = await axiosInstance.get(url, config);
    console.log(`✅ API Response [${url}]:`, response.data);
    
    // If the response is an array or an object, return it (wrapping a singular object in an array)
    if (Array.isArray(response.data)) return response.data;
    if (typeof response.data === "object" && response.data !== null) return [response.data];

    console.error(`❌ Unexpected response format from ${url}:`, response.data);
    return [];
  } catch (error) {
    console.error(
      `❌ Error fetching ${url}:`,
      error.response ? error.response.data : error.message
    );
    return [];
  }
};

// ✅ API calls for each endpoint using their dedicated axios instances

// Suppliers endpoints (GET)
export const getSuppliers = () => safeGet(suppliersApi, "/");

// Locations endpoints (GET)
export const getLocations = () => safeGet(locationsApi, "/");

// Regions endpoints (GET)
export const getRegions = () => safeGet(regionsApi, "/");

// Products endpoints (GET)
export const getProducts = () => safeGet(productsApi, "/");

// Inventory endpoints (GET) with optional filters
export const getInventory = (regionId = null, locationId = null) =>
  safeGet(inventoryApi, "/", withFilters(regionId, locationId));

// Sales endpoints (GET) with optional filters
export const getSales = (regionId = null, locationId = null) =>
  safeGet(salesApi, "/", withFilters(regionId, locationId));

// Orders endpoints (GET) with optional filters
export const getOrders = (regionId = null, locationId = null) =>
  safeGet(ordersApi, "/", withFilters(regionId, locationId));

// Orders endpoints (POST)
export const createOrder = async (data) => {
  try {
    const response = await ordersApi.post("/", data);
    console.log("✅ Order Created:", response.data);
    return response.data;
  } catch (error) {
    console.error(
      "❌ Error creating order:",
      error.response ? error.response.data : error.message
    );
    return null;
  }
};

// Sales endpoints (POST)
export const createSale = async (data) => {
  try {
    const response = await salesApi.post("/", data);
    console.log("✅ Sale Created:", response.data);
    return response.data;
  } catch (error) {
    console.error(
      "❌ Error creating sale:",
      error.response ? error.response.data : error.message
    );
    return null;
  }
};

// Inventory endpoints (PUT) for updating inventory
export const updateInventory = async (data) => {
  try {
    const response = await inventoryApi.put("/update/", data);
    console.log("✅ Inventory Updated:", response.data);
    return response.data;
  } catch (error) {
    console.error(
      "❌ Error updating inventory:",
      error.response ? error.response.data : error.message
    );
    return null;
  }
};

export default {
  getSuppliers,
  getLocations,
  getRegions,
  getProducts,
  getInventory,
  getSales,
  getOrders,
  createOrder,
  createSale,
  updateInventory,
};
