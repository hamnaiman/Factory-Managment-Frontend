import { useEffect, useRef, useState } from "react";
import { X, Loader2 } from "lucide-react";

const UNIT = "Kg";

function ProductModal({
  isOpen,
  onClose,
  onSave,
  initialData,
  isSaving,
}) {
  const modalRef = useRef(null);

  const [formData, setFormData] = useState({
    productName: "",
    productCode: "",
    category: "",
    color: "",
    minimumStock: "5",
    status: "active",
  });

  const [errors, setErrors] = useState({});

  useEffect(() => {
    if (initialData) {
      setFormData({
        productName: initialData.productName || "",
        productCode: initialData.productCode || "",
        category: initialData.category || "",
        color: initialData.color || "",
        minimumStock: initialData.minimumStock ?? "5",
        status: initialData.status || "active",
      });
    } else {
      setFormData({
        productName: "",
        productCode: "",
        category: "",
        color: "",
        minimumStock: "5",
        status: "active",
      });
    }

    setErrors({});
  }, [initialData, isOpen]);

  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === "Escape" && isOpen) {
        onClose();
      }
    };

    window.addEventListener("keydown", handleKeyDown);

    return () => {
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const validateForm = () => {
    const newErrors = {};

    if (!formData.productName.trim()) {
      newErrors.productName = "Product name is required";
    }

    if (!formData.productCode.trim()) {
      newErrors.productCode = "Product code is required";
    }

    if (!formData.category.trim()) {
      newErrors.category = "Category is required";
    }

    if (!formData.color.trim()) {
      newErrors.color = "Color is required";
    }

    if (
      formData.minimumStock === "" ||
      Number(formData.minimumStock) < 0
    ) {
      newErrors.minimumStock =
        "Minimum stock cannot be negative";
    }

    setErrors(newErrors);

    return Object.keys(newErrors).length === 0;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));

    if (errors[name]) {
      setErrors((prev) => ({
        ...prev,
        [name]: "",
      }));
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!validateForm()) return;

    onSave({
      ...formData,
      unit: UNIT,
      minimumStock: Number(formData.minimumStock),
    });
  };

  const handleOutsideClick = (e) => {
    if (
      modalRef.current &&
      !modalRef.current.contains(e.target)
    ) {
      onClose();
    }
  };

  const inputClass = (field) =>
    `h-11 w-full rounded-xl border px-4 text-sm
     focus:outline-none transition-colors
     ${
       errors[field]
         ? "border-red-500 focus:border-red-500"
         : "border-slate-300 focus:border-[#1E3A8A]"
     }`;

  return (
    <div
      onClick={handleOutsideClick}
      className="fixed inset-0 z-50 flex items-center justify-center
      bg-slate-900/40 backdrop-blur-sm p-4"
    >
      <div
        ref={modalRef}
        className="relative w-full max-w-2xl max-h-[90vh]
        overflow-y-auto rounded-3xl bg-white shadow-xl p-6 md:p-8"
      >
        {/* Header */}
        <div className="flex items-center justify-between border-b border-slate-100 pb-4">
          <div>
            <h2 className="text-xl font-bold text-slate-900">
              {initialData
                ? "Modify Product"
                : "Register New Product"}
            </h2>

            <p className="text-sm text-slate-500 mt-1">
              Product master information
            </p>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="rounded-xl p-2 text-slate-400
            hover:bg-slate-100 hover:text-slate-600"
          >
            <X size={20} />
          </button>
        </div>

        <form
          onSubmit={handleSubmit}
          className="space-y-5 mt-6"
        >
          {/* Product Name + Code */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                Product Name *
              </label>

              <input
                type="text"
                name="productName"
                value={formData.productName}
                onChange={handleChange}
                placeholder="e.g. Titanium Dioxide"
                className={inputClass("productName")}
              />

              {errors.productName && (
                <p className="text-xs text-red-500 mt-1">
                  {errors.productName}
                </p>
              )}
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                Product Code *
              </label>

              <input
                type="text"
                name="productCode"
                value={formData.productCode}
                onChange={handleChange}
                placeholder="e.g. PROD-001"
                className={inputClass("productCode")}
              />

              {errors.productCode && (
                <p className="text-xs text-red-500 mt-1">
                  {errors.productCode}
                </p>
              )}
            </div>
          </div>

          {/* Category + Color */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                Category *
              </label>

              <input
                type="text"
                name="category"
                value={formData.category}
                onChange={handleChange}
                placeholder="e.g. Chemicals, Colors"
                className={inputClass("category")}
              />

              {errors.category && (
                <p className="text-xs text-red-500 mt-1">
                  {errors.category}
                </p>
              )}
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                Color / Variant *
              </label>

              <input
                type="text"
                name="color"
                value={formData.color}
                onChange={handleChange}
                placeholder="e.g. Red, Blue, White"
                className={inputClass("color")}
              />

              {errors.color && (
                <p className="text-xs text-red-500 mt-1">
                  {errors.color}
                </p>
              )}
            </div>
          </div>

          {/* Unit + Minimum Stock */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                Unit
              </label>

              <div className="h-11 flex items-center rounded-xl border border-slate-300 bg-slate-50 px-4 text-sm font-semibold text-slate-700">
                Kg
              </div>

              <p className="text-xs text-slate-400 mt-1">
                Factory products are measured in kilograms.
              </p>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                Minimum Stock
              </label>

              <input
                type="number"
                min="0"
                name="minimumStock"
                value={formData.minimumStock}
                onChange={handleChange}
                placeholder="5"
                className={inputClass("minimumStock")}
              />

              {errors.minimumStock && (
                <p className="text-xs text-red-500 mt-1">
                  {errors.minimumStock}
                </p>
              )}
            </div>
          </div>

          {/* Status */}
          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
              Status
            </label>

            <select
              name="status"
              value={formData.status}
              onChange={handleChange}
              className="h-11 w-full rounded-xl border border-slate-300
              bg-white px-4 text-sm focus:border-[#1E3A8A]
              focus:outline-none"
            >
              <option value="active">Active</option>
              <option value="inactive">Inactive</option>
            </select>
          </div>

          {/* Info */}
          <div className="rounded-2xl bg-blue-50 border border-blue-100 p-4">
            <p className="text-sm text-blue-800">
              <strong>Pricing & Stock:</strong> Cost price is
              recorded when stock is purchased, while selling
              price is recorded when a sale is created. Current
              stock is automatically maintained through stock
              transactions.
            </p>
          </div>

          {/* Buttons */}
          <div className="pt-4 flex flex-col-reverse gap-3 sm:flex-row sm:justify-end border-t border-slate-100">
            <button
              type="button"
              onClick={onClose}
              disabled={isSaving}
              className="h-11 w-full sm:w-32 rounded-xl
              border border-slate-300 text-sm font-semibold
              text-slate-700 hover:bg-slate-50"
            >
              Cancel
            </button>

            <button
              type="submit"
              disabled={isSaving}
              className="h-11 w-full sm:w-40 flex items-center
              justify-center gap-2 rounded-xl bg-[#1E3A8A]
              text-sm font-semibold text-white
              hover:bg-[#17307A] disabled:bg-slate-400"
            >
              {isSaving ? (
                <>
                  <Loader2
                    className="animate-spin"
                    size={16}
                  />
                  Saving...
                </>
              ) : (
                "Save Product"
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default ProductModal;