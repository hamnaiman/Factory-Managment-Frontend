import {
  Edit2,
  EyeOff,
  RotateCcw,
  AlertTriangle,
  X,
} from "lucide-react";
import { useState } from "react";

function ProductTable({
  products,
  onEdit,
  onDeactivate,
  onRestore,
}) {
  const [confirmId, setConfirmId] = useState(null);

  const executeDeactivate = (id) => {
    onDeactivate(id);
    setConfirmId(null);
  };

  return (
    <>
      {/* =========================================================
          MOBILE CARDS
          Only visible below md breakpoint
      ========================================================= */}
      <div className="block md:hidden">
        <div className="space-y-3">
          {products.map((product) => {
            const currentStock = Number(
              product.currentStock || 0
            );

            const minimumStock = Number(
              product.minimumStock || 0
            );

            const isLowStock =
              currentStock <= minimumStock;

            const isActive =
              product.status === "active";

            return (
              <div
                key={product._id}
                className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm"
              >
                {/* Top Section */}
                <div className="flex items-start justify-between gap-3">
                  <div className="min-w-0 flex-1">
                    <div className="font-semibold text-slate-900 break-words">
                      {product.productName}
                    </div>

                    <div className="text-xs text-slate-400 font-mono mt-1 break-all">
                      {product.productCode}
                    </div>
                  </div>

                  {/* Status */}
                  <span
                    className={`shrink-0 inline-flex rounded-full px-3 py-1 text-xs font-semibold border ${
                      isActive
                        ? "bg-green-50 border-green-200 text-green-700"
                        : "bg-red-50 border-red-200 text-red-700"
                    }`}
                  >
                    {isActive ? "Active" : "Inactive"}
                  </span>
                </div>

                {/* Product Details */}
                <div className="mt-4 grid grid-cols-2 gap-3">
                  {/* Category */}
                  <div className="rounded-xl bg-slate-50 p-3">
                    <p className="text-[10px] font-bold uppercase tracking-wide text-slate-400">
                      Category
                    </p>

                    <p className="mt-1 text-sm font-medium text-slate-800 break-words">
                      {product.category}
                    </p>
                  </div>

                  {/* Color */}
                  <div className="rounded-xl bg-slate-50 p-3">
                    <p className="text-[10px] font-bold uppercase tracking-wide text-slate-400">
                      Color
                    </p>

                    <p className="mt-1 text-sm text-slate-800 break-words">
                      {product.color}
                    </p>
                  </div>

                  {/* Unit */}
                  <div className="rounded-xl bg-slate-50 p-3">
                    <p className="text-[10px] font-bold uppercase tracking-wide text-slate-400">
                      Unit
                    </p>

                    <span className="mt-1 inline-flex rounded-lg bg-slate-200 px-2.5 py-1 text-xs font-bold text-slate-700">
                      Kg
                    </span>
                  </div>

                  {/* Stock */}
                  <div
                    className={`rounded-xl p-3 ${
                      isLowStock
                        ? "bg-orange-50"
                        : "bg-slate-50"
                    }`}
                  >
                    <p className="text-[10px] font-bold uppercase tracking-wide text-slate-400">
                      Stock
                    </p>

                    <div
                      className={`mt-1 font-bold ${
                        isLowStock
                          ? "text-orange-600"
                          : "text-slate-900"
                      }`}
                    >
                      {currentStock} Kg
                    </div>

                    <div className="text-[11px] text-slate-400 mt-0.5">
                      Minimum: {minimumStock} Kg
                    </div>
                  </div>
                </div>

                {/* Low Stock Warning */}
                {isLowStock && (
                  <div className="mt-3 flex items-center gap-1.5 rounded-xl bg-orange-50 border border-orange-200 px-3 py-2">
                    <AlertTriangle
                      size={13}
                      className="shrink-0 text-orange-600"
                    />

                    <span className="text-xs font-bold text-orange-600">
                      Low Stock
                    </span>
                  </div>
                )}

                {/* Actions */}
                <div className="mt-4 flex items-center justify-end gap-2 border-t border-slate-100 pt-3">
                  <button
                    onClick={() => onEdit(product)}
                    title="Edit Product"
                    className="inline-flex items-center gap-2 rounded-xl bg-slate-50 px-3 py-2 text-xs font-semibold text-slate-600 hover:bg-slate-100 hover:text-slate-900 transition"
                  >
                    <Edit2 size={15} />
                    Edit
                  </button>

                  {isActive ? (
                    <button
                      onClick={() =>
                        setConfirmId(product._id)
                      }
                      title="Deactivate Product"
                      className="inline-flex items-center gap-2 rounded-xl bg-red-50 px-3 py-2 text-xs font-semibold text-red-600 hover:bg-red-100 transition"
                    >
                      <EyeOff size={15} />
                      Deactivate
                    </button>
                  ) : (
                    <button
                      onClick={() =>
                        onRestore(product._id)
                      }
                      title="Restore Product"
                      className="inline-flex items-center gap-2 rounded-xl bg-green-50 px-3 py-2 text-xs font-semibold text-green-600 hover:bg-green-100 transition"
                    >
                      <RotateCcw size={15} />
                      Restore
                    </button>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* =========================================================
          DESKTOP TABLE
          Existing table preserved
      ========================================================= */}
      <div className="hidden md:block w-full overflow-x-auto">
        <table className="w-full min-w-[850px]">
          <thead className="bg-slate-50 border-b border-slate-200">
            <tr>
              <th className="px-6 py-4 text-left text-xs font-bold uppercase text-slate-500">
                Product
              </th>

              <th className="px-6 py-4 text-left text-xs font-bold uppercase text-slate-500">
                Category
              </th>

              <th className="px-6 py-4 text-left text-xs font-bold uppercase text-slate-500">
                Color
              </th>

              <th className="px-6 py-4 text-center text-xs font-bold uppercase text-slate-500">
                Unit
              </th>

              <th className="px-6 py-4 text-center text-xs font-bold uppercase text-slate-500">
                Stock Status
              </th>

              <th className="px-6 py-4 text-center text-xs font-bold uppercase text-slate-500">
                Status
              </th>

              <th className="px-6 py-4 text-right text-xs font-bold uppercase text-slate-500">
                Actions
              </th>
            </tr>
          </thead>

          <tbody className="divide-y divide-slate-100">
            {products.map((product) => {
              const currentStock = Number(
                product.currentStock || 0
              );

              const minimumStock = Number(
                product.minimumStock || 0
              );

              const isLowStock =
                currentStock <= minimumStock;

              const isActive =
                product.status === "active";

              return (
                <tr
                  key={product._id}
                  className="hover:bg-slate-50/70 transition-colors"
                >
                  {/* Product */}
                  <td className="px-6 py-4">
                    <div className="font-semibold text-slate-900">
                      {product.productName}
                    </div>

                    <div className="text-xs text-slate-400 font-mono mt-1">
                      {product.productCode}
                    </div>
                  </td>

                  {/* Category */}
                  <td className="px-6 py-4">
                    <span className="font-medium text-slate-800">
                      {product.category}
                    </span>
                  </td>

                  {/* Color */}
                  <td className="px-6 py-4">
                    <span className="text-slate-800">
                      {product.color}
                    </span>
                  </td>

                  {/* Unit */}
                  <td className="px-6 py-4 text-center">
                    <span className="inline-flex rounded-lg bg-slate-100 px-3 py-1 text-xs font-bold text-slate-700">
                      Kg
                    </span>
                  </td>

                  {/* Stock */}
                  <td className="px-6 py-4 text-center">
                    <div className="flex flex-col items-center gap-1">
                      <div
                        className={`font-bold ${
                          isLowStock
                            ? "text-orange-600"
                            : "text-slate-900"
                        }`}
                      >
                        {currentStock} Kg
                      </div>

                      <div className="text-xs text-slate-400">
                        Minimum: {minimumStock} Kg
                      </div>

                      {isLowStock && (
                        <span className="inline-flex items-center gap-1 rounded-md bg-orange-50 px-2 py-1 text-[10px] font-bold text-orange-600 border border-orange-200">
                          <AlertTriangle size={10} />
                          Low Stock
                        </span>
                      )}
                    </div>
                  </td>

                  {/* Status */}
                  <td className="px-6 py-4 text-center">
                    <span
                      className={`inline-flex rounded-full px-3 py-1 text-xs font-semibold border ${
                        isActive
                          ? "bg-green-50 border-green-200 text-green-700"
                          : "bg-red-50 border-red-200 text-red-700"
                      }`}
                    >
                      {isActive
                        ? "Active"
                        : "Inactive"}
                    </span>
                  </td>

                  {/* Actions */}
                  <td className="px-6 py-4">
                    <div className="flex items-center justify-end gap-2">
                      <button
                        onClick={() => onEdit(product)}
                        title="Edit Product"
                        className="p-2 rounded-lg text-slate-500 hover:bg-slate-100 hover:text-slate-900"
                      >
                        <Edit2 size={16} />
                      </button>

                      {isActive ? (
                        <button
                          onClick={() =>
                            setConfirmId(product._id)
                          }
                          title="Deactivate Product"
                          className="p-2 rounded-lg text-slate-400 hover:bg-red-50 hover:text-red-600"
                        >
                          <EyeOff size={16} />
                        </button>
                      ) : (
                        <button
                          onClick={() =>
                            onRestore(product._id)
                          }
                          title="Restore Product"
                          className="p-2 rounded-lg text-slate-400 hover:bg-green-50 hover:text-green-600"
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

      {/* Confirmation */}
      {confirmId && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/40 backdrop-blur-sm p-4">
          <div className="w-full max-w-md rounded-3xl bg-white p-6 shadow-xl">
            <div className="flex justify-between">
              <div className="h-12 w-12 flex items-center justify-center rounded-2xl bg-red-50 text-red-600">
                <AlertTriangle size={24} />
              </div>

              <button
                onClick={() => setConfirmId(null)}
                className="p-2 text-slate-400 hover:bg-slate-100 rounded-xl"
              >
                <X size={18} />
              </button>
            </div>

            <h3 className="mt-4 text-lg font-bold text-slate-900">
              Deactivate Product?
            </h3>

            <p className="mt-2 text-sm text-slate-500">
              The product will become inactive but can be
              restored later.
            </p>

            <div className="mt-6 flex gap-3 justify-end">
              <button
                onClick={() => setConfirmId(null)}
                className="h-11 px-5 rounded-xl border border-slate-300 text-sm font-semibold"
              >
                Cancel
              </button>

              <button
                onClick={() =>
                  executeDeactivate(confirmId)
                }
                className="h-11 px-5 rounded-xl bg-red-600 text-white text-sm font-semibold hover:bg-red-700"
              >
                Deactivate
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

export default ProductTable;