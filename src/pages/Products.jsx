import { useEffect, useState } from "react";
import { Plus, Search, Loader2 } from "lucide-react";
import toast from "react-hot-toast";
import Sidebar from "../components/Sidebar";
import Navbar from "../components/Navbar";
import ProductTable from "../components/ProductTable";
import ProductModal from "../components/ProductModal";
import {
  getProducts,
  createProduct,
  updateProduct,
  deactivateProduct,
  restoreProduct,
} from "../services/productService";

function Products() {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [products, setProducts] = useState([]);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [lowStockOnly, setLowStockOnly] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);

  const fetchProducts = async () => {
    try {
      setLoading(true);
      const data = await getProducts();
      const productList = Array.isArray(data)
        ? data
        : data?.products || data?.data || [];
      setProducts(productList);
    } catch (error) {
      console.error("Failed to fetch products:", error);
      const msg = error.response?.data?.message || "Failed to load products.";
      toast.error(msg);
      setProducts([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  const handleAdd = () => {
    setSelectedProduct(null);
    setIsModalOpen(true);
  };

  const handleEdit = (product) => {
    setSelectedProduct(product);
    setIsModalOpen(true);
  };

  const handleSave = async (formData) => {
    try {
      setIsSaving(true);
      if (selectedProduct) {
        await updateProduct(selectedProduct._id, formData);
        toast.success("Product updated successfully.");
      } else {
        await createProduct(formData);
        toast.success("Product added successfully.");
      }
      setIsModalOpen(false);
      setSelectedProduct(null);
      fetchProducts();
    } catch (error) {
      console.error("Failed to save product:", error);
      const msg = error.response?.data?.message || "Network error. Please try again.";
      toast.error(msg);
    } finally {
      setIsSaving(false);
    }
  };

  const handleDeactivate = async (id) => {
    try {
      await deactivateProduct(id);
      toast.success("Product deactivated successfully.");
      fetchProducts();
    } catch (error) {
      console.error("Failed to deactivate product:", error);
      const msg = error.response?.data?.message || "Failed to deactivate product.";
      toast.error(msg);
    }
  };

  const handleRestore = async (id) => {
    try {
      await restoreProduct(id);
      toast.success("Product restored successfully.");
      fetchProducts();
    } catch (error) {
      console.error("Failed to restore product:", error);
      const msg = error.response?.data?.message || "Failed to restore product.";
      toast.error(msg);
    }
  };

  const visibleProducts = (products || []).filter((product) => {
    const sName = product.productName?.toLowerCase() || "";
    const sCode = product.productCode?.toLowerCase() || "";
    const sCat = product.category?.toLowerCase() || "";
    const q = search.toLowerCase();

    const matchesSearch = sName.includes(q) || sCode.includes(q) || sCat.includes(q);
    const matchesStatus = statusFilter === "all" || product.status === statusFilter;
    const matchesLowStock = !lowStockOnly || (Number(product.currentStock) <= Number(product.minimumStock));

    return matchesSearch && matchesStatus && matchesLowStock;
  });

  return (
    <div className="min-h-screen bg-slate-100 flex overflow-x-hidden">
      <Sidebar isOpen={isSidebarOpen} setIsOpen={setIsSidebarOpen} />

      <div className={`flex-1 min-w-0 transition-all duration-300 ease-in-out ${isSidebarOpen ? "ml-0 lg:ml-72" : "ml-0 lg:ml-20"}`}>
       <Navbar
  isSidebarOpen={isSidebarOpen}
  setIsSidebarOpen={setIsSidebarOpen}
/>

        <main className="p-4 md:p-6 lg:p-8 space-y-6 max-w-[1600px] mx-auto mt-24">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <h1 className="text-2xl font-bold text-slate-900 sm:text-3xl">Products</h1>
              <p className="text-sm text-slate-500 mt-1">Manage factory products ledger, track attributes, and monitor thresholds.</p>
            </div>

            <button
              onClick={handleAdd}
              className="flex items-center justify-center gap-2 rounded-xl bg-[#1E3A8A] px-5 py-2.5 text-sm font-semibold text-white hover:bg-[#17307A] transition-all hover:shadow-md cursor-pointer active:scale-95"
            >
              <Plus size={18} />
              Add Product
            </button>
          </div>

          <div className="rounded-3xl border border-slate-200 bg-white p-5 shadow-xs">
            <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
              <div className="relative flex-1 min-w-0">
                <Search size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />
                <input
                  type="text"
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  placeholder="Search by name, code, or category..."
                  className="w-full rounded-xl border border-slate-300 bg-white py-2.5 pl-11 pr-4 text-sm focus:border-[#1E3A8A] focus:ring-1 focus:ring-[#1E3A8A] focus:outline-hidden"
                />
              </div>

              <div className="flex gap-3">
                <select
                  value={statusFilter}
                  onChange={(e) => setStatusFilter(e.target.value)}
                  className="flex-1 rounded-xl border border-slate-300 bg-white px-4 py-2.5 text-sm focus:border-[#1E3A8A] focus:outline-hidden sm:flex-none cursor-pointer"
                >
                  <option value="all">All Status</option>
                  <option value="active">Active</option>
                  <option value="inactive">Inactive</option>
                </select>

                <label className="flex flex-1 items-center justify-center gap-2 whitespace-nowrap rounded-xl border border-slate-300 bg-white px-4 py-2.5 text-sm text-slate-700 sm:flex-none cursor-pointer select-none transition-colors hover:bg-slate-50">
                  <input
                    type="checkbox"
                    checked={lowStockOnly}
                    onChange={(e) => setLowStockOnly(e.target.checked)}
                    className="cursor-pointer accent-[#1E3A8A] h-4 w-4 rounded-sm"
                  />
                  Low Stock
                </label>
              </div>
            </div>
          </div>

          <div className="w-full bg-white rounded-3xl border border-slate-200 shadow-xs overflow-hidden">
            {loading ? (
              <div className="p-16 flex flex-col items-center justify-center space-y-4 text-slate-500">
                <Loader2 className="animate-spin text-[#1E3A8A]" size={36} />
                <p className="text-sm font-medium">Loading products pipeline ledger...</p>
              </div>
            ) : visibleProducts.length === 0 ? (
              <div className="p-16 text-center flex flex-col items-center justify-center max-w-md mx-auto">
                <span className="text-5xl mb-4 select-none">📦</span>
                <h3 className="text-lg font-bold text-slate-800">No products found.</h3>
                <p className="text-sm text-slate-500 mt-1 mb-6">Click "Add Product" to create your first product dynamic listing.</p>
                <button
                  onClick={handleAdd}
                  className="inline-flex items-center gap-2 rounded-xl bg-[#1E3A8A] px-4 py-2 text-sm font-semibold text-white hover:bg-[#17307A] transition-all cursor-pointer"
                >
                  <Plus size={16} /> Add First Product
                </button>
              </div>
            ) : (
              <ProductTable
                products={visibleProducts}
                onEdit={handleEdit}
                onDeactivate={handleDeactivate}
                onRestore={handleRestore}
              />
            )}
          </div>

          <ProductModal
            isOpen={isModalOpen}
            onClose={() => {
              setIsModalOpen(false);
              setSelectedProduct(null);
            }}
            onSave={handleSave}
            initialData={selectedProduct}
            isSaving={isSaving}
          />
        </main>
      </div>
    </div>
  );
}

export default Products;