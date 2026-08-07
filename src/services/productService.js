import API from "./api";

const API_URL = "/products";

// Get All Products
export const getProducts = async (params = {}) => {
  const response = await API.get(API_URL, { params });
  return response.data;
};

// Get Single Product
export const getProductById = async (id) => {
  const response = await API.get(`${API_URL}/${id}`);
  return response.data;
};

// Search Products
export const searchProducts = async (keyword) => {
  const response = await API.get(`${API_URL}/search`, {
    params: { keyword },
  });
  return response.data;
};

// Low Stock Products
export const getLowStockProducts = async () => {
  const response = await API.get(`${API_URL}/low-stock`);
  return response.data;
};

// ✅ Add Product
export const createProduct = async (productData) => {
  const response = await API.post(API_URL, productData);
  return response.data;
};

// Update Product
export const updateProduct = async (id, productData) => {
  const response = await API.put(`${API_URL}/${id}`, productData);
  return response.data;
};

// Soft Delete Product
export const deactivateProduct = async (id) => {
  const response = await API.delete(`${API_URL}/${id}`);
  return response.data;
};

// Restore Product
export const restoreProduct = async (id) => {
  const response = await API.patch(`${API_URL}/${id}/restore`);
  return response.data;
};