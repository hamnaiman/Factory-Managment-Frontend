import React, { useState } from "react";
import {
  Eye,
  Edit3,
  Trash2,
  Printer,
  CheckCircle,
  AlertCircle,
  Clock,
} from "lucide-react";

const SaleTable = ({
  sales,
  search,
  onEdit,
  onDelete,
  onPrintInvoice,
  onMarkAsPaid,
}) => {
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 8;

  // Search filter logic
  const filteredSales = sales.filter((sale) => {
    const invoiceNo = String(
      sale.invoiceNumber || sale._id || ""
    ).toLowerCase();

    const clientName = String(
      sale.client?.clientName || sale.client?.name || ""
    ).toLowerCase();

    const query = search.toLowerCase();

    return invoiceNo.includes(query) || clientName.includes(query);
  });

  // Pagination logic
  const totalPages = Math.ceil(filteredSales.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const currentSales = filteredSales.slice(
    startIndex,
    startIndex + itemsPerPage
  );

  const getStatusBadge = (sale) => {
    const status = sale.paymentStatus || sale.status || "Unpaid";
    const isPaid =
      status.toLowerCase() === "paid" ||
      sale.paidAmount >= sale.grandTotal;

    if (isPaid) {
      return (
        <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-bold bg-emerald-100 text-emerald-800 border border-emerald-300">
          <CheckCircle className="w-3.5 h-3.5" />
          PAID
        </span>
      );
    } else if (status.toLowerCase() === "partial") {
      return (
        <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-bold bg-amber-100 text-amber-800 border border-amber-300">
          <Clock className="w-3.5 h-3.5" />
          PARTIAL
        </span>
      );
    } else {
      return (
        <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-bold bg-rose-100 text-rose-800 border border-rose-300">
          <AlertCircle className="w-3.5 h-3.5" />
          UNPAID
        </span>
      );
    }
  };

  return (
    <div className="rounded-2xl border border-slate-200 bg-white shadow-sm overflow-hidden">

      {/* =====================================================
          DESKTOP / TABLET TABLE
          ===================================================== */}
      <div className="hidden sm:block overflow-x-auto">
        <table className="w-full text-left text-sm">
          <thead className="border-b border-slate-200 bg-white">
            <tr>
              <th className="px-6 py-5 text-left text-sm font-bold uppercase tracking-wide text-slate-500">
                Invoice #
              </th>

              <th className="px-6 py-5 text-left text-sm font-bold uppercase tracking-wide text-slate-500">
                Client Name
              </th>

              <th className="px-6 py-5 text-left text-sm font-bold uppercase tracking-wide text-slate-500">
                Date
              </th>

              <th className="px-6 py-5 text-left text-sm font-bold uppercase tracking-wide text-slate-500">
                Grand Total
              </th>

              <th className="px-6 py-5 text-left text-sm font-bold uppercase tracking-wide text-slate-500">
                Paid
              </th>

              <th className="px-6 py-5 text-left text-sm font-bold uppercase tracking-wide text-slate-500">
                Balance Due
              </th>

              <th className="px-6 py-5 text-left text-sm font-bold uppercase tracking-wide text-slate-500">
                Payment Status
              </th>

              <th className="px-6 py-5 text-left text-sm font-bold uppercase tracking-wide text-slate-500">
                Actions
              </th>
            </tr>
          </thead>

          <tbody className="divide-y divide-slate-200 text-slate-700">
            {currentSales.length > 0 ? (
              currentSales.map((sale) => {
                const total = sale.grandTotal || 0;
                const paid = sale.paidAmount || 0;

                const due =
                  sale.remainingBalance ??
                  sale.dueAmount ??
                  Math.max(0, total - paid);

                const isPaid =
                  (sale.paymentStatus || sale.status || "").toLowerCase() ===
                    "paid" || paid >= total;

                return (
                  <tr
                    key={sale._id}
                    className="transition hover:bg-slate-50"
                  >
                    <td className="px-6 py-6 font-bold text-blue-900">
                      #{sale.invoiceNumber || sale._id?.slice(-8)}
                    </td>

                    <td className="px-6 py-6 font-semibold text-slate-900">
                      {sale.client?.clientName ||
                        sale.client?.name ||
                        "Walk-in Customer"}
                    </td>

                    <td className="px-6 py-6 text-slate-500">
                      {new Date(
                        sale.createdAt || sale.invoiceDate
                      ).toLocaleDateString()}
                    </td>

                    <td className="px-6 py-6 text-right font-semibold text-slate-900">
                      Rs. {Number(total).toLocaleString()}
                    </td>

                    <td className="px-6 py-6 text-right font-semibold text-green-600">
                      Rs. {Number(paid).toLocaleString()}
                    </td>

                    <td className="px-6 py-6 text-right font-semibold text-red-600">
                      Rs. {Number(due).toLocaleString()}
                    </td>

                    {/* Status */}
                    <td className="px-6 py-6 text-center">
                      <div className="flex flex-col items-center justify-center gap-1.5">
                        {getStatusBadge(sale)}

                        {!isPaid && onMarkAsPaid && (
                          <button
                            onClick={() => onMarkAsPaid(sale)}
                            className="px-2.5 py-1 text-[11px] font-bold text-white bg-emerald-600 hover:bg-emerald-700 rounded-lg shadow-xs transition cursor-pointer"
                            title="Click to mark this sale as fully paid"
                          >
                            Mark Paid
                          </button>
                        )}
                      </div>
                    </td>

                    {/* Actions */}
                    <td className="px-6 py-6 text-center">
                      <div className="flex items-center justify-center gap-1.5">
                        <button
                          onClick={() => onPrintInvoice(sale)}
                          disabled={isPaid}
                          className={`p-2 rounded-lg transition ${
                            isPaid
                              ? "text-slate-300 cursor-not-allowed"
                              : "text-slate-500 hover:text-blue-600 hover:bg-blue-50"
                          }`}
                          title={
                            isPaid
                              ? "Invoice disabled for paid sales"
                              : "Print Invoice"
                          }
                        >
                          <Printer size={16} />
                        </button>

                        <button
                          onClick={() => onEdit(sale)}
                          className="p-2 rounded-lg text-slate-500 hover:bg-amber-50 hover:text-amber-600 transition"
                          title="Edit Sale"
                        >
                          <Edit3 size={16} />
                        </button>

                        <button
                          onClick={() => onDelete(sale._id)}
                          className="p-2 rounded-lg text-slate-500 hover:bg-red-50 hover:text-red-600 transition"
                          title="Delete Sale"
                        >
                          <Trash2 size={16} />
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })
            ) : (
              <tr>
                <td
                  colSpan="8"
                  className="p-8 text-center text-slate-400 italic"
                >
                  No sales records found.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* =====================================================
          MOBILE CARDS
          ===================================================== */}
      <div className="block sm:hidden">
        {currentSales.length > 0 ? (
          <div className="divide-y divide-slate-200">
            {currentSales.map((sale) => {
              const total = sale.grandTotal || 0;
              const paid = sale.paidAmount || 0;

              const due =
                sale.remainingBalance ??
                sale.dueAmount ??
                Math.max(0, total - paid);

              const isPaid =
                (sale.paymentStatus || sale.status || "").toLowerCase() ===
                  "paid" || paid >= total;

              return (
                <div
                  key={sale._id}
                  className="p-4 bg-white hover:bg-slate-50 transition"
                >
                  {/* Card Header */}
                  <div className="flex items-start justify-between gap-3">
                    <div className="min-w-0">
                      <p className="text-xs font-semibold text-slate-400 uppercase tracking-wide">
                        Invoice
                      </p>

                      <p className="mt-0.5 text-base font-bold text-blue-900 truncate">
                        #{sale.invoiceNumber || sale._id?.slice(-8)}
                      </p>
                    </div>

                    <div className="shrink-0">
                      {getStatusBadge(sale)}
                    </div>
                  </div>

                  {/* Client */}
                  <div className="mt-4">
                    <p className="text-xs font-medium text-slate-400">
                      Client
                    </p>

                    <p className="mt-0.5 text-sm font-semibold text-slate-900 break-words">
                      {sale.client?.clientName ||
                        sale.client?.name ||
                        "Walk-in Customer"}
                    </p>
                  </div>

                  {/* Date */}
                  <div className="mt-3">
                    <p className="text-xs font-medium text-slate-400">
                      Date
                    </p>

                    <p className="mt-0.5 text-sm text-slate-600">
                      {new Date(
                        sale.createdAt || sale.invoiceDate
                      ).toLocaleDateString()}
                    </p>
                  </div>

                  {/* Financial Summary */}
                  <div className="grid grid-cols-3 gap-2 mt-4">
                    <div className="rounded-xl bg-slate-50 border border-slate-100 p-3 min-w-0">
                      <p className="text-[10px] font-semibold uppercase text-slate-400">
                        Total
                      </p>

                      <p className="mt-1 text-sm font-bold text-slate-900 break-words">
                        Rs. {Number(total).toLocaleString()}
                      </p>
                    </div>

                    <div className="rounded-xl bg-emerald-50 border border-emerald-100 p-3 min-w-0">
                      <p className="text-[10px] font-semibold uppercase text-emerald-600">
                        Paid
                      </p>

                      <p className="mt-1 text-sm font-bold text-emerald-700 break-words">
                        Rs. {Number(paid).toLocaleString()}
                      </p>
                    </div>

                    <div className="rounded-xl bg-rose-50 border border-rose-100 p-3 min-w-0">
                      <p className="text-[10px] font-semibold uppercase text-rose-600">
                        Due
                      </p>

                      <p className="mt-1 text-sm font-bold text-rose-700 break-words">
                        Rs. {Number(due).toLocaleString()}
                      </p>
                    </div>
                  </div>

                  {/* Mark Paid */}
                  {!isPaid && onMarkAsPaid && (
                    <button
                      onClick={() => onMarkAsPaid(sale)}
                      className="mt-4 w-full h-10 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold transition cursor-pointer"
                    >
                      Mark as Paid
                    </button>
                  )}

                  {/* Actions */}
                  <div className="flex items-center justify-end gap-2 mt-4 pt-3 border-t border-slate-100">
                    <button
                      onClick={() => onPrintInvoice(sale)}
                      disabled={isPaid}
                      className={`flex items-center justify-center gap-1.5 px-3 py-2 rounded-xl text-xs font-semibold transition ${
                        isPaid
                          ? "text-slate-300 bg-slate-50 cursor-not-allowed"
                          : "text-blue-600 bg-blue-50 hover:bg-blue-100"
                      }`}
                      title={
                        isPaid
                          ? "Invoice disabled for paid sales"
                          : "Print Invoice"
                      }
                    >
                      <Printer size={15} />
                      Print
                    </button>

                    <button
                      onClick={() => onEdit(sale)}
                      className="flex items-center justify-center gap-1.5 px-3 py-2 rounded-xl text-xs font-semibold text-amber-600 bg-amber-50 hover:bg-amber-100 transition"
                    >
                      <Edit3 size={15} />
                      Edit
                    </button>

                    <button
                      onClick={() => onDelete(sale._id)}
                      className="flex items-center justify-center gap-1.5 px-3 py-2 rounded-xl text-xs font-semibold text-red-600 bg-red-50 hover:bg-red-100 transition"
                    >
                      <Trash2 size={15} />
                      Delete
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        ) : (
          <div className="p-8 text-center text-slate-400 italic text-sm">
            No sales records found.
          </div>
        )}
      </div>

      {/* =====================================================
          PAGINATION
          ===================================================== */}
      {totalPages > 1 && (
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 border-t border-slate-200 bg-white px-4 sm:px-6 py-4">
          <p className="text-xs text-slate-500 text-center sm:text-left">
            Showing{" "}
            <span className="font-semibold">{startIndex + 1}</span> to{" "}
            <span className="font-semibold">
              {Math.min(
                startIndex + itemsPerPage,
                filteredSales.length
              )}
            </span>{" "}
            of{" "}
            <span className="font-semibold">
              {filteredSales.length}
            </span>{" "}
            entries
          </p>

          <div className="flex items-center justify-center gap-2">
            <button
              onClick={() =>
                setCurrentPage((prev) => Math.max(prev - 1, 1))
              }
              disabled={currentPage === 1}
              className="px-3 py-1.5 text-xs font-medium rounded-lg border border-slate-200 disabled:opacity-40 transition cursor-pointer"
            >
              Previous
            </button>

            <span className="text-xs font-semibold px-2">
              {currentPage} / {totalPages}
            </span>

            <button
              onClick={() =>
                setCurrentPage((prev) =>
                  Math.min(prev + 1, totalPages)
                )
              }
              disabled={currentPage === totalPages}
              className="px-3 py-1.5 text-xs font-medium rounded-lg border border-slate-200 disabled:opacity-40 transition cursor-pointer"
            >
              Next
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default SaleTable;