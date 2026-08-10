import { useEffect, useState } from "react";
import { X, Upload, Loader2, ExternalLink } from "lucide-react";
import toast from "react-hot-toast";
import axios from "axios";

const CATEGORIES = [
  "Electricity",
  "Labour",
  "Rent",
  "Transport",
  "Maintenance",
  "Purchase",
  "Other",
];

const defaultForm = {
  title: "",
  category: "Other",
  amount: "",
  date: new Date().toISOString().split("T")[0],
  notes: "",
  billImage: "",
};

function ExpenseModal({
  isOpen,
  onClose,
  onSave,
  initialData,
  isSaving,
}) {
  const [form, setForm] = useState(defaultForm);
  const [uploadingImage, setUploadingImage] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);

  useEffect(() => {
    if (initialData) {
      setForm({
        title: initialData.title || "",
        category: initialData.category || "Other",
        amount: initialData.amount ?? "",
        date: initialData.date
          ? new Date(initialData.date).toISOString().split("T")[0]
          : new Date().toISOString().split("T")[0],
        notes: initialData.notes || "",
        billImage: initialData.billImage || "",
      });
    } else {
      setForm({
        ...defaultForm,
        date: new Date().toISOString().split("T")[0],
      });
    }

    setUploadingImage(false);
    setUploadProgress(0);
  }, [initialData, isOpen]);

  if (!isOpen) return null;

  const handleChange = (e) => {
    const { name, value } = e.target;

    setForm((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleImageChange = async (e) => {
    const file = e.target.files?.[0];

    // Reset file input value so same file can be selected again
    e.target.value = "";

    if (!file) return;

    // Validate file type
    const allowedTypes = [
      "image/jpeg",
      "image/png",
      "image/webp",
    ];

    if (!allowedTypes.includes(file.type)) {
      toast.error("Please upload a JPG, PNG, or WEBP image.");
      return;
    }

    // 10 MB maximum
    const maxSize = 10 * 1024 * 1024;

    if (file.size > maxSize) {
      toast.error("Image size must be less than 10 MB.");
      return;
    }

    const cloudName = import.meta.env.VITE_CLOUDINARY_CLOUD_NAME;
    const uploadPreset = import.meta.env.VITE_CLOUDINARY_UPLOAD_PRESET;

    if (!cloudName || !uploadPreset) {
      console.error("Cloudinary environment variables are missing:", {
        cloudName: !!cloudName,
        uploadPreset: !!uploadPreset,
      });

      toast.error("Cloudinary configuration is missing.");
      return;
    }

    const formData = new FormData();

    formData.append("file", file);
    formData.append("upload_preset", uploadPreset);

    // Optional folder organization
    formData.append("folder", "factory_uploads/expenses");

    setUploadingImage(true);
    setUploadProgress(0);

    try {
      const uploadUrl = `https://api.cloudinary.com/v1_1/${cloudName}/image/upload`;

      const response = await axios.post(uploadUrl, formData, {
        onUploadProgress: (progressEvent) => {
          if (progressEvent.total) {
            const percent = Math.round(
              (progressEvent.loaded * 100) / progressEvent.total
            );

            setUploadProgress(percent);
          }
        },
      });

      const uploadedImageUrl = response.data?.secure_url;

      if (!uploadedImageUrl) {
        throw new Error("Cloudinary did not return an image URL.");
      }

      setForm((prev) => ({
        ...prev,
        billImage: uploadedImageUrl,
      }));

      toast.success("Bill uploaded successfully.");
    } catch (error) {
      console.error("Cloudinary expense bill upload error:", error);

      const cloudinaryMessage =
        error.response?.data?.error?.message ||
        error.message ||
        "Failed to upload bill image.";

      toast.error(cloudinaryMessage);
    } finally {
      setUploadingImage(false);
      setUploadProgress(0);
    }
  };

  const removeBillImage = () => {
    setForm((prev) => ({
      ...prev,
      billImage: "",
    }));

    toast.success("Bill image removed.");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (uploadingImage) {
      toast.error("Please wait until the bill upload finishes.");
      return;
    }

    if (!form.title.trim()) {
      toast.error("Expense name is required.");
      return;
    }

    if (!form.amount || Number(form.amount) < 0) {
      toast.error("Please enter a valid amount.");
      return;
    }

    if (!form.date) {
      toast.error("Expense date is required.");
      return;
    }

    const payload = {
      ...form,
      title: form.title.trim(),
      notes: form.notes.trim(),
      amount: Number(form.amount),
      billImage: form.billImage || "",
    };

    onSave(payload);
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-slate-900/50 p-3 sm:p-5">
      <div className="flex max-h-[95vh] w-full max-w-2xl flex-col overflow-hidden rounded-2xl sm:rounded-3xl bg-white shadow-2xl">
        {/* Header */}
        <div className="flex shrink-0 items-center justify-between border-b border-slate-200 px-4 py-4 sm:px-6 sm:py-5">
          <div className="min-w-0 pr-3">
            <h2 className="text-lg font-bold text-slate-900 sm:text-xl">
              {initialData ? "Edit Expense" : "Add Expense"}
            </h2>

            <p className="mt-1 text-xs text-slate-500 sm:text-sm">
              Record factory expenses and bills.
            </p>
          </div>

          <button
            type="button"
            onClick={onClose}
            disabled={uploadingImage}
            className="shrink-0 rounded-xl p-2 text-slate-400 transition hover:bg-slate-100 hover:text-slate-700 disabled:cursor-not-allowed disabled:opacity-50"
            aria-label="Close"
          >
            <X size={20} />
          </button>
        </div>

        {/* Form */}
        <form
          onSubmit={handleSubmit}
          className="flex-1 overflow-y-auto"
        >
          <div className="space-y-5 p-4 sm:space-y-6 sm:p-6">

            {/* Expense Name */}
            <div>
              <label className="mb-1.5 block text-sm font-semibold text-slate-700">
                Expense Name
              </label>

              <input
                type="text"
                name="title"
                value={form.title}
                onChange={handleChange}
                placeholder="e.g. Electricity Bill"
                required
                disabled={uploadingImage}
                className="w-full rounded-xl border border-slate-300 px-4 py-3 text-sm outline-none transition focus:border-[#1E3A8A] focus:ring-1 focus:ring-[#1E3A8A] disabled:bg-slate-100"
              />
            </div>

            {/* Category + Amount */}
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">

              {/* Category */}
              <div>
                <label className="mb-1.5 block text-sm font-semibold text-slate-700">
                  Category
                </label>

                <select
                  name="category"
                  value={form.category}
                  onChange={handleChange}
                  disabled={uploadingImage}
                  className="w-full cursor-pointer rounded-xl border border-slate-300 bg-white px-4 py-3 text-sm outline-none focus:border-[#1E3A8A] focus:ring-1 focus:ring-[#1E3A8A] disabled:bg-slate-100"
                >
                  {CATEGORIES.map((category) => (
                    <option key={category} value={category}>
                      {category}
                    </option>
                  ))}
                </select>
              </div>

              {/* Amount */}
              <div>
                <label className="mb-1.5 block text-sm font-semibold text-slate-700">
                  Amount
                </label>

                <input
                  type="number"
                  name="amount"
                  value={form.amount}
                  onChange={handleChange}
                  placeholder="0"
                  min="0"
                  step="0.01"
                  required
                  disabled={uploadingImage}
                  className="w-full rounded-xl border border-slate-300 px-4 py-3 text-sm outline-none focus:border-[#1E3A8A] focus:ring-1 focus:ring-[#1E3A8A] disabled:bg-slate-100"
                />
              </div>
            </div>

            {/* Date */}
            <div>
              <label className="mb-1.5 block text-sm font-semibold text-slate-700">
                Date
              </label>

              <input
                type="date"
                name="date"
                value={form.date}
                onChange={handleChange}
                required
                disabled={uploadingImage}
                className="w-full rounded-xl border border-slate-300 px-4 py-3 text-sm outline-none focus:border-[#1E3A8A] focus:ring-1 focus:ring-[#1E3A8A] disabled:bg-slate-100"
              />
            </div>

            {/* Notes */}
            <div>
              <label className="mb-1.5 block text-sm font-semibold text-slate-700">
                Notes
              </label>

              <textarea
                name="notes"
                value={form.notes}
                onChange={handleChange}
                rows={3}
                placeholder="Optional notes..."
                disabled={uploadingImage}
                className="w-full resize-none rounded-xl border border-slate-300 px-4 py-3 text-sm outline-none focus:border-[#1E3A8A] focus:ring-1 focus:ring-[#1E3A8A] disabled:bg-slate-100"
              />
            </div>

            {/* Bill / Receipt */}
            <div>
              <label className="mb-1.5 block text-sm font-semibold text-slate-700">
                Bill / Receipt
              </label>

              {!form.billImage ? (
                <label
                  className={`flex items-center gap-3 rounded-xl border-2 border-dashed border-slate-300 px-4 py-4 transition ${
                    uploadingImage
                      ? "cursor-not-allowed bg-slate-50"
                      : "cursor-pointer hover:border-[#1E3A8A] hover:bg-slate-50"
                  }`}
                >
                  {uploadingImage ? (
                    <Loader2
                      size={20}
                      className="shrink-0 animate-spin text-[#1E3A8A]"
                    />
                  ) : (
                    <Upload
                      size={20}
                      className="shrink-0 text-slate-500"
                    />
                  )}

                  <div className="min-w-0">
                    <p className="text-sm font-semibold text-slate-700">
                      {uploadingImage
                        ? `Uploading bill... ${uploadProgress}%`
                        : "Upload bill image"}
                    </p>

                    <p className="text-xs text-slate-400">
                      JPG, PNG or WEBP • Maximum 10 MB
                    </p>
                  </div>

                  {!uploadingImage && (
                    <input
                      type="file"
                      accept="image/png,image/jpeg,image/webp"
                      onChange={handleImageChange}
                      className="hidden"
                    />
                  )}
                </label>
              ) : (
                <div className="overflow-hidden rounded-xl border border-slate-200 bg-slate-50">

                  {/* Image */}
                  <div className="relative">
                    <img
                      src={form.billImage}
                      alt="Uploaded bill"
                      className="max-h-64 w-full object-contain bg-slate-100 p-2 sm:max-h-72"
                    />
                  </div>

                  {/* Image actions */}
                  <div className="flex flex-col gap-2 border-t border-slate-200 bg-white p-3 sm:flex-row sm:items-center sm:justify-between">

                    <div className="flex min-w-0 items-center gap-2">
                      <span className="text-xs font-medium text-emerald-600">
                        Bill uploaded successfully
                      </span>
                    </div>

                    <div className="flex items-center gap-2">
                      <a
                        href={form.billImage}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-1.5 rounded-lg border border-slate-200 px-3 py-2 text-xs font-semibold text-slate-700 transition hover:bg-slate-50"
                      >
                        <ExternalLink size={13} />
                        View
                      </a>

                      <button
                        type="button"
                        onClick={removeBillImage}
                        disabled={uploadingImage}
                        className="rounded-lg border border-red-200 px-3 py-2 text-xs font-semibold text-red-600 transition hover:bg-red-50 disabled:opacity-50"
                      >
                        Remove
                      </button>
                    </div>
                  </div>
                </div>
              )}

              {/* Upload progress */}
              {uploadingImage && (
                <div className="mt-2">
                  <div className="h-2 w-full overflow-hidden rounded-full bg-slate-100">
                    <div
                      className="h-full rounded-full bg-[#1E3A8A] transition-all duration-200"
                      style={{ width: `${uploadProgress}%` }}
                    />
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Buttons */}
          <div className="sticky bottom-0 flex flex-col-reverse gap-3 border-t border-slate-200 bg-white px-4 py-4 sm:flex-row sm:justify-end sm:px-6">
            <button
              type="button"
              onClick={onClose}
              disabled={isSaving || uploadingImage}
              className="w-full rounded-xl border border-slate-300 px-5 py-3 text-sm font-semibold text-slate-700 transition hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-50 sm:w-auto"
            >
              Cancel
            </button>

            <button
              type="submit"
              disabled={isSaving || uploadingImage}
              className="flex w-full items-center justify-center gap-2 rounded-xl bg-[#1E3A8A] px-6 py-3 text-sm font-semibold text-white transition hover:bg-[#17307A] disabled:cursor-not-allowed disabled:opacity-60 sm:w-auto"
            >
              {(isSaving || uploadingImage) && (
                <Loader2 size={16} className="animate-spin" />
              )}

              {uploadingImage
                ? "Uploading..."
                : isSaving
                ? "Saving..."
                : initialData
                ? "Update Expense"
                : "Add Expense"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default ExpenseModal;