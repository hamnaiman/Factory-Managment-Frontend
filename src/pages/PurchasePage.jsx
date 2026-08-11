import React, { useState, useEffect, useCallback } from "react";
import toast from "react-hot-toast";

import {
  Search,
  FileText,
  ExternalLink,
  Eye,
  Edit2,
  AlertCircle,
  CalendarDays,
  Building2,
  CreditCard,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";

import Sidebar from "../components/Sidebar";
import Navbar from "../components/Navbar";
import VendorSelect from "../components/VendorSelect";
import PurchaseModal from "../components/PurchaseModal";
import PurchaseDetailModal from "../components/PurchaseDetailModal";

import { purchaseService } from "../services/purchaseService";

const PurchasePage = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);

  // =====================================================
  // FILTERS & LIST DATA
  // =====================================================

  const [purchases, setPurchases] = useState([]);
  const [loading, setLoading] = useState(true);

  const [search, setSearch] = useState("");
  const [selectedVendor, setSelectedVendor] = useState("");
  const [paymentStatus, setPaymentStatus] = useState("");
  const [fromDate, setFromDate] = useState("");
  const [toDate, setToDate] = useState("");

  // =====================================================
  // PAGINATION
  // =====================================================

  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  // =====================================================
  // MODALS
  // =====================================================

  const [isFormOpen, setIsFormOpen] = useState(false);
  const [isDetailOpen, setIsDetailOpen] = useState(false);
  const [activePurchase, setActivePurchase] = useState(null);

  // =====================================================
  // FETCH PURCHASES
  // =====================================================

  const fetchPurchases = useCallback(async () => {
    setLoading(true);

    try {
      const res = await purchaseService.getPurchases({
        search,
        vendor: selectedVendor,
        paymentStatus,
        fromDate,
        toDate,
        page,
        limit: 15,
      });

      if (res.success) {
        setPurchases(res.data || []);

        if (res.pagination) {
          setTotalPages(res.pagination.totalPages || 1);
        }
      }
    } catch (error) {
      console.error("Failed to load purchases:", error);
      toast.error("Failed to load purchases");
    } finally {
      setLoading(false);
    }
  }, [
    search,
    selectedVendor,
    paymentStatus,
    fromDate,
    toDate,
    page,
  ]);

  useEffect(() => {
    const timer = setTimeout(() => {
      fetchPurchases();
    }, 300);

    return () => clearTimeout(timer);
  }, [fetchPurchases]);

  // =====================================================
  // RESET PAGE WHEN FILTER CHANGES
  // =====================================================

  useEffect(() => {
    setPage(1);
  }, [
    search,
    selectedVendor,
    paymentStatus,
    fromDate,
    toDate,
  ]);

  // =====================================================
  // CANCEL PURCHASE
  // =====================================================

  const handleCancelPrompt = (purchase) => {
    toast(
      (t) => (
        <div className="flex flex-col gap-3 p-1">
          <div className="flex items-start gap-2">
            <AlertCircle
              className="mt-0.5 shrink-0 text-red-600"
              size={18}
            />

            <div>
              <p className="text-xs font-bold text-slate-800">
                Cancel Purchase #{purchase.invoiceNumber}?
              </p>

              <p className="mt-1 text-xs leading-5 text-slate-600">
                This will reverse the stock added by this
                purchase. Continue?
              </p>
            </div>
          </div>

          <div className="flex justify-end gap-2 pt-1">
            <button
              onClick={() => toast.dismiss(t.id)}
              className="rounded-lg border border-slate-200 px-3 py-1.5 text-xs text-slate-600 transition hover:bg-slate-50"
            >
              No, keep it
            </button>

            <button
              onClick={async () => {
                toast.dismiss(t.id);

                try {
                  const res =
                    await purchaseService.cancelPurchase(
                      purchase._id
                    );

                  if (res.success) {
                    toast.success(
                      "Purchase cancelled & stock reversed"
                    );

                    fetchPurchases();
                  }
                } catch (error) {
                  const msg =
                    error?.response?.data?.message ||
                    "Cancellation failed";

                  toast.error(msg);
                }
              }}
              className="rounded-lg bg-red-600 px-3 py-1.5 text-xs font-medium text-white transition hover:bg-red-700"
            >
              Yes, Cancel
            </button>
          </div>
        </div>
      ),
      {
        duration: 8000,
        position: "top-center",
      }
    );
  };

  // =====================================================
  // STATUS BADGE
  // =====================================================

  const renderStatusBadge = (status) => {
    switch (status) {
      case "Paid":
        return (
          <span className="inline-flex items-center rounded-full border border-emerald-200 bg-emerald-50 px-2.5 py-1 text-[11px] font-semibold text-emerald-700">
            Paid
          </span>
        );

      case "Partial":
        return (
          <span className="inline-flex items-center rounded-full border border-amber-200 bg-amber-50 px-2.5 py-1 text-[11px] font-semibold text-amber-700">
            Partial
          </span>
        );

      default:
        return (
          <span className="inline-flex items-center rounded-full border border-red-200 bg-red-50 px-2.5 py-1 text-[11px] font-semibold text-red-700">
            Unpaid
          </span>
        );
    }
  };

  // =====================================================
  // FORMAT DATE
  // =====================================================

  const formatDate = (date) => {
    if (!date) return "—";

    return new Date(date).toLocaleDateString("en-PK", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    });
  };

  // =====================================================
  // OPEN DETAILS
  // =====================================================

  const handleViewPurchase = (purchase) => {
    setActivePurchase(purchase);
    setIsDetailOpen(true);
  };

  // =====================================================
  // OPEN EDIT
  // =====================================================

  const handleEditPurchase = (purchase) => {
    setActivePurchase(purchase);
    setIsFormOpen(true);
  };

  // =====================================================
  // OPEN NEW PURCHASE
  // =====================================================

  const handleNewPurchase = () => {
    setActivePurchase(null);
    setIsFormOpen(true);
  };

  return (
    <div className="flex min-h-screen overflow-x-hidden bg-slate-100">
      {/* =====================================================
          SIDEBAR
      ===================================================== */}

      <Sidebar
        isOpen={isSidebarOpen}
        setIsOpen={setIsSidebarOpen}
      />

      {/* =====================================================
          MAIN AREA
      ===================================================== */}

      <div
        className={`min-w-0 flex-1 transition-all duration-300 ease-in-out ${
          isSidebarOpen
            ? "ml-0 lg:ml-72"
            : "ml-0 lg:ml-20"
        }`}
      >
        <Navbar
          isSidebarOpen={isSidebarOpen}
          setIsSidebarOpen={setIsSidebarOpen}
        />

        <main className="mx-auto mt-20 w-full max-w-[1600px] space-y-4 px-3 pb-8 pt-4 sm:mt-24 sm:space-y-6 sm:px-5 sm:pt-2 lg:px-8">
          {/* =====================================================
              PAGE HEADER
          ===================================================== */}

          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div className="min-w-0">
              <h1 className="text-xl font-bold leading-tight text-slate-900 sm:text-2xl lg:text-3xl">
                Purchase Management
              </h1>

              <p className="mt-1 max-w-xl text-xs leading-5 text-slate-500 sm:text-sm">
                Record raw material purchases and auto-update
                stock.
              </p>
            </div>

            <button
              type="button"
              onClick={handleNewPurchase}
              className="flex h-11 w-full shrink-0 items-center justify-center rounded-xl bg-[#1E3A8A] px-5 text-sm font-semibold text-white shadow-sm transition hover:bg-blue-900 sm:h-12 sm:w-auto sm:rounded-2xl"
            >
              + Record Purchase
            </button>
          </div>

          {/* =====================================================
              FILTERS
          ===================================================== */}

          <section className="rounded-2xl border border-slate-200 bg-white p-3 shadow-sm sm:rounded-3xl sm:p-4">
            <div className="grid grid-cols-2 gap-2.5 sm:grid-cols-2 sm:gap-3 lg:grid-cols-5">
              {/* Search */}

              <div className="relative col-span-2 sm:col-span-1 lg:col-span-1">
                <Search
                  size={16}
                  className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
                />

                <input
                  type="text"
                  placeholder="Invoice #"
                  value={search}
                  onChange={(e) =>
                    setSearch(e.target.value)
                  }
                  className="h-10 w-full rounded-xl border border-slate-200 bg-white pl-9 pr-3 text-xs text-slate-700 outline-none transition placeholder:text-slate-400 focus:border-[#1E3A8A] focus:ring-2 focus:ring-[#1E3A8A]/10"
                />
              </div>

              {/* Vendor */}

              <div className="col-span-2 sm:col-span-1 lg:col-span-1">
                <VendorSelect
                  value={selectedVendor}
                  onChange={(val) =>
                    setSelectedVendor(val)
                  }
                  className="h-10 w-full text-xs"
                />
              </div>

              {/* Payment Status */}

              <div className="col-span-2 sm:col-span-1 lg:col-span-1">
                <select
                  value={paymentStatus}
                  onChange={(e) =>
                    setPaymentStatus(e.target.value)
                  }
                  className="h-10 w-full rounded-xl border border-slate-200 bg-white px-3 text-xs text-slate-700 outline-none transition focus:border-[#1E3A8A] focus:ring-2 focus:ring-[#1E3A8A]/10"
                >
                  <option value="">
                    All Payment Statuses
                  </option>
                  <option value="Paid">Paid</option>
                  <option value="Partial">Partial</option>
                  <option value="Unpaid">Unpaid</option>
                </select>
              </div>

              {/* From Date */}

              <div className="col-span-1 sm:col-span-1 lg:col-span-1">
                <input
                  type="date"
                  value={fromDate}
                  onChange={(e) =>
                    setFromDate(e.target.value)
                  }
                  className="h-10 w-full min-w-0 rounded-xl border border-slate-200 bg-white px-2.5 text-[11px] text-slate-700 outline-none transition focus:border-[#1E3A8A] focus:ring-2 focus:ring-[#1E3A8A]/10 sm:px-3 sm:text-xs"
                />
              </div>

              {/* To Date */}

              <div className="col-span-1 sm:col-span-1 lg:col-span-1">
                <input
                  type="date"
                  value={toDate}
                  onChange={(e) =>
                    setToDate(e.target.value)
                  }
                  className="h-10 w-full min-w-0 rounded-xl border border-slate-200 bg-white px-2.5 text-[11px] text-slate-700 outline-none transition focus:border-[#1E3A8A] focus:ring-2 focus:ring-[#1E3A8A]/10 sm:px-3 sm:text-xs"
                />
              </div>
            </div>
          </section>

          {/* =====================================================
              MOBILE / TABLET PURCHASE CARDS
              Hidden on large screens
          ===================================================== */}

          <div className="space-y-3 lg:hidden">
            {loading ? (
              <div className="rounded-2xl border border-slate-200 bg-white p-8 text-center shadow-sm">
                <div className="mx-auto mb-3 h-7 w-7 animate-spin rounded-full border-2 border-slate-200 border-t-[#1E3A8A]" />

                <p className="text-xs text-slate-400">
                  Loading purchases...
                </p>
              </div>
            ) : purchases.length === 0 ? (
              <div className="rounded-2xl border border-slate-200 bg-white p-8 text-center shadow-sm">
                <p className="text-sm font-medium text-slate-600">
                  No purchases found.
                </p>

                <p className="mt-1 text-xs text-slate-400">
                  Try changing your filters.
                </p>
              </div>
            ) : (
              purchases.map((p) => (
                <article
                  key={p._id}
                  className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm"
                >
                  {/* Card Header */}

                  <div className="flex items-start justify-between gap-3 border-b border-slate-100 px-4 py-3.5">
                    <div className="min-w-0">
                      <div className="flex flex-wrap items-center gap-2">
                        <span className="text-sm font-bold text-slate-900">
                          #{p.invoiceNumber || "—"}
                        </span>

                        {renderStatusBadge(
                          p.paymentStatus
                        )}
                      </div>

                      <p className="mt-1 flex items-center gap-1.5 text-[11px] text-slate-400">
                        <CalendarDays size={12} />

                        {formatDate(p.purchaseDate)}
                      </p>
                    </div>

                    <div className="shrink-0 text-right">
                      <p className="text-[10px] font-medium uppercase tracking-wide text-slate-400">
                        Total
                      </p>

                      <p className="mt-0.5 text-base font-bold text-[#1E3A8A]">
                        PKR{" "}
                        {Number(
                          p.totalAmount || 0
                        ).toLocaleString("en-PK")}
                      </p>
                    </div>
                  </div>

                  {/* Card Body */}

                  <div className="space-y-3 px-4 py-3.5">
                    {/* Vendor */}

                    <div className="flex items-start gap-2.5">
                      <div className="mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-slate-100 text-slate-500">
                        <Building2 size={15} />
                      </div>

                      <div className="min-w-0">
                        <p className="text-[10px] font-medium uppercase tracking-wide text-slate-400">
                          Vendor
                        </p>

                        <p className="truncate text-xs font-semibold text-slate-800">
                          {p.vendor?.name || "—"}
                        </p>

                        {p.vendor?.companyName && (
                          <p className="truncate text-[11px] text-slate-400">
                            {p.vendor.companyName}
                          </p>
                        )}
                      </div>
                    </div>

                    {/* Payment */}

                    <div className="grid grid-cols-2 gap-2">
                      <div className="rounded-xl bg-slate-50 px-3 py-2.5">
                        <p className="text-[10px] text-slate-400">
                          Paid
                        </p>

                        <p className="mt-0.5 text-xs font-bold text-emerald-600">
                          PKR{" "}
                          {Number(
                            p.paidAmount || 0
                          ).toLocaleString("en-PK")}
                        </p>
                      </div>

                      <div className="rounded-xl bg-slate-50 px-3 py-2.5">
                        <p className="text-[10px] text-slate-400">
                          Remaining
                        </p>

                        <p className="mt-0.5 text-xs font-bold text-red-600">
                          PKR{" "}
                          {Number(
                            p.remainingBalance || 0
                          ).toLocaleString("en-PK")}
                        </p>
                      </div>
                    </div>

                    {/* Actions */}

                    <div className="flex items-center gap-2 border-t border-slate-100 pt-3">
                      <button
                        type="button"
                        onClick={() =>
                          handleViewPurchase(p)
                        }
                        className="flex h-9 flex-1 items-center justify-center gap-1.5 rounded-xl border border-slate-200 bg-white text-xs font-semibold text-slate-600 transition hover:border-blue-200 hover:bg-blue-50 hover:text-[#1E3A8A]"
                      >
                        <Eye size={15} />
                        View
                      </button>

                      <button
                        type="button"
                        onClick={() =>
                          handleEditPurchase(p)
                        }
                        className="flex h-9 flex-1 items-center justify-center gap-1.5 rounded-xl bg-[#1E3A8A] text-xs font-semibold text-white transition hover:bg-blue-900"
                      >
                        <Edit2 size={14} />
                        Edit
                      </button>

                      {p.bill?.url && (
                        <a
                          href={p.bill.url}
                          target="_blank"
                          rel="noreferrer"
                          className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl border border-slate-200 text-slate-500 transition hover:border-blue-200 hover:bg-blue-50 hover:text-[#1E3A8A]"
                          title="View Bill"
                        >
                          <FileText size={15} />
                        </a>
                      )}
                    </div>
                  </div>
                </article>
              ))
            )}
          </div>

          {/* =====================================================
              DESKTOP PURCHASE TABLE
              Visible from lg and above
          ===================================================== */}

          <div className="hidden w-full overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-sm lg:block">
            <div className="overflow-x-auto">
              <table className="w-full border-collapse text-left">
                <thead>
                  <tr className="border-b border-slate-200 bg-slate-50 text-xs font-semibold uppercase tracking-wider text-slate-500">
                    <th className="whitespace-nowrap px-6 py-4">
                      Invoice #
                    </th>

                    <th className="whitespace-nowrap px-6 py-4">
                      Vendor
                    </th>

                    <th className="whitespace-nowrap px-6 py-4">
                      Date
                    </th>

                    <th className="whitespace-nowrap px-6 py-4">
                      Total Amount
                    </th>

                    <th className="whitespace-nowrap px-6 py-4">
                      Payment Status
                    </th>

                    <th className="whitespace-nowrap px-6 py-4">
                      Bill
                    </th>

                    <th className="whitespace-nowrap px-6 py-4 text-right">
                      Actions
                    </th>
                  </tr>
                </thead>

                <tbody className="divide-y divide-slate-100 text-sm text-slate-700">
                  {loading ? (
                    <tr>
                      <td
                        colSpan="7"
                        className="py-10 text-center text-slate-400"
                      >
                        Loading purchases...
                      </td>
                    </tr>
                  ) : purchases.length === 0 ? (
                    <tr>
                      <td
                        colSpan="7"
                        className="py-10 text-center text-slate-400"
                      >
                        No purchases found.
                      </td>
                    </tr>
                  ) : (
                    purchases.map((p) => (
                      <tr
                        key={p._id}
                        className="transition-colors hover:bg-slate-50/80"
                      >
                        {/* Invoice */}

                        <td className="whitespace-nowrap px-6 py-4">
                          <span className="font-bold text-slate-800">
                            #{p.invoiceNumber}
                          </span>
                        </td>

                        {/* Vendor */}

                        <td className="px-6 py-4">
                          <div className="font-semibold text-slate-800">
                            {p.vendor?.name || "—"}
                          </div>

                          <div className="mt-0.5 text-xs text-slate-400">
                            {p.vendor?.companyName || ""}
                          </div>
                        </td>

                        {/* Date */}

                        <td className="whitespace-nowrap px-6 py-4 text-xs text-slate-600">
                          {formatDate(p.purchaseDate)}
                        </td>

                        {/* Total */}

                        <td className="whitespace-nowrap px-6 py-4 font-bold text-[#1E3A8A]">
                          PKR{" "}
                          {Number(
                            p.totalAmount || 0
                          ).toLocaleString("en-PK")}
                        </td>

                        {/* Status */}

                        <td className="whitespace-nowrap px-6 py-4">
                          {renderStatusBadge(
                            p.paymentStatus
                          )}
                        </td>

                        {/* Bill */}

                        <td className="whitespace-nowrap px-6 py-4">
                          {p.bill?.url ? (
                            <a
                              href={p.bill.url}
                              target="_blank"
                              rel="noreferrer"
                              className="inline-flex items-center gap-1 text-xs font-semibold text-[#1E3A8A] hover:underline"
                            >
                              <FileText size={14} />

                              View

                              <ExternalLink
                                size={10}
                              />
                            </a>
                          ) : (
                            <span className="text-xs text-slate-300">
                              —
                            </span>
                          )}
                        </td>

                        {/* Actions */}

                        <td className="whitespace-nowrap px-6 py-4 text-right">
                          <div className="flex justify-end gap-1.5">
                            <button
                              type="button"
                              onClick={() =>
                                handleViewPurchase(p)
                              }
                              className="inline-flex h-8 w-8 items-center justify-center rounded-lg text-slate-500 transition hover:bg-blue-50 hover:text-[#1E3A8A]"
                              title="View Details"
                            >
                              <Eye size={16} />
                            </button>

                            <button
                              type="button"
                              onClick={() =>
                                handleEditPurchase(p)
                              }
                              className="inline-flex h-8 w-8 items-center justify-center rounded-lg text-slate-500 transition hover:bg-slate-100 hover:text-slate-900"
                              title="Edit"
                            >
                              <Edit2 size={16} />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>

          {/* =====================================================
              PAGINATION
          ===================================================== */}

          {totalPages > 1 && (
            <div className="flex items-center justify-between rounded-2xl border border-slate-200 bg-white px-3 py-2.5 shadow-sm sm:justify-end sm:gap-2 sm:border-0 sm:bg-transparent sm:px-0 sm:py-2 sm:shadow-none">
              <button
                type="button"
                disabled={page <= 1}
                onClick={() =>
                  setPage((prev) => prev - 1)
                }
                className="inline-flex h-9 items-center gap-1 rounded-xl border border-slate-200 px-3 text-xs font-semibold text-slate-600 transition hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-40"
              >
                <ChevronLeft size={14} />

                <span className="hidden sm:inline">
                  Previous
                </span>

                <span className="sm:hidden">
                  Prev
                </span>
              </button>

              <span className="px-2 text-xs font-medium text-slate-500">
                Page {page} of {totalPages}
              </span>

              <button
                type="button"
                disabled={page >= totalPages}
                onClick={() =>
                  setPage((prev) => prev + 1)
                }
                className="inline-flex h-9 items-center gap-1 rounded-xl border border-slate-200 px-3 text-xs font-semibold text-slate-600 transition hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-40"
              >
                <span className="hidden sm:inline">
                  Next
                </span>

                <span className="sm:hidden">
                  Next
                </span>

                <ChevronRight size={14} />
              </button>
            </div>
          )}

          {/* =====================================================
              MODALS
          ===================================================== */}

          <PurchaseModal
            isOpen={isFormOpen}
            onClose={() => setIsFormOpen(false)}
            purchase={activePurchase}
            onSuccess={fetchPurchases}
          />

          <PurchaseDetailModal
            isOpen={isDetailOpen}
            onClose={() => setIsDetailOpen(false)}
            purchase={activePurchase}
            onEdit={(purch) => {
              setActivePurchase(purch);
              setIsFormOpen(true);
            }}
            onCancelPrompt={handleCancelPrompt}
          />
        </main>
      </div>
    </div>
  );
};

export default PurchasePage;