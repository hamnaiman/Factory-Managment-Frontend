import API from "./api";

const API_URL = "/sales";

// ============================================================
// GET ALL SALES
// ============================================================
export const getSales = async (params = {}) => {
  const response = await API.get(API_URL, {
    params,
  });

  return response.data;
};

// ============================================================
// GET SALE BY ID
// ============================================================
export const getSaleById = async (id) => {
  const response = await API.get(`${API_URL}/${id}`);

  return response.data;
};

// ============================================================
// CREATE SALE
// ============================================================
export const createSale = async (saleData) => {
  const formattedData = {
    ...saleData,

    // Backend Sale schema:
    // Completed / Cancelled
    saleStatus:
      saleData.saleStatus === "Cancelled"
        ? "Cancelled"
        : "Completed",

    items:
      saleData.items?.map((item) => ({
        ...item,

        product:
          item.product ||
          item.productId ||
          item._id,

        productName:
          item.productName ||
          item.name ||
          "Product",

        color:
          item.color || "",

        quantity:
          Number(item.quantity ?? item.qty ?? 0),

        rate:
          Number(
            item.rate ??
            item.unitPrice ??
            item.price ??
            0
          ),

        amount:
          Number(
            item.amount ??
            (
              Number(item.quantity ?? item.qty ?? 0) *
              Number(
                item.rate ??
                item.unitPrice ??
                item.price ??
                0
              )
            )
          ),
      })) || [],
  };

  const response = await API.post(
    API_URL,
    formattedData
  );

  return response.data;
};

// ============================================================
// UPDATE SALE
// ============================================================
export const updateSale = async (id, saleData) => {
  const formattedData = {
    ...saleData,

    saleStatus:
      saleData.saleStatus === "Cancelled"
        ? "Cancelled"
        : "Completed",

    items:
      saleData.items?.map((item) => ({
        ...item,

        product:
          item.product ||
          item.productId ||
          item._id,

        productName:
          item.productName ||
          item.name ||
          "Product",

        color:
          item.color || "",

        quantity:
          Number(item.quantity ?? item.qty ?? 0),

        rate:
          Number(
            item.rate ??
            item.unitPrice ??
            item.price ??
            0
          ),

        amount:
          Number(
            item.amount ??
            (
              Number(item.quantity ?? item.qty ?? 0) *
              Number(
                item.rate ??
                item.unitPrice ??
                item.price ??
                0
              )
            )
          ),
      })) || [],
  };

  const response = await API.put(
    `${API_URL}/${id}`,
    formattedData
  );

  return response.data;
};

// ============================================================
// CANCEL SALE
// ============================================================
export const deleteSale = async (id) => {
  const response = await API.delete(
    `${API_URL}/${id}`
  );

  return response.data;
};

// ============================================================
// GET SALES TOTAL
// GET /api/sales/total
// ============================================================
export const getSalesTotal = async (params = {}) => {
  const response = await API.get(
    `${API_URL}/total`,
    {
      params,
    }
  );

  return response.data;
};