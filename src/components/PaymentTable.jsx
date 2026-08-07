import { Pencil, Trash2 } from "lucide-react";

function PaymentTable({
  payments,
  search,
  onEdit,
  onDelete,
}) {
  const filteredPayments = payments.filter((payment) =>
    payment.worker?.name
      ?.toLowerCase()
      .includes(search.toLowerCase())
  );

  if (filteredPayments.length === 0) {
    return (
      <div className="rounded-3xl border border-slate-200 bg-white p-10 text-center shadow-sm">
        No payments found.
      </div>
    );
  }

  return (
    <>
      {/* ================= Desktop Table ================= */}

      <div className="hidden lg:block">
        <div className="overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-sm"> <div className="min-w-[950px]">

            {/* Header */}

            <div className="grid grid-cols-12 bg-slate-50 px-8 py-4 font-semibold text-slate-700">

              <div className="col-span-2">Worker</div>

              <div className="col-span-2">Amount</div>

              <div className="col-span-2">Type</div>

              <div className="col-span-2">Method</div>

              <div className="col-span-2">Date</div>

              <div className="col-span-2 text-center">
                Actions
              </div>

            </div>

            {filteredPayments.map((payment) => (

              <div
                key={payment._id}
                className="grid grid-cols-12 items-center border-t border-slate-100 px-6 py-5 hover:bg-slate-50"
              >

                <div className="col-span-2 font-semibold">
                  {payment.worker?.name}
                </div>

                <div className="col-span-2 font-semibold text-[#1E3A8A]">
                  Rs. {payment.amount}
                </div>

                <div className="col-span-2">

                  <span
                    className={`rounded-full px-3 py-1 text-xs font-medium ${
                      payment.paymentType === "Salary"
                        ? "bg-green-100 text-green-700"
                        : "bg-yellow-100 text-yellow-700"
                    }`}
                  >
                    {payment.paymentType}
                  </span>

                </div>

                <div className="col-span-2">
                  {payment.paymentMethod}
                </div>

                <div className="col-span-2">
                  {new Date(
                    payment.paymentDate
                  ).toLocaleDateString()}
                </div>

                <div className="col-span-2 flex justify-center gap-3">

                  <button
                    onClick={() => onEdit(payment)}
                    className="rounded-xl bg-blue-50 p-2 text-blue-600 hover:bg-blue-100"
                  >
                    <Pencil size={18} />
                  </button>

                  <button
                    onClick={() => onDelete(payment._id)}
                    className="rounded-xl bg-red-50 p-2 text-red-600 hover:bg-red-100"
                  >
                    <Trash2 size={18} />
                  </button>

                </div>

              </div>

            ))}

          </div>
        </div>
      </div>

      {/* ================= Mobile Cards ================= */}

      <div className="grid gap-4 lg:hidden">

        {filteredPayments.map((payment) => (

          <div
            key={payment._id}
            className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm"
          >

            <div className="flex items-start justify-between">

              <div>

                <h3 className="text-lg font-bold text-slate-800">
                  {payment.worker?.name}
                </h3>

                <p className="mt-1 text-lg font-semibold text-[#1E3A8A]">
                  Rs. {payment.amount}
                </p>

              </div>

              <span
                className={`rounded-full px-3 py-1 text-xs font-medium ${
                  payment.paymentType === "Salary"
                    ? "bg-green-100 text-green-700"
                    : "bg-yellow-100 text-yellow-700"
                }`}
              >
                {payment.paymentType}
              </span>

            </div>

            <div className="mt-5 space-y-2 text-sm">

              <div className="flex justify-between">
                <span className="text-slate-500">Method</span>
                <span>{payment.paymentMethod}</span>
              </div>

              <div className="flex justify-between">
                <span className="text-slate-500">Date</span>
                <span>
                  {new Date(
                    payment.paymentDate
                  ).toLocaleDateString()}
                </span>
              </div>

            </div>

            <div className="mt-6 flex gap-3">

              <button
                onClick={() => onEdit(payment)}
                className="flex-1 rounded-xl bg-blue-600 py-2 text-white hover:bg-blue-700"
              >
                Edit
              </button>

              <button
                onClick={() => onDelete(payment._id)}
                className="flex-1 rounded-xl bg-red-600 py-2 text-white hover:bg-red-700"
              >
                Delete
              </button>

            </div>

          </div>

        ))}

      </div>
    </>
  );
}

export default PaymentTable;