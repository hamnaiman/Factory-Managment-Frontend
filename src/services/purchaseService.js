import axios from "axios";
import API from "../services/api";

const API_BASE = "/purchases";

// ======================================================
// CLOUDINARY UPLOAD
// ======================================================

export const uploadToCloudinary = async (
  file,
  onProgress
) => {
  if (!file) {
    throw new Error("No file selected");
  }

  const cloudName =
    import.meta.env.VITE_CLOUDINARY_CLOUD_NAME;

  const uploadPreset =
    import.meta.env.VITE_CLOUDINARY_UPLOAD_PRESET;

  if (!cloudName) {
    throw new Error(
      "Cloudinary cloud name is not configured"
    );
  }

  if (!uploadPreset) {
    throw new Error(
      "Cloudinary upload preset is not configured"
    );
  }

  const formData = new FormData();

  formData.append("file", file);
  formData.append(
    "upload_preset",
    uploadPreset
  );

  const uploadUrl =
    `https://api.cloudinary.com/v1_1/${cloudName}/auto/upload`;

  const response = await axios.post(
    uploadUrl,
    formData,
    {
      headers: {
        "Content-Type":
          "multipart/form-data",
      },

      onUploadProgress: (progressEvent) => {
        if (
          onProgress &&
          progressEvent.total
        ) {
          const percent = Math.round(
            (progressEvent.loaded * 100) /
              progressEvent.total
          );

          onProgress(percent);
        }
      },
    }
  );

  return {
    url:
      response.data.secure_url,

    fileName:
      file.name,

    fileType:
      file.type,

    publicId:
      response.data.public_id || "",

    resourceType:
      response.data.resource_type || "",
  };
};

// ======================================================
// PURCHASE API
// ======================================================

export const purchaseService = {
  // Get all purchases
  getPurchases: async (params = {}) => {
    const response =
      await API.get(API_BASE, {
        params,
      });

    return response.data;
  },

  // Get single purchase
  getPurchaseById: async (id) => {
    const response =
      await API.get(
        `${API_BASE}/${id}`
      );

    return response.data;
  },

  // Create purchase
  createPurchase: async (payload) => {
    const response =
      await API.post(
        API_BASE,
        payload
      );

    return response.data;
  },

  // Update purchase
  updatePurchase: async (
    id,
    payload
  ) => {
    const response =
      await API.put(
        `${API_BASE}/${id}`,
        payload
      );

    return response.data;
  },

  // Delete / cancel purchase
  cancelPurchase: async (id) => {
    const response =
      await API.delete(
        `${API_BASE}/${id}`
      );

    return response.data;
  },
};