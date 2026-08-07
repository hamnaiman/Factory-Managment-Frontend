import { useEffect, useState, useRef } from "react";
import { X, Loader2 } from "lucide-react";

const UNITS = ["Kg", "Piece", "Box", "Litre", "Packet", "Meter", "Roll"];
const PRODUCT_TYPES = ["Raw Material", "Finished Product"];
const STOCK_TYPES = ["Local", "Imported"];
const STATUS_OPTIONS = ["active", "inactive"];

function ProductModal({ isOpen, onClose, onSave, initialData, isSaving }) {
  const modalRef = useRef(null);
  const [formData, setFormData] = useState({
    productName: "",
    productCode: "",
    category: "",
    productType: "",
    color: "",
    unit: "",
    stockType: "",
    costPrice: "",
    sellingPrice: "",
    currentStock: "",
    minimumStock: "",
    status: "active",
  });

  const [errors, setErrors] = useState({});

  useEffect(() => {
    if (initialData) {
      setFormData({
        productName: initialData.productName || "",
        productCode: initialData.productCode || "",
        category: initialData.category || "",
        productType: initialData.productType || "",
        color: initialData.color || "",
        unit: initialData.unit || "",
        stockType: initialData.stockType || "",
        costPrice: initialData.costPrice || "",
        sellingPrice: initialData.sellingPrice || "",
        currentStock: initialData.currentStock || "",
        minimumStock: initialData.minimumStock || "",
        status: initialData.status || "active",
      });
    } else {
      setFormData({
        productName: "",
        productCode: "",
        category: "",
        productType: "",
        color: "",
        unit: "",
        stockType: "",
        costPrice: "",
        sellingPrice: "",
        currentStock: "",
        minimumStock: "",
        status: "active",
  });
    }
    setErrors({});
  }, [initialData, isOpen]);

  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === "Escape" && isOpen) onClose();
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const validateForm = () => {
    const tempErrors = {};
    const requiredFields = [
      "productName",
      "productCode",
      "category",
      "productType",
      "color",
      "unit",
      "stockType",
      "costPrice",
      "sellingPrice",
      "currentStock",
      "minimumStock",
    ];

    requiredFields.forEach((field) => {
      if (!formData[field] || formData[field].toString().trim() === "") {
        tempErrors[field] = "This field is required";
      }
    });

    if (formData.costPrice && Number(formData.costPrice) < 0) {
      tempErrors.costPrice = "Cannot be negative";
    }
    if (formData.sellingPrice && Number(formData.sellingPrice) < 0) {
      tempErrors.sellingPrice = "Cannot be negative";
    }
    if (formData.currentStock && Number(formData.currentStock) < 0) {
      tempErrors.currentStock = "Cannot be negative";
    }
    if (formData.minimumStock && Number(formData.minimumStock) < 0) {
      tempErrors.minimumStock = "Cannot be negative";
    }

    setErrors(tempErrors);
    return Object.keys(tempErrors).length === 0;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: "" }));
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!validateForm()) return;
    onSave(formData);
  };

  const handleOutsideClick = (e) => {
    if (modalRef.current && !modalRef.current.contains(e.target)) {
      onClose();
    }
  };

  return (
    <div
      onClick={handleOutsideClick}
      className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/40 backdrop-blur-xs p-4 animate-fade-in"
    >
      <div
        ref={modalRef}
        className="relative max-h-[90vh] w-full max-w-2xl overflow-y-auto rounded-3xl bg-white shadow-xl flex flex-col transform transition-all duration-300 scale-100 p-6 md:p-8"
      >
        <div className="flex items-center justify-between border-b border-slate-100 pb-4 shrink-0">
          <h2 className="text-xl font-bold text-slate-900">
            {initialData ? "Modify Existing Product" : "Register New Product"}
          </h2>
          <button
            onClick={onClose}
            className="rounded-xl p-1.5 text-slate-400 hover:bg-slate-100 hover:text-slate-600 transition-colors cursor-pointer"
          >
            <X size={20} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-5 mt-4 flex-1">
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">Product Name *</label>
              <input
                type="text"
                name="productName"
                value={formData.productName}
                onChange={handleChange}
                placeholder="Enter item name"
                className={`h-11 w-full rounded-xl border px-4 text-sm focus:outline-hidden transition-colors ${errors.productName ? "border-red-500 focus:border-red-500" : "border-slate-300 focus:border-[#1E3A8A]"}`}
              />
              {errors.productName && <p className="text-xs text-red-500 mt-1 font-medium">{errors.productName}</p>}
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">Product Code *</label>
              <input
                type="text"
                name="productCode"
                value={formData.productCode}
                onChange={handleChange}
                placeholder="SKU-XXXXX"
                className={`h-11 w-full rounded-xl border px-4 text-sm focus:outline-hidden transition-colors ${errors.productCode ? "border-red-500 focus:border-red-500" : "border-slate-300 focus:border-[#1E3A8A]"}`}
              />
              {errors.productCode && <p className="text-xs text-red-500 mt-1 font-medium">{errors.productCode}</p>}
            </div>
          </div>

          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">Category *</label>
              <input
                type="text"
                name="category"
                value={formData.category}
                onChange={handleChange}
                placeholder="e.g. Plastics, Metals"
                className={`h-11 w-full rounded-xl border px-4 text-sm focus:outline-hidden transition-colors ${errors.category ? "border-red-500 focus:border-red-500" : "border-slate-300 focus:border-[#1E3A8A]"}`}
              />
              {errors.category && <p className="text-xs text-red-500 mt-1 font-medium">{errors.category}</p>}
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">Product Type *</label>
              <select
                name="productType"
                value={formData.productType}
                onChange={handleChange}
                className={`h-11 w-full rounded-xl border px-4 text-sm focus:outline-hidden bg-white cursor-pointer transition-colors ${errors.productType ? "border-red-500 focus:border-red-500" : "border-slate-300 focus:border-[#1E3A8A]"}`}
              >
                <option value="">Select Product Type</option>
                {PRODUCT_TYPES.map((type) => (
                  <option key={type} value={type}>{type}</option>
                ))}
              </select>
              {errors.productType && <p className="text-xs text-red-500 mt-1 font-medium">{errors.productType}</p>}
            </div>
          </div>

          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">Color / Variant *</label>
              <input
                type="text"
                name="color"
                value={formData.color}
                onChange={handleChange}
                placeholder="e.g. Matte Black, Transparent"
                className={`h-11 w-full rounded-xl border px-4 text-sm focus:outline-hidden transition-colors ${errors.color ? "border-red-500 focus:border-red-500" : "border-slate-300 focus:border-[#1E3A8A]"}`}
              />
              {errors.color && <p className="text-xs text-red-500 mt-1 font-medium">{errors.color}</p>}
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">Unit of Measure *</label>
              <select
                name="unit"
                value={formData.unit}
                onChange={handleChange}
                className={`h-11 w-full rounded-xl border px-4 text-sm focus:outline-hidden bg-white cursor-pointer transition-colors ${errors.unit ? "border-red-500 focus:border-red-500" : "border-slate-300 focus:border-[#1E3A8A]"}`}
              >
                <option value="">Select Metric Unit</option>
                {UNITS.map((u) => (
                  <option key={u} value={u}>{u}</option>
                ))}
              </select>
              {errors.unit && <p className="text-xs text-red-500 mt-1 font-medium">{errors.unit}</p>}
            </div>
          </div>

          <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">Stock Type *</label>
              <select
                name="stockType"
                value={formData.stockType}
                onChange={handleChange}
                className={`h-11 w-full rounded-xl border px-4 text-sm focus:outline-hidden bg-white cursor-pointer transition-colors ${errors.stockType ? "border-red-500 focus:border-red-500" : "border-slate-300 focus:border-[#1E3A8A]"}`}
              >
                <option value="">Select Origin</option>
                {STOCK_TYPES.map((st) => (
                  <option key={st} value={st}>{st}</option>
                ))}
              </select>
              {errors.stockType && <p className="text-xs text-red-500 mt-1 font-medium">{errors.stockType}</p>}
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">Cost Price (PKR) *</label>
              <input
                type="number"
                step="0.01"
                name="costPrice"
                value={formData.costPrice}
                onChange={handleChange}
                placeholder="0.00"
                className={`h-11 w-full rounded-xl border px-4 text-sm focus:outline-hidden transition-colors ${errors.costPrice ? "border-red-500 focus:border-red-500" : "border-slate-300 focus:border-[#1E3A8A]"}`}
              />
              {errors.costPrice && <p className="text-xs text-red-500 mt-1 font-medium">{errors.costPrice}</p>}
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">Selling Price (PKR) *</label>
              <input
                type="number"
                step="0.01"
                name="sellingPrice"
                value={formData.sellingPrice}
                onChange={handleChange}
                placeholder="0.00"
                className={`h-11 w-full rounded-xl border px-4 text-sm focus:outline-hidden transition-colors ${errors.sellingPrice ? "border-red-500 focus:border-red-500" : "border-slate-300 focus:border-[#1E3A8A]"}`}
              />
              {errors.sellingPrice && <p className="text-xs text-red-500 mt-1 font-medium">{errors.sellingPrice}</p>}
            </div>
          </div>

          <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">Current Stock *</label>
              <input
                type="number"
                name="currentStock"
                value={formData.currentStock}
                onChange={handleChange}
                placeholder="Available qty"
                className={`h-11 w-full rounded-xl border px-4 text-sm focus:outline-hidden transition-colors ${errors.currentStock ? "border-red-500 focus:border-red-500" : "border-slate-300 focus:border-[#1E3A8A]"}`}
              />
              {errors.currentStock && <p className="text-xs text-red-500 mt-1 font-medium">{errors.currentStock}</p>}
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">Minimum Stock *</label>
              <input
                type="number"
                name="minimumStock"
                value={formData.minimumStock}
                onChange={handleChange}
                placeholder="Alert safety limit"
                className={`h-11 w-full rounded-xl border px-4 text-sm focus:outline-hidden transition-colors ${errors.minimumStock ? "border-red-500 focus:border-red-500" : "border-slate-300 focus:border-[#1E3A8A]"}`}
              />
              {errors.minimumStock && <p className="text-xs text-red-500 mt-1 font-medium">{errors.minimumStock}</p>}
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">System Status *</label>
              <select
                name="status"
                value={formData.status}
                onChange={handleChange}
                className="h-11 w-full rounded-xl border border-slate-300 px-4 text-sm focus:border-[#1E3A8A] focus:outline-hidden bg-white cursor-pointer"
              >
                {STATUS_OPTIONS.map((st) => (
                  <option key={st} value={st}>
                    {st === "active" ? "Active" : "Inactive"}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div className="pt-4 flex flex-col-reverse gap-3 sm:flex-row sm:justify-end border-t border-slate-100 shrink-0">
            <button
              type="button"
              onClick={onClose}
              disabled={isSaving}
              className="h-11 w-full sm:w-32 rounded-xl border border-slate-300 text-sm font-semibold text-slate-700 hover:bg-slate-50 transition-colors cursor-pointer disabled:opacity-50"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSaving}
              className="h-11 w-full sm:w-36 flex items-center justify-center gap-2 rounded-xl bg-[#1E3A8A] text-sm font-semibold text-white hover:bg-[#17307A] transition-colors cursor-pointer disabled:bg-slate-400 disabled:cursor-not-allowed"
            >
              {isSaving ? (
                <>
                  <Loader2 className="animate-spin" size={16} />
                  <span>Saving...</span>
                </>
              ) : (
                <span>Save Product</span>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default ProductModal;