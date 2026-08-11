import api from "./api";

export const vendorService = {
  // Get list of vendors
  getVendors: async (
    search = "",
    includeInactive = true
  ) => {
    const params = new URLSearchParams();

    if (search) {
      params.append("search", search);
    }

    if (includeInactive) {
      params.append("includeInactive", "true");
    }

    const response = await api.get(
      `/vendors?${params.toString()}`
    );

    return response.data;
  },

  // Get single vendor
  getVendorById: async (id) => {
    const response = await api.get(
      `/vendors/${id}`
    );

    return response.data;
  },

  // Create vendor
  createVendor: async (vendorData) => {
    const response = await api.post(
      "/vendors",
      vendorData
    );

    return response.data;
  },

  // Update vendor
  updateVendor: async (id, vendorData) => {
    const response = await api.put(
      `/vendors/${id}`,
      vendorData
    );

    return response.data;
  },

  // Deactivate vendor
  deactivateVendor: async (id) => {
    const response = await api.delete(
      `/vendors/${id}`
    );

    return response.data;
  },

  // Reactivate vendor
  reactivateVendor: async (id) => {
    const response = await api.put(
      `/vendors/${id}`,
      {
        isActive: true,
      }
    );

    return response.data;
  },

  // Get purchase summary for a specific vendor
  getVendorPurchaseSummary: async (vendorId) => {
    const response = await api.get(
      `/purchases/vendor/${vendorId}/summary`
    );

    return response.data;
  },

  // Get detailed purchase history for a vendor
  getPurchasesByVendor: async (vendorId) => {
    const response = await api.get(
      `/purchases?vendor=${vendorId}&limit=100`
    );

    return response.data;
  },
};