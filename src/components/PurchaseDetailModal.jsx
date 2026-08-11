import React from "react";
import {
  ExternalLink,
  X,
  FileText,
  CalendarDays,
  Phone,
  Building2,
  Package,
  CreditCard,
  Pencil,
  Ban,
} from "lucide-react";

const PurchaseDetailModal = ({
  isOpen,
  onClose,
  purchase,
  onEdit,
  onCancelPrompt,
}) => {
  if (!isOpen || !purchase) return null;

  const formatCurrency = (amount) => {
    return Number(amount || 0).toLocaleString("en-PK");
  };

  const formatDate = (date) => {
    if (!date) return "—";

    const parsedDate = new Date(date);

    if (Number.isNaN(parsedDate.getTime())) {
      return "—";
    }

    return parsedDate.toLocaleDateString("en-PK", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    });
  };

  const getStatusBadge = (status) => {
    switch (status) {
      case "Paid":
        return (
          <span className="inline-flex shrink-0 items-center rounded-full border border-emerald-200 bg-emerald-50 px-2.5 py-1 text-[10px] font-semibold text-emerald-700 sm:px-3 sm:text-xs">
            Paid
          </span>
        );

      case "Partial":
        return (
          <span className="inline-flex shrink-0 items-center rounded-full border border-amber-200 bg-amber-50 px-2.5 py-1 text-[10px] font-semibold text-amber-700 sm:px-3 sm:text-xs">
            Partial
          </span>
        );

      default:
        return (
          <span className="inline-flex shrink-0 items-center rounded-full border border-red-200 bg-red-50 px-2.5 py-1 text-[10px] font-semibold text-red-700 sm:px-3 sm:text-xs">
            Unpaid
          </span>
        );
    }
  };

  const items = Array.isArray(purchase.items)
    ? purchase.items
    : [];

  return (
    <div className="fixed inset-0 z-[100] flex items-start justify-center overflow-y-auto bg-slate-950/50 p-2.5 backdrop-blur-sm sm:items-center sm:p-4">
      <div
        className="
          flex
          max-h-[94vh]
          w-full
          max-w-3xl
          flex-col
          overflow-hidden
          rounded-2xl
          border
          border-slate-200
          bg-white
          shadow-2xl
          sm:max-h-[92vh]
          sm:rounded-3xl
        "
      >
        {/* =====================================================
            HEADER
        ===================================================== */}

        <div className="flex shrink-0 items-start justify-between gap-3 border-b border-slate-200 bg-slate-50/80 px-4 py-3.5 sm:items-center sm:px-6 sm:py-4">
          <div className="min-w-0 flex-1">
            <div className="flex min-w-0 flex-wrap items-center gap-2">
              <h3 className="min-w-0 truncate text-sm font-bold text-slate-800 sm:text-lg">
                Purchase Order #{purchase.invoiceNumber || "—"}
              </h3>

              {getStatusBadge(purchase.paymentStatus)}
            </div>

            <p className="mt-1 text-[10px] text-slate-500 sm:text-xs">
              Purchase record and payment details
            </p>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="shrink-0 rounded-xl p-1.5 text-slate-400 transition hover:bg-slate-200 hover:text-slate-700"
            aria-label="Close purchase details"
          >
            <X size={19} />
          </button>
        </div>

        {/* =====================================================
            SCROLLABLE CONTENT
        ===================================================== */}

        <div className="min-h-0 flex-1 overflow-y-auto">
          <div className="space-y-5 p-4 sm:space-y-6 sm:p-6">
            {/* =================================================
                VENDOR / GENERAL INFORMATION
            ================================================= */}

            <section>
              <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
                {/* Vendor */}

                <div className="rounded-2xl border border-slate-200 bg-slate-50 p-3.5 sm:p-4">
                  <div className="mb-2 flex items-center gap-2">
                    <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-white text-[#1E3A8A] shadow-sm">
                      <Building2 size={16} />
                    </div>

                    <p className="text-[10px] font-semibold uppercase tracking-wide text-slate-400 sm:text-xs">
                      Vendor
                    </p>
                  </div>

                  <p className="truncate text-sm font-bold text-slate-900">
                    {purchase.vendor?.name || "—"}
                  </p>

                  <p className="mt-0.5 truncate text-xs text-slate-500">
                    {purchase.vendor?.companyName || "No company"}
                  </p>
                </div>

                {/* Date */}

                <div className="rounded-2xl border border-slate-200 bg-slate-50 p-3.5 sm:p-4">
                  <div className="mb-2 flex items-center gap-2">
                    <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-white text-[#1E3A8A] shadow-sm">
                      <CalendarDays size={16} />
                    </div>

                    <p className="text-[10px] font-semibold uppercase tracking-wide text-slate-400 sm:text-xs">
                      Purchase Date
                    </p>
                  </div>

                  <p className="text-sm font-bold text-slate-800">
                    {formatDate(purchase.purchaseDate)}
                  </p>
                </div>

                {/* Phone */}

                <div className="rounded-2xl border border-slate-200 bg-slate-50 p-3.5 sm:p-4">
                  <div className="mb-2 flex items-center gap-2">
                    <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-white text-[#1E3A8A] shadow-sm">
                      <Phone size={16} />
                    </div>

                    <p className="text-[10px] font-semibold uppercase tracking-wide text-slate-400 sm:text-xs">
                      Vendor Phone
                    </p>
                  </div>

                  <p className="break-all text-sm font-bold text-slate-800">
                    {purchase.vendor?.phone || "—"}
                  </p>
                </div>
              </div>
            </section>

            {/* =================================================
                PURCHASED ITEMS
            ================================================= */}

            <section>
              <div className="mb-3 flex items-center justify-between">
                <div>
                  <h4 className="text-sm font-bold text-slate-800 sm:text-base">
                    Purchased Items
                  </h4>

                  <p className="mt-0.5 text-[10px] text-slate-400 sm:text-xs">
                    {items.length}{" "}
                    {items.length === 1 ? "item" : "items"} in this purchase
                  </p>
                </div>

                <Package
                  size={18}
                  className="text-slate-400"
                />
              </div>

              {/* =================================================
                  DESKTOP TABLE
              ================================================= */}

              <div className="hidden overflow-hidden rounded-2xl border border-slate-200 sm:block">
                <div className="overflow-x-auto">
                  <table className="w-full min-w-[600px] border-collapse text-left">
                    <thead>
                      <tr className="border-b border-slate-200 bg-slate-50 text-xs font-semibold text-slate-500">
                        <th className="px-4 py-3">
                          Product
                        </th>

                        <th className="px-4 py-3">
                          Qty
                        </th>

                        <th className="px-4 py-3">
                          Rate
                        </th>

                        <th className="px-4 py-3 text-right">
                          Line Total
                        </th>
                      </tr>
                    </thead>

                    <tbody className="divide-y divide-slate-100">
                      {items.length > 0 ? (
                        items.map((item, idx) => {
                          const quantity =
                            Number(item.quantity) || 0;

                          const rate =
                            Number(item.rate) || 0;

                          const lineTotal =
                            Number(item.lineTotal) ||
                            quantity * rate;

                          return (
                            <tr
                              key={idx}
                              className="text-xs text-slate-700"
                            >
                              <td className="px-4 py-3">
                                <p className="font-semibold text-slate-800">
                                  {item.product?.productName ||
                                    item.productName ||
                                    "—"}
                                </p>

                                {item.product?.productCode && (
                                  <p className="mt-0.5 text-[10px] text-slate-400">
                                    {item.product.productCode}
                                  </p>
                                )}
                              </td>

                              <td className="px-4 py-3 font-medium">
                                {quantity}
                              </td>

                              <td className="px-4 py-3">
                                PKR {formatCurrency(rate)}
                              </td>

                              <td className="px-4 py-3 text-right font-bold text-slate-900">
                                PKR {formatCurrency(lineTotal)}
                              </td>
                            </tr>
                          );
                        })
                      ) : (
                        <tr>
                          <td
                            colSpan={4}
                            className="px-4 py-8 text-center text-xs text-slate-400"
                          >
                            No purchased items found.
                          </td>
                        </tr>
                      )}
                    </tbody>
                  </table>
                </div>
              </div>

              {/* =================================================
                  MOBILE ITEM CARDS
              ================================================= */}

              <div className="space-y-3 sm:hidden">
                {items.length > 0 ? (
                  items.map((item, idx) => {
                    const quantity =
                      Number(item.quantity) || 0;

                    const rate =
                      Number(item.rate) || 0;

                    const lineTotal =
                      Number(item.lineTotal) ||
                      quantity * rate;

                    return (
                      <div
                        key={idx}
                        className="rounded-2xl border border-slate-200 bg-slate-50/60 p-3.5"
                      >
                        {/* Product */}

                        <div className="flex items-start justify-between gap-3">
                          <div className="min-w-0">
                            <p className="text-sm font-bold text-slate-800">
                              {item.product?.productName ||
                                item.productName ||
                                "—"}
                            </p>

                            {item.product?.productCode && (
                              <p className="mt-0.5 text-[10px] text-slate-400">
                                Code: {item.product.productCode}
                              </p>
                            )}
                          </div>

                          <span className="shrink-0 rounded-lg bg-white px-2 py-1 text-[10px] font-semibold text-slate-500">
                            Item {idx + 1}
                          </span>
                        </div>

                        {/* Details */}

                        <div className="mt-3 grid grid-cols-3 gap-2">
                          <div className="rounded-xl bg-white p-2.5">
                            <p className="text-[9px] font-medium uppercase tracking-wide text-slate-400">
                              Qty
                            </p>

                            <p className="mt-0.5 text-xs font-bold text-slate-800">
                              {quantity}
                            </p>
                          </div>

                          <div className="rounded-xl bg-white p-2.5">
                            <p className="text-[9px] font-medium uppercase tracking-wide text-slate-400">
                              Rate
                            </p>

                            <p className="mt-0.5 truncate text-xs font-bold text-slate-800">
                              PKR {formatCurrency(rate)}
                            </p>
                          </div>

                          <div className="rounded-xl bg-white p-2.5">
                            <p className="text-[9px] font-medium uppercase tracking-wide text-slate-400">
                              Total
                            </p>

                            <p className="mt-0.5 truncate text-xs font-bold text-[#1E3A8A]">
                              PKR {formatCurrency(lineTotal)}
                            </p>
                          </div>
                        </div>
                      </div>
                    );
                  })
                ) : (
                  <div className="rounded-2xl border border-dashed border-slate-200 p-6 text-center text-xs text-slate-400">
                    No purchased items found.
                  </div>
                )}
              </div>
            </section>

            {/* =================================================
                PAYMENT SUMMARY CARDS
            ================================================= */}

            <section>
              <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
                {/* Total */}

                <div className="rounded-2xl border border-blue-100 bg-blue-50/60 p-3.5 sm:p-4">
                  <div className="flex items-center justify-between">
                    <p className="text-[10px] font-semibold uppercase tracking-wide text-slate-500 sm:text-xs">
                      Total Amount
                    </p>

                    <CreditCard
                      size={16}
                      className="text-[#1E3A8A]"
                    />
                  </div>

                  <p className="mt-2 text-lg font-bold text-[#1E3A8A] sm:text-xl">
                    PKR {formatCurrency(purchase.totalAmount)}
                  </p>
                </div>

                {/* Paid */}

                <div className="rounded-2xl border border-emerald-100 bg-emerald-50/60 p-3.5 sm:p-4">
                  <p className="text-[10px] font-semibold uppercase tracking-wide text-slate-500 sm:text-xs">
                    Paid Amount
                  </p>

                  <p className="mt-2 text-lg font-bold text-emerald-600 sm:text-xl">
                    PKR {formatCurrency(purchase.paidAmount)}
                  </p>
                </div>

                {/* Remaining */}

                <div className="rounded-2xl border border-red-100 bg-red-50/60 p-3.5 sm:p-4">
                  <p className="text-[10px] font-semibold uppercase tracking-wide text-slate-500 sm:text-xs">
                    Remaining Balance
                  </p>

                  <p className="mt-2 text-lg font-bold text-red-600 sm:text-xl">
                    PKR {formatCurrency(
                      purchase.remainingBalance
                    )}
                  </p>
                </div>
              </div>
            </section>

            {/* =================================================
                NOTES + BILL
            ================================================= */}

            <section className="grid grid-cols-1 gap-3 sm:grid-cols-2">
              {/* Notes */}

              <div className="min-w-0 rounded-2xl border border-slate-200 bg-slate-50 p-3.5 sm:p-4">
                <p className="text-[10px] font-semibold uppercase tracking-wide text-slate-400 sm:text-xs">
                  Notes / Remarks
                </p>

                <p className="mt-2 break-words text-xs leading-5 text-slate-700 sm:text-sm">
                  {purchase.notes ||
                    "No remarks recorded."}
                </p>
              </div>

              {/* Bill */}

              <div className="rounded-2xl border border-slate-200 bg-slate-50 p-3.5 sm:p-4">
                <p className="mb-2 text-[10px] font-semibold uppercase tracking-wide text-slate-400 sm:text-xs">
                  Attached Bill
                </p>

                {purchase.bill?.url ? (
                  <a
                    href={purchase.bill.url}
                    target="_blank"
                    rel="noreferrer"
                    className="flex w-full items-center justify-center gap-2 rounded-xl border border-slate-200 bg-white px-3 py-2.5 text-xs font-semibold text-[#1E3A8A] transition hover:bg-slate-100"
                  >
                    <FileText size={15} />

                    <span className="truncate">
                      View Attached Bill
                    </span>

                    <ExternalLink
                      size={12}
                      className="shrink-0"
                    />
                  </a>
                ) : (
                  <div className="flex items-center gap-2 rounded-xl border border-dashed border-slate-200 bg-white px-3 py-2.5 text-xs text-slate-400">
                    <FileText size={15} />

                    <span>
                      No bill attached
                    </span>
                  </div>
                )}
              </div>
            </section>
          </div>
        </div>

        {/* =====================================================
            FOOTER ACTIONS
        ===================================================== */}

        <div className="shrink-0 border-t border-slate-200 bg-white px-4 py-3 sm:px-6 sm:py-4">
          {/* Cancel Purchase */}

          <button
            type="button"
            onClick={() => {
              onClose();
              onCancelPrompt(purchase);
            }}
            className="mb-2.5 flex w-full items-center justify-center gap-1.5 rounded-xl px-3 py-2.5 text-xs font-semibold text-red-600 transition hover:bg-red-50 sm:mb-0 sm:w-auto sm:justify-start"
          >
            <Ban size={14} />
            Cancel Purchase
          </button>

          {/* Main Actions */}

          <div className="flex w-full gap-2 sm:absolute sm:bottom-auto sm:right-auto sm:mt-[-42px] sm:justify-end">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 rounded-xl border border-slate-200 px-4 py-2.5 text-xs font-medium text-slate-600 transition hover:bg-slate-50 sm:flex-none sm:px-5"
            >
              Close
            </button>

            <button
              type="button"
              onClick={() => {
                onClose();
                onEdit(purchase);
              }}
              className="flex flex-1 items-center justify-center gap-1.5 rounded-xl bg-[#1E3A8A] px-4 py-2.5 text-xs font-medium text-white transition hover:bg-blue-900 sm:flex-none sm:px-5"
            >
              <Pencil size={13} />
              Edit Purchase
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PurchaseDetailModal;