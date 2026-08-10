import { useEffect, useState } from "react";
import {
  Boxes,
  Search,
  Loader2,
  AlertTriangle,
  RefreshCw,
} from "lucide-react";
import toast from "react-hot-toast";

import Sidebar from "../components/Sidebar";
import Navbar from "../components/Navbar";

import { getInventoryList } from "../services/stockService";

const getQty = (item) => {
  if (!item) return 0;

  if (
    item.currentStock !== undefined &&
    item.currentStock !== null &&
    !isNaN(Number(item.currentStock))
  ) {
    return Number(item.currentStock);
  }

  return 0;
};

const getIsLow = (item) => {
  if (typeof item.isLowStock === "boolean") {
    return item.isLowStock;
  }

  const total = getQty(item);
  const minimum = Number(item.minimumStock ?? 0);

  return total <= minimum;
};

function Stock() {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);

  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  const [search, setSearch] = useState("");
  const [activeTab, setActiveTab] = useState("all");

  const fetchStockData = async () => {
    try {
      setLoading(true);

      const productList = await getInventoryList();

      setProducts(Array.isArray(productList) ? productList : []);
    } catch (error) {
      console.error("Failed to fetch inventory:", error);

      const msg =
        error.response?.data?.message ||
        "Failed to load inventory stock.";

      toast.error(msg);
      setProducts([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchStockData();
  }, []);

  // -----------------------------------------
  // SUMMARY
  // -----------------------------------------

  const totalItems = products.length;

  const totalStock = products.reduce(
    (total, product) => total + getQty(product),
    0
  );

  const lowStockCount = products.filter((item) =>
    getIsLow(item)
  ).length;

  // -----------------------------------------
  // SEARCH + FILTER
  // -----------------------------------------

  const visibleProducts = products.filter((item) => {
    const q = search.toLowerCase();

    const productName =
      item.productName?.toLowerCase() || "";

    const productCode =
      item.productCode?.toLowerCase() || "";

    const category =
      item.category?.toLowerCase() || "";

    const matchesSearch =
      productName.includes(q) ||
      productCode.includes(q) ||
      category.includes(q);

    const matchesTab =
      activeTab === "all"
        ? true
        : getIsLow(item);

    return matchesSearch && matchesTab;
  });

  return (
    <div className="min-h-screen bg-slate-50">
      {/* Sidebar */}
      <Sidebar
        isOpen={isSidebarOpen}
        setIsOpen={setIsSidebarOpen}
      />

      {/* Main Content */}
      <div
        className={`flex-1 min-w-0 transition-all duration-300 ease-in-out ${
          isSidebarOpen
            ? "ml-0 lg:ml-72"
            : "ml-0 lg:ml-20"
        }`}
      >
        <Navbar
          isSidebarOpen={isSidebarOpen}
          setIsSidebarOpen={setIsSidebarOpen}
        />

        <main className="p-4 md:p-6 lg:p-8 space-y-6 max-w-[1600px] mx-auto mt-24">

          {/* -----------------------------------------
              HEADER
          ----------------------------------------- */}

          <div className="flex flex-col gap-1">
            <h1 className="text-2xl font-bold text-slate-900 sm:text-3xl">
              Inventory & Stock
            </h1>

            <p className="text-sm text-slate-500">
              Monitor current product stock levels and low stock alerts.
            </p>
          </div>

          {/* -----------------------------------------
              KPI CARDS
          ----------------------------------------- */}

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">

            {/* Total Products */}
            <div className="rounded-3xl border border-slate-200 bg-white p-5 flex items-center justify-between">
              <div>
                <p className="text-xs font-semibold text-slate-400 uppercase">
                  Total Products
                </p>

                <h3 className="text-2xl font-bold text-slate-900 mt-1">
                  {totalItems}
                </h3>
              </div>

              <div className="h-12 w-12 rounded-2xl bg-blue-50 text-[#1E3A8A] flex items-center justify-center">
                <Boxes size={24} />
              </div>
            </div>

            {/* Total Stock */}
            <div className="rounded-3xl border border-slate-200 bg-white p-5 flex items-center justify-between">
              <div>
                <p className="text-xs font-semibold text-slate-400 uppercase">
                  Total Stock
                </p>

                <h3 className="text-2xl font-bold text-[#1E3A8A] mt-1">
                  {totalStock.toLocaleString()}
                </h3>
              </div>

              <div className="h-12 w-12 rounded-2xl bg-blue-50 text-[#1E3A8A] flex items-center justify-center">
                <Boxes size={24} />
              </div>
            </div>

            {/* Low Stock */}
            <div
              onClick={() =>
                setActiveTab(
                  activeTab === "low_stock"
                    ? "all"
                    : "low_stock"
                )
              }
              className={`rounded-3xl border p-5 flex items-center justify-between cursor-pointer transition-all ${
                lowStockCount > 0
                  ? "border-amber-200 bg-amber-50/50"
                  : "border-slate-200 bg-white"
              }`}
            >
              <div>
                <p className="text-xs font-semibold text-amber-700 uppercase">
                  Low Stock Alerts
                </p>

                <h3 className="text-2xl font-bold text-amber-900 mt-1">
                  {lowStockCount}
                </h3>
              </div>

              <div className="h-12 w-12 rounded-2xl bg-amber-100 text-amber-600 flex items-center justify-center">
                <AlertTriangle size={24} />
              </div>
            </div>
          </div>

          {/* -----------------------------------------
              FILTERS
          ----------------------------------------- */}

          <div className="rounded-3xl border border-slate-200 bg-white p-5 space-y-4">

            {/* Tabs */}
            <div className="flex border-b border-slate-200 gap-6 text-sm font-medium">

              <button
                onClick={() => setActiveTab("all")}
                className={`pb-3 relative cursor-pointer ${
                  activeTab === "all"
                    ? "text-[#1E3A8A] font-bold"
                    : "text-slate-500"
                }`}
              >
                All Stock Records

                {activeTab === "all" && (
                  <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-[#1E3A8A] rounded-full" />
                )}
              </button>

              <button
                onClick={() => setActiveTab("low_stock")}
                className={`pb-3 relative cursor-pointer flex items-center gap-2 ${
                  activeTab === "low_stock"
                    ? "text-amber-600 font-bold"
                    : "text-slate-500"
                }`}
              >
                Low Stock Warning

                {lowStockCount > 0 && (
                  <span className="bg-amber-100 text-amber-700 text-xs px-2 py-0.5 rounded-full font-bold">
                    {lowStockCount}
                  </span>
                )}

                {activeTab === "low_stock" && (
                  <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-amber-600 rounded-full" />
                )}
              </button>
            </div>

            {/* Search */}
            <div className="flex flex-col gap-3 sm:flex-row sm:items-center">

              <div className="relative flex-1 min-w-0">

                <Search
                  size={18}
                  className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400"
                />

                <input
                  type="text"
                  value={search}
                  onChange={(e) =>
                    setSearch(e.target.value)
                  }
                  placeholder="Search by name, code, or category..."
                  className="w-full rounded-xl border border-slate-300 bg-white py-2.5 pl-11 pr-4 text-sm focus:border-[#1E3A8A] focus:ring-1 focus:ring-[#1E3A8A] outline-none"
                />
              </div>

              <button
                onClick={fetchStockData}
                className="p-2.5 rounded-xl border border-slate-300 bg-white text-slate-600 hover:bg-slate-50 cursor-pointer"
                title="Refresh Stock"
              >
                <RefreshCw size={18} />
              </button>
            </div>
          </div>

          {/* -----------------------------------------
              TABLE
          ----------------------------------------- */}

          <div className="w-full bg-white rounded-3xl border border-slate-200 overflow-hidden">

            {loading ? (
              <div className="p-16 flex flex-col items-center justify-center space-y-4 text-slate-500">

                <Loader2
                  className="animate-spin text-[#1E3A8A]"
                  size={36}
                />

                <p className="text-sm font-medium">
                  Fetching inventory...
                </p>
              </div>
            ) : visibleProducts.length === 0 ? (

              <div className="p-16 text-center flex flex-col items-center justify-center">

                <Boxes
                  size={48}
                  className="text-slate-300 mb-4"
                />

                <h3 className="text-lg font-bold text-slate-800">
                  No stock records found
                </h3>

                <p className="text-sm text-slate-500 mt-1">
                  No products match the current search or filter.
                </p>
              </div>

            ) : (

              <div className="overflow-x-auto">

                <table className="w-full text-left text-sm text-slate-600">

                  <thead className="bg-slate-50 border-b border-slate-200 text-xs uppercase text-slate-500 font-semibold">

                    <tr>

                      <th className="px-6 py-4">
                        Product
                      </th>

                      <th className="px-6 py-4">
                        Category
                      </th>

                      <th className="px-6 py-4">
                        Unit
                      </th>

                      <th className="px-6 py-4 text-right">
                        Current Stock
                      </th>

                      <th className="px-6 py-4 text-right">
                        Minimum Stock
                      </th>

                      <th className="px-6 py-4 text-center">
                        Status
                      </th>

                    </tr>
                  </thead>

                  <tbody className="divide-y divide-slate-200">

                    {visibleProducts.map((item) => {

                      const totalQty = getQty(item);

                      const minimumStock =
                        Number(
                          item.minimumStock ?? 0
                        );

                      const isLow =
                        getIsLow(item);

                      const unitLabel =
                        item.unit || "Kg";

                      return (
                        <tr
                          key={item.productId || item._id}
                          className="hover:bg-slate-50/80 transition-colors"
                        >

                          {/* Product */}
                          <td className="px-6 py-4">

                            <div className="font-bold text-slate-900">
                              {item.productName}
                            </div>

                            <div className="text-xs text-slate-400 mt-0.5">
                              {item.productCode || "-"}
                            </div>

                          </td>

                          {/* Category */}
                          <td className="px-6 py-4">

                            <span className="inline-flex items-center rounded-lg bg-slate-100 px-2.5 py-1 text-xs font-semibold text-slate-700">
                              {item.category || "General"}
                            </span>

                          </td>

                          {/* Unit */}
                          <td className="px-6 py-4">

                            <span className="font-medium text-slate-700">
                              {unitLabel}
                            </span>

                          </td>

                          {/* Current Stock */}
                          <td className="px-6 py-4 text-right">

                            <span
                              className={`text-base font-bold ${
                                isLow
                                  ? "text-amber-600"
                                  : "text-[#1E3A8A]"
                              }`}
                            >
                              {totalQty.toLocaleString()}
                            </span>

                            <span className="text-xs text-slate-400 ml-1">
                              {unitLabel}
                            </span>

                          </td>

                          {/* Minimum Stock */}
                          <td className="px-6 py-4 text-right">

                            <span className="font-medium text-slate-700">
                              {minimumStock.toLocaleString()}
                            </span>

                            <span className="text-xs text-slate-400 ml-1">
                              {unitLabel}
                            </span>

                          </td>

                          {/* Status */}
                          <td className="px-6 py-4 text-center">

                            {isLow ? (

                              <span className="inline-flex items-center gap-1.5 rounded-full bg-amber-50 px-3 py-1 text-xs font-bold text-amber-700 border border-amber-200">

                                <AlertTriangle size={12} />

                                Low Stock

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

        </main>
      </div>
    </div>
  );
}

export default Stock;