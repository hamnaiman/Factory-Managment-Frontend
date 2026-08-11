import axios from "axios";

/**
 * Upload files directly to Cloudinary.
 *
 * Supported:
 * - JPG
 * - JPEG
 * - PNG
 * - WEBP
 * - PDF
 *
 * Uses Cloudinary AUTO resource type so the same uploader
 * works for both images and documents.
 */
export const uploadToCloudinary = async (file, onProgress) => {
  if (!file) {
    throw new Error("No file selected.");
  }

  // ============================================================
  // CLOUDINARY ENVIRONMENT VARIABLES
  // ============================================================

  const cloudName =
    import.meta.env.VITE_CLOUDINARY_CLOUD_NAME?.trim();

  const uploadPreset =
    import.meta.env.VITE_CLOUDINARY_UPLOAD_PRESET?.trim();

  if (!cloudName) {
    throw new Error(
      "Cloudinary cloud name is missing. Please check VITE_CLOUDINARY_CLOUD_NAME."
    );
  }

  if (!uploadPreset) {
    throw new Error(
      "Cloudinary upload preset is missing. Please check VITE_CLOUDINARY_UPLOAD_PRESET."
    );
  }

  // ============================================================
  // FILE VALIDATION
  // ============================================================

  const allowedTypes = [
    "application/pdf",
    "image/jpeg",
    "image/png",
    "image/webp",
  ];

  if (!allowedTypes.includes(file.type)) {
    throw new Error(
      "Only PDF, JPG, JPEG, PNG, and WEBP files are allowed."
    );
  }

  // Maximum 10 MB
  const maxSize = 10 * 1024 * 1024;

  if (file.size > maxSize) {
    throw new Error(
      "File size must be less than 10 MB."
    );
  }

  // ============================================================
  // FORM DATA
  // ============================================================

  const formData = new FormData();

  formData.append("file", file);
  formData.append("upload_preset", uploadPreset);

  // ============================================================
  // CLOUDINARY AUTO UPLOAD
  //
  // IMPORTANT:
  // Do NOT use /image/upload for PDFs.
  // Do NOT manually switch between /raw/upload and /image/upload.
  // AUTO lets Cloudinary determine the correct resource type.
  // ============================================================

  formData.append(
    "folder",
    "factory_uploads"
  );

  const uploadUrl =
    `https://api.cloudinary.com/v1_1/${cloudName}/auto/upload`;

  try {
    const response = await axios.post(
      uploadUrl,
      formData,
      {
        // Let axios/browser set multipart boundary automatically.
        // Do NOT manually set Content-Type.
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

    const data = response?.data;

    // ============================================================
    // VERIFY CLOUDINARY RESPONSE
    // ============================================================

    if (!data?.secure_url) {
      throw new Error(
        "Cloudinary upload completed but no secure URL was returned."
      );
    }

    return {
      url: data.secure_url,

      secureUrl: data.secure_url,

      fileName:
        data.original_filename ||
        file.name,

      fileType:
        file.type,

      publicId:
        data.public_id || "",

      resourceType:
        data.resource_type || "",

      format:
        data.format || "",

      bytes:
        data.bytes || file.size,
    };
  } catch (error) {
    console.error(
      "Cloudinary Upload Error:",
      error
    );

    console.error(
      "Cloudinary Response:",
      error?.response?.data
    );

    let message =
      "Failed to upload file to Cloudinary.";

    if (
      error?.response?.data?.error?.message
    ) {
      message =
        error.response.data.error.message;
    } else if (error?.message) {
      message = error.message;
    }

    throw new Error(message);
  }
};