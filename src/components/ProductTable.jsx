import { useState } from "react";
import { Edit2, EyeOff, RotateCcw, AlertTriangle, X, PackageCheck } from "lucide-react";

function ProductTable({ products, onEdit, onDeactivate, onRestore }) {
  const [confirmId, setConfirmId] = useState(null);

  const triggerDeactivate = (id) => {
    setConfirmId(id);
  };

  const executeDeactivate = (id) => {
    onDeactivate(id);
    setConfirmId(null);
  };

  return (
    <div className="w-full relative">
      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-slate-50 text-slate-700 border-b border-slate-200 text-xs font-bold uppercase tracking-wider">
              <th className="px-6 py-4">Product Code / Name</th>
              <th className="px-6 py-4">Category / Type</th>
              <th className="px-6 py-4">Color & Unit</th>
              <th className="px-6 py-4 text-right">Cost Price</th>
              <th className="px-6 py-4 text-right">Selling Price</th>
              {/* ✨ Updated Header */}
              <th className="px-6 py-4 text-center">Stock Breakdown (L / IMP)</th>
              <th className="px-6 py-4 text-center">Status</th>
              <th className="px-6 py-4 text-right pr-8">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100 text-sm text-slate-700">
            {products.map((product) => {
              const localStock = Number(product.localStock || 0);
              const importedStock = Number(product.importedStock || 0);
              const currentStock = Number(product.currentStock || (localStock + importedStock));
              const minStock = Number(product.minimumStock || 0);

              const isLowStock = currentStock <= minStock;
              const isActive = product.status === "active";

              return (
                <tr key={product._id} className="hover:bg-slate-50/70 transition-colors">
                  <td className="px-6 py-4">
                    <div className="font-semibold text-slate-900">{product.productName}</div>
                    <div className="text-xs text-slate-400 font-mono mt-0.5">{product.productCode}</div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="font-medium text-slate-800">{product.category}</div>
                    <div className="text-xs text-slate-500 mt-0.5">{product.productType}</div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="text-slate-800 font-medium">{product.color}</div>
                    <div className="text-xs text-slate-500 mt-1 flex items-center gap-1.5">
                      <span>Per {product.unit}</span>
                      {product.stockType && (
                        <span className="inline-block px-1.5 py-0.2 rounded-md bg-slate-100 text-slate-600 font-semibold text-[10px] uppercase border border-slate-200">
                          {product.stockType}
                        </span>
                      )}
                    </div>
                  </td>
                  <td className="px-6 py-4 text-right font-mono text-slate-800">
                    Rs. {Number(product.costPrice).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                  </td>
                  <td className="px-6 py-4 text-right font-mono font-medium text-slate-900">
                    Rs. {Number(product.sellingPrice).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                  </td>

                  {/* ✨ User Friendly Local vs Imported Stock Column */}
                  <td className="px-6 py-4">
                    <div className="flex flex-col items-center justify-center space-y-1">
                      {/* Total Balance */}
                      <div className="flex items-center gap-1">
                        <span className={`font-bold text-sm ${isLowStock ? "text-orange-600" : "text-slate-900"}`}>
                          {currentStock}
                        </span>
                        <span className="text-xs text-slate-400 font-normal">/ Min: {minStock}</span>
                      </div>

                      {/* Local vs Imported Visual Badges */}
                      <div className="flex items-center gap-1.5">
                        <span className="inline-flex items-center gap-0.5 rounded-md bg-blue-50 px-2 py-0.5 text-[11px] font-bold text-blue-700 border border-blue-100" title="Local Stock">
                          <span className="text-[9px] uppercase opacity-75">Loc:</span> {localStock}
                        </span>
                        <span className="inline-flex items-center gap-0.5 rounded-md bg-teal-50 px-2 py-0.5 text-[11px] font-bold text-teal-700 border border-teal-100" title="Imported Stock">
                          <span className="text-[9px] uppercase opacity-75">Imp:</span> {importedStock}
                        </span>
                      </div>

                      {isLowStock && (
                        <span className="mt-0.5 inline-flex items-center gap-1 rounded-md bg-orange-50 px-2 py-0.5 text-2xs font-bold text-orange-600 border border-orange-200">
                          <AlertTriangle size={10} /> Low Stock
                        </span>
                      )}
                    </div>
                  </td>

                  <td className="px-6 py-4 text-center">
                    <span
                      className={`inline-flex items-center rounded-full px-2.5 py-1 text-xs font-semibold border ${
                        isActive
                          ? "bg-green-50 border-green-200 text-green-700"
                          : "bg-red-50 border-red-200 text-red-700"
                      }`}
                    >
                      {isActive ? "Active" : "Inactive"}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-right pr-8">
                    <div className="flex items-center justify-end gap-2">
                      <button
                        onClick={() => onEdit(product)}
                        title="Edit Details"
                        className="p-2 rounded-lg text-slate-500 hover:bg-slate-100 hover:text-slate-900 transition-colors cursor-pointer"
                      >
                        <Edit2 size={16} />
                      </button>

                      {isActive ? (
                        <button
                          onClick={() => triggerDeactivate(product._id)}
                          title="Deactivate Product"
                          className="p-2 rounded-lg text-slate-400 hover:bg-red-50 hover:text-red-600 transition-colors cursor-pointer"
                        >
                          <EyeOff size={16} />
                        </button>
                      ) : (
                        <button
                          onClick={() => onRestore(product._id)}
                          title="Restore Product"
                          className="p-2 rounded-lg text-slate-400 hover:bg-green-50 hover:text-green-600 transition-colors cursor-pointer"
                        >
                          <RotateCcw size={16} />
                        </button>
                      )}
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {/* Embedded Action Overlay for Delete/Deactivate Confirmation Prompt */}
      {confirmId && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/40 backdrop-blur-xs p-4 animate-fade-in">
          <div className="w-full max-w-md rounded-3xl border border-slate-200 bg-white p-6 shadow-xl transform transition-all scale-100">
            <div className="flex items-start justify-between">
              <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-red-50 text-red-600 border border-red-100">
                <AlertTriangle size={24} />
              </div>
              <button
                onClick={() => setConfirmId(null)}
                className="rounded-xl p-1 text-slate-400 hover:bg-slate-100 hover:text-slate-600 transition-colors cursor-pointer"
              >
                <X size={18} />
              </button>
            </div>
            <div className="mt-4">
              <h3 className="text-lg font-bold text-slate-900">Deactivate Product?</h3>
              <p className="mt-2 text-sm text-slate-500">
                This product will become inactive and can be restored later.
              </p>
            </div>
            <div className="mt-6 flex flex-col-reverse gap-3 sm:flex-row sm:justify-end">
              <button
                onClick={() => setConfirmId(null)}
                className="h-11 w-full rounded-xl border border-slate-300 text-sm font-semibold text-slate-700 transition hover:bg-slate-50 sm:w-28 cursor-pointer"
              >
                Cancel
              </button>
              <button
                onClick={() => executeDeactivate(confirmId)}
                className="h-11 w-full rounded-xl bg-red-600 text-sm font-semibold text-white transition hover:bg-red-700 sm:w-32 cursor-pointer shadow-xs active:scale-95"
              >
                Deactivate
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default ProductTable;