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
      <div className="w-full overflow-x-auto">
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