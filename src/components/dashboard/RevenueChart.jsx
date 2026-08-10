import {
  DollarSign,
  WalletCards,
} from "lucide-react";

function RevenueChart({ dashboard }) {
  // ============================================================
  // SAFE DASHBOARD CHECK
  // ============================================================

  if (!dashboard || typeof dashboard !== "object") {
    return (
      <div className="rounded-2xl border border-slate-200 bg-white">
        <div className="flex h-48 items-center justify-center text-sm text-slate-400">
          Dashboard data unavailable.
        </div>
      </div>
    );
  }

  // ============================================================
  // SAFE NUMBER HELPER
  // Handles:
  // undefined
  // null
  // ""
  // strings like "5000"
  // invalid strings
  // NaN
  // ============================================================

  const safeNumber = (value) => {
    if (
      value === null ||
      value === undefined ||
      value === ""
    ) {
      return 0;
    }

    const number = Number(value);

    return Number.isFinite(number)
      ? number
      : 0;
  };

  // ============================================================
  // SAFE STRING HELPER
  // Prevents rendering unexpected objects / undefined
  // ============================================================

  const safeString = (value, fallback = "") => {
    if (
      value === null ||
      value === undefined
    ) {
      return fallback;
    }

    if (typeof value === "string") {
      const trimmed = value.trim();

      return trimmed || fallback;
    }

    if (
      typeof value === "number" ||
      typeof value === "boolean"
    ) {
      return String(value);
    }

    return fallback;
  };

  // ============================================================
  // SAFE CURRENCY FORMATTER
  // IMPORTANT:
  // toLocaleString() is called ONLY after converting to a
  // guaranteed finite number.
  // ============================================================

  const formatCurrency = (value) => {
    const amount = safeNumber(value);

    return `Rs. ${amount.toLocaleString("en-PK", {
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    })}`;
  };

  // ============================================================
  // PAYMENTS
  // Prefer today's payments.
  // Fallback to recentPayments for backward compatibility.
  // ============================================================

  let payments = [];

  if (Array.isArray(dashboard.todayPayments)) {
    payments = dashboard.todayPayments;
  } else if (Array.isArray(dashboard.recentPayments)) {
    payments = dashboard.recentPayments;
  }

  // Make absolutely sure every item is an object.
  payments = payments.filter(
    (item) =>
      item !== null &&
      typeof item === "object" &&
      !Array.isArray(item)
  );

  // ============================================================
  // TOTAL PAYMENT
  // ============================================================

  const dashboardTotal = safeNumber(
    dashboard.todayPaymentTotal
  );

  const calculatedTotal = payments.reduce(
    (sum, item) => {
      return (
        sum +
        safeNumber(item?.amount)
      );
    },
    0
  );

  const total =
    dashboard.todayPaymentTotal !== undefined &&
    dashboard.todayPaymentTotal !== null &&
    dashboard.todayPaymentTotal !== ""
      ? dashboardTotal
      : calculatedTotal;

  // ============================================================
  // RENDER
  // ============================================================

  return (
    <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">

      {/* ======================================================
          HEADER
      ====================================================== */}

      <div className="flex flex-col gap-4 border-b border-slate-100 px-6 py-5 sm:flex-row sm:items-center sm:justify-between">

        <div className="flex min-w-0 items-center gap-3">

          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border border-blue-100 bg-blue-50 text-blue-600">
            <WalletCards size={20} />
          </div>

          <div className="min-w-0">

            <h2 className="truncate text-lg font-bold text-slate-900">
              Today's Payments
            </h2>

            <p className="mt-1 text-sm text-slate-500">
              Salary payments processed today
            </p>

          </div>
        </div>

        {/* TOTAL */}

        <div className="shrink-0 rounded-xl border border-blue-100 bg-blue-50 px-4 py-3 text-right">

          <p className="text-xs font-medium text-slate-500">
            Total Paid
          </p>

          <p className="mt-1 whitespace-nowrap text-lg font-bold text-slate-900">
            {formatCurrency(total)}
          </p>

        </div>

      </div>

      {/* ======================================================
          PAYMENT LIST
      ====================================================== */}

      <div className="max-h-[300px] divide-y divide-slate-100 overflow-y-auto">

        {payments.length === 0 ? (

          /* EMPTY STATE */

          <div className="flex h-48 flex-col items-center justify-center px-6 text-center">

            <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-slate-100 text-slate-400">
              <DollarSign size={20} />
            </div>

            <p className="mt-3 text-sm font-medium text-slate-600">
              No payments made today.
            </p>

            <p className="mt-1 text-xs text-slate-400">
              Today's salary payments will appear here.
            </p>

          </div>

        ) : (

          payments.map((item, index) => {

            // ==================================================
            // WORKER NAME
            // ==================================================

            const workerName =
              safeString(
                item?.worker?.name
              ) ||
              safeString(
                item?.workerName
              ) ||
              safeString(
                item?.name
              ) ||
              "Unknown Worker";

            // ==================================================
            // AMOUNT
            // ==================================================

            const amount = safeNumber(
              item?.amount
            );

            // ==================================================
            // PAYMENT TYPE
            // ==================================================

            const paymentType =
              safeString(
                item?.paymentType
              ) ||
              safeString(
                item?.type
              ) ||
              "Salary";

            // ==================================================
            // DATE
            // ==================================================

            const paymentDate =
              item?.paymentDate ||
              item?.date ||
              null;

            // ==================================================
            // SAFE KEY
            // ==================================================

            const paymentKey =
              safeString(item?._id) ||
              `${workerName}-${paymentDate || index}-${index}`;

            return (
              <div
                key={paymentKey}
                className="flex items-center justify-between gap-4 px-6 py-4 transition-colors hover:bg-slate-50"
              >

                {/* LEFT */}

                <div className="flex min-w-0 items-center gap-4">

                  <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl border border-blue-100 bg-blue-50 text-blue-600">
                    <DollarSign size={20} />
                  </div>

                  <div className="min-w-0">

                    <h3 className="truncate font-semibold text-slate-900">
                      {workerName}
                    </h3>

                    <p className="mt-0.5 truncate text-sm capitalize text-slate-500">
                      {paymentType}
                    </p>

                  </div>

                </div>

                {/* RIGHT */}

                <span className="shrink-0 whitespace-nowrap text-sm font-bold text-emerald-600">
                  {formatCurrency(amount)}
                </span>

              </div>
            );
          })
        )}

      </div>

    </div>
  );
}

export default RevenueChart;