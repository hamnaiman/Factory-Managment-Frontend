import { useEffect, useMemo, useState } from "react";
import {
  Plus,
  Search,
  Loader2,
  Pencil,
  Trash2,
  Receipt,
  X,
  Wallet,
  PackageMinus,
  TrendingUp,
  PiggyBank,
  Minus,
  Equal,
} from "lucide-react";
import toast from "react-hot-toast";

import Sidebar from "../components/Sidebar";
import Navbar from "../components/Navbar";
import ExpenseModal from "../components/ExpenseModal";

import {
  getExpenses,
  getExpenseTotal,
  createExpense,
  updateExpense,
  deleteExpense,
} from "../services/expenseService";

import { getSalesTotal } from "../services/saleService";

function Expenses() {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);

  const [expenses, setExpenses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedExpense, setSelectedExpense] = useState(null);

  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("all");
  const [fromDate, setFromDate] = useState("");
  const [toDate, setToDate] = useState("");

  const [totalExpenses, setTotalExpenses] = useState(0);

  const [totalRevenue, setTotalRevenue] = useState(0);
  const [totalCOGS, setTotalCOGS] = useState(0);
  const [grossProfit, setGrossProfit] = useState(0);

  const [billPreview, setBillPreview] = useState(null);

  // ============================================================
  // FETCH EXPENSES & SALES
  // ============================================================

  const fetchExpenses = async () => {
    try {
      setLoading(true);

      const params = {};

      if (category !== "all") params.category = category;
      if (fromDate) params.fromDate = fromDate;
      if (toDate) params.toDate = toDate;

      const response = await getExpenses(params);

      const list =
        response?.data?.data ||
        response?.data ||
        response?.expenses ||
        [];

      setExpenses(Array.isArray(list) ? list : []);

      const totalResponse = await getExpenseTotal(params);

      const expenseTotal =
        totalResponse?.data?.data?.totalExpenses ??
        totalResponse?.data?.totalExpenses ??
        0;

      setTotalExpenses(Number(expenseTotal));

      const salesResponse = await getSalesTotal({
        fromDate,
        toDate,
      });

      const salesData =
        salesResponse?.data?.data ??
        salesResponse?.data ??
        {};

      const revenue = Number(salesData?.totalSales ?? 0);
      const cogs = Number(salesData?.totalCOGS ?? 0);

      const gross = Number(
        salesData?.grossProfit ?? revenue - cogs
      );

      setTotalRevenue(revenue);
      setTotalCOGS(cogs);
      setGrossProfit(gross);
    } catch (error) {
      console.error(
        "Failed to fetch profit & expenses:",
        error
      );

      toast.error(
        error.response?.data?.message ||
          "Failed to load profit and expenses."
      );

      setExpenses([]);
      setTotalExpenses(0);
      setTotalRevenue(0);
      setTotalCOGS(0);
      setGrossProfit(0);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchExpenses();
  }, [category, fromDate, toDate]);

  // ============================================================
  // NET PROFIT & FILTERING
  // ============================================================

  const netProfit = useMemo(() => {
    return Number(grossProfit) - Number(totalExpenses);
  }, [grossProfit, totalExpenses]);

  const grossMarginPct = useMemo(() => {
    if (!totalRevenue) return null;

    return (
      (Number(grossProfit) / Number(totalRevenue)) * 100
    );
  }, [grossProfit, totalRevenue]);

  const netMarginPct = useMemo(() => {
    if (!totalRevenue) return null;

    return (
      (Number(netProfit) / Number(totalRevenue)) * 100
    );
  }, [netProfit, totalRevenue]);

  const visibleExpenses = useMemo(() => {
    const query = search.toLowerCase().trim();

    if (!query) return expenses;

    return expenses.filter((expense) => {
      return (
        expense.title?.toLowerCase().includes(query) ||
        expense.category?.toLowerCase().includes(query) ||
        expense.notes?.toLowerCase().includes(query)
      );
    });
  }, [expenses, search]);

  // ============================================================
  // HANDLERS
  // ============================================================

  const handleAdd = () => {
    setSelectedExpense(null);
    setIsModalOpen(true);
  };

  const handleEdit = (expense) => {
    setSelectedExpense(expense);
    setIsModalOpen(true);
  };

  const handleSave = async (formData) => {
    try {
      setIsSaving(true);

      if (selectedExpense) {
        await updateExpense(
          selectedExpense._id,
          formData
        );

        toast.success(
          "Expense updated successfully."
        );
      } else {
        await createExpense(formData);

        toast.success(
          "Expense added successfully."
        );
      }

      setIsModalOpen(false);
      setSelectedExpense(null);

      await fetchExpenses();
    } catch (error) {
      console.error(
        "Failed to save expense:",
        error
      );

      toast.error(
        error.response?.data?.message ||
          "Failed to save expense."
      );
    } finally {
      setIsSaving(false);
    }
  };

  const handleDelete = async (id) => {
    if (
      !window.confirm(
        "Are you sure you want to delete this expense?"
      )
    ) {
      return;
    }

    try {
      await deleteExpense(id);

      toast.success(
        "Expense deleted successfully."
      );

      await fetchExpenses();
    } catch (error) {
      console.error(
        "Failed to delete expense:",
        error
      );

      toast.error(
        error.response?.data?.message ||
          "Failed to delete expense."
      );
    }
  };

  const clearFilters = () => {
    setSearch("");
    setCategory("all");
    setFromDate("");
    setToDate("");
  };

  // ============================================================
  // UI
  // ============================================================

  return (
    <div className="flex min-h-screen overflow-x-hidden bg-slate-100">
      {/* SIDEBAR */}
      <Sidebar
        isOpen={isSidebarOpen}
        setIsOpen={setIsSidebarOpen}
      />

      {/* CONTENT */}
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

        <main className="mx-auto mt-24 max-w-[1600px] space-y-6 p-3 sm:p-4 md:p-6 lg:p-8">

          {/* PAGE HEADER */}
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div className="min-w-0">
              <h1 className="text-2xl font-bold text-slate-900 sm:text-3xl">
                Expenses & Profit
              </h1>

              <p className="mt-1 text-sm text-slate-500">
                Track factory expenditures and monitor net earnings ledger.
              </p>
            </div>

            <button
              onClick={handleAdd}
              className="flex w-full items-center justify-center gap-2 rounded-xl bg-[#1E3A8A] px-5 py-2.5 text-sm font-semibold text-white transition-all hover:bg-[#17307A] hover:shadow-md active:scale-95 sm:w-auto"
            >
              <Plus size={18} />
              Add Expense
            </button>
          </div>

          {/* SUMMARY METRICS */}
          <div className="space-y-4">

            {/* Supporting Figures */}
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">

              {/* Revenue */}
              <div className="group rounded-3xl border border-slate-200 bg-white p-5 shadow-xs transition-shadow hover:shadow-md">
                <div className="flex items-center gap-3">
                  <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-2xl bg-slate-100 text-slate-600">
                    <Wallet size={18} />
                  </span>

                  <p className="text-xs font-semibold uppercase tracking-wider text-slate-400">
                    Total Revenue
                  </p>
                </div>

                <p className="mt-4 text-2xl font-bold tabular-nums text-slate-900 sm:text-[1.75rem]">
                  PKR{" "}
                  {Number(
                    totalRevenue
                  ).toLocaleString()}
                </p>

                <p className="mt-1 text-xs text-slate-400">
                  Total sales in this period
                </p>
              </div>

              {/* COGS */}
              <div className="group rounded-3xl border border-slate-200 bg-white p-5 shadow-xs transition-shadow hover:shadow-md">
                <div className="flex items-center gap-3">
                  <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-2xl bg-amber-50 text-amber-600">
                    <PackageMinus size={18} />
                  </span>

                  <p className="text-xs font-semibold uppercase tracking-wider text-slate-400">
                    Cost of Goods Sold
                  </p>
                </div>

                <p className="mt-4 text-2xl font-bold tabular-nums text-slate-900 sm:text-[1.75rem]">
                  PKR{" "}
                  {Number(
                    totalCOGS
                  ).toLocaleString()}
                </p>

                <p className="mt-1 text-xs text-slate-400">
                  What the sold products actually cost
                </p>
              </div>

              {/* Gross Profit */}
              <div className="group rounded-3xl border border-slate-200 bg-white p-5 shadow-xs transition-shadow hover:shadow-md">
                <div className="flex items-center gap-3">
                  <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-2xl bg-emerald-50 text-emerald-600">
                    <TrendingUp size={18} />
                  </span>

                  <p className="text-xs font-semibold uppercase tracking-wider text-slate-400">
                    Gross Profit
                  </p>
                </div>

                <p className="mt-4 text-2xl font-bold tabular-nums text-slate-900 sm:text-[1.75rem]">
                  PKR{" "}
                  {Number(
                    grossProfit
                  ).toLocaleString()}
                </p>

                <p className="mt-1 text-xs text-slate-400">
                  {grossMarginPct === null
                    ? "Revenue minus COGS"
                    : `${grossMarginPct.toFixed(
                        1
                      )}% margin`}
                </p>
              </div>

              {/* Expenses */}
              <div className="group rounded-3xl border border-slate-200 bg-white p-5 shadow-xs transition-shadow hover:shadow-md">
                <div className="flex items-center gap-3">
                  <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-2xl bg-rose-50 text-rose-600">
                    <Receipt size={18} />
                  </span>

                  <p className="text-xs font-semibold uppercase tracking-wider text-slate-400">
                    Total Expenses
                  </p>
                </div>

                <p className="mt-4 text-2xl font-bold tabular-nums text-slate-900 sm:text-[1.75rem]">
                  PKR{" "}
                  {Number(
                    totalExpenses
                  ).toLocaleString()}
                </p>

                <p className="mt-1 text-xs text-slate-400">
                  Labour, rent, and other costs
                </p>
              </div>
            </div>

            {/* NET PROFIT */}
            <div className="relative overflow-hidden rounded-3xl bg-[#1E3A8A] p-5 text-white shadow-lg sm:p-7">
              <div className="flex flex-col gap-5 sm:flex-row sm:items-center sm:justify-between">

                <div className="flex min-w-0 items-center gap-4">
                  <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-white/10 text-white">
                    <PiggyBank size={22} />
                  </span>

                  <div className="min-w-0">
                    <p className="text-xs font-semibold uppercase tracking-wider text-blue-200">
                      Net Profit
                    </p>

                    <p className="mt-1 break-words text-2xl font-bold tabular-nums sm:text-4xl">
                      PKR{" "}
                      {Number(
                        netProfit
                      ).toLocaleString()}
                    </p>

                    {netMarginPct !== null && (
                      <span
                        className={`mt-2 inline-flex items-center rounded-full px-2.5 py-1 text-xs font-semibold ${
                          netProfit >= 0
                            ? "bg-emerald-400/20 text-emerald-300"
                            : "bg-rose-400/20 text-rose-300"
                        }`}
                      >
                        {netMarginPct.toFixed(
                          1
                        )}% net margin
                      </span>
                    )}
                  </div>
                </div>

                {/* Formula */}
                <div className="flex max-w-full flex-wrap items-center gap-2.5 overflow-hidden rounded-2xl bg-white/5 px-4 py-3 text-sm text-blue-100 sm:gap-3">
                  <span className="font-semibold text-white">
                    PKR{" "}
                    {Number(
                      grossProfit
                    ).toLocaleString()}
                  </span>

                  <span className="text-xs text-blue-300">
                    Gross Profit
                  </span>

                  <Minus
                    size={14}
                    className="text-blue-300"
                  />

                  <span className="font-semibold text-white">
                    PKR{" "}
                    {Number(
                      totalExpenses
                    ).toLocaleString()}
                  </span>

                  <span className="text-xs text-blue-300">
                    Expenses
                  </span>

                  <Equal
                    size={14}
                    className="text-blue-300"
                  />

                  <span
                    className={`font-semibold ${
                      netProfit >= 0
                        ? "text-emerald-300"
                        : "text-rose-300"
                    }`}
                  >
                    PKR{" "}
                    {Number(
                      netProfit
                    ).toLocaleString()}
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* FILTER BAR */}
          <div className="rounded-3xl border border-slate-200 bg-white p-4 shadow-xs sm:p-5">
            <div className="flex flex-col gap-3 lg:flex-row lg:items-center">

              {/* Search */}
              <div className="relative min-w-0 flex-1">
                <Search
                  size={18}
                  className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400"
                />

                <input
                  type="text"
                  value={search}
                  onChange={(e) =>
                    setSearch(e.target.value)
                  }
                  placeholder="Search expense description, category..."
                  className="w-full rounded-xl border border-slate-300 bg-white py-2.5 pl-11 pr-4 text-sm outline-none focus:border-[#1E3A8A] focus:ring-1 focus:ring-[#1E3A8A]"
                />
              </div>

              {/* Controls */}
              <div className="grid grid-cols-1 gap-3 sm:grid-cols-3 lg:flex lg:w-auto">

                <select
                  value={category}
                  onChange={(e) =>
                    setCategory(e.target.value)
                  }
                  className="cursor-pointer rounded-xl border border-slate-300 bg-white px-4 py-2.5 text-sm outline-none focus:border-[#1E3A8A]"
                >
                  <option value="all">
                    All Categories
                  </option>

                  <option value="Electricity">
                    Electricity
                  </option>

                  <option value="Labour">
                    Labour
                  </option>

                  <option value="Rent">
                    Rent
                  </option>

                  <option value="Transport">
                    Transport
                  </option>

                  <option value="Maintenance">
                    Maintenance
                  </option>

                  <option value="Purchase">
                    Purchase
                  </option>

                  <option value="Other">
                    Other
                  </option>
                </select>

                <input
                  type="date"
                  value={fromDate}
                  onChange={(e) =>
                    setFromDate(e.target.value)
                  }
                  className="rounded-xl border border-slate-300 bg-white px-4 py-2.5 text-sm outline-none focus:border-[#1E3A8A]"
                />

                <div className="flex gap-2">
                  <input
                    type="date"
                    value={toDate}
                    onChange={(e) =>
                      setToDate(e.target.value)
                    }
                    className="min-w-0 flex-1 rounded-xl border border-slate-300 bg-white px-4 py-2.5 text-sm outline-none focus:border-[#1E3A8A]"
                  />

                  <button
                    onClick={clearFilters}
                    title="Clear filters"
                    className="flex items-center justify-center rounded-xl border border-slate-300 px-3 text-slate-500 transition-colors hover:bg-slate-50"
                  >
                    <X size={18} />
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* ============================================================
              EXPENSES
          ============================================================ */}

          <div className="w-full overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-xs">

            {loading ? (
              <div className="flex flex-col items-center justify-center space-y-4 p-16 text-slate-500">
                <Loader2
                  className="animate-spin text-[#1E3A8A]"
                  size={36}
                />

                <p className="text-sm font-medium">
                  Loading ledger records...
                </p>
              </div>
            ) : visibleExpenses.length === 0 ? (
              <div className="mx-auto flex max-w-md flex-col items-center justify-center p-12 text-center sm:p-16">
                <Receipt
                  size={42}
                  className="mb-2 text-slate-300"
                />

                <h3 className="text-lg font-bold text-slate-800">
                  No expenses recorded
                </h3>

                <p className="mb-6 mt-1 text-sm text-slate-500">
                  Add an expense entry to track cost analysis and profits.
                </p>

                <button
                  onClick={handleAdd}
                  className="inline-flex items-center gap-2 rounded-xl bg-[#1E3A8A] px-4 py-2 text-sm font-semibold text-white transition-all hover:bg-[#17307A]"
                >
                  <Plus size={16} />
                  Add Expense
                </button>
              </div>
            ) : (
              <>
                {/* =====================================================
                    MOBILE CARDS
                    Visible below lg
                ====================================================== */}

                <div className="space-y-3 p-3 sm:p-4 lg:hidden">
                  {visibleExpenses.map((expense) => (
                    <div
                      key={expense._id}
                      className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm"
                    >
                      {/* Card Top */}
                      <div className="flex items-start justify-between gap-3">
                        <div className="min-w-0 flex-1">
                          <p className="break-words text-sm font-bold text-slate-900">
                            {expense.title}
                          </p>

                          <p className="mt-1 text-xs text-slate-500">
                            {new Date(
                              expense.date
                            ).toLocaleDateString()}
                          </p>
                        </div>

                        <span className="shrink-0 rounded-lg bg-slate-100 px-2.5 py-1 text-xs font-semibold text-slate-700">
                          {expense.category}
                        </span>
                      </div>

                      {/* Notes */}
                      {expense.notes && (
                        <p className="mt-3 break-words rounded-xl bg-slate-50 p-3 text-xs leading-5 text-slate-500">
                          {expense.notes}
                        </p>
                      )}

                      {/* Amount */}
                      <div className="mt-4 flex items-center justify-between border-t border-slate-100 pt-3">
                        <span className="text-xs font-medium text-slate-500">
                          Amount
                        </span>

                        <span className="text-base font-bold text-slate-900">
                          PKR{" "}
                          {Number(
                            expense.amount
                          ).toLocaleString()}
                        </span>
                      </div>

                      {/* Actions */}
                      <div className="mt-3 flex items-center justify-between gap-2">

                        {expense.billImage ? (
                          <button
                            onClick={() =>
                              setBillPreview(
                                expense.billImage
                              )
                            }
                            className="inline-flex items-center gap-1.5 rounded-xl border border-slate-200 px-3 py-2 text-xs font-semibold text-[#1E3A8A] transition-colors hover:bg-slate-50"
                          >
                            <Receipt size={14} />
                            View Bill
                          </button>
                        ) : (
                          <span className="text-xs text-slate-400">
                            No bill attached
                          </span>
                        )}

                        <div className="flex items-center gap-1">
                          <button
                            onClick={() =>
                              handleEdit(expense)
                            }
                            className="rounded-xl p-2.5 text-slate-500 transition-colors hover:bg-slate-100 hover:text-slate-900"
                            title="Edit"
                          >
                            <Pencil size={17} />
                          </button>

                          <button
                            onClick={() =>
                              handleDelete(
                                expense._id
                              )
                            }
                            className="rounded-xl p-2.5 text-slate-400 transition-colors hover:bg-rose-50 hover:text-rose-600"
                            title="Delete"
                          >
                            <Trash2 size={17} />
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>

                {/* =====================================================
                    DESKTOP TABLE
                    Visible lg and above
                ====================================================== */}

                <div className="hidden overflow-x-auto lg:block">
                  <table className="w-full min-w-[700px] border-collapse text-left">
                    <thead>
                      <tr className="border-b border-slate-200 bg-slate-50/50">
                        <th className="px-6 py-4 text-xs font-bold uppercase tracking-wider text-slate-500">
                          Date
                        </th>

                        <th className="px-6 py-4 text-xs font-bold uppercase tracking-wider text-slate-500">
                          Title / Notes
                        </th>

                        <th className="px-6 py-4 text-xs font-bold uppercase tracking-wider text-slate-500">
                          Category
                        </th>

                        <th className="px-6 py-4 text-right text-xs font-bold uppercase tracking-wider text-slate-500">
                          Amount
                        </th>

                        <th className="px-6 py-4 text-center text-xs font-bold uppercase tracking-wider text-slate-500">
                          Bill
                        </th>

                        <th className="px-6 py-4 text-right text-xs font-bold uppercase tracking-wider text-slate-500">
                          Actions
                        </th>
                      </tr>
                    </thead>

                    <tbody className="divide-y divide-slate-100">
                      {visibleExpenses.map((expense) => (
                        <tr
                          key={expense._id}
                          className="transition-colors hover:bg-slate-50/80"
                        >
                          <td className="whitespace-nowrap px-6 py-4 text-sm text-slate-600">
                            {new Date(
                              expense.date
                            ).toLocaleDateString()}
                          </td>

                          <td className="px-6 py-4">
                            <p className="text-sm font-bold text-slate-900">
                              {expense.title}
                            </p>

                            {expense.notes && (
                              <p className="mt-0.5 max-w-xs truncate text-xs text-slate-400">
                                {expense.notes}
                              </p>
                            )}
                          </td>

                          <td className="whitespace-nowrap px-6 py-4">
                            <span className="inline-block rounded-lg bg-slate-100 px-2.5 py-1 text-xs font-semibold text-slate-700">
                              {expense.category}
                            </span>
                          </td>

                          <td className="whitespace-nowrap px-6 py-4 text-right text-sm font-bold text-slate-900">
                            PKR{" "}
                            {Number(
                              expense.amount
                            ).toLocaleString()}
                          </td>

                          <td className="whitespace-nowrap px-6 py-4 text-center">
                            {expense.billImage ? (
                              <button
                                onClick={() =>
                                  setBillPreview(
                                    expense.billImage
                                  )
                                }
                                className="inline-flex items-center gap-1.5 rounded-xl border border-slate-200 px-3 py-1.5 text-xs font-semibold text-[#1E3A8A] transition-colors hover:bg-slate-100"
                              >
                                <Receipt size={14} />
                                View
                              </button>
                            ) : (
                              <span className="text-xs text-slate-400">
                                No bill
                              </span>
                            )}
                          </td>

                          <td className="whitespace-nowrap px-6 py-4 text-right">
                            <div className="flex items-center justify-end gap-1">
                              <button
                                onClick={() =>
                                  handleEdit(expense)
                                }
                                className="rounded-lg p-2 text-slate-500 transition-colors hover:bg-slate-100 hover:text-slate-900"
                                title="Edit"
                              >
                                <Pencil size={16} />
                              </button>

                              <button
                                onClick={() =>
                                  handleDelete(
                                    expense._id
                                  )
                                }
                                className="rounded-lg p-2 text-slate-400 transition-colors hover:bg-rose-50 hover:text-rose-600"
                                title="Delete"
                              >
                                <Trash2 size={16} />
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </>
            )}
          </div>
        </main>
      </div>

      {/* EXPENSE MODAL */}
      <ExpenseModal
        isOpen={isModalOpen}
        onClose={() => {
          setIsModalOpen(false);
          setSelectedExpense(null);
        }}
        onSave={handleSave}
        initialData={selectedExpense}
        isSaving={isSaving}
      />

      {/* BILL PREVIEW */}
      {billPreview && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 p-3 backdrop-blur-xs sm:p-4">
          <div className="relative max-h-[90vh] w-full max-w-2xl rounded-2xl bg-white p-3 shadow-2xl sm:rounded-3xl sm:p-4">
            <button
              onClick={() => setBillPreview(null)}
              className="absolute right-3 top-3 z-10 rounded-full bg-slate-100 p-2 text-slate-600 transition-colors hover:bg-slate-200 sm:right-4 sm:top-4"
            >
              <X size={18} />
            </button>

            <img
              src={billPreview}
              alt="Expense receipt preview"
              className="max-h-[80vh] w-full rounded-2xl object-contain"
            />
          </div>
        </div>
      )}
    </div>
  );
}

export default Expenses;