import API from "./api";

// Get all expenses
export const getExpenses = async (params = {}) => {
  const response = await API.get("/expenses", {
    params,
  });

  return response.data;
};

// Get total expenses
export const getExpenseTotal = async (params = {}) => {
  const response = await API.get("/expenses/total", {
    params,
  });

  return response.data;
};

// Get single expense
export const getExpenseById = async (id) => {
  const response = await API.get(`/expenses/${id}`);

  return response.data;
};

// Create expense
export const createExpense = async (data) => {
  const response = await API.post("/expenses", data);

  return response.data;
};

// Update expense
export const updateExpense = async (id, data) => {
  const response = await API.put(`/expenses/${id}`, data);

  return response.data;
};

// Delete expense
export const deleteExpense = async (id) => {
  const response = await API.delete(`/expenses/${id}`);

  return response.data;
};