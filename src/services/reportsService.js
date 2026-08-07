import api from "./api"; // Reuses existing configured axios client withCredentials: true

// ==================== SALES REPORTS ====================
export const getSalesSummaryReport = async (params) => {
  const response = await api.get("/reports/sales/summary", { params });
  return response.data;
};

export const getProductWiseSalesReport = async (params) => {
  const response = await api.get("/reports/sales/by-product", { params });
  return response.data;
};

export const getClientWiseSalesReport = async (params) => {
  const response = await api.get("/reports/sales/by-client", { params });
  return response.data;
};

export const getStockTypeSalesReport = async (params) => {
  const response = await api.get("/reports/sales/by-stock-type", { params });
  return response.data;
};

// ==================== STOCK REPORTS ====================
export const getStockReport = async (params) => {
  const response = await api.get("/reports/stock", { params });
  return response.data;
};

export const getLocalStockReport = async (params) => {
  const response = await api.get("/reports/stock/local", { params });
  return response.data;
};

export const getImportedStockReport = async (params) => {
  const response = await api.get("/reports/stock/imported", { params });
  return response.data;
};

export const getStockMovementsReport = async (params) => {
  const response = await api.get("/reports/stock/movements", { params });
  return response.data;
};

export const getLowStockReport = async (params) => {
  const response = await api.get("/reports/stock/low-stock", { params });
  return response.data;
};

// ==================== PRODUCTION REPORTS ====================
export const getDailyProductionReport = async (params) => {
  const response = await api.get("/reports/production/daily", { params });
  return response.data;
};

export const getProductionHistoryReport = async (params) => {
  const response = await api.get("/reports/production/history", { params });
  return response.data;
};

export const getRawMaterialConsumptionReport = async (params) => {
  const response = await api.get("/reports/production/raw-material-consumption", { params });
  return response.data;
};

export const getFinishedGoodsStockReport = async (params) => {
  const response = await api.get("/reports/production/finished-goods", { params });
  return response.data;
};

// ==================== CLIENT REPORTS ====================
export const getClientOutstandingReport = async (params) => {
  const response = await api.get("/reports/clients/outstanding-balance", { params });
  return response.data;
};

export const getClientPaymentReport = async (params) => {
  const response = await api.get("/reports/clients/payments", { params });
  return response.data;
};

export const getClientLedgerReport = async (clientId, params) => {
  const response = await api.get(`/reports/clients/${clientId}/ledger`, { params });
  return response.data;
};

// Helper to fetch dropdown options
export const getClientsList = async () => {
  const response = await api.get("/clients");
  return response.data;
};

// ==================== LABOUR REPORTS ====================
export const getDailyAttendanceReport = async (params) => {
  const response = await api.get("/reports/labour/attendance/daily", { params });
  return response.data;
};

export const getMonthlyAttendanceReport = async (params) => {
  const response = await api.get("/reports/labour/attendance/monthly", { params });
  return response.data;
};

export const getLabourWageReport = async (params) => {
  const response = await api.get("/reports/labour/wages", { params });
  return response.data;
};

export const getLabourPaymentReport = async (params) => {
  const response = await api.get("/reports/labour/payments", { params });
  return response.data;
};

export const getLabourOutstandingReport = async (params) => {
  const response = await api.get("/reports/labour/outstanding-balance", { params });
  return response.data;
};

export const getWorkersList = async () => {
  const response = await api.get("/labours");
  return response.data;
};