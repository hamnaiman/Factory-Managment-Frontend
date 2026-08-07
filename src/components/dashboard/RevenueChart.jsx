import { DollarSign } from "lucide-react";

function RevenueChart({ dashboard }) {
  const payments = dashboard?.recentPayments || [];

  const today = new Date().toDateString();

  const todayPayments = payments.filter(
    (item) => new Date(item.paymentDate).toDateString() === today
  );

  const total = todayPayments.reduce(
    (sum, item) => sum + Number(item.amount),
    0
  );

  return (
    <div className="rounded-2xl border border-slate-200 bg-white shadow-sm">
      {/* Header */}
      <div className="flex items-center justify-between border-b border-slate-200 px-6 py-5">
        <div>
          <h2 className="text-xl font-semibold text-slate-900">
            Today's Payments
          </h2>

          <p className="mt-1 text-sm text-slate-500">
            Salary payments processed today
          </p>
        </div>

        <div className="rounded-xl bg-blue-50 px-4 py-3">
          <p className="text-xs text-slate-500">Total Paid</p>

          <h3 className="text-lg font-bold text-slate-900">
            Rs. {total.toLocaleString()}
          </h3>
        </div>
      </div>

      {/* Payment List */}
      <div className="max-h-[270px] overflow-y-auto divide-y divide-slate-100">
        {todayPayments.length === 0 ? (
          <div className="flex h-44 items-center justify-center text-slate-500">
            No payments made today.
          </div>
        ) : (
          todayPayments.map((item) => (
            <div
              key={item._id}
              className="flex items-center justify-between px-6 py-4 hover:bg-slate-50"
            >
              <div className="flex items-center gap-4">
                <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-blue-100">
                  <DollarSign
                    size={20}
                    className="text-blue-600"
                  />
                </div>

                <div>
                  <h3 className="font-semibold text-slate-900">
                    {item.worker?.name}
                  </h3>

                  <p className="text-sm text-slate-500">
                    Salary Paid
                  </p>
                </div>
              </div>

              <span className="font-semibold text-green-600">
                Rs. {Number(item.amount).toLocaleString()}
              </span>
            </div>
          ))
        )}
      </div>
    </div>
  );
}

export default RevenueChart;