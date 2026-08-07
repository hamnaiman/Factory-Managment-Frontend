import { useEffect, useState } from "react";
import {
  Boxes,
  Search,
  Loader2,
  PlusCircle,
  MinusCircle,
  SlidersHorizontal,
  AlertTriangle,
  ArrowUpRight,
  ArrowDownRight,
  RefreshCw,
  X,
  Factory,
  PackageMinus,
  Plus,
  Trash2,
} from "lucide-react";
import toast from "react-hot-toast";
import Sidebar from "../components/Sidebar";
import Navbar from "../components/Navbar";

import {
  getInventoryList,
  purchaseStock,
  sellStock,
  consumeStock,
  produceStock,
  adjustStock,
} from "../services/stockService";

const getQty = (item, type) => {
  if (!item) return 0;

  if (type === "local") {
    return Number(item.localStock ?? 0);
  }

  if (type === "imported") {
    return Number(item.importedStock ?? 0);
  }

  if (type === "total") {
    const directTotal = item.currentStock;
    if (directTotal !== undefined && directTotal !== null && !isNaN(Number(directTotal))) {
      return Number(directTotal);
    }
    return getQty(item, "local") + getQty(item, "imported");
  }

  return 0;
};

const getIsLow = (item) => {
  if (typeof item.isLowStock === "boolean") return item.isLowStock;
  const total = getQty(item, "total");
  const min = Number(item.minimumStock ?? 0);
  return total <= min;
};

const emptyRawMaterialRow = () => ({
  productId: "",
  quantity: "",
  stockType: "Local",
});

// ✅ Sorted, consistent action button config — sab same blue color
const ACTION_BUTTONS = [
  { type: "purchase", label: "Purchase", icon: PlusCircle },
  { type: "sale", label: "Sale", icon: MinusCircle },
  { type: "production", label: "Production", icon: Factory },
  { type: "consume", label: "Consume", icon: PackageMinus },
  { type: "adjust", label: "Adjust", icon: SlidersHorizontal },
];

function Stock() {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [stockTypeFilter, setStockTypeFilter] = useState("all");
  const [activeTab, setActiveTab] = useState("all");

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [actionType, setActionType] = useState("purchase");
  const [isSaving, setIsSaving] = useState(false);

  // Form state for Purchase / Sale / Consume / Adjust (single product actions)
  const [formData, setFormData] = useState({
    product: "",
    stockType: "Local",
    adjustmentType: "Add",
    quantity: "",
    remarks: "",
  });

  // Separate state for Production (raw materials + finished product)
  const [productionData, setProductionData] = useState({
    rawMaterials: [emptyRawMaterialRow()],
    finishedProduct: { productId: "", quantity: "", stockType: "Local" },
    remarks: "",
  });

  const fetchStockData = async () => {
    try {
      setLoading(true);
      const productList = await getInventoryList();
      setProducts(Array.isArray(productList) ? productList : []);
    } catch (error) {
      console.error("Failed to fetch products stock:", error);
      const msg = error.response?.data?.message || "Failed to load inventory stock.";
      toast.error(msg);
      setProducts([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchStockData();
  }, []);

  const totalItems = products.length;
  const totalLocalStock = products.reduce((acc, curr) => acc + getQty(curr, "local"), 0);
  const totalImportedStock = products.reduce((acc, curr) => acc + getQty(curr, "imported"), 0);
  const lowStockCount = products.filter((item) => getIsLow(item)).length;

  const visibleProducts = (products || []).filter((item) => {
    const q = search.toLowerCase();
    const sName = item.productName?.toLowerCase() || "";
    const sCode = item.productCode?.toLowerCase() || "";
    const sCat = item.category?.toLowerCase() || "";

    const matchesSearch = sName.includes(q) || sCode.includes(q) || sCat.includes(q);

    const localQty = getQty(item, "local");
    const importedQty = getQty(item, "imported");

    const matchesStockType =
      stockTypeFilter === "all"
        ? true
        : stockTypeFilter === "local"
        ? localQty > 0
        : importedQty > 0;

    const matchesTab = activeTab === "all" ? true : getIsLow(item);

    return matchesSearch && matchesStockType && matchesTab;
  });

  const openActionModal = (type) => {
    setActionType(type);
    const defaultProductId = products.length > 0 ? products[0].productId : "";

    if (type === "production") {
      setProductionData({
        rawMaterials: [emptyRawMaterialRow()],
        finishedProduct: { productId: defaultProductId, quantity: "", stockType: "Local" },
        remarks: "",
      });
    } else {
      setFormData({
        product: defaultProductId,
        stockType: "Local",
        adjustmentType: "Add",
        quantity: "",
        remarks: "",
      });
    }

    setIsModalOpen(true);
  };

  const addRawMaterialRow = () => {
    setProductionData((prev) => ({
      ...prev,
      rawMaterials: [...prev.rawMaterials, emptyRawMaterialRow()],
    }));
  };

  const removeRawMaterialRow = (index) => {
    setProductionData((prev) => ({
      ...prev,
      rawMaterials: prev.rawMaterials.filter((_, i) => i !== index),
    }));
  };

  const updateRawMaterialRow = (index, field, value) => {
    setProductionData((prev) => ({
      ...prev,
      rawMaterials: prev.rawMaterials.map((row, i) =>
        i === index ? { ...row, [field]: value } : row
      ),
    }));
  };

  const updateFinishedProduct = (field, value) => {
    setProductionData((prev) => ({
      ...prev,
      finishedProduct: { ...prev.finishedProduct, [field]: value },
    }));
  };

  const handleActionSubmit = async (e) => {
    e.preventDefault();

    // ✅ Production has its own validation + submit path
    if (actionType === "production") {
      const validMaterials = productionData.rawMaterials.filter(
        (m) => m.productId && Number(m.quantity) > 0
      );

      if (validMaterials.length === 0) {
        toast.error("Please add at least one valid raw material with quantity.");
        return;
      }

      if (!productionData.finishedProduct.productId || Number(productionData.finishedProduct.quantity) <= 0) {
        toast.error("Please select a finished product and enter a valid quantity.");
        return;
      }

      try {
        setIsSaving(true);
        await produceStock({
          rawMaterials: validMaterials.map((m) => ({
            productId: m.productId,
            quantity: Number(m.quantity),
            stockType: m.stockType,
          })),
          finishedProduct: {
            productId: productionData.finishedProduct.productId,
            quantity: Number(productionData.finishedProduct.quantity),
            stockType: productionData.finishedProduct.stockType,
            remarks: productionData.remarks,
          },
        });

        toast.success("Production entry added!");
        setIsModalOpen(false);
        fetchStockData();
      } catch (error) {
        console.error("Failed production operation:", error);
        const msg = error.response?.data?.message || "Production entry failed. Please try again.";
        toast.error(msg);
      } finally {
        setIsSaving(false);
      }
      return;
    }

    // ✅ Purchase / Sale / Consume / Adjust — single-product path
    if (!formData.product || !formData.quantity || Number(formData.quantity) <= 0) {
      toast.error("Please select a product and enter a valid quantity.");
      return;
    }

    try {
      setIsSaving(true);
      const payload = {
        productId: formData.product,
        stockType: formData.stockType,
        quantity: Number(formData.quantity),
        remarks: formData.remarks,
      };

      if (actionType === "purchase") {
        await purchaseStock(payload);
        toast.success("Stock purchased successfully!");
      } else if (actionType === "sale") {
        await sellStock(payload);
        toast.success("Stock sale recorded!");
      } else if (actionType === "consume") {
        // ✅ Consume uses the Issue movement type by default on the backend
        await consumeStock(payload);
        toast.success("Stock issue/consumption recorded!");
      } else if (actionType === "adjust") {
        // ✅ Adjust requires adjustmentType ("Increase"/"Decrease") — backend enum check
        await adjustStock({
          ...payload,
          adjustmentType:
            formData.adjustmentType === "Add" ? "Increase" : "Decrease",
        });
        toast.success("Stock adjusted successfully!");
      }

      setIsModalOpen(false);
      fetchStockData();
    } catch (error) {
      console.error("Failed stock operation:", error);
      const msg = error.response?.data?.message || "Transaction failed. Please try again.";
      toast.error(msg);
    } finally {
      setIsSaving(false);
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
          {/* Header Title Section */}
          <div>
            <h1 className="text-2xl font-bold text-slate-900 sm:text-3xl">
              Inventory & Stock
            </h1>
            <p className="text-sm text-slate-500 mt-1">
              Monitor real-time Local vs Imported balances and adjust product quantities.
            </p>
          </div>

          {/* ✅ Actions — sab same blue color, heading ke neeche neat row mein */}
          <div className="flex flex-wrap items-center gap-2 sm:gap-3">
            {ACTION_BUTTONS.map(({ type, label, icon: Icon }) => (
              <button
                key={type}
                onClick={() => openActionModal(type)}
                className="flex items-center gap-2 rounded-xl bg-[#1E3A8A] px-4 py-2.5 text-sm font-semibold text-white hover:bg-[#17307A] transition-all cursor-pointer"
              >
                <Icon size={18} />
                {label}
              </button>
            ))}
          </div>

          {/* KPI Summary Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="rounded-3xl border border-slate-200 bg-white p-5 flex items-center justify-between">
              <div>
                <p className="text-xs font-semibold text-slate-400 uppercase">Total Products</p>
                <h3 className="text-2xl font-bold text-slate-900 mt-1">
                  {totalItems} <span className="text-sm font-normal text-slate-500">Items</span>
                </h3>
              </div>
              <div className="h-12 w-12 rounded-2xl bg-blue-50 text-[#1E3A8A] flex items-center justify-center">
                <Boxes size={24} />
              </div>
            </div>

            <div className="rounded-3xl border border-slate-200 bg-white p-5 flex items-center justify-between">
              <div>
                <p className="text-xs font-semibold text-slate-400 uppercase">Local Stock</p>
                <h3 className="text-2xl font-bold text-indigo-700 mt-1">
                  {totalLocalStock.toLocaleString()}
                </h3>
              </div>
              <div className="h-12 w-12 rounded-2xl bg-indigo-50 text-indigo-600 flex items-center justify-center">
                <ArrowUpRight size={24} />
              </div>
            </div>

            <div className="rounded-3xl border border-slate-200 bg-white p-5 flex items-center justify-between">
              <div>
                <p className="text-xs font-semibold text-slate-400 uppercase">Imported Stock</p>
                <h3 className="text-2xl font-bold text-teal-700 mt-1">
                  {totalImportedStock.toLocaleString()}
                </h3>
              </div>
              <div className="h-12 w-12 rounded-2xl bg-teal-50 text-teal-600 flex items-center justify-center">
                <ArrowDownRight size={24} />
              </div>
            </div>

            <div
              onClick={() => setActiveTab(activeTab === "low_stock" ? "all" : "low_stock")}
              className={`rounded-3xl border p-5 flex items-center justify-between cursor-pointer transition-all ${
                lowStockCount > 0 ? "border-amber-200 bg-amber-50/50" : "border-slate-200 bg-white"
              }`}
            >
              <div>
                <p className="text-xs font-semibold text-amber-700 uppercase">Low Stock Alerts</p>
                <h3 className="text-2xl font-bold text-amber-900 mt-1">
                  {lowStockCount} <span className="text-sm font-normal text-amber-700">Items</span>
                </h3>
              </div>
              <div className="h-12 w-12 rounded-2xl bg-amber-100 text-amber-600 flex items-center justify-center">
                <AlertTriangle size={24} />
              </div>
            </div>
          </div>

          {/* Filters & Controls */}
          <div className="rounded-3xl border border-slate-200 bg-white p-5 space-y-4">
            <div className="flex border-b border-slate-200 gap-6 text-sm font-medium">
              <button
                onClick={() => setActiveTab("all")}
                className={`pb-3 relative cursor-pointer ${
                  activeTab === "all" ? "text-[#1E3A8A] font-bold" : "text-slate-500"
                }`}
              >
                All Stock Records
                {activeTab === "all" && <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-[#1E3A8A] rounded-full" />}
              </button>

              <button
                onClick={() => setActiveTab("low_stock")}
                className={`pb-3 relative cursor-pointer flex items-center gap-2 ${
                  activeTab === "low_stock" ? "text-amber-600 font-bold" : "text-slate-500"
                }`}
              >
                Low Stock Warning
                {lowStockCount > 0 && (
                  <span className="bg-amber-100 text-amber-700 text-xs px-2 py-0.5 rounded-full font-bold">
                    {lowStockCount}
                  </span>
                )}
                {activeTab === "low_stock" && <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-amber-600 rounded-full" />}
              </button>
            </div>

            <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
              <div className="relative flex-1 min-w-0">
                <Search size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />
                <input
                  type="text"
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  placeholder="Search by name, code, or category..."
                  className="w-full rounded-xl border border-slate-300 py-2.5 pl-11 pr-4 text-sm focus:border-[#1E3A8A] outline-hidden"
                />
              </div>

              <div className="flex gap-3">
                <select
                  value={stockTypeFilter}
                  onChange={(e) => setStockTypeFilter(e.target.value)}
                  className="rounded-xl border border-slate-300 bg-white px-4 py-2.5 text-sm outline-hidden cursor-pointer"
                >
                  <option value="all">All Stock Types</option>
                  <option value="local">Has Local Stock</option>
                  <option value="imported">Has Imported Stock</option>
                </select>

                <button
                  onClick={fetchStockData}
                  className="p-2.5 rounded-xl border border-slate-300 bg-white text-slate-600 hover:bg-slate-50 cursor-pointer"
                >
                  <RefreshCw size={18} />
                </button>
              </div>
            </div>
          </div>

          {/* Table Section */}
          <div className="w-full bg-white rounded-3xl border border-slate-200 overflow-hidden">
            {loading ? (
              <div className="p-16 flex flex-col items-center justify-center space-y-4 text-slate-500">
                <Loader2 className="animate-spin text-[#1E3A8A]" size={36} />
                <p className="text-sm font-medium">Fetching real-time stock registers...</p>
              </div>
            ) : visibleProducts.length === 0 ? (
              <div className="p-16 text-center flex flex-col items-center justify-center max-w-md mx-auto">
                <Boxes size={48} className="text-slate-300 mb-4" />
                <h3 className="text-lg font-bold text-slate-800">No stock records found</h3>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-left text-sm text-slate-600">
                  <thead className="bg-slate-50 border-b border-slate-200 text-xs uppercase text-slate-500 font-semibold">
                    <tr>
                      <th className="px-6 py-4">Product Details</th>
                      <th className="px-6 py-4">Category</th>
                      <th className="px-6 py-4 text-right">Local Stock</th>
                      <th className="px-6 py-4 text-right">Imported Stock</th>
                      <th className="px-6 py-4 text-right">Total Balance</th>
                      <th className="px-6 py-4 text-center">Status</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-200 font-medium">
                    {visibleProducts.map((item) => {
                      const localQty = getQty(item, "local");
                      const importedQty = getQty(item, "imported");
                      const totalQty = getQty(item, "total");
                      const isLow = getIsLow(item);
                      const unitLabel = item.unit || "Units";

                      return (
                        <tr key={item.productId} className="hover:bg-slate-50/80">
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="font-bold text-slate-900">{item.productName}</div>
                            <div className="text-xs text-slate-400 mt-0.5">{item.productCode || "-"}</div>
                          </td>

                          <td className="px-6 py-4 whitespace-nowrap">
                            <span className="inline-flex items-center rounded-lg bg-slate-100 px-2.5 py-1 text-xs font-semibold text-slate-700">
                              {item.category || "General"}
                            </span>
                          </td>

                          <td className="px-6 py-4 text-right whitespace-nowrap">
                            <span className="font-bold text-indigo-600">{localQty.toLocaleString()}</span>{" "}
                            <span className="text-xs text-slate-400">{unitLabel}</span>
                          </td>

                          <td className="px-6 py-4 text-right whitespace-nowrap">
                            <span className="font-bold text-teal-600">{importedQty.toLocaleString()}</span>{" "}
                            <span className="text-xs text-slate-400">{unitLabel}</span>
                          </td>

                          <td className="px-6 py-4 text-right whitespace-nowrap">
                            <span className={`text-base font-bold ${isLow ? "text-amber-600" : "text-[#1E3A8A]"}`}>
                              {totalQty.toLocaleString()}
                            </span>{" "}
                            <span className="text-xs text-slate-400">{unitLabel}</span>
                          </td>

                          <td className="px-6 py-4 text-center whitespace-nowrap">
                            {isLow ? (
                              <span className="inline-flex items-center gap-1.5 rounded-full bg-amber-50 px-3 py-1 text-xs font-bold text-amber-700 border border-amber-200">
                                <AlertTriangle size={12} /> Low Stock
                              </span>
                            ) : (
                              <span className="inline-flex items-center rounded-full bg-emerald-50 px-3 py-1 text-xs font-bold text-emerald-700 border border-emerald-200">
                                In Stock
                              </span>
                            )}
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            )}
          </div>

          {/* Action Modal */}
          {isModalOpen && (
            <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/40 backdrop-blur-xs p-4">
              <div className={`w-full rounded-3xl bg-white p-6 shadow-2xl border border-slate-100 ${
                actionType === "production" ? "max-w-2xl" : "max-w-lg"
              }`}>
                <div className="flex items-center justify-between pb-4 border-b border-slate-100">
                  <h3 className="text-lg font-bold text-slate-900 capitalize">
                    {actionType} Stock Transaction
                  </h3>
                  <button
                    onClick={() => setIsModalOpen(false)}
                    className="p-1 rounded-lg text-slate-400 hover:bg-slate-100"
                  >
                    <X size={20} />
                  </button>
                </div>

                {/* PRODUCTION FORM — raw materials + finished product */}
                {actionType === "production" ? (
                  <form onSubmit={handleActionSubmit} className="space-y-5 mt-4 max-h-[70vh] overflow-y-auto pr-1">
                    <div>
                      <div className="flex items-center justify-between mb-2">
                        <label className="block text-xs font-semibold uppercase text-slate-500">
                          Raw Materials Consumed *
                        </label>
                        <button
                          type="button"
                          onClick={addRawMaterialRow}
                          className="flex items-center gap-1 text-xs font-semibold text-[#1E3A8A] hover:underline cursor-pointer"
                        >
                          <Plus size={14} /> Add Material
                        </button>
                      </div>

                      <div className="space-y-3">
                        {productionData.rawMaterials.map((row, index) => (
                          <div
                            key={index}
                            className="grid grid-cols-12 gap-2 items-center rounded-xl border border-slate-200 p-3"
                          >
                            <select
                              value={row.productId}
                              onChange={(e) => updateRawMaterialRow(index, "productId", e.target.value)}
                              className="col-span-5 rounded-lg border border-slate-300 bg-white p-2 text-sm outline-hidden"
                            >
                              <option value="">Select material...</option>
                              {products.map((p) => (
                                <option key={p.productId} value={p.productId}>
                                  {p.productName} ({p.productCode || "N/A"})
                                </option>
                              ))}
                            </select>

                            <select
                              value={row.stockType}
                              onChange={(e) => updateRawMaterialRow(index, "stockType", e.target.value)}
                              className="col-span-3 rounded-lg border border-slate-300 bg-white p-2 text-sm outline-hidden"
                            >
                              <option value="Local">Local</option>
                              <option value="Imported">Imported</option>
                            </select>

                            <input
                              type="number"
                              step="0.01"
                              min="0.01"
                              placeholder="Qty"
                              value={row.quantity}
                              onChange={(e) => updateRawMaterialRow(index, "quantity", e.target.value)}
                              className="col-span-3 rounded-lg border border-slate-300 bg-white p-2 text-sm outline-hidden"
                            />

                            <button
                              type="button"
                              onClick={() => removeRawMaterialRow(index)}
                              disabled={productionData.rawMaterials.length === 1}
                              className="col-span-1 flex items-center justify-center rounded-lg p-2 text-red-500 hover:bg-red-50 disabled:opacity-30 disabled:cursor-not-allowed cursor-pointer"
                            >
                              <Trash2 size={16} />
                            </button>
                          </div>
                        ))}
                      </div>
                    </div>

                    <div className="rounded-xl border border-blue-200 bg-blue-50/50 p-4 space-y-3">
                      <label className="block text-xs font-semibold uppercase text-[#1E3A8A]">
                        Finished Product *
                      </label>

                      <div className="grid grid-cols-12 gap-2">
                        <select
                          value={productionData.finishedProduct.productId}
                          onChange={(e) => updateFinishedProduct("productId", e.target.value)}
                          className="col-span-6 rounded-lg border border-slate-300 bg-white p-2.5 text-sm outline-hidden"
                        >
                          <option value="">Select product...</option>
                          {products.map((p) => (
                            <option key={p.productId} value={p.productId}>
                              {p.productName} ({p.productCode || "N/A"})
                            </option>
                          ))}
                        </select>

                        <select
                          value={productionData.finishedProduct.stockType}
                          onChange={(e) => updateFinishedProduct("stockType", e.target.value)}
                          className="col-span-3 rounded-lg border border-slate-300 bg-white p-2.5 text-sm outline-hidden"
                        >
                          <option value="Local">Local</option>
                          <option value="Imported">Imported</option>
                        </select>

                        <input
                          type="number"
                          step="0.01"
                          min="0.01"
                          placeholder="Qty"
                          value={productionData.finishedProduct.quantity}
                          onChange={(e) => updateFinishedProduct("quantity", e.target.value)}
                          className="col-span-3 rounded-lg border border-slate-300 bg-white p-2.5 text-sm outline-hidden"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-xs font-semibold uppercase text-slate-500 mb-1">
                        Remarks / Note
                      </label>
                      <textarea
                        rows={2}
                        placeholder="Add production batch reference or details..."
                        value={productionData.remarks}
                        onChange={(e) => setProductionData((prev) => ({ ...prev, remarks: e.target.value }))}
                        className="w-full rounded-xl border border-slate-300 bg-white p-2.5 text-sm outline-hidden"
                      />
                    </div>

                    <div className="flex justify-end gap-3 pt-4 border-t border-slate-100">
                      <button
                        type="button"
                        onClick={() => setIsModalOpen(false)}
                        className="rounded-xl px-4 py-2 text-sm font-semibold text-slate-600 hover:bg-slate-100"
                      >
                        Cancel
                      </button>
                      <button
                        type="submit"
                        disabled={isSaving}
                        className="flex items-center gap-2 rounded-xl bg-[#1E3A8A] px-5 py-2 text-sm font-semibold text-white hover:bg-[#17307A] disabled:opacity-50"
                      >
                        {isSaving && <Loader2 className="animate-spin" size={16} />}
                        Confirm Production
                      </button>
                    </div>
                  </form>
                ) : (
                  /* Purchase / Sale / Consume / Adjust — single-product form */
                  <form onSubmit={handleActionSubmit} className="space-y-4 mt-4">
                    <div>
                      <label className="block text-xs font-semibold uppercase text-slate-500 mb-1">
                        Select Product *
                      </label>
                      <select
                        value={formData.product}
                        onChange={(e) => setFormData({ ...formData, product: e.target.value })}
                        className="w-full rounded-xl border border-slate-300 bg-white p-2.5 text-sm outline-hidden"
                        required
                      >
                        {products.map((p) => (
                          <option key={p.productId} value={p.productId}>
                            {p.productName} ({p.productCode || "N/A"})
                          </option>
                        ))}
                      </select>
                    </div>

                    {actionType === "adjust" && (
                      <div>
                        <label className="block text-xs font-semibold uppercase text-slate-500 mb-1">
                          Adjustment Action *
                        </label>
                        <select
                          value={formData.adjustmentType}
                          onChange={(e) => setFormData({ ...formData, adjustmentType: e.target.value })}
                          className="w-full rounded-xl border border-slate-300 bg-white p-2.5 text-sm outline-hidden"
                        >
                          <option value="Add">Add Stock (+)</option>
                          <option value="Deduct">Deduct Stock (-)</option>
                        </select>
                      </div>
                    )}

                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="block text-xs font-semibold uppercase text-slate-500 mb-1">
                          Stock Type *
                        </label>
                        <select
                          value={formData.stockType}
                          onChange={(e) => setFormData({ ...formData, stockType: e.target.value })}
                          className="w-full rounded-xl border border-slate-300 bg-white p-2.5 text-sm outline-hidden"
                        >
                          <option value="Local">Local</option>
                          <option value="Imported">Imported</option>
                        </select>
                      </div>

                      <div>
                        <label className="block text-xs font-semibold uppercase text-slate-500 mb-1">
                          Quantity *
                        </label>
                        <input
                          type="number"
                          step="0.01"
                          min="0.01"
                          placeholder="0.00"
                          value={formData.quantity}
                          onChange={(e) => setFormData({ ...formData, quantity: e.target.value })}
                          className="w-full rounded-xl border border-slate-300 bg-white p-2.5 text-sm outline-hidden"
                          required
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-xs font-semibold uppercase text-slate-500 mb-1">
                        Remarks / Note
                      </label>
                      <textarea
                        rows={2}
                        placeholder="Add transaction reference or details..."
                        value={formData.remarks}
                        onChange={(e) => setFormData({ ...formData, remarks: e.target.value })}
                        className="w-full rounded-xl border border-slate-300 bg-white p-2.5 text-sm outline-hidden"
                      />
                    </div>

                    <div className="flex justify-end gap-3 pt-4 border-t border-slate-100">
                      <button
                        type="button"
                        onClick={() => setIsModalOpen(false)}
                        className="rounded-xl px-4 py-2 text-sm font-semibold text-slate-600 hover:bg-slate-100"
                      >
                        Cancel
                      </button>
                      <button
                        type="submit"
                        disabled={isSaving}
                        className="flex items-center gap-2 rounded-xl bg-[#1E3A8A] px-5 py-2 text-sm font-semibold text-white hover:bg-[#17307A] disabled:opacity-50"
                      >
                        {isSaving && <Loader2 className="animate-spin" size={16} />}
                        Confirm Transaction
                      </button>
                    </div>
                  </form>
                )}
              </div>
            </div>
          )}
        </main>
      </div>
    </div>
  );
}

export default Stock;