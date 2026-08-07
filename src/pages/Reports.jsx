import React, { useState, useEffect, useCallback } from "react";
import {
  FileText,
  Printer,
  Download,
  Filter,
  Loader2,
  TrendingUp,
  Boxes,
  Factory,
  Users,
  HardHat,
} from "lucide-react";
import toast from "react-hot-toast";
import Sidebar from "../components/Sidebar";
import Navbar from "../components/Navbar";

// Service Imports
import * as reportService from "../services/reportsService";
import { getProducts } from "../services/productService";

// Standardized Currency Formatter
const formatCurrency = (val) => {
  const num = Number(val || 0);
  return new Intl.NumberFormat("en-PK", {
    style: "currency",
    currency: "PKR",
    minimumFractionDigits: 0,
    maximumFractionDigits: 2,
  }).format(num);
};

// CATEGORY & REPORT CONFIGURATION MAP
const REPORT_CATEGORIES = [
  {
    id: "sales",
    label: "Sales Reports",
    icon: TrendingUp,
    reports: [
      { id: "sales_summary", name: "Sales Summary (Daily/Weekly/Monthly)" },
      { id: "sales_by_product", name: "Product-wise Sales" },
      { id: "sales_by_client", name: "Client-wise Sales" },
      { id: "sales_by_stock_type", name: "Local vs. Imported Sales" },
    ],
  },
  {
    id: "stock",
    label: "Stock & Inventory",
    icon: Boxes,
    reports: [
      { id: "stock_overall", name: "Overall Stock Ledger" },
      { id: "stock_local", name: "Local Stock Report" },
      { id: "stock_imported", name: "Imported Stock Report" },
      { id: "stock_movements", name: "Stock Movement Audit Log" },
      { id: "stock_low", name: "Low Stock Alert Register" },
    ],
  },
  {
    id: "production",
    label: "Production",
    icon: Factory,
    reports: [
      { id: "prod_daily", name: "Daily Production Log" },
      { id: "prod_history", name: "Production History & Runs" },
      { id: "prod_raw_materials", name: "Raw Material Consumption" },
      { id: "prod_finished_goods", name: "Finished Goods Stock" },
    ],
  },
  {
    id: "client",
    label: "Client Financials",
    icon: Users,
    reports: [
      { id: "client_outstanding", name: "Client Outstanding Balances" },
      { id: "client_payments", name: "Client Payments History" },
      { id: "client_ledger", name: "Individual Client Ledger" },
    ],
  },
  {
    id: "labour",
    label: "Labour & Wages",
    icon: HardHat,
    reports: [
      { id: "labour_att_daily", name: "Daily Attendance Sheet" },
      { id: "labour_att_monthly", name: "Monthly Attendance Summary" },
      { id: "labour_wages", name: "Labour Wage Earnings" },
      { id: "labour_payments", name: "Labour Payments & Advances" },
      { id: "labour_outstanding", name: "Worker Outstanding Balance" },
    ],
  },
];

function Reports() {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);

  // Active Category & Report selection
  const [activeCategory, setActiveCategory] = useState("sales");
  const [activeReport, setActiveReport] = useState("sales_summary");

  // Options State for Filters
  const [productsList, setProductsList] = useState([]);
  const [clientsList, setClientsList] = useState([]);
  const [workersList, setWorkersList] = useState([]);

  // Generic Filter States
  const [filters, setFilters] = useState({
    groupBy: "day",
    fromDate: "",
    toDate: "",
    product: "",
    client: "",
    worker: "",
    stockType: "Local",
    category: "",
    movementType: "",
    referenceType: "",
    date: new Date().toISOString().split("T")[0],
    month: new Date().getMonth() + 1,
    year: new Date().getFullYear(),
    paymentType: "",
    minBalance: "",
    search: "",
    page: 1,
    limit: 50,
  });

  // Report Execution & Results State
  const [reportData, setReportData] = useState(null);
  const [loading, setLoading] = useState(false);

  // 1. Fetch Option Lists once
  useEffect(() => {
    const loadDropdownData = async () => {
      try {
        const [prodRes, clientRes, workerRes] = await Promise.allSettled([
          getProducts(),
          reportService.getClientsList(),
          reportService.getWorkersList(),
        ]);

        if (prodRes.status === "fulfilled") {
          const list = Array.isArray(prodRes.value) ? prodRes.value : prodRes.value?.data || prodRes.value?.products || [];
          setProductsList(list);
        }
        if (clientRes.status === "fulfilled") {
          const list = Array.isArray(clientRes.value) ? clientRes.value : clientRes.value?.data || [];
          setClientsList(list);
        }
        if (workerRes.status === "fulfilled") {
          const list = Array.isArray(workerRes.value) ? workerRes.value : workerRes.value?.data || [];
          setWorkersList(list);
        }
      } catch (err) {
        console.error("Failed loading filter dropdown options:", err);
      }
    };
    loadDropdownData();
  }, []);

  // 2. Fetch Selected Report
  const executeReportFetch = useCallback(async () => {
    if (activeReport === "client_ledger" && !filters.client) {
      setReportData(null);
      return;
    }

    try {
      setLoading(true);

      const cleanParams = Object.fromEntries(
        Object.entries(filters).filter(([_, v]) => v !== "" && v !== null && v !== undefined)
      );

      let res = null;

      switch (activeReport) {
        case "sales_summary":
          res = await reportService.getSalesSummaryReport(cleanParams);
          break;
        case "sales_by_product":
          res = await reportService.getProductWiseSalesReport(cleanParams);
          break;
        case "sales_by_client":
          res = await reportService.getClientWiseSalesReport(cleanParams);
          break;
        case "sales_by_stock_type":
          res = await reportService.getStockTypeSalesReport(cleanParams);
          break;
        case "stock_overall":
          res = await reportService.getStockReport(cleanParams);
          break;
        case "stock_local":
          res = await reportService.getLocalStockReport(cleanParams);
          break;
        case "stock_imported":
          res = await reportService.getImportedStockReport(cleanParams);
          break;
        case "stock_movements":
          res = await reportService.getStockMovementsReport(cleanParams);
          break;
        case "stock_low":
          res = await reportService.getLowStockReport(cleanParams);
          break;
        case "prod_daily":
          res = await reportService.getDailyProductionReport({ date: filters.date });
          break;
        case "prod_history":
          res = await reportService.getProductionHistoryReport(cleanParams);
          break;
        case "prod_raw_materials":
          res = await reportService.getRawMaterialConsumptionReport(cleanParams);
          break;
        case "prod_finished_goods":
          res = await reportService.getFinishedGoodsStockReport(cleanParams);
          break;
        case "client_outstanding":
          res = await reportService.getClientOutstandingReport(cleanParams);
          break;
        case "client_payments":
          res = await reportService.getClientPaymentReport(cleanParams);
          break;
        case "client_ledger":
          res = await reportService.getClientLedgerReport(filters.client, cleanParams);
          break;
        case "labour_att_daily":
          res = await reportService.getDailyAttendanceReport({ date: filters.date });
          break;
        case "labour_att_monthly":
          res = await reportService.getMonthlyAttendanceReport(cleanParams);
          break;
        case "labour_wages":
          res = await reportService.getLabourWageReport(cleanParams);
          break;
        case "labour_payments":
          res = await reportService.getLabourPaymentReport(cleanParams);
          break;
        case "labour_outstanding":
          res = await reportService.getLabourOutstandingReport(cleanParams);
          break;
        default:
          break;
      }

      if (res) {
        if (activeReport === "stock_movements") {
          setReportData(res?.data?.data || res?.data || []);
        } else if (activeReport === "prod_history") {
          setReportData(res?.data || []);
        } else {
          setReportData(res?.data !== undefined ? res.data : res);
        }
      }
    } catch (err) {
      console.error("Report Fetch Error:", err);
      const msg = err?.response?.data?.message || "Failed to load report data.";
      toast.error(msg);
      setReportData(null);
    } finally {
      setLoading(false);
    }
  }, [activeReport, filters]);

  useEffect(() => {
    executeReportFetch();
  }, [activeReport, filters.page, executeReportFetch]);

  const handleCategoryChange = (catId) => {
    setActiveCategory(catId);
    const catObj = REPORT_CATEGORIES.find((c) => c.id === catId);
    if (catObj && catObj.reports.length > 0) {
      setActiveReport(catObj.reports[0].id);
    }
    setReportData(null);
  };

  const handleFilterChange = (field, value) => {
    setFilters((prev) => ({ ...prev, [field]: value, page: 1 }));
  };

  const handlePrint = () => {
    window.print();
  };

  const handleDownloadCSV = () => {
    if (!reportData || (Array.isArray(reportData) && reportData.length === 0)) {
      toast.error("No data available to export.");
      return;
    }

    let rowsToExport = [];
    if (Array.isArray(reportData)) {
      rowsToExport = reportData;
    } else if (reportData.ledger && Array.isArray(reportData.ledger)) {
      rowsToExport = reportData.ledger;
    }

    if (rowsToExport.length === 0) {
      toast.error("No tabular data found for export.");
      return;
    }

    const headers = Object.keys(rowsToExport[0]).filter(
      (k) => typeof rowsToExport[0][k] !== "object"
    );

    const csvContent =
      "data:text/csv;charset=utf-8," +
      [
        headers.join(","),
        ...rowsToExport.map((row) =>
          headers
            .map((field) => `"${row[field] !== undefined && row[field] !== null ? row[field] : ""}"`)
            .join(",")
        ),
      ].join("\n");

    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", `${activeReport}_${new Date().toISOString().split("T")[0]}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // Helper to extract flat rows array from data
  const getTableRows = () => {
    if (!reportData) return [];
    if (Array.isArray(reportData)) return reportData;
    if (reportData.ledger && Array.isArray(reportData.ledger)) return reportData.ledger;
    return [];
  };

  const tableRows = getTableRows();

  return (
    <div className="min-h-screen bg-slate-100 flex overflow-x-hidden">
      {/* Inline styles to automatically handle print formatting */}
      <style>{`
        @media print {
          body * {
            visibility: hidden;
          }
          #printable-report-area, #printable-report-area * {
            visibility: visible;
          }
          #printable-report-area {
            position: absolute;
            left: 0;
            top: 0;
            width: 100%;
            margin: 0;
            padding: 0;
          }
          .no-print {
            display: none !important;
          }
        }
      `}</style>

      {/* Sidebar hidden during print */}
      <div className="no-print">
        <Sidebar isOpen={isSidebarOpen} setIsOpen={setIsSidebarOpen} />
      </div>

      <div
        className={`flex-1 min-w-0 transition-all duration-300 ease-in-out ${
          isSidebarOpen ? "ml-0 lg:ml-72" : "ml-0 lg:ml-20"
        }`}
      >
        {/* Navbar hidden during print */}
        <div className="no-print">
         <Navbar
  isSidebarOpen={isSidebarOpen}
  setIsSidebarOpen={setIsSidebarOpen}
/>
        </div>

        <main className="p-4 md:p-6 lg:p-8 space-y-6 max-w-[1600px] mx-auto mt-24">
          {/* Header Bar */}
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between no-print">
            <div>
              <h1 className="text-2xl font-bold text-slate-900 sm:text-3xl">
                Factory Management Reports
              </h1>
              <p className="text-sm text-slate-500 mt-1">
                Read-only analytics and audit reports across Sales, Inventory, Production, and Labour.
              </p>
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={handlePrint}
                className="flex items-center gap-2 rounded-xl border border-slate-300 bg-white px-4 py-2 text-sm font-semibold text-slate-700 hover:bg-slate-50 cursor-pointer shadow-xs"
              >
                <Printer size={16} /> Print Report
              </button>
              <button
                onClick={handleDownloadCSV}
                className="flex items-center gap-2 rounded-xl bg-[#1E3A8A] px-4 py-2 text-sm font-semibold text-white hover:bg-[#17307A] cursor-pointer shadow-xs"
              >
                <Download size={16} /> Export CSV
              </button>
            </div>
          </div>

          {/* Navigation Category Tabs */}
          <div className="flex border-b border-slate-200 gap-2 sm:gap-6 overflow-x-auto no-print bg-white px-4 py-3 rounded-2xl border shadow-xs">
            {REPORT_CATEGORIES.map((cat) => {
              const Icon = cat.icon;
              const isActive = activeCategory === cat.id;
              return (
                <button
                  key={cat.id}
                  onClick={() => handleCategoryChange(cat.id)}
                  className={`flex items-center gap-2 pb-2 pt-1 border-b-2 font-medium text-sm transition-all whitespace-nowrap cursor-pointer ${
                    isActive
                      ? "border-[#1E3A8A] text-[#1E3A8A] font-bold"
                      : "border-transparent text-slate-500 hover:text-slate-800"
                  }`}
                >
                  <Icon size={18} />
                  {cat.label}
                </button>
              );
            })}
          </div>

          {/* Sub-Report Selector Bar */}
          <div className="flex items-center gap-2 overflow-x-auto no-print pb-1">
            {REPORT_CATEGORIES.find((c) => c.id === activeCategory)?.reports.map((rep) => (
              <button
                key={rep.id}
                onClick={() => {
                  setActiveReport(rep.id);
                  setReportData(null);
                }}
                className={`px-3.5 py-2 rounded-xl text-xs font-semibold transition-all cursor-pointer whitespace-nowrap ${
                  activeReport === rep.id
                    ? "bg-[#1E3A8A] text-white shadow-xs"
                    : "bg-white text-slate-600 border border-slate-200 hover:bg-slate-50"
                }`}
              >
                {rep.name}
              </button>
            ))}
          </div>

          {/* DYNAMIC FILTER BAR */}
          <div className="rounded-3xl border border-slate-200 bg-white p-5 shadow-xs space-y-4 no-print">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold uppercase text-slate-400 tracking-wider flex items-center gap-1.5">
                <Filter size={14} /> Report Filters
              </span>
              <button
                onClick={executeReportFetch}
                className="flex items-center gap-1.5 rounded-xl bg-slate-900 px-4 py-1.5 text-xs font-semibold text-white hover:bg-slate-800 cursor-pointer"
              >
                Run Report
              </button>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-3">
              {/* GroupBy Filter */}
              {activeReport === "sales_summary" && (
                <div>
                  <label className="block text-xs font-medium text-slate-500 mb-1">Group By</label>
                  <select
                    value={filters.groupBy}
                    onChange={(e) => handleFilterChange("groupBy", e.target.value)}
                    className="w-full rounded-xl border border-slate-300 bg-white p-2 text-xs focus:border-[#1E3A8A]"
                  >
                    <option value="day">Daily</option>
                    <option value="week">Weekly</option>
                    <option value="month">Monthly</option>
                  </select>
                </div>
              )}

              {/* Stock Type Filter */}
              {(activeReport === "sales_by_stock_type" ||
                activeReport === "stock_movements" ||
                activeReport === "stock_overall" ||
                activeReport === "prod_history" ||
                activeReport === "prod_finished_goods" ||
                activeReport === "stock_low") && (
                <div>
                  <label className="block text-xs font-medium text-slate-500 mb-1">
                    Stock Classification
                  </label>
                  <select
                    value={filters.stockType}
                    onChange={(e) => handleFilterChange("stockType", e.target.value)}
                    className="w-full rounded-xl border border-slate-300 bg-white p-2 text-xs focus:border-[#1E3A8A]"
                  >
                    {activeReport !== "sales_by_stock_type" && <option value="">All Types</option>}
                    <option value="Local">Local</option>
                    <option value="Imported">Imported</option>
                  </select>
                </div>
              )}

              {/* Product Selector Filter */}
              {(activeReport === "sales_by_product" ||
                activeReport === "stock_movements" ||
                activeReport === "prod_history" ||
                activeReport === "prod_raw_materials") && (
                <div>
                  <label className="block text-xs font-medium text-slate-500 mb-1">
                    Select Product
                  </label>
                  <select
                    value={filters.product}
                    onChange={(e) => handleFilterChange("product", e.target.value)}
                    className="w-full rounded-xl border border-slate-300 bg-white p-2 text-xs focus:border-[#1E3A8A]"
                  >
                    <option value="">All Products</option>
                    {productsList.map((p) => (
                      <option key={p._id} value={p._id}>
                        {p.productName}
                      </option>
                    ))}
                  </select>
                </div>
              )}

              {/* Client Selector Filter */}
              {(activeReport === "sales_by_client" ||
                activeReport === "client_payments" ||
                activeReport === "client_ledger") && (
                <div>
                  <label className="block text-xs font-medium text-slate-500 mb-1">
                    Select Client {activeReport === "client_ledger" && "*"}
                  </label>
                  <select
                    value={filters.client}
                    onChange={(e) => handleFilterChange("client", e.target.value)}
                    className="w-full rounded-xl border border-slate-300 bg-white p-2 text-xs focus:border-[#1E3A8A]"
                  >
                    <option value="">
                      {activeReport === "client_ledger"
                        ? "-- Select Required Client --"
                        : "All Clients"}
                    </option>
                    {clientsList.map((c) => (
                      <option key={c._id} value={c._id}>
                        {c.clientName} ({c.companyName || "No Company"})
                      </option>
                    ))}
                  </select>
                </div>
              )}

              {/* Worker Selector Filter */}
              {(activeReport === "labour_att_monthly" ||
                activeReport === "labour_wages" ||
                activeReport === "labour_payments" ||
                activeReport === "labour_outstanding") && (
                <div>
                  <label className="block text-xs font-medium text-slate-500 mb-1">
                    Select Worker
                  </label>
                  <select
                    value={filters.worker}
                    onChange={(e) => handleFilterChange("worker", e.target.value)}
                    className="w-full rounded-xl border border-slate-300 bg-white p-2 text-xs focus:border-[#1E3A8A]"
                  >
                    <option value="">All Workers</option>
                    {workersList.map((w) => (
                      <option key={w._id} value={w._id}>
                        {w.name} ({w.department || "General"})
                      </option>
                    ))}
                  </select>
                </div>
              )}

              {/* Date Inputs */}
              {activeReport === "prod_daily" || activeReport === "labour_att_daily" ? (
                <div>
                  <label className="block text-xs font-medium text-slate-500 mb-1">Select Date</label>
                  <input
                    type="date"
                    value={filters.date}
                    onChange={(e) => handleFilterChange("date", e.target.value)}
                    className="w-full rounded-xl border border-slate-300 bg-white p-2 text-xs focus:border-[#1E3A8A]"
                  />
                </div>
              ) : activeReport === "labour_att_monthly" ? (
                <>
                  <div>
                    <label className="block text-xs font-medium text-slate-500 mb-1">Month</label>
                    <select
                      value={filters.month}
                      onChange={(e) => handleFilterChange("month", e.target.value)}
                      className="w-full rounded-xl border border-slate-300 bg-white p-2 text-xs focus:border-[#1E3A8A]"
                    >
                      {Array.from({ length: 12 }, (_, i) => (
                        <option key={i + 1} value={i + 1}>
                          {new Date(0, i).toLocaleString("en", { month: "long" })}
                        </option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-slate-500 mb-1">Year</label>
                    <input
                      type="number"
                      value={filters.year}
                      onChange={(e) => handleFilterChange("year", e.target.value)}
                      className="w-full rounded-xl border border-slate-300 bg-white p-2 text-xs focus:border-[#1E3A8A]"
                    />
                  </div>
                </>
              ) : (
                <>
                  <div>
                    <label className="block text-xs font-medium text-slate-500 mb-1">From Date</label>
                    <input
                      type="date"
                      value={filters.fromDate}
                      onChange={(e) => handleFilterChange("fromDate", e.target.value)}
                      className="w-full rounded-xl border border-slate-300 bg-white p-2 text-xs focus:border-[#1E3A8A]"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-slate-500 mb-1">To Date</label>
                    <input
                      type="date"
                      value={filters.toDate}
                      onChange={(e) => handleFilterChange("toDate", e.target.value)}
                      className="w-full rounded-xl border border-slate-300 bg-white p-2 text-xs focus:border-[#1E3A8A]"
                    />
                  </div>
                </>
              )}

              {/* Movement Type */}
              {activeReport === "stock_movements" && (
                <div>
                  <label className="block text-xs font-medium text-slate-500 mb-1">Movement Type</label>
                  <select
                    value={filters.movementType}
                    onChange={(e) => handleFilterChange("movementType", e.target.value)}
                    className="w-full rounded-xl border border-slate-300 bg-white p-2 text-xs focus:border-[#1E3A8A]"
                  >
                    <option value="">All Movements</option>
                    <option value="Purchase">Purchase</option>
                    <option value="Receive">Receive</option>
                    <option value="Issue">Issue</option>
                    <option value="Production">Production</option>
                    <option value="Sale">Sale</option>
                    <option value="Adjustment">Adjustment</option>
                  </select>
                </div>
              )}

              {/* Min Balance */}
              {activeReport === "client_outstanding" && (
                <div>
                  <label className="block text-xs font-medium text-slate-500 mb-1">
                    Min Outstanding Balance
                  </label>
                  <input
                    type="number"
                    placeholder="0"
                    value={filters.minBalance}
                    onChange={(e) => handleFilterChange("minBalance", e.target.value)}
                    className="w-full rounded-xl border border-slate-300 bg-white p-2 text-xs focus:border-[#1E3A8A]"
                  />
                </div>
              )}
            </div>
          </div>

          {/* MAIN REPORT PRINT & DISPLAY AREA */}
          <div
            id="printable-report-area"
            className="w-full bg-white rounded-3xl border border-slate-200 shadow-xs overflow-hidden"
          >
            {/* Header visible only on Print */}
            <div className="hidden print:block p-6 border-b border-slate-300">
              <h2 className="text-2xl font-bold text-slate-900">Factory Management Official Report</h2>
              <p className="text-sm text-slate-600">
                Report: {REPORT_CATEGORIES.flatMap((c) => c.reports).find((r) => r.id === activeReport)?.name}
              </p>
              <p className="text-xs text-slate-400 mt-1">Generated Date: {new Date().toLocaleString()}</p>
            </div>

            {loading ? (
              <div className="p-16 flex flex-col items-center justify-center space-y-4 text-slate-500">
                <Loader2 className="animate-spin text-[#1E3A8A]" size={36} />
                <p className="text-sm font-medium">Running report queries...</p>
              </div>
            ) : activeReport === "client_ledger" && !filters.client ? (
              <div className="p-16 text-center text-slate-500">
                <Users size={48} className="mx-auto text-slate-300 mb-3" />
                <p className="text-sm font-medium">Please select a Client from the filters above to generate their ledger.</p>
              </div>
            ) : tableRows.length === 0 ? (
              <div className="p-16 text-center text-slate-500">
                <FileText size={48} className="mx-auto text-slate-300 mb-3" />
                <p className="text-sm font-medium">No records found matching the specified range or filters.</p>
              </div>
            ) : (
              <div>
                {/* Client Ledger Summary Card */}
                {activeReport === "client_ledger" && reportData.clientSummary && (
                  <div className="p-6 border-b border-slate-200 bg-slate-50/50 space-y-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <h3 className="text-lg font-bold text-slate-900">
                          {reportData.clientSummary.clientName}
                        </h3>
                        <p className="text-xs text-slate-500">
                          {reportData.clientSummary.companyName} | Phone: {reportData.clientSummary.phone || "N/A"}
                        </p>
                      </div>
                    </div>

                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                      <div className="bg-white p-3.5 rounded-2xl border border-slate-200">
                        <span className="text-xs text-slate-400 block">Opening Balance</span>
                        <span className="text-base font-bold text-slate-800">
                          {formatCurrency(reportData.clientSummary.openingBalance)}
                        </span>
                      </div>
                      <div className="bg-white p-3.5 rounded-2xl border border-slate-200">
                        <span className="text-xs text-slate-400 block">Total Purchases</span>
                        <span className="text-base font-bold text-slate-800">
                          {formatCurrency(reportData.clientSummary.totalPurchases)}
                        </span>
                      </div>
                      <div className="bg-white p-3.5 rounded-2xl border border-slate-200">
                        <span className="text-xs text-slate-400 block">Total Payments</span>
                        <span className="text-base font-bold text-emerald-600">
                          {formatCurrency(reportData.clientSummary.totalPayments)}
                        </span>
                      </div>
                      <div className="bg-white p-3.5 rounded-2xl border border-slate-200">
                        <span className="text-xs text-slate-400 block">Outstanding Balance</span>
                        <span className="text-base font-bold text-amber-600">
                          {formatCurrency(reportData.clientSummary.outstandingBalance)}
                        </span>
                      </div>
                    </div>
                  </div>
                )}

                {/* Main Table */}
                <div className="overflow-x-auto">
                  <table className="w-full text-left text-sm text-slate-600">
                    <thead className="bg-slate-50 border-b border-slate-200 text-xs uppercase text-slate-500 font-semibold tracking-wider">
                      <tr>
                        {Object.keys(tableRows[0] || {})
                          .filter((key) => typeof tableRows[0][key] !== "object")
                          .map((colHeader, index) => (
                            <th key={index} className="px-6 py-4">
                              {colHeader.replace(/([A-Z])/g, " $1").toUpperCase()}
                            </th>
                          ))}
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-200">
                      {tableRows.map((row, rowIndex) => (
                        <tr key={rowIndex} className="hover:bg-slate-50/50 transition-colors">
                          {Object.keys(row)
                            .filter((key) => typeof row[key] !== "object")
                            .map((colKey, colIndex) => (
                              <td key={colIndex} className="px-6 py-4 whitespace-nowrap text-xs">
                                {colKey.toLowerCase().includes("amount") ||
                                colKey.toLowerCase().includes("revenue") ||
                                colKey.toLowerCase().includes("price") ||
                                colKey.toLowerCase().includes("balance") ||
                                colKey.toLowerCase().includes("wage")
                                  ? formatCurrency(row[colKey])
                                  : String(row[colKey] !== undefined && row[colKey] !== null ? row[colKey] : "")}
                              </td>
                            ))}
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}
          </div>
        </main>
      </div>
    </div>
  );
}

export default Reports;