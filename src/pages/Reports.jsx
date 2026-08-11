import { useState, useEffect, useCallback, useMemo } from "react";
import {
  FileText,
  Printer,
  Download,
  Loader2,
} from "lucide-react";
import toast from "react-hot-toast";

import Sidebar from "../components/Sidebar";
import Navbar from "../components/Navbar";

import * as reportService from "../services/reportsService";
import { getProducts } from "../services/productService";
import { getLabours } from "../services/labourService";

// ======================================================
// HELPERS
// ======================================================

const formatDate = (value) => {
  if (!value) return "";

  const date = new Date(value);

  if (Number.isNaN(date.getTime())) {
    return "";
  }

  return date.toLocaleDateString("en-GB", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
};

const formatShortDate = (value) => {
  if (!value) return "";

  const date = new Date(value);

  if (Number.isNaN(date.getTime())) {
    return "";
  }

  return date.toLocaleDateString("en-GB", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
  });
};

const getDayName = (value) => {
  if (!value) return "";

  const date = new Date(value);

  if (Number.isNaN(date.getTime())) {
    return "";
  }

  return date.toLocaleDateString("en-US", {
    weekday: "long",
  });
};

const formatCurrency = (value) => {
  const amount = Number(value || 0);

  return `Rs. ${amount.toLocaleString("en-PK")}`;
};

// Keep date-only API values in local calendar time.
// This prevents UTC conversion from moving a record to the previous/next day.
const getDateKey = (value) => {
  if (!value) return "";

  const raw = String(value);

  if (/^\d{4}-\d{2}-\d{2}/.test(raw)) {
    return raw.slice(0, 10);
  }

  const date = new Date(value);

  if (Number.isNaN(date.getTime())) return "";

  const y = date.getFullYear();
  const m = String(date.getMonth() + 1).padStart(2, "0");
  const d = String(date.getDate()).padStart(2, "0");

  return `${y}-${m}-${d}`;
};

const toArray = (value) => {
  if (Array.isArray(value)) return value;
  if (!value || typeof value !== "object") return [];

  if (Array.isArray(value.data)) return value.data;
  if (Array.isArray(value.records)) return value.records;
  if (Array.isArray(value.results)) return value.results;
  if (Array.isArray(value.attendance)) return value.attendance;
  if (Array.isArray(value.payments)) return value.payments;

  return [];
};

const formatColumnName = (key) => {
  return String(key)
    .replace(/([A-Z])/g, " $1")
    .replace(/_/g, " ")
    .replace(/^./, (char) => char.toUpperCase())
    .trim();
};

const isHiddenField = (key) => {
  const value = String(key).toLowerCase();

  return (
    value === "_id" ||
    value.endsWith("id") ||
    value.includes("workerid") ||
    value.includes("labourid") ||
    value.includes("clientid") ||
    value.includes("productid") ||
    value === "createdat" ||
    value === "updatedat" ||
    value === "created" ||
    value === "updated"
  );
};

const isMoneyField = (key) => {
  const value = String(key).toLowerCase();

  return (
    value.includes("amount") ||
    value.includes("salary") ||
    value.includes("wage") ||
    value.includes("profit") ||
    value.includes("price") ||
    value.includes("cost") ||
    value.includes("balance") ||
    value.includes("payment")
  );
};

// ======================================================
// REPORTS
// ======================================================

const REPORTS = [
  {
    id: "sales_summary",
    name: "Sales Report",
    category: "Sales",
  },
  {
    id: "stock_overall",
    name: "Stock Report",
    category: "Stock",
  },
  {
    id: "labour",
    name: "Labour Report",
    category: "Labour",
  },
];

// ======================================================
// MONTH DATE RANGE
// ======================================================

const getMonthDateRange = (month, year) => {
  const numericMonth = Number(month);
  const numericYear = Number(year);

  const firstDay = new Date(
    numericYear,
    numericMonth - 1,
    1
  );

  const lastDay = new Date(
    numericYear,
    numericMonth,
    0
  );

  const formatInputDate = (date) => {
    const y = date.getFullYear();
    const m = String(date.getMonth() + 1).padStart(2, "0");
    const d = String(date.getDate()).padStart(2, "0");

    return `${y}-${m}-${d}`;
  };

  return {
    fromDate: formatInputDate(firstDay),
    toDate: formatInputDate(lastDay),
  };
};

// ======================================================
// COMPONENT
// ======================================================

function Reports() {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);

  const [workers, setWorkers] = useState([]);
  const [products, setProducts] = useState([]);

  const [loading, setLoading] = useState(false);

  const [reportData, setReportData] = useState([]);

  const [labourReport, setLabourReport] = useState(null);

  const [filters, setFilters] = useState({
    report: "sales_summary",

    date: new Date()
      .toISOString()
      .split("T")[0],

    fromDate: "",
    toDate: "",

    month: new Date().getMonth() + 1,
    year: new Date().getFullYear(),

    worker: "",
    product: "",
    stockType: "",
    movementType: "",
  });

  const activeReport = filters.report;

  // ======================================================
  // LOAD WORKERS
  // ======================================================

  useEffect(() => {
    const loadWorkers = async () => {
      try {
        const response = await getLabours();

        const data =
          response?.data?.data ||
          response?.data ||
          [];

        setWorkers(
          Array.isArray(data) ? data : []
        );
      } catch (error) {
        console.error(
          "Worker loading error:",
          error
        );

        setWorkers([]);
      }
    };

    loadWorkers();
  }, []);

  // ======================================================
  // LOAD PRODUCTS
  // ======================================================

  useEffect(() => {
    const loadProducts = async () => {
      try {
        const response = await getProducts();

        const data =
          response?.data?.data ||
          response?.data ||
          [];

        setProducts(
          Array.isArray(data) ? data : []
        );
      } catch (error) {
        console.error(
          "Product loading error:",
          error
        );

        setProducts([]);
      }
    };

    loadProducts();
  }, []);

  // ======================================================
  // CHANGE FILTER
  // ======================================================

  const handleChange = (field, value) => {
    setFilters((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  // ======================================================
  // CHANGE REPORT
  // ======================================================

  const handleReportChange = (e) => {
    const report = e.target.value;

    setFilters((prev) => ({
      ...prev,
      report,

      worker: "",
      product: "",
      stockType: "",
      movementType: "",

      fromDate: "",
      toDate: "",
    }));

    setReportData([]);
    setLabourReport(null);
  };

  // ======================================================
  // EXTRACT API DATA
  // ======================================================

  const extractData = (response) => {
    if (!response) {
      return [];
    }

    if (response.data) {
      if (Array.isArray(response.data.data)) {
        return response.data.data;
      }

      if (Array.isArray(response.data.records)) {
        return response.data.records;
      }

      if (Array.isArray(response.data.results)) {
        return response.data.results;
      }

      if (Array.isArray(response.data)) {
        return response.data;
      }

      if (
        response.data.data &&
        typeof response.data.data === "object"
      ) {
        return response.data.data;
      }
    }

    if (Array.isArray(response)) {
      return response;
    }

    if (Array.isArray(response.records)) {
      return response.records;
    }

    if (Array.isArray(response.results)) {
      return response.results;
    }

    return response;
  };

  // ======================================================
  // NUMBER HELPER
  // ======================================================

  const getNumber = (obj, keys) => {
    if (!obj) return 0;

    for (const key of keys) {
      const value = obj?.[key];

      if (
        value !== undefined &&
        value !== null &&
        value !== ""
      ) {
        const number = Number(value);

        if (!Number.isNaN(number)) {
          return number;
        }
      }
    }

    return 0;
  };

  // ======================================================
  // NORMALIZE WORKER ID
  // ======================================================

  const getWorkerId = (worker) => {
    if (!worker) return "";

    return String(
      worker?._id ||
        worker?.worker?._id ||
        worker?.worker ||
        ""
    );
  };

  // ======================================================
  // RUN REPORT
  // ======================================================

  const runReport = useCallback(async () => {
    try {
      setLoading(true);

      setReportData([]);
      setLabourReport(null);

      // ==================================================
      // SALES
      // ==================================================

      if (activeReport === "sales_summary") {
        const response =
          await reportService.getSalesSummaryReport(
            filters
          );

        const data = extractData(response);

        setReportData(
          Array.isArray(data) ? data : []
        );

        return;
      }

      // ==================================================
      // STOCK
      // ==================================================

      if (activeReport === "stock_overall") {
        const response =
          await reportService.getStockReport(
            filters
          );

        const data = extractData(response);

        setReportData(
          Array.isArray(data) ? data : []
        );

        return;
      }

      // ==================================================
      // LABOUR REPORT
      // ==================================================

      if (activeReport === "labour") {
        if (!filters.worker) {
          toast.error("Please select a worker");
          return;
        }

        // ------------------------------------------------
        // MONTH RANGE
        // ------------------------------------------------

        const { fromDate, toDate } =
          getMonthDateRange(
            filters.month,
            filters.year
          );

        const params = {
          worker: filters.worker,
          month: Number(filters.month),
          year: Number(filters.year),
        };

        // ------------------------------------------------
        // IMPORTANT:
        // Attendance uses month/year.
        // Wages/payments/outstanding use dates.
        // ------------------------------------------------

        const [
          attendanceResponse,
          wagesResponse,
          paymentsResponse,
          outstandingResponse,
        ] = await Promise.all([
          reportService.getMonthlyAttendanceReport(
            params
          ),

          reportService.getLabourWageReport({
            worker: filters.worker,
            fromDate,
            toDate,
          }),

          reportService.getLabourPaymentReport({
            worker: filters.worker,
            fromDate,
            toDate,
          }),

          reportService.getLabourOutstandingReport({
            worker: filters.worker,
            fromDate,
            toDate,
          }),
        ]);

        // ------------------------------------------------
        // EXTRACT
        // ------------------------------------------------

        const attendanceData =
          extractData(attendanceResponse);

        const wagesData =
          extractData(wagesResponse);

        const paymentsData =
          extractData(paymentsResponse);

        const outstandingData =
          extractData(outstandingResponse);

        // ------------------------------------------------
        // ATTENDANCE
        // ------------------------------------------------

        const attendance = toArray(
          attendanceData?.attendance ??
          attendanceData
        );

        // ------------------------------------------------
        // PAYMENTS
        // ------------------------------------------------

        const payments = toArray(
          paymentsData?.payments ??
          paymentsData
        );

        // ------------------------------------------------
        // WAGES
        // ------------------------------------------------

        const wageRows = toArray(wagesData);

        const wageObject =
          wageRows[0] || {};

        const selectedWorker =
          workers.find(
            (worker) =>
              getWorkerId(worker) &&
              getWorkerId(worker) ===
                String(filters.worker)
          );

        const dailyWage =
          getNumber(
            wageObject,
            [
              "dailyWage",
              "wagePerDay",
              "rate",
              "salaryPerDay",
              "wage",
            ]
          ) ||
          Number(
            selectedWorker?.dailyWage || 0
          );

        // ------------------------------------------------
        // ATTENDANCE COUNTS
        // ------------------------------------------------

        let presentDays = 0;
        let absentDays = 0;
        let leaveDays = 0;

        attendance.forEach((item) => {
          const status =
            String(
              item?.status || ""
            ).toLowerCase();

          if (status === "present") {
            presentDays++;
          }

          if (status === "absent") {
            absentDays++;
          }

          if (status === "leave") {
            leaveDays++;
          }
        });

        // ------------------------------------------------
        // TOTAL WAGES
        // ------------------------------------------------

        let totalWages =
          getNumber(
            wageObject,
            [
              "totalWages",
              "totalWage",
              "earnedWages",
              "totalSalary",
              "totalWagesEarned",
            ]
          );

        if (
          totalWages === 0 &&
          dailyWage > 0
        ) {
          totalWages =
            presentDays * dailyWage;
        }

        // ------------------------------------------------
        // PAYMENT TOTALS
        // ------------------------------------------------

        let totalPaid = 0;
        let salaryPaid = 0;
        let advancePaid = 0;

        if (Array.isArray(payments)) {
          payments.forEach((payment) => {
            const amount =
              Number(payment?.amount || 0);

            totalPaid += amount;

            const type =
              String(
                payment?.paymentType ||
                  payment?.type ||
                  ""
              ).toLowerCase();

            if (type === "advance") {
              advancePaid += amount;
            } else {
              salaryPaid += amount;
            }
          });
        }

        // ------------------------------------------------
        // PAYMENT DATE MAP
        // ------------------------------------------------

        const paymentMap = {};

        payments.forEach((payment) => {
          const rawDate =
            payment?.paymentDate ||
            payment?.date ||
            payment?.createdAt;

          if (!rawDate) return;

          const key = getDateKey(rawDate);

          if (!key) return;

          if (!paymentMap[key]) {
            paymentMap[key] = {
              total: 0,
              salary: 0,
              advance: 0,
              records: [],
            };
          }

          const amount =
            Number(payment?.amount || 0);

          const type =
            String(
              payment?.paymentType ||
                payment?.type ||
                "salary"
            ).toLowerCase();

          paymentMap[key].total += amount;

          if (type === "advance") {
            paymentMap[key].advance += amount;
          } else {
            paymentMap[key].salary += amount;
          }

          paymentMap[key].records.push(
            payment
          );
        });

        // ------------------------------------------------
        // ATTENDANCE DATE MAP
        // ------------------------------------------------

        const attendanceMap = {};

        attendance.forEach((item) => {
          const rawDate =
            item?.date ||
            item?.attendanceDate ||
            item?.attendance_date;

          if (!rawDate) return;

          const key = getDateKey(rawDate);

          if (!key) return;

          attendanceMap[key] = item;
        });

        // ------------------------------------------------
        // CREATE NOTEBOOK STYLE LEDGER
        // ------------------------------------------------

        const ledgerMap = {};

        Object.keys(attendanceMap).forEach(
          (date) => {
            ledgerMap[date] = {
              date,
              attendance:
                attendanceMap[date],
              payment:
                paymentMap[date] || null,
            };
          }
        );

        Object.keys(paymentMap).forEach(
          (date) => {
            if (!ledgerMap[date]) {
              ledgerMap[date] = {
                date,
                attendance: null,
                payment:
                  paymentMap[date],
              };
            }
          }
        );

        const ledgerRows = Object.values(
          ledgerMap
        ).sort(
          (a, b) =>
            new Date(a.date) -
            new Date(b.date)
        );

        // ------------------------------------------------
        // RUNNING BALANCE
        // ------------------------------------------------

        let runningBalance = 0;

        const finalLedger =
          ledgerRows.map((row) => {
            const status =
              String(
                row?.attendance?.status ||
                  ""
              ).toLowerCase();

            let earned = 0;

            if (status === "present") {
              earned = dailyWage;
            }

            const paid =
              Number(
                row?.payment?.total || 0
              );

            runningBalance =
              runningBalance +
              earned -
              paid;

            return {
              ...row,
              earned,
              paid,
              runningBalance,
            };
          });

        // ------------------------------------------------
        // OUTSTANDING API VALUE
        // ------------------------------------------------

        const outstandingRows = toArray(outstandingData);

        const outstandingObject =
          outstandingRows.length > 0
            ? outstandingRows.find(
                (row) =>
                  String(
                    row?.workerId ||
                      row?.worker?._id ||
                      row?.worker ||
                      ""
                  ) ===
                  String(filters.worker)
              ) || outstandingRows[0] || {}
            : outstandingData || {};

        const balanceKeys = [
          "remainingBalance",
          "outstandingBalance",
          "balance",
          "remaining",
        ];

        const hasApiBalance = balanceKeys.some(
          (key) =>
            outstandingObject?.[key] !== undefined &&
            outstandingObject?.[key] !== null &&
            outstandingObject?.[key] !== ""
        );

        let finalBalance = getNumber(
          outstandingObject,
          balanceKeys
        );

        // Only fall back to the calculated balance when the API did not
        // provide a balance at all.
        if (!hasApiBalance) {
          finalBalance = runningBalance;
        }

        // ------------------------------------------------
        // FINAL REPORT
        // ------------------------------------------------

        setLabourReport({
          worker:
            selectedWorker || null,

          month: Number(
            filters.month
          ),

          year: Number(
            filters.year
          ),

          fromDate,
          toDate,

          attendance,

          payments,

          ledger: finalLedger,

          summary: {
            presentDays,
            absentDays,
            leaveDays,
            totalMarkedDays:
              presentDays +
              absentDays +
              leaveDays,
          },

          wages: {
            dailyWage,
            totalWages,
          },

          paymentSummary: {
            salaryPaid,
            advancePaid,
            totalPaid,
          },

          balance: finalBalance,
        });

        return;
      }
    } catch (error) {
      console.error(
        "Report error:",
        error
      );

      toast.error(
        error?.response?.data?.message ||
          "Failed to load report"
      );

      setReportData([]);
      setLabourReport(null);
    } finally {
      setLoading(false);
    }
  }, [
    activeReport,
    filters,
    workers,
  ]);

  // ======================================================
  // SELECTED WORKER
  // ======================================================

  const selectedWorker = useMemo(
    () =>
      workers.find(
        (worker) =>
          getWorkerId(worker) ===
          String(filters.worker)
      ),
    [workers, filters.worker]
  );

  // ======================================================
  // MONTH NAME
  // ======================================================

  const monthName = new Date(
    Number(filters.year),
    Number(filters.month) - 1,
    1
  ).toLocaleString("en-US", {
    month: "long",
  });

  // ======================================================
  // EXPORT
  // ======================================================

  const handleExport = () => {
    if (activeReport === "labour") {
      if (!labourReport) {
        toast.error(
          "Generate a report first"
        );

        return;
      }

      const rows = [
        [
          "Labour Report",
        ],

        [
          "Worker",
          labourReport.worker?.name ||
            "",
        ],

        [
          "Month",
          `${monthName} ${filters.year}`,
        ],

        [],

        [
          "Date",
          "Day",
          "Attendance",
          "Earned",
          "Payment",
          "Balance",
        ],

        ...(labourReport.ledger || []).map(
          (row) => [
            formatShortDate(
              row.date
            ),

            getDayName(
              row.date
            ),

            String(
              row?.attendance?.status ||
                "-"
            ),

            row.earned || 0,

            row.paid || 0,

            row.runningBalance || 0,
          ]
        ),

        [],

        [
          "Present Days",
          labourReport.summary.presentDays,
        ],

        [
          "Absent Days",
          labourReport.summary.absentDays,
        ],

        [
          "Leave Days",
          labourReport.summary.leaveDays,
        ],

        [
          "Daily Wage",
          labourReport.wages.dailyWage,
        ],

        [
          "Total Wages",
          labourReport.wages.totalWages,
        ],

        [
          "Salary Paid",
          labourReport.paymentSummary.salaryPaid,
        ],

        [
          "Advance Paid",
          labourReport.paymentSummary.advancePaid,
        ],

        [
          "Total Paid",
          labourReport.paymentSummary.totalPaid,
        ],

        [
          "Remaining Balance",
          labourReport.balance,
        ],
      ];

      const csv = rows
        .map((row) =>
          row
            .map(
              (value) =>
                `"${String(
                  value ?? ""
                ).replace(
                  /"/g,
                  '""'
                )}"`
            )
            .join(",")
        )
        .join("\n");

      const blob = new Blob(
        [csv],
        {
          type:
            "text/csv;charset=utf-8;",
        }
      );

      const url =
        URL.createObjectURL(blob);

      const link =
        document.createElement("a");

      link.href = url;

      link.download =
        `${
          selectedWorker?.name ||
          "labour"
        }-labour-report.csv`;

      document.body.appendChild(link);

      link.click();

      document.body.removeChild(link);

      URL.revokeObjectURL(url);

      return;
    }

    if (!reportData.length) {
      toast.error(
        "No report data available"
      );

      return;
    }

    const columns =
      Object.keys(
        reportData[0]
      ).filter(
        (key) =>
          !isHiddenField(key) &&
          typeof reportData[0][key] !==
            "object"
      );

    const headers =
      columns.map(
        formatColumnName
      );

    const rows =
      reportData.map((row) =>
        columns
          .map(
            (column) =>
              `"${String(
                row[column] ?? ""
              ).replace(
                /"/g,
                '""'
              )}"`
          )
          .join(",")
      );

    const csv = [
      headers.join(","),
      ...rows,
    ].join("\n");

    const blob = new Blob(
      [csv],
      {
        type:
          "text/csv;charset=utf-8;",
      }
    );

    const url =
      URL.createObjectURL(blob);

    const link =
      document.createElement("a");

    link.href = url;

    link.download =
      `${activeReport}.csv`;

    document.body.appendChild(link);

    link.click();

    document.body.removeChild(link);

    URL.revokeObjectURL(url);
  };

  // ======================================================
  // PRINT
  // ======================================================

  const handlePrint = () => {
    if (
      activeReport === "labour"
        ? !labourReport
        : !reportData.length
    ) {
      toast.error(
        "Generate a report first"
      );

      return;
    }

    window.print();
  };

  // ======================================================
  // NORMAL COLUMNS
  // ======================================================

  const normalColumns =
    reportData.length
      ? Object.keys(
          reportData[0]
        ).filter(
          (key) =>
            !isHiddenField(key) &&
            typeof reportData[0][key] !==
              "object"
        )
        : [];

  // ======================================================
  // JSX
  // ======================================================

  return (
    <div className="min-h-screen overflow-x-hidden bg-slate-100">

      {/* ==================================================
          SIDEBAR
      ================================================== */}

      <div className="no-print">
         <Sidebar isOpen={isSidebarOpen} setIsOpen={setIsSidebarOpen} />
      </div>

      {/* ==================================================
          MAIN
      ================================================== */}

       <div
        className={`flex-1 min-w-0 transition-all duration-300 ease-in-out ${
          isSidebarOpen ? "ml-0 lg:ml-72" : "ml-0 lg:ml-20"
        }`}
      >

        {/* NAVBAR */}

        <div className="no-print">
          <Navbar
          isSidebarOpen={isSidebarOpen}
          setIsSidebarOpen={setIsSidebarOpen}
        />
        </div>

        <main className="mx-auto mt-24 max-w-[1600px] space-y-6 p-4 md:p-6 lg:p-8">

          {/* ==================================================
              HEADER
          ================================================== */}

          <div className="no-print flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">

            <div>
              <h1 className="text-3xl font-bold text-slate-900">
                Reports
              </h1>

              <p className="mt-1 text-sm text-slate-500">
                View business reports.
              </p>
            </div>

            <div className="flex gap-2">

              <button
                onClick={handlePrint}
                className="flex items-center gap-2 rounded-xl border border-slate-300 bg-white px-5 py-3 font-semibold text-slate-700 hover:bg-slate-50"
              >
                <Printer size={18} />
                Print
              </button>

              <button
                onClick={handleExport}
                className="flex items-center gap-2 rounded-xl bg-[#1E3A8A] px-5 py-3 font-semibold text-white hover:bg-[#17307A]"
              >
                <Download size={18} />
                Export
              </button>

            </div>

          </div>

          {/* ==================================================
              FILTER
          ================================================== */}

          <div className="no-print rounded-3xl border border-slate-200 bg-white p-5 shadow-sm md:p-6">

            <h2 className="text-xl font-bold text-slate-900">
              Generate Report
            </h2>

            <p className="mt-1 text-sm text-slate-500">
              Select report and filters.
            </p>

            <div className="mt-6 grid grid-cols-1 gap-5 md:grid-cols-2 lg:grid-cols-4">

              {/* REPORT */}

              <div
                className={
                  activeReport === "labour"
                    ? "lg:col-span-2"
                    : "lg:col-span-2"
                }
              >
                <label className="mb-2 block text-sm font-medium text-slate-700">
                  Report
                </label>

                <select
                  value={activeReport}
                  onChange={
                    handleReportChange
                  }
                  className="h-12 w-full rounded-xl border border-slate-300 bg-white px-4 outline-none focus:border-[#1E3A8A]"
                >
                  <optgroup label="Sales">
                    <option value="sales_summary">
                      Sales Report
                    </option>
                  </optgroup>

                  <optgroup label="Stock">
                    <option value="stock_overall">
                      Stock Report
                    </option>
                  </optgroup>

                  <optgroup label="Labour">
                    <option value="labour">
                      Labour Report
                    </option>
                  </optgroup>
                </select>
              </div>

              {/* SALES DATE */}

              {activeReport ===
                "sales_summary" && (
                <>
                  <div>
                    <label className="mb-2 block text-sm font-medium text-slate-700">
                      From Date
                    </label>

                    <input
                      type="date"
                      value={
                        filters.fromDate
                      }
                      onChange={(e) =>
                        handleChange(
                          "fromDate",
                          e.target.value
                        )
                      }
                      className="h-12 w-full rounded-xl border border-slate-300 bg-white px-4"
                    />
                  </div>

                  <div>
                    <label className="mb-2 block text-sm font-medium text-slate-700">
                      To Date
                    </label>

                    <input
                      type="date"
                      value={
                        filters.toDate
                      }
                      onChange={(e) =>
                        handleChange(
                          "toDate",
                          e.target.value
                        )
                      }
                      className="h-12 w-full rounded-xl border border-slate-300 bg-white px-4"
                    />
                  </div>
                </>
              )}

              {/* LABOUR WORKER */}

              {activeReport ===
                "labour" && (
                <div>
                  <label className="mb-2 block text-sm font-medium text-slate-700">
                    Worker
                  </label>

                  <select
                    value={
                      filters.worker
                    }
                    onChange={(e) =>
                      handleChange(
                        "worker",
                        e.target.value
                      )
                    }
                    className="h-12 w-full rounded-xl border border-slate-300 bg-white px-4"
                  >
                    <option value="">
                      Select Worker
                    </option>

                    {workers.map(
                      (worker) => (
                        <option
                          key={
                            worker._id
                          }
                          value={
                            worker._id
                          }
                        >
                          {
                            worker.name
                          }
                        </option>
                      )
                    )}
                  </select>
                </div>
              )}

              {/* LABOUR MONTH */}

              {activeReport ===
                "labour" && (
                <div>
                  <label className="mb-2 block text-sm font-medium text-slate-700">
                    Month
                  </label>

                  <select
                    value={
                      filters.month
                    }
                    onChange={(e) =>
                      handleChange(
                        "month",
                        e.target.value
                      )
                    }
                    className="h-12 w-full rounded-xl border border-slate-300 bg-white px-4"
                  >
                    {Array.from(
                      {
                        length: 12,
                      },
                      (_, index) => (
                        <option
                          key={
                            index + 1
                          }
                          value={
                            index + 1
                          }
                        >
                          {new Date(
                            Number(
                              filters.year
                            ),
                            index,
                            1
                          ).toLocaleString(
                            "en-US",
                            {
                              month:
                                "long",
                            }
                          )}
                        </option>
                      )
                    )}
                  </select>
                </div>
              )}

              {/* LABOUR YEAR */}

              {activeReport ===
                "labour" && (
                <div>
                  <label className="mb-2 block text-sm font-medium text-slate-700">
                    Year
                  </label>

                  <input
                    type="number"
                    value={
                      filters.year
                    }
                    onChange={(e) =>
                      handleChange(
                        "year",
                        e.target.value
                      )
                    }
                    className="h-12 w-full rounded-xl border border-slate-300 bg-white px-4"
                  />
                </div>
              )}

            </div>

            {/* RUN */}

            <div className="mt-6 flex justify-end">

              <button
                onClick={runReport}
                disabled={
                  loading ||
                  (
                    activeReport ===
                      "labour" &&
                    !filters.worker
                  )
                }
                className="flex h-12 items-center gap-2 rounded-xl bg-[#1E3A8A] px-7 font-semibold text-white hover:bg-[#17307A] disabled:cursor-not-allowed disabled:opacity-50"
              >

                {loading ? (
                  <>
                    <Loader2
                      size={18}
                      className="animate-spin"
                    />

                    Loading...
                  </>
                ) : (
                  <>
                    <FileText size={18} />

                    Run Report
                  </>
                )}

              </button>

            </div>

          </div>

          {/* ==================================================
              LABOUR REPORT
          ================================================== */}

        {activeReport === "labour" && labourReport && (
  <div
    id="printable-report"
    className="rounded-3xl border border-slate-200 bg-white shadow-sm"
  >
    {/* =====================================================
        PRINT ONLY HEADER
    ===================================================== */}

    <div className="print-only print-header">
      <h1 className="print-company-name">
        LABOUR MANAGEMENT SYSTEM
      </h1>

      <p className="print-report-title">
        LABOUR ATTENDANCE & PAYMENT REPORT
      </p>

      <div className="print-info-grid">
        <div>
          <span>Worker Name</span>
          <strong>
            {labourReport.worker?.name ||
              selectedWorker?.name ||
              "Labour"}
          </strong>
        </div>

        <div>
          <span>Report Period</span>
          <strong>
            {monthName} {filters.year}
          </strong>
        </div>

        <div>
          <span>Daily Wage</span>
          <strong>
            {formatCurrency(
              labourReport.wages?.dailyWage
            )}
          </strong>
        </div>

        <div>
          <span>Report Date</span>
          <strong>
            {new Date().toLocaleDateString("en-GB")}
          </strong>
        </div>
      </div>
    </div>

    {/* =====================================================
        SCREEN HEADER
    ===================================================== */}

    <div className="screen-only border-b border-slate-200 p-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <p className="text-xs font-bold uppercase tracking-widest text-[#1E3A8A]">
            Labour Report
          </p>

          <h2 className="mt-1 text-2xl font-bold text-slate-900">
            {labourReport.worker?.name ||
              selectedWorker?.name ||
              "Labour"}
          </h2>

          <p className="mt-1 text-sm text-slate-500">
            {monthName} {filters.year}
          </p>
        </div>

        <div className="text-left sm:text-right">
          <p className="text-xs uppercase tracking-wide text-slate-400">
            Daily Wage
          </p>

          <p className="text-lg font-bold text-slate-900">
            {formatCurrency(
              labourReport.wages?.dailyWage
            )}
          </p>
        </div>
      </div>
    </div>

    {/* =====================================================
        SCREEN SUMMARY
    ===================================================== */}

    <div className="screen-only grid grid-cols-1 gap-4 p-6 md:grid-cols-3">
      <div className="rounded-2xl bg-green-50 p-5">
        <p className="text-sm font-medium text-green-700">
          Present Days
        </p>

        <p className="mt-2 text-3xl font-bold text-green-700">
          {labourReport.summary?.presentDays || 0}
        </p>
      </div>

      <div className="rounded-2xl bg-red-50 p-5">
        <p className="text-sm font-medium text-red-700">
          Absent Days
        </p>

        <p className="mt-2 text-3xl font-bold text-red-700">
          {labourReport.summary?.absentDays || 0}
        </p>
      </div>

      <div className="rounded-2xl bg-orange-50 p-5">
        <p className="text-sm font-medium text-orange-700">
          Leave Days
        </p>

        <p className="mt-2 text-3xl font-bold text-orange-700">
          {labourReport.summary?.leaveDays || 0}
        </p>
      </div>
    </div>

    {/* =====================================================
        PROFESSIONAL LEDGER TABLE
    ===================================================== */}

    <div className="p-5 sm:p-6">

      <div className="screen-only mb-4">
        <h3 className="text-lg font-bold text-slate-900">
          Attendance & Payment History
        </h3>

        <p className="mt-1 text-xs text-slate-500">
          Daily attendance, wages, payments and balance
        </p>
      </div>

      <div className="overflow-x-auto">
        <table className="labour-print-table w-full min-w-[850px]">

          <thead>
            <tr>

              <th className="w-[55px] ">
                #
              </th>

              <th>
                Date
              </th>

              <th>
                Day
              </th>

              <th className="text-center">
                Present
              </th>

              <th className="text-center">
                Absent
              </th>

              <th className="text-right">
                Amount
              </th>

              <th className="text-right">
                Payment
              </th>

              <th className="text-right">
                Balance
              </th>

            </tr>
          </thead>

          <tbody>
            {(labourReport.ledger || []).length === 0 ? (
              <tr>
                <td
                  colSpan="8"
                  className="py-12 text-center text-sm text-slate-400"
                >
                  No attendance or payment records found.
                </td>
              </tr>
            ) : (
              (labourReport.ledger || []).map(
                (row, index) => {

                  const status = String(
                    row?.attendance?.status || ""
                  ).toLowerCase();

                  const present =
                    status === "present";

                  const absent =
                    status === "absent";

                  const leave =
                    status === "leave";

                  return (
                    <tr
                      key={`${row.date}-${index}`}
                    >

                      <td className="text-center">
                        {index + 1}
                      </td>

                      <td className="font-semibold">
                        {formatDate(row.date)}
                      </td>

                      <td>
                        {getDayName(row.date)}
                      </td>

                      <td className="text-center">

                        {present ? (
                          <span className="attendance-mark">
                            ✓
                          </span>
                        ) : (
                          "—"
                        )}

                      </td>

                      <td className="text-center">

                        {absent ? (
                          <span className="attendance-mark">
                            ×
                          </span>
                        ) : leave ? (
                          <span className="leave-print">
                            Leave
                          </span>
                        ) : (
                          "—"
                        )}

                      </td>

                      <td className="text-right">
                        {Number(row.earned || 0) > 0
                          ? formatCurrency(row.earned)
                          : "—"}
                      </td>

                      <td className="text-right font-semibold">
                        {Number(row.paid || 0) > 0
                          ? formatCurrency(row.paid)
                          : "—"}
                      </td>

                      <td className="text-right font-bold">
                        {formatCurrency(
                          row.runningBalance || 0
                        )}
                      </td>

                    </tr>
                  );
                }
              )
            )}
          </tbody>

        </table>
      </div>

      {/* =====================================================
          TOTALS
      ===================================================== */}

     <div className="mt-6 grid grid-cols-1 gap-4 md:grid-cols-3">

  <div className="summary-box">
    <span>
      Total Wages
    </span>

    <strong>
      {formatCurrency(
        labourReport.wages?.totalWages
      )}
    </strong>
  </div>

  <div className="summary-box">
    <span>
      Total Paid
    </span>

    <strong>
      {formatCurrency(
        labourReport.paymentSummary?.totalPaid ??
        labourReport.payments?.totalPaid
      )}
    </strong>
  </div>

  <div className="summary-box balance-box">
    <span>
      Remaining Balance
    </span>

    <strong>
      {formatCurrency(
        labourReport.balance
      )}
    </strong>
  </div>

</div>

      {/* =====================================================
          PRINT TOTALS
      ===================================================== */}

      <div className="print-only print-total-section">

        <div className="print-total-row">
          <span>
            Total Present Days
          </span>

          <strong>
            {labourReport.summary?.presentDays || 0}
          </strong>
        </div>

        <div className="print-total-row">
          <span>
            Total Absent Days
          </span>

          <strong>
            {labourReport.summary?.absentDays || 0}
          </strong>
        </div>

        <div className="print-total-row">
          <span>
            Total Leave Days
          </span>

          <strong>
            {labourReport.summary?.leaveDays || 0}
          </strong>
        </div>

        <div className="print-total-row">
          <span>
            Daily Wage
          </span>

          <strong>
            {formatCurrency(
              labourReport.wages?.dailyWage
            )}
          </strong>
        </div>

        <div className="print-total-row">
          <span>
            Total Wages
          </span>

          <strong>
            {formatCurrency(
              labourReport.wages?.totalWages
            )}
          </strong>
        </div>

        <div className="print-total-row">
          <span>
            Total Payments
          </span>

          <strong>
            {formatCurrency(
              labourReport.paymentSummary?.totalPaid ??
              labourReport.payments?.totalPaid
            )}
          </strong>
        </div>

        <div className="print-total-row print-final-balance">
          <span>
            Remaining Balance
          </span>

          <strong>
            {formatCurrency(
              labourReport.balance
            )}
          </strong>
        </div>

      </div>

      {/* =====================================================
          PRINT FOOTER
      ===================================================== */}

      <div className="print-only print-footer">
        <span>
          Labour Attendance & Payment Report
        </span>

        <span>
          Generated on{" "}
          {new Date().toLocaleDateString("en-GB")}
        </span>
      </div>

    </div>

  </div>
)}

          {/* ==================================================
              NORMAL SALES / STOCK REPORT
          ================================================== */}

          {activeReport !==
            "labour" && (
            <div
              id="printable-report"
              className="overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-sm"
            >

              {loading && (
                <div className="flex min-h-[280px] flex-col items-center justify-center">

                  <Loader2
                    size={35}
                    className="animate-spin text-[#1E3A8A]"
                  />

                  <p className="mt-3 text-sm text-slate-500">
                    Loading report...
                  </p>

                </div>
              )}

              {!loading &&
                reportData.length ===
                  0 && (
                  <div className="flex min-h-[280px] flex-col items-center justify-center p-8 text-center">

                    <FileText
                      size={40}
                      className="text-slate-300"
                    />

                    <h3 className="mt-3 font-semibold text-slate-700">
                      No records found
                    </h3>

                    <p className="mt-1 text-sm text-slate-400">
                      Select filters and
                      run the report.
                    </p>

                  </div>
                )}

              {!loading &&
                reportData.length >
                  0 && (
                  <div className="w-full overflow-x-auto">

                    <table className="w-full min-w-[600px]">

                      <thead>

                        <tr className="border-b border-slate-200 bg-slate-50">

                          {normalColumns.map(
                            (column) => (
                              <th
                                key={
                                  column
                                }
                                className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wide text-slate-500"
                              >
                                {formatColumnName(
                                  column
                                )}
                              </th>
                            )
                          )}

                        </tr>

                      </thead>

                      <tbody>

                        {reportData.map(
                          (
                            row,
                            index
                          ) => (
                            <tr
                              key={
                                row._id ||
                                index
                              }
                              className="border-b border-slate-100 hover:bg-slate-50"
                            >

                              {normalColumns.map(
                                (
                                  column
                                ) => {

                                  const value =
                                    row[
                                      column
                                    ];

                                  return (
                                    <td
                                      key={
                                        column
                                      }
                                      className={`px-6 py-4 text-sm ${
                                        isMoneyField(
                                          column
                                        )
                                          ? "font-semibold text-slate-800"
                                          : "text-slate-700"
                                      }`}
                                    >

                                      {isMoneyField(
                                        column
                                      )
                                        ? formatCurrency(
                                            value
                                          )
                                        : String(
                                            value ??
                                              ""
                                          )}

                                    </td>
                                  );
                                }
                              )}

                            </tr>
                          )
                        )}

                      </tbody>

                    </table>

                  </div>
                )}

            </div>
          )}

        </main>

      </div>

      {/* ==================================================
          PRINT CSS
      ================================================== */}

      <style>{`
  /* =====================================================
     LABOUR SCREEN SUMMARY
  ===================================================== */
.labour-print-table {
  width: 100%;
  border-collapse: collapse;
  border: 1px solid #cbd5e1;
}

.labour-print-table th,
.labour-print-table td {
  border: 1px solid #cbd5e1;
  padding: 10px 8px;
}

.labour-print-table th {
  background: #f8fafc;
  font-weight: 700;
  color: #0f172a;
}

.labour-print-table tbody tr:hover {
  background: #f8fafc;
}
  .summary-box {
    display: flex;
    align-items: center;
    justify-content: space-between;

    min-height: 82px;

    padding: 18px 20px;

    border: 1px solid #e2e8f0;

    border-radius: 14px;

    background: #ffffff;

    gap: 20px;
  }

  .summary-box span {
    font-size: 14px;

    font-weight: 500;

    color: #64748b;

    white-space: nowrap;
  }

  .summary-box strong {
    font-size: 18px;

    font-weight: 700;

    color: #0f172a;

    white-space: nowrap;

    text-align: right;
  }

  .balance-box {
    background: #f8fafc;

    border-color: #cbd5e1;
  }

  .balance-box span {
    color: #475569;

    font-weight: 600;
  }

  .balance-box strong {
    font-size: 19px;

    color: #1e3a8a;
  }

  @media (max-width: 767px) {

    .summary-box {
      min-height: 72px;

      padding: 15px 16px;
    }

    .summary-box strong {
      font-size: 16px;
    }

  }

  /* =====================================================
     PRINT MUST STAY EXACTLY AS BEFORE
  ===================================================== */

  @media print {

    .summary-box,
    .balance-box {
      display: none !important;
    }

  }
  /* =====================================================
     SCREEN ONLY
  ===================================================== */

  .print-only {
    display: none;
  }

  /* =====================================================
     PRINT
  ===================================================== */

  @media print {

    @page {
      size: A4 portrait;
      margin: 12mm;
    }

    html,
    body {
      margin: 0 !important;
      padding: 0 !important;

      background: #fff !important;
      color: #000 !important;

      font-family:
        Arial,
        Helvetica,
        sans-serif !important;

      -webkit-print-color-adjust: exact !important;
      print-color-adjust: exact !important;
    }

    /* Hide complete application */

    body * {
      visibility: hidden !important;
    }

    /* Show report only */

    #printable-report,
    #printable-report * {
      visibility: visible !important;
    }

    #printable-report {
      position: absolute !important;

      top: 0 !important;
      left: 0 !important;

      width: 100% !important;

      margin: 0 !important;
      padding: 0 !important;

      background: #fff !important;

      border: none !important;
      border-radius: 0 !important;

      box-shadow: none !important;

      color: #000 !important;
    }

    /* Hide screen UI */

    .screen-only,
    .no-print {
      display: none !important;
    }

    .print-only {
      display: block !important;
    }

    /* =================================================
       PRINT HEADER
    ================================================= */

    .print-header {
      display: block !important;

      margin-bottom: 18px !important;

      padding-bottom: 12px !important;

      border-bottom: 2px solid #000 !important;
    }

    .print-company-name {
      margin: 0 !important;

      text-align: center !important;

      font-size: 20px !important;

      line-height: 1.3 !important;

      font-weight: 700 !important;

      letter-spacing: 0.5px !important;

      color: #000 !important;
    }

    .print-report-title {
      margin: 4px 0 0 !important;

      text-align: center !important;

      font-size: 13px !important;

      line-height: 1.3 !important;

      font-weight: 700 !important;

      text-transform: uppercase !important;

      letter-spacing: 1px !important;

      color: #000 !important;
    }

    .print-info-grid {
      display: grid !important;

      grid-template-columns: 1fr 1fr !important;

      gap: 7px 25px !important;

      margin-top: 15px !important;
    }

    .print-info-grid > div {
      display: flex !important;

      justify-content: space-between !important;

      gap: 15px !important;

      padding-bottom: 4px !important;

      border-bottom: 1px solid #999 !important;

      font-size: 10px !important;

      color: #000 !important;
    }

    .print-info-grid span {
      font-weight: 400 !important;
      color: #000 !important;
    }

    .print-info-grid strong {
      font-weight: 700 !important;
      color: #000 !important;
      text-align: right !important;
    }

    /* =================================================
       TABLE
    ================================================= */

    .labour-print-table {
      width: 100% !important;

      min-width: 0 !important;

      border-collapse: collapse !important;

      border-spacing: 0 !important;

      table-layout: fixed !important;

      font-size: 9.5px !important;

      color: #000 !important;
    }

    .labour-print-table thead {
      display: table-header-group !important;
    }

    .labour-print-table tbody {
      display: table-row-group !important;
    }

    .labour-print-table tr {
      page-break-inside: avoid !important;

      break-inside: avoid !important;
    }

    .labour-print-table th {
      padding: 7px 5px !important;

      border: 1px solid #000 !important;

      background: #fff !important;

      color: #000 !important;

      font-size: 8.5px !important;

      font-weight: 700 !important;

      text-align: center !important;

      text-transform: uppercase !important;

      letter-spacing: 0.2px !important;
    }

    .labour-print-table td {
      padding: 6px 5px !important;

      border: 1px solid #555 !important;

      background: #fff !important;

      color: #000 !important;

      font-size: 9.5px !important;

      vertical-align: middle !important;
    }

    .labour-print-table th:nth-child(1),
    .labour-print-table td:nth-child(1) {
      width: 6% !important;
      text-align: center !important;
    }

    .labour-print-table th:nth-child(2),
    .labour-print-table td:nth-child(2) {
      width: 14% !important;
    }

    .labour-print-table th:nth-child(3),
    .labour-print-table td:nth-child(3) {
      width: 15% !important;
    }

    .labour-print-table th:nth-child(4),
    .labour-print-table td:nth-child(4) {
      width: 10% !important;
    }

    .labour-print-table th:nth-child(5),
    .labour-print-table td:nth-child(5) {
      width: 10% !important;
    }

    .labour-print-table th:nth-child(6),
    .labour-print-table td:nth-child(6) {
      width: 15% !important;
      text-align: right !important;
    }

    .labour-print-table th:nth-child(7),
    .labour-print-table td:nth-child(7) {
      width: 15% !important;
      text-align: right !important;
    }

    .labour-print-table th:nth-child(8),
    .labour-print-table td:nth-child(8) {
      width: 15% !important;
      text-align: right !important;
    }

    .attendance-mark {
      font-size: 13px !important;

      font-weight: 700 !important;

      color: #000 !important;
    }

    .leave-print {
      font-weight: 700 !important;

      color: #000 !important;
    }

    /* =================================================
       PRINT TOTALS
    ================================================= */

    .print-total-section {
      display: block !important;

      width: 48% !important;

      margin-top: 15px !important;

      margin-left: auto !important;

      border: 1px solid #000 !important;
    }

    .print-total-row {
      display: flex !important;

      justify-content: space-between !important;

      padding: 6px 9px !important;

      border-bottom: 1px solid #999 !important;

      font-size: 10px !important;

      color: #000 !important;
    }

    .print-total-row:last-child {
      border-bottom: none !important;
    }

    .print-total-row span {
      color: #000 !important;
    }

    .print-total-row strong {
      color: #000 !important;

      font-weight: 700 !important;
    }

    .print-final-balance {
      border-top: 2px solid #000 !important;

      font-size: 11px !important;

      font-weight: 700 !important;
    }

    /* =================================================
       FOOTER
    ================================================= */

    .print-footer {
      display: flex !important;

      justify-content: space-between !important;

      margin-top: 25px !important;

      padding-top: 7px !important;

      border-top: 1px solid #000 !important;

      font-size: 8px !important;

      color: #000 !important;
    }

    /* Remove all screen decoration */

    #printable-report .rounded-3xl,
    #printable-report .rounded-2xl,
    #printable-report .rounded-xl {
      border-radius: 0 !important;
    }

    #printable-report .shadow-sm {
      box-shadow: none !important;
    }

    /* Prevent weird page breaks */

    .labour-print-table,
    .print-total-section,
    .print-footer {
      page-break-inside: avoid !important;

      break-inside: avoid !important;
    }

  }

`}</style>

    </div>
  );
}

export default Reports;