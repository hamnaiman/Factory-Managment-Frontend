import API from "./api";

const API_URL = "/sales";

export const getSales = async () => {
  const response = await API.get(API_URL);
  return response.data;
};

export const getSaleById = async (id) => {
  const response = await API.get(`${API_URL}/${id}`);
  return response.data;
};

export const createSale = async (saleData) => {
  // Payload Sanitization: Default invalid Enum aur Missing fields safety
  const formattedData = {
    ...saleData,
    saleStatus: saleData.saleStatus === "Active" || !saleData.saleStatus ? "Completed" : saleData.saleStatus,
    items: saleData.items?.map((item) => ({
      ...item,
      productName: item.productName || item.name || "Product",
      stockType: item.stockType || "Local",
    })),
  };

  const response = await API.post(API_URL, formattedData);
  return response.data;
};

export const updateSale = async (id, saleData) => {
  const formattedData = {
    ...saleData,
    saleStatus: saleData.saleStatus === "Active" || !saleData.saleStatus ? "Completed" : saleData.saleStatus,
    items: saleData.items?.map((item) => ({
      ...item,
      productName: item.productName || item.name || "Product",
      stockType: item.stockType || "Local",
    })),
  };

  const response = await API.put(`${API_URL}/${id}`, formattedData);
  return response.data;
};

export const deleteSale = async (id) => {
  const response = await API.delete(`${API_URL}/${id}`);
  return response.data;
};