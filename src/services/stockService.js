import API from "./api";

// Get product stock
export const getProductStock = async (productId) => {
  const { data } = await API.get(`/stock/products/${productId}`);
  return data?.data || data; // Backend 'data' key object check
};

// Get low stock products
export const getLowStockProducts = async () => {
  const { data } = await API.get("/stock/low-stock");
  return data?.data || data;
};

// ✅ NEW: Get bulk inventory list (Inventory Page)
export const getInventoryList = async (params = {}) => {
  const { data } = await API.get("/stock/inventory", { params });
  return data?.data || data;
};

// Purchase stock
export const purchaseStock = async (payload) => {
  const { data } = await API.post("/stock/purchase", payload);
  return data;
};

// Sell stock
export const sellStock = async (payload) => {
  const { data } = await API.post("/stock/sale", payload);
  return data;
};

// Consume stock
export const consumeStock = async (payload) => {
  const { data } = await API.post("/stock/consume", payload);
  return data;
};

// Production stock
export const produceStock = async (payload) => {
  const { data } = await API.post("/stock/production", payload);
  return data;
};

// Adjust stock
export const adjustStock = async (payload) => {
  const { data } = await API.post("/stock/adjust", payload);
  return data;
};