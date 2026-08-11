import API from "./api";
import { uploadToCloudinary } from "./cloudinaryService";

const API_BASE = "/purchases";

// ======================================================
// CLOUDINARY UPLOAD
// ======================================================

export { uploadToCloudinary };

// ======================================================
// PURCHASE API
// ======================================================

export const purchaseService = {
  // ----------------------------------------------------
  // Get all purchases
  // ----------------------------------------------------

  getPurchases: async (params = {}) => {
    const response = await API.get(
      API_BASE,
      {
        params,
      }
    );

    return response.data;
  },

  // ----------------------------------------------------
  // Get single purchase
  // ----------------------------------------------------

  getPurchaseById: async (id) => {
    if (!id) {
      throw new Error(
        "Purchase ID is required."
      );
    }

    const response = await API.get(
      `${API_BASE}/${id}`
    );

    return response.data;
  },

  // ----------------------------------------------------
  // Create purchase
  // ----------------------------------------------------

  createPurchase: async (payload) => {
    const response = await API.post(
      API_BASE,
      payload
    );

    return response.data;
  },

  // ----------------------------------------------------
  // Update purchase
  // ----------------------------------------------------

  updatePurchase: async (
    id,
    payload
  ) => {
    if (!id) {
      throw new Error(
        "Purchase ID is required."
      );
    }

    const response = await API.put(
      `${API_BASE}/${id}`,
      payload
    );

    return response.data;
  },

  // ----------------------------------------------------
  // Delete / cancel purchase
  // ----------------------------------------------------

  cancelPurchase: async (id) => {
    if (!id) {
      throw new Error(
        "Purchase ID is required."
      );
    }

    const response = await API.delete(
      `${API_BASE}/${id}`
    );

    return response.data;
  },
};