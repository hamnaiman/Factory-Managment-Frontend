import {
  AlertTriangle,
  Package,
  ChevronRight,
} from "lucide-react";

function LowStock({ dashboard }) {
  const products = dashboard?.lowStockProducts || [];

  return (
    <div className="rounded-2xl border border-slate-200 bg-white shadow-sm">

      {/* Header */}

      <div className="flex items-center justify-between border-b border-slate-200 px-6 py-5">

        <div>

          <h2 className="text-xl font-semibold text-slate-900">
            Low Stock Alerts
          </h2>

          <p className="mt-1 text-sm text-slate-500">
            Products requiring inventory replenishment
          </p>

        </div>

        <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-orange-100">

          <AlertTriangle
            size={20}
            className="text-orange-600"
          />

        </div>

      </div>

      {/* Body */}

      <div className="max-h-[420px] overflow-y-auto">

        {products.length === 0 ? (

          <div className="flex h-52 flex-col items-center justify-center">

            <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-green-100">

              <Package
                size={24}
                className="text-green-600"
              />

            </div>

            <h3 className="mt-5 text-lg font-semibold text-slate-900">
              Inventory Healthy
            </h3>

            <p className="mt-1 text-sm text-slate-500">
              No products require restocking.
            </p>

          </div>

        ) : (

          <div className="divide-y divide-slate-100">

            {products.map((item) => (

              <div
                key={item._id}
                className="group flex items-center justify-between px-6 py-5 transition-colors duration-200 hover:bg-slate-50"
              >

                <div className="flex items-center gap-4">

                  <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-orange-100">

                    <Package
                      size={20}
                      className="text-orange-600"
                    />

                  </div>

                  <div>

                    <h3 className="font-semibold text-slate-900">
                      {item.name}
                    </h3>

                    <p className="mt-1 text-sm text-slate-500">
                      Inventory running low
                    </p>

                  </div>

                </div>

                <div className="flex items-center gap-4">

                  <span
                    className={`rounded-full px-3 py-1 text-sm font-semibold ${
                      item.quantity <= 5
                        ? "bg-red-100 text-red-700"
                        : "bg-orange-100 text-orange-700"
                    }`}
                  >
                    {item.quantity} Left
                  </span>

                  <ChevronRight
                    size={18}
                    className="text-slate-300 transition group-hover:translate-x-1"
                  />

                </div>

              </div>

            ))}

          </div>

        )}

      </div>

    </div>
  );
}

export default LowStock;