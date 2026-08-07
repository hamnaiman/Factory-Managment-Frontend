import { ArrowDownCircle, ArrowUpCircle } from "lucide-react";

function ClientLedger({ ledger = [] }) {
  if (!ledger.length) {
    return (
      <div className="rounded-3xl border border-slate-200 bg-white p-10 text-center shadow-sm">
        No transaction history found.
      </div>
    );
  }

  return (
    <>
      {/* ================= Desktop Table ================= */}

      <div className="hidden lg:block">
        <div className="overflow-x-auto rounded-3xl border border-slate-200 bg-white shadow-sm">
          <div className="min-w-[1000px]">

            <div className="grid grid-cols-12 bg-slate-50 px-6 py-4 font-semibold text-slate-700">

              <div className="col-span-2">Date</div>

              <div className="col-span-3">Description</div>

              <div className="col-span-2">Type</div>

              <div className="col-span-2">Debit</div>

              <div className="col-span-2">Credit</div>

              <div className="col-span-1">Balance</div>

            </div>

            {ledger.map((item) => (
              <div
                key={item._id}
                className="grid grid-cols-12 items-center border-t border-slate-100 px-6 py-5 hover:bg-slate-50"
              >
                <div className="col-span-2">
                  {new Date(item.date).toLocaleDateString()}
                </div>

                <div className="col-span-3 font-medium">
                  {item.description}
                </div>

                <div className="col-span-2">

                  <span
                    className={`inline-flex items-center gap-2 rounded-full px-3 py-1 text-xs font-semibold ${
                      item.type === "payment"
                        ? "bg-green-100 text-green-700"
                        : "bg-blue-100 text-blue-700"
                    }`}
                  >
                    {item.type === "payment" ? (
                      <ArrowDownCircle size={14} />
                    ) : (
                      <ArrowUpCircle size={14} />
                    )}

                    {item.type === "payment" ? "Payment" : "Sale"}

                  </span>

                </div>

                <div className="col-span-2 font-semibold text-red-600">
                  {item.debit ? `Rs. ${item.debit}` : "-"}
                </div>

                <div className="col-span-2 font-semibold text-green-600">
                  {item.credit ? `Rs. ${item.credit}` : "-"}
                </div>

                <div className="col-span-1 font-bold">
                  Rs. {item.balance}
                </div>

              </div>
            ))}

          </div>
        </div>
      </div>

      {/* ================= Mobile Cards ================= */}

      <div className="grid gap-4 lg:hidden">

        {ledger.map((item) => (

          <div
            key={item._id}
            className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm"
          >

            <div className="flex items-center justify-between">

              <h3 className="font-semibold">
                {item.description}
              </h3>

              <span
                className={`rounded-full px-3 py-1 text-xs font-semibold ${
                  item.type === "payment"
                    ? "bg-green-100 text-green-700"
                    : "bg-blue-100 text-blue-700"
                }`}
              >
                {item.type === "payment" ? "Payment" : "Sale"}
              </span>

            </div>

            <div className="mt-4 space-y-2 text-sm">

              <div className="flex justify-between">
                <span className="text-slate-500">Date</span>
                <span>{new Date(item.date).toLocaleDateString()}</span>
              </div>

              <div className="flex justify-between">
                <span className="text-slate-500">Debit</span>
                <span className="font-semibold text-red-600">
                  {item.debit ? `Rs. ${item.debit}` : "-"}
                </span>
              </div>

              <div className="flex justify-between">
                <span className="text-slate-500">Credit</span>
                <span className="font-semibold text-green-600">
                  {item.credit ? `Rs. ${item.credit}` : "-"}
                </span>
              </div>

              <div className="flex justify-between">
                <span className="text-slate-500">Balance</span>
                <span className="font-bold">
                  Rs. {item.balance}
                </span>
              </div>

            </div>

          </div>

        ))}

      </div>
    </>
  );
}

export default ClientLedger;