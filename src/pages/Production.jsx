import React, { useState, useEffect, useMemo } from "react";
import {
  Factory,
  Search,
  Plus,
  Loader2,
  Calendar,
  Eye,
  Edit2,
  Trash2,
  X,
  PlusCircle,
  AlertTriangle,
  RefreshCw,
  Layers,
  ChevronLeft,
  ChevronRight,
  Filter,
} from "lucide-react";
import toast from "react-hot-toast";
import Sidebar from "../components/Sidebar";
import Navbar from "../components/Navbar";

// Service Imports
import {
  getProductionRuns,
  getProductionRunById,
  createProductionRun,
  updateProductionRun,
  deleteProductionRun,
} from "../services/productionService";
import { getProducts } from "../services/productService";

function Production() {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);

  // Core Data States
  const [productionRuns, setProductionRuns] = useState([]);
  const [productsList, setProductsList] = useState([]);
  const [loading, setLoading] = useState(true);

  // Pagination & Filters State
  const [search, setSearch] = useState("");
  const [stockTypeFilter, setStockTypeFilter] = useState("");
  const [productFilter, setProductFilter] = useState("");
  const [fromDate, setFromDate] = useState("");
  const [toDate, setToDate] = useState("");
  const [page, setPage] = useState(1);
  const [limit] = useState(10);
  const [totalPages, setTotalPages] = useState(1);

  // Modal States
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [isDetailOpen, setIsDetailOpen] = useState(false);
  const [isCancelConfirmOpen, setIsCancelConfirmOpen] = useState(false);

  // Active / Selected Items
  const [editingId, setEditingId] = useState(null);
  const [selectedRun, setSelectedRun] = useState(null);
  const [itemToCancel, setItemToCancel] = useState(null);

  // Loading flags
  const [isSaving, setIsSaving] = useState(false);
  const [isCancelling, setIsCancelling] = useState(false);

  // Dynamic Form State
  const initialFormState = {
    productionDate: new Date().toISOString().split("T")[0],
    finishedProduct: "",
    finishedProductName: "",
    color: "",
    stockType: "Local",
    producedQuantity: "",
    notes: "",
    rawMaterials: [
      { product: "", productName: "", stockType: "Local", quantityUsed: "" },
    ],
  };

  const [formData, setFormData] = useState(initialFormState);

  // Load Products for Dropdowns
  const loadProducts = async () => {
    try {
      const res = await getProducts();
      const list = Array.isArray(res) ? res : res?.data || res?.products || [];
      setProductsList(list);
    } catch (err) {
      console.error("Failed to fetch products:", err);
      toast.error("Could not load product dropdown list.");
    }
  };

  // Load Production Runs Grid Data
  const fetchProductionData = async () => {
    try {
      setLoading(true);
      const params = {
        search,
        stockType: stockTypeFilter,
        product: productFilter,
        fromDate,
        toDate,
        page,
        limit,
      };
      const res = await getProductionRuns(params);
      const list = res?.data || (Array.isArray(res) ? res : []);
      setProductionRuns(list);
      if (res?.pagination?.totalPages) {
        setTotalPages(res.pagination.totalPages);
      }
    } catch (err) {
      console.error("Error fetching production runs:", err);
      const msg = err?.response?.data?.message || "Failed to load production runs.";
      toast.error(msg);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadProducts();
  }, []);

  useEffect(() => {
    fetchProductionData();
  }, [search, stockTypeFilter, productFilter, fromDate, toDate, page]);

  // Open Create Form
  const handleOpenCreate = () => {
    setEditingId(null);
    setFormData({
      ...initialFormState,
      finishedProduct: productsList[0]?._id || "",
      finishedProductName: productsList[0]?.productName || "",
      color: productsList[0]?.color || "",
    });
    setIsFormOpen(true);
  };

  // Open Edit Form
  const handleOpenEdit = (run) => {
    setEditingId(run._id);
    setFormData({
      productionDate: run.productionDate
        ? new Date(run.productionDate).toISOString().split("T")[0]
        : new Date().toISOString().split("T")[0],
      finishedProduct: run.finishedProduct?._id || run.finishedProduct || "",
      finishedProductName: run.finishedProductName || run.finishedProduct?.productName || "",
      color: run.color || "",
      stockType: run.stockType || "Local",
      producedQuantity: run.producedQuantity || "",
      notes: run.notes || "",
      rawMaterials: (run.rawMaterials || []).map((rm) => ({
        product: rm.product?._id || rm.product || "",
        productName: rm.productName || rm.product?.productName || "",
        stockType: rm.stockType || "Local",
        quantityUsed: rm.quantityUsed || "",
      })),
    });
    setIsDetailOpen(false);
    setIsFormOpen(true);
  };

  // Open Detail View Modal
  const handleOpenDetail = async (id) => {
    try {
      const res = await getProductionRunById(id);
      setSelectedRun(res?.data || res);
      setIsDetailOpen(true);
    } catch (err) {
      toast.error("Failed to load production run details.");
    }
  };

  // Dynamic Row Actions for Raw Materials
  const handleFinishedProductChange = (productId) => {
    const matched = productsList.find((p) => p._id === productId);
    setFormData((prev) => ({
      ...prev,
      finishedProduct: productId,
      finishedProductName: matched ? matched.productName : "",
      color: matched ? matched.color || "" : prev.color,
    }));
  };

  const handleRawMaterialChange = (index, field, value) => {
    setFormData((prev) => {
      const updatedRM = [...prev.rawMaterials];
      updatedRM[index] = { ...updatedRM[index], [field]: value };

      if (field === "product") {
        const matched = productsList.find((p) => p._id === value);
        updatedRM[index].productName = matched ? matched.productName : "";
      }

      return { ...prev, rawMaterials: updatedRM };
    });
  };

  const addRawMaterialRow = () => {
    const defaultProduct = productsList[0] || {};
    setFormData((prev) => ({
      ...prev,
      rawMaterials: [
        ...prev.rawMaterials,
        {
          product: defaultProduct._id || "",
          productName: defaultProduct.productName || "",
          stockType: "Local",
          quantityUsed: "",
        },
      ],
    }));
  };

  const removeRawMaterialRow = (index) => {
    if (formData.rawMaterials.length <= 1) {
      toast.error("At least one raw material is required.");
      return;
    }
    setFormData((prev) => ({
      ...prev,
      rawMaterials: prev.rawMaterials.filter((_, i) => i !== index),
    }));
  };

  // Form Submit Handler (Create & Update)
  const handleSubmitForm = async (e) => {
    e.preventDefault();

    if (!formData.finishedProduct || !formData.producedQuantity || Number(formData.producedQuantity) <= 0) {
      toast.error("Please enter a valid finished product and quantity.");
      return;
    }

    if (!formData.rawMaterials.length) {
      toast.error("At least one raw material must be added.");
      return;
    }

    for (let i = 0; i < formData.rawMaterials.length; i++) {
      const rm = formData.rawMaterials[i];
      if (!rm.product || !rm.quantityUsed || Number(rm.quantityUsed) <= 0) {
        toast.error(`Please select a product and valid quantity for Raw Material #${i + 1}`);
        return;
      }
    }

    const payload = {
      productionDate: formData.productionDate,
      finishedProduct: formData.finishedProduct,
      finishedProductName: formData.finishedProductName,
      color: formData.color,
      stockType: formData.stockType,
      producedQuantity: Number(formData.producedQuantity),
      rawMaterials: formData.rawMaterials.map((rm) => ({
        product: rm.product,
        productName: rm.productName,
        stockType: rm.stockType,
        quantityUsed: Number(rm.quantityUsed),
      })),
      notes: formData.notes,
    };

    try {
      setIsSaving(true);
      if (editingId) {
        await updateProductionRun(editingId, payload);
        toast.success("Production run updated successfully!");
      } else {
        await createProductionRun(payload);
        toast.success("Production run recorded successfully!");
      }
      setIsFormOpen(false);
      fetchProductionData();
    } catch (err) {
      console.error("Save Error:", err);
      // Display EXACT backend 400 validation error (e.g. stock stock limit)
      const backendMsg = err?.response?.data?.message || "Failed to process production run.";
      toast.error(backendMsg, { duration: 5000 });
    } finally {
      setIsSaving(false);
    }
  };

  // Delete / Cancel Handler
  const confirmCancelProduction = (run) => {
    setItemToCancel(run);
    setIsCancelConfirmOpen(true);
  };

  const handleExecuteCancel = async () => {
    if (!itemToCancel) return;
    try {
      setIsCancelling(true);
      const res = await deleteProductionRun(itemToCancel._id);
      toast.success(
        `Production ${res?.data?.productionNumber || itemToCancel.productionNumber} cancelled & stock restored.`
      );
      setIsCancelConfirmOpen(false);
      setIsDetailOpen(false);
      setItemToCancel(null);
      fetchProductionData();
    } catch (err) {
      const msg = err?.response?.data?.message || "Failed to cancel production run.";
      toast.error(msg);
    } finally {
      setIsCancelling(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-100 flex overflow-x-hidden">
      <Sidebar isOpen={isSidebarOpen} setIsOpen={setIsSidebarOpen} />

      <div
        className={`flex-1 min-w-0 transition-all duration-300 ease-in-out ${
          isSidebarOpen ? "ml-0 lg:ml-72" : "ml-0 lg:ml-20"
        }`}
      >
      <Navbar
  isSidebarOpen={isSidebarOpen}
  setIsSidebarOpen={setIsSidebarOpen}
/>

        <main className="p-4 md:p-6 lg:p-8 space-y-6 max-w-[1600px] mx-auto mt-24">
          {/* Header Bar */}
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <h1 className="text-2xl font-bold text-slate-900 sm:text-3xl">
                Factory Production Module
              </h1>
              <p className="text-sm text-slate-500 mt-1">
                Record daily production runs, track raw material consumption, and auto-update stock records.
              </p>
            </div>

            <button
              onClick={handleOpenCreate}
              className="flex items-center gap-2 rounded-xl bg-[#1E3A8A] px-5 py-2.5 text-sm font-semibold text-white hover:bg-[#17307A] transition-all cursor-pointer active:scale-95 shadow-xs"
            >
              <Plus size={18} /> New Production Run
            </button>
          </div>

          {/* Filter Bar */}
          <div className="rounded-3xl border border-slate-200 bg-white p-5 shadow-xs space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3">
              {/* Search */}
              <div className="relative">
                <Search size={18} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
                <input
                  type="text"
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  placeholder="Production Run #..."
                  className="w-full rounded-xl border border-slate-300 bg-white py-2 pl-10 pr-3 text-sm focus:border-[#1E3A8A] focus:ring-1 focus:ring-[#1E3A8A] focus:outline-hidden"
                />
              </div>

              {/* Product Filter */}
              <div>
                <select
                  value={productFilter}
                  onChange={(e) => setProductFilter(e.target.value)}
                  className="w-full rounded-xl border border-slate-300 bg-white py-2 px-3 text-sm focus:border-[#1E3A8A] focus:outline-hidden cursor-pointer"
                >
                  <option value="">All Finished Products</option>
                  {productsList.map((p) => (
                    <option key={p._id} value={p._id}>
                      {p.productName}
                    </option>
                  ))}
                </select>
              </div>

              {/* Stock Type Filter */}
              <div>
                <select
                  value={stockTypeFilter}
                  onChange={(e) => setStockTypeFilter(e.target.value)}
                  className="w-full rounded-xl border border-slate-300 bg-white py-2 px-3 text-sm focus:border-[#1E3A8A] focus:outline-hidden cursor-pointer"
                >
                  <option value="">All Stock Types</option>
                  <option value="Local">Local</option>
                  <option value="Imported">Imported</option>
                </select>
              </div>

              {/* Date Filters */}
              <div>
                <input
                  type="date"
                  value={fromDate}
                  onChange={(e) => setFromDate(e.target.value)}
                  className="w-full rounded-xl border border-slate-300 bg-white py-2 px-3 text-sm focus:border-[#1E3A8A] focus:outline-hidden"
                />
              </div>

              <div>
                <input
                  type="date"
                  value={toDate}
                  onChange={(e) => setToDate(e.target.value)}
                  className="w-full rounded-xl border border-slate-300 bg-white py-2 px-3 text-sm focus:border-[#1E3A8A] focus:outline-hidden"
                />
              </div>
            </div>
          </div>

          {/* Main Production Table */}
          <div className="w-full bg-white rounded-3xl border border-slate-200 shadow-xs overflow-hidden">
            {loading ? (
              <div className="p-16 flex flex-col items-center justify-center space-y-4 text-slate-500">
                <Loader2 className="animate-spin text-[#1E3A8A]" size={36} />
                <p className="text-sm font-medium">Loading production ledger...</p>
              </div>
            ) : productionRuns.length === 0 ? (
              <div className="p-16 text-center flex flex-col items-center justify-center max-w-md mx-auto">
                <Factory size={48} className="text-slate-300 mb-4" />
                <h3 className="text-lg font-bold text-slate-800">No Production Runs Found</h3>
                <p className="text-sm text-slate-500 mt-1">
                  There are no records matching your current filter parameters.
                </p>
              </div>
            ) : (
              <>
                <div className="overflow-x-auto">
                  <table className="w-full text-left text-sm text-slate-600">
                    <thead className="bg-slate-50 border-b border-slate-200 text-xs uppercase text-slate-500 font-semibold tracking-wider">
                      <tr>
                        <th className="px-6 py-4">Production #</th>
                        <th className="px-6 py-4">Run Date</th>
                        <th className="px-6 py-4">Finished Product</th>
                        <th className="px-6 py-4">Stock Classification</th>
                        <th className="px-6 py-4 text-right">Produced Qty</th>
                        <th className="px-6 py-4 text-center">Raw Materials</th>
                        <th className="px-6 py-4 text-center">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-200 font-medium">
                      {productionRuns.map((run) => (
                        <tr key={run._id} className="hover:bg-slate-50/80 transition-colors">
                          <td className="px-6 py-4 whitespace-nowrap font-bold text-[#1E3A8A]">
                            {run.productionNumber || "N/A"}
                          </td>

                          <td className="px-6 py-4 whitespace-nowrap text-slate-700">
                            {run.productionDate
                              ? new Date(run.productionDate).toLocaleDateString()
                              : "N/A"}
                          </td>

                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="font-bold text-slate-900">
                              {run.finishedProductName || run.finishedProduct?.productName || "Unknown"}
                            </div>
                            {run.color && (
                              <span className="text-xs text-slate-400">Color: {run.color}</span>
                            )}
                          </td>

                          <td className="px-6 py-4 whitespace-nowrap">
                            <span
                              className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-bold ${
                                run.stockType === "Local"
                                  ? "bg-indigo-50 text-indigo-700 border border-indigo-200"
                                  : "bg-teal-50 text-teal-700 border border-teal-200"
                              }`}
                            >
                              {run.stockType}
                            </span>
                          </td>

                          <td className="px-6 py-4 text-right whitespace-nowrap font-bold text-slate-900">
                            {run.producedQuantity}{" "}
                            <span className="text-xs font-normal text-slate-400">
                              {run.finishedProduct?.unit || "Units"}
                            </span>
                          </td>

                          <td className="px-6 py-4 text-center whitespace-nowrap">
                            <span className="inline-flex items-center gap-1 rounded-lg bg-slate-100 px-2.5 py-1 text-xs font-semibold text-slate-700">
                              <Layers size={14} />
                              {run.rawMaterials?.length || 0} Item(s)
                            </span>
                          </td>

                          <td className="px-6 py-4 text-center whitespace-nowrap">
                            <div className="flex items-center justify-center gap-2">
                              <button
                                onClick={() => handleOpenDetail(run._id)}
                                className="p-1.5 rounded-lg text-slate-500 hover:bg-slate-100 hover:text-[#1E3A8A] transition-colors"
                                title="View Details"
                              >
                                <Eye size={18} />
                              </button>
                              <button
                                onClick={() => handleOpenEdit(run)}
                                className="p-1.5 rounded-lg text-slate-500 hover:bg-slate-100 hover:text-amber-600 transition-colors"
                                title="Edit Production"
                              >
                                <Edit2 size={18} />
                              </button>
                              <button
                                onClick={() => confirmCancelProduction(run)}
                                className="p-1.5 rounded-lg text-slate-500 hover:bg-slate-100 hover:text-rose-600 transition-colors"
                                title="Cancel Production"
                              >
                                <Trash2 size={18} />
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>

                {/* Footer Pagination */}
                <div className="flex items-center justify-between border-t border-slate-200 px-6 py-4">
                  <span className="text-sm text-slate-500">
                    Page <span className="font-semibold text-slate-900">{page}</span> of{" "}
                    <span className="font-semibold text-slate-900">{totalPages}</span>
                  </span>
                  <div className="flex items-center gap-2">
                    <button
                      disabled={page <= 1}
                      onClick={() => setPage((p) => p - 1)}
                      className="p-2 rounded-xl border border-slate-300 disabled:opacity-40 hover:bg-slate-50"
                    >
                      <ChevronLeft size={18} />
                    </button>
                    <button
                      disabled={page >= totalPages}
                      onClick={() => setPage((p) => p + 1)}
                      className="p-2 rounded-xl border border-slate-300 disabled:opacity-40 hover:bg-slate-50"
                    >
                      <ChevronRight size={18} />
                    </button>
                  </div>
                </div>
              </>
            )}
          </div>

          {/* CREATE / EDIT FORM MODAL */}
          {isFormOpen && (
            <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/40 backdrop-blur-xs p-4 overflow-y-auto">
              <div className="w-full max-w-4xl rounded-3xl bg-white p-6 shadow-2xl border border-slate-100 my-8">
                <div className="flex items-center justify-between pb-4 border-b border-slate-100">
                  <h3 className="text-lg font-bold text-slate-900">
                    {editingId ? "Edit Production Run" : "Record New Production Run"}
                  </h3>
                  <button
                    onClick={() => setIsFormOpen(false)}
                    className="p-1 rounded-lg text-slate-400 hover:bg-slate-100"
                  >
                    <X size={20} />
                  </button>
                </div>

                <form onSubmit={handleSubmitForm} className="space-y-6 mt-4">
                  {/* SECTION 1: FINISHED PRODUCT DETAILS */}
                  <div className="bg-slate-50/80 p-4 rounded-2xl border border-slate-200 space-y-4">
                    <h4 className="text-xs font-bold uppercase text-slate-500 tracking-wider">
                      Finished Product Output
                    </h4>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <div>
                        <label className="block text-xs font-semibold text-slate-600 mb-1">
                          Production Date *
                        </label>
                        <input
                          type="date"
                          value={formData.productionDate}
                          onChange={(e) =>
                            setFormData({ ...formData, productionDate: e.target.value })
                          }
                          className="w-full rounded-xl border border-slate-300 bg-white p-2.5 text-sm focus:border-[#1E3A8A]"
                          required
                        />
                      </div>

                      <div>
                        <label className="block text-xs font-semibold text-slate-600 mb-1">
                          Finished Product *
                        </label>
                        <select
                          value={formData.finishedProduct}
                          onChange={(e) => handleFinishedProductChange(e.target.value)}
                          className="w-full rounded-xl border border-slate-300 bg-white p-2.5 text-sm focus:border-[#1E3A8A] cursor-pointer"
                          required
                        >
                          <option value="">Select Finished Product</option>
                          {productsList.map((p) => (
                            <option key={p._id} value={p._id}>
                              {p.productName} ({p.productCode || "No Code"})
                            </option>
                          ))}
                        </select>
                      </div>

                      <div>
                        <label className="block text-xs font-semibold text-slate-600 mb-1">
                          Color / Variant
                        </label>
                        <input
                          type="text"
                          value={formData.color}
                          onChange={(e) => setFormData({ ...formData, color: e.target.value })}
                          placeholder="e.g. White, Blue"
                          className="w-full rounded-xl border border-slate-300 bg-white p-2.5 text-sm focus:border-[#1E3A8A]"
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-xs font-semibold text-slate-600 mb-1">
                          Stock Classification *
                        </label>
                        <select
                          value={formData.stockType}
                          onChange={(e) =>
                            setFormData({ ...formData, stockType: e.target.value })
                          }
                          className="w-full rounded-xl border border-slate-300 bg-white p-2.5 text-sm focus:border-[#1E3A8A] cursor-pointer"
                        >
                          <option value="Local">Local</option>
                          <option value="Imported">Imported</option>
                        </select>
                      </div>

                      <div>
                        <label className="block text-xs font-semibold text-slate-600 mb-1">
                          Produced Quantity *
                        </label>
                        <input
                          type="number"
                          step="0.01"
                          min="0.01"
                          placeholder="0.00"
                          value={formData.producedQuantity}
                          onChange={(e) =>
                            setFormData({ ...formData, producedQuantity: e.target.value })
                          }
                          className="w-full rounded-xl border border-slate-300 bg-white p-2.5 text-sm focus:border-[#1E3A8A]"
                          required
                        />
                      </div>
                    </div>
                  </div>

                  {/* SECTION 2: REPEATABLE RAW MATERIALS */}
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <h4 className="text-xs font-bold uppercase text-slate-500 tracking-wider">
                        Raw Materials Consumed
                      </h4>
                      <span className="text-xs text-slate-400">
                        Stock will be reduced automatically
                      </span>
                    </div>

                    {formData.rawMaterials.map((rm, idx) => (
                      <div
                        key={idx}
                        className="flex flex-col md:flex-row items-center gap-3 p-3 rounded-2xl border border-slate-200 bg-white shadow-2xs"
                      >
                        <div className="flex-1 w-full">
                          <label className="block text-[11px] font-medium text-slate-500 mb-1">
                            Raw Material Item #{idx + 1}
                          </label>
                          <select
                            value={rm.product}
                            onChange={(e) =>
                              handleRawMaterialChange(idx, "product", e.target.value)
                            }
                            className="w-full rounded-xl border border-slate-300 bg-white p-2 text-sm focus:border-[#1E3A8A]"
                            required
                          >
                            <option value="">Select Material</option>
                            {productsList.map((p) => (
                              <option key={p._id} value={p._id}>
                                {p.productName} ({p.productCode || "N/A"})
                              </option>
                            ))}
                          </select>
                        </div>

                        <div className="w-full md:w-36">
                          <label className="block text-[11px] font-medium text-slate-500 mb-1">
                            Stock Type
                          </label>
                          <select
                            value={rm.stockType}
                            onChange={(e) =>
                              handleRawMaterialChange(idx, "stockType", e.target.value)
                            }
                            className="w-full rounded-xl border border-slate-300 bg-white p-2 text-sm focus:border-[#1E3A8A]"
                          >
                            <option value="Local">Local</option>
                            <option value="Imported">Imported</option>
                          </select>
                        </div>

                        <div className="w-full md:w-36">
                          <label className="block text-[11px] font-medium text-slate-500 mb-1">
                            Quantity Used
                          </label>
                          <input
                            type="number"
                            step="0.01"
                            min="0.01"
                            placeholder="0.00"
                            value={rm.quantityUsed}
                            onChange={(e) =>
                              handleRawMaterialChange(idx, "quantityUsed", e.target.value)
                            }
                            className="w-full rounded-xl border border-slate-300 bg-white p-2 text-sm focus:border-[#1E3A8A]"
                            required
                          />
                        </div>

                        <div className="pt-4 md:pt-5">
                          <button
                            type="button"
                            onClick={() => removeRawMaterialRow(idx)}
                            className="p-2 text-slate-400 hover:text-rose-600 transition-colors"
                            title="Remove Material"
                          >
                            <Trash2 size={18} />
                          </button>
                        </div>
                      </div>
                    ))}

                    <button
                      type="button"
                      onClick={addRawMaterialRow}
                      className="flex items-center gap-1.5 text-xs font-bold text-[#1E3A8A] hover:underline pt-1 cursor-pointer"
                    >
                      <PlusCircle size={16} /> Add Another Raw Material
                    </button>
                  </div>

                  {/* NOTES */}
                  <div>
                    <label className="block text-xs font-semibold text-slate-600 mb-1">
                      Notes / Remarks
                    </label>
                    <textarea
                      rows={2}
                      placeholder="Optional production notes..."
                      value={formData.notes}
                      onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                      className="w-full rounded-xl border border-slate-300 bg-white p-2.5 text-sm focus:border-[#1E3A8A]"
                    />
                  </div>

                  {/* SUBMIT BUTTONS */}
                  <div className="flex justify-end gap-3 pt-4 border-t border-slate-100">
                    <button
                      type="button"
                      onClick={() => setIsFormOpen(false)}
                      className="rounded-xl px-4 py-2 text-sm font-semibold text-slate-600 hover:bg-slate-100"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      disabled={isSaving}
                      className="flex items-center gap-2 rounded-xl bg-[#1E3A8A] px-5 py-2 text-sm font-semibold text-white hover:bg-[#17307A] disabled:opacity-50 cursor-pointer"
                    >
                      {isSaving && <Loader2 className="animate-spin" size={16} />}
                      {editingId ? "Update Production" : "Save Production Run"}
                    </button>
                  </div>
                </form>
              </div>
            </div>
          )}

          {/* READ-ONLY DETAIL MODAL */}
          {isDetailOpen && selectedRun && (
            <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/40 backdrop-blur-xs p-4">
              <div className="w-full max-w-2xl rounded-3xl bg-white p-6 shadow-2xl border border-slate-100 space-y-5">
                <div className="flex items-center justify-between pb-4 border-b border-slate-100">
                  <div>
                    <h3 className="text-lg font-bold text-slate-900">
                      Run Details: {selectedRun.productionNumber}
                    </h3>
                    <p className="text-xs text-slate-400 mt-0.5">
                      Recorded on{" "}
                      {selectedRun.productionDate
                        ? new Date(selectedRun.productionDate).toLocaleDateString()
                        : "N/A"}
                    </p>
                  </div>
                  <button
                    onClick={() => setIsDetailOpen(false)}
                    className="p-1 rounded-lg text-slate-400 hover:bg-slate-100"
                  >
                    <X size={20} />
                  </button>
                </div>

                <div className="grid grid-cols-2 gap-4 bg-slate-50 p-4 rounded-2xl border border-slate-200 text-sm">
                  <div>
                    <span className="text-xs text-slate-400 block">Finished Product</span>
                    <span className="font-bold text-slate-900">
                      {selectedRun.finishedProductName || selectedRun.finishedProduct?.productName}
                    </span>
                  </div>
                  <div>
                    <span className="text-xs text-slate-400 block">Quantity Produced</span>
                    <span className="font-bold text-slate-900">
                      {selectedRun.producedQuantity} {selectedRun.finishedProduct?.unit}
                    </span>
                  </div>
                  <div>
                    <span className="text-xs text-slate-400 block">Stock Classification</span>
                    <span className="font-bold text-slate-900">{selectedRun.stockType}</span>
                  </div>
                  <div>
                    <span className="text-xs text-slate-400 block">Color</span>
                    <span className="font-bold text-slate-900">{selectedRun.color || "N/A"}</span>
                  </div>
                </div>

                <div>
                  <h4 className="text-xs font-bold uppercase text-slate-500 mb-2">
                    Raw Materials Consumed
                  </h4>
                  <div className="border border-slate-200 rounded-2xl overflow-hidden">
                    <table className="w-full text-left text-xs">
                      <thead className="bg-slate-50 border-b border-slate-200 font-semibold text-slate-500">
                        <tr>
                          <th className="px-4 py-2.5">Material</th>
                          <th className="px-4 py-2.5">Type</th>
                          <th className="px-4 py-2.5 text-right">Qty Consumed</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-100">
                        {selectedRun.rawMaterials?.map((rm, idx) => (
                          <tr key={idx}>
                            <td className="px-4 py-2.5 font-bold text-slate-800">
                              {rm.productName || rm.product?.productName}
                            </td>
                            <td className="px-4 py-2.5">{rm.stockType}</td>
                            <td className="px-4 py-2.5 text-right font-bold text-slate-900">
                              {rm.quantityUsed}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>

                {selectedRun.notes && (
                  <div>
                    <span className="text-xs text-slate-400 block">Notes</span>
                    <p className="text-sm text-slate-600 bg-slate-50 p-3 rounded-xl border border-slate-200 mt-1">
                      {selectedRun.notes}
                    </p>
                  </div>
                )}

                <div className="flex justify-end gap-3 pt-3 border-t border-slate-100">
                  <button
                    onClick={() => confirmCancelProduction(selectedRun)}
                    className="flex items-center gap-1.5 rounded-xl border border-rose-200 bg-rose-50 px-4 py-2 text-xs font-semibold text-rose-700 hover:bg-rose-100"
                  >
                    <Trash2 size={14} /> Cancel Production
                  </button>
                  <button
                    onClick={() => handleOpenEdit(selectedRun)}
                    className="flex items-center gap-1.5 rounded-xl bg-[#1E3A8A] px-4 py-2 text-xs font-semibold text-white hover:bg-[#17307A]"
                  >
                    <Edit2 size={14} /> Edit Run
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* CANCEL CONFIRMATION DIALOG */}
          {isCancelConfirmOpen && (
            <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/40 backdrop-blur-xs p-4">
              <div className="w-full max-w-md rounded-3xl bg-white p-6 shadow-2xl border border-slate-100 space-y-4">
                <div className="flex items-center gap-3 text-amber-600">
                  <div className="p-3 bg-amber-50 rounded-2xl border border-amber-200">
                    <AlertTriangle size={24} />
                  </div>
                  <div>
                    <h3 className="text-base font-bold text-slate-900">Confirm Reversal</h3>
                    <p className="text-xs text-slate-500">
                      Run #{itemToCancel?.productionNumber}
                    </p>
                  </div>
                </div>

                <p className="text-xs text-slate-600 leading-relaxed">
                  This action will <strong>restore raw material stock</strong> and{" "}
                  <strong>remove the finished product stock</strong> created by this run. This cannot
                  be undone from here. Continue?
                </p>

                <div className="flex justify-end gap-3 pt-3 border-t border-slate-100">
                  <button
                    onClick={() => setIsCancelConfirmOpen(false)}
                    className="rounded-xl px-4 py-2 text-xs font-semibold text-slate-600 hover:bg-slate-100"
                  >
                    No, Keep Record
                  </button>
                  <button
                    disabled={isCancelling}
                    onClick={handleExecuteCancel}
                    className="flex items-center gap-2 rounded-xl bg-rose-600 px-4 py-2 text-xs font-semibold text-white hover:bg-rose-700 disabled:opacity-50"
                  >
                    {isCancelling && <Loader2 className="animate-spin" size={14} />}
                    Yes, Reverse & Delete
                  </button>
                </div>
              </div>
            </div>
          )}
        </main>
      </div>
    </div>
  );
}

export default Production;