import { useState, useEffect, useCallback } from "react";
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
    value.includes("balance")
  );
};

// ======================================================
// ONLY 3 MAIN REPORT TYPES
// ======================================================

const REPORTS = [
  // SALES
  {
    id: "sales_summary",
    name: "Sales Report",
    category: "Sales",
  },

  // STOCK
  {
    id: "stock_overall",
    name: "Stock Report",
    category: "Stock",
  },

  // LABOUR
  {
    id: "labour",
    name: "Labour Report",
    category: "Labour",
  },
];

// ======================================================
// COMPONENT
// ======================================================

function Reports() {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);

  const [workers, setWorkers] = useState([]);
  const [products, setProducts] = useState([]);

  const [loading, setLoading] = useState(false);

  // Normal reports remain arrays
  const [reportData, setReportData] = useState([]);

  // Combined labour report
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

    // Axios response
    if (response.data) {
      if (
        Array.isArray(response.data.data)
      ) {
        return response.data.data;
      }

      if (
        Array.isArray(response.data.records)
      ) {
        return response.data.records;
      }

      if (
        Array.isArray(response.data.results)
      ) {
        return response.data.results;
      }

      if (
        Array.isArray(response.data)
      ) {
        return response.data;
      }

      // Sometimes API returns object directly
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

    if (
      Array.isArray(response.records)
    ) {
      return response.records;
    }

    if (
      Array.isArray(response.results)
    ) {
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
  // FIND VALUE FROM API OBJECT
  // ======================================================

  const findValue = (obj, keys) => {
    if (!obj) return 0;

    for (const key of keys) {
      if (
        obj[key] !== undefined &&
        obj[key] !== null
      ) {
        return obj[key];
      }
    }

    return 0;
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

      if (
        activeReport === "sales_summary"
      ) {
        const response =
          await reportService.getSalesSummaryReport(
            filters
          );

        const data =
          extractData(response);

        setReportData(
          Array.isArray(data)
            ? data
            : []
        );

        return;
      }

      // ==================================================
      // STOCK
      // ==================================================

      if (
        activeReport === "stock_overall"
      ) {
        const response =
          await reportService.getStockReport(
            filters
          );

        const data =
          extractData(response);

        setReportData(
          Array.isArray(data)
            ? data
            : []
        );

        return;
      }

      // ==================================================
      // LABOUR COMBINED REPORT
      // ==================================================

      if (
        activeReport === "labour"
      ) {
        if (!filters.worker) {
          toast.error(
            "Please select a worker"
          );

          return;
        }

        // ------------------------------------------------
        // ALL LABOUR DATA TOGETHER
        // ------------------------------------------------

        const params = {
          worker: filters.worker,
          month: Number(filters.month),
          year: Number(filters.year),
        };

        const [
          attendanceResponse,
          wagesResponse,
          paymentsResponse,
          outstandingResponse,
        ] = await Promise.all([
          reportService.getMonthlyAttendanceReport(
            params
          ),

          reportService.getLabourWageReport(
            params
          ),

          reportService.getLabourPaymentReport(
            params
          ),

          reportService.getLabourOutstandingReport(
            params
          ),
        ]);

        // ------------------------------------------------
        // EXTRACT
        // ------------------------------------------------

        const attendanceData =
          extractData(
            attendanceResponse
          );

        const wagesData =
          extractData(
            wagesResponse
          );

        const paymentsData =
          extractData(
            paymentsResponse
          );

        const outstandingData =
          extractData(
            outstandingResponse
          );

        // ------------------------------------------------
        // NORMALIZE ATTENDANCE
        // ------------------------------------------------

        const attendance = Array.isArray(
          attendanceData
        )
          ? attendanceData
          : attendanceData?.attendance ||
            attendanceData?.records ||
            [];

        // ------------------------------------------------
        // NORMALIZE WAGES
        // ------------------------------------------------

        const wages =
          Array.isArray(wagesData)
            ? wagesData
            : wagesData?.data ||
              wagesData ||
              {};

        // ------------------------------------------------
        // NORMALIZE PAYMENTS
        // ------------------------------------------------

        const payments =
          Array.isArray(paymentsData)
            ? paymentsData
            : paymentsData?.data ||
              paymentsData ||
              {};

        // ------------------------------------------------
        // NORMALIZE OUTSTANDING
        // ------------------------------------------------

        const outstanding =
          Array.isArray(
            outstandingData
          )
            ? outstandingData
            : outstandingData?.data ||
              outstandingData ||
              {};

        // ------------------------------------------------
        // ATTENDANCE COUNTS
        // ------------------------------------------------

        let presentDays = 0;
        let absentDays = 0;
        let leaveDays = 0;

        attendance.forEach((item) => {
          const status =
            String(
              item.status || ""
            ).toLowerCase();

          if (
            status === "present"
          ) {
            presentDays++;
          }

          if (
            status === "absent"
          ) {
            absentDays++;
          }

          if (
            status === "leave"
          ) {
            leaveDays++;
          }
        });

        // ------------------------------------------------
        // WAGE VALUES
        // ------------------------------------------------

        const wageObject =
          Array.isArray(wages)
            ? wages[0] || {}
            : wages;

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
          );

        let totalWages =
          getNumber(
            wageObject,
            [
              "totalWages",
              "totalWage",
              "earnedWages",
              "totalSalary",
            ]
          );

        // If API does not give total wage,
        // calculate from present days.
        if (
          totalWages === 0 &&
          dailyWage > 0
        ) {
          totalWages =
            presentDays * dailyWage;
        }

        // ------------------------------------------------
        // PAYMENT VALUES
        // ------------------------------------------------

        const paymentObject =
          Array.isArray(payments)
            ? payments
            : payments;

        let totalPaid = 0;
        let salaryPaid = 0;
        let advancePaid = 0;

        if (
          Array.isArray(paymentObject)
        ) {
          paymentObject.forEach(
            (payment) => {
              const amount =
                Number(
                  payment.amount || 0
                );

              totalPaid += amount;

              const type =
                String(
                  payment.paymentType ||
                    payment.type ||
                    ""
                ).toLowerCase();

              if (
                type === "advance"
              ) {
                advancePaid += amount;
              } else {
                salaryPaid += amount;
              }
            }
          );
        } else {
          totalPaid =
            getNumber(
              paymentObject,
              [
                "totalPaid",
                "totalPayment",
                "paid",
              ]
            );

          salaryPaid =
            getNumber(
              paymentObject,
              [
                "salaryPaid",
                "salary",
              ]
            );

          advancePaid =
            getNumber(
              paymentObject,
              [
                "advancePaid",
                "advance",
              ]
            );
        }

        // ------------------------------------------------
        // BALANCE
        // ------------------------------------------------

        let balance =
          getNumber(
            outstanding,
            [
              "balance",
              "outstandingBalance",
              "remainingBalance",
              "remaining",
            ]
          );

        // If backend didn't send balance,
        // calculate it.
        if (
          balance === 0 &&
          totalWages > 0
        ) {
          balance =
            totalWages - totalPaid;
        }

        // ------------------------------------------------
        // WORKER
        // ------------------------------------------------

        const selectedWorker =
          workers.find(
            (worker) =>
              worker._id ===
              filters.worker
          );

        // ------------------------------------------------
        // FINAL COMBINED REPORT
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

          attendance,

          summary: {
            presentDays,
            absentDays,
            leaveDays,
          },

          wages: {
            dailyWage,
            totalWages,
          },

          payments: {
            salaryPaid,
            advancePaid,
            totalPaid,
          },

          balance,
        });

        return;
      }
    } catch (error) {
      console.error(
        "Report error:",
        error
      );

      toast.error(
        error?.response?.data
          ?.message ||
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

  const selectedWorker =
    workers.find(
      (worker) =>
        worker._id ===
        filters.worker
    );

  // ======================================================
  // MONTH NAME
  // ======================================================

  const monthName =
    new Date(
      2026,
      Number(filters.month) - 1,
      1
    ).toLocaleString("en-US", {
      month: "long",
    });

  // ======================================================
  // EXPORT CSV
  // ======================================================

  const handleExport = () => {
    if (
      activeReport === "labour"
    ) {
      if (!labourReport) {
        toast.error(
          "Generate a report first"
        );

        return;
      }

      const rows = [
        ["Worker", selectedWorker?.name || ""],
        [
          "Month",
          `${monthName} ${filters.year}`,
        ],
        [],
        ["ATTENDANCE"],
        ["Date", "Day", "Status"],
        ...(
          labourReport.attendance ||
          []
        ).map((item) => [
          formatDate(
            item.date ||
              item.attendanceDate
          ),
          getDayName(
            item.date ||
              item.attendanceDate
          ),
          String(
            item.status || ""
          ),
        ]),
        [],
        [
          "Present Days",
          labourReport.summary
            .presentDays,
        ],
        [
          "Absent Days",
          labourReport.summary
            .absentDays,
        ],
        [
          "Leave Days",
          labourReport.summary
            .leaveDays,
        ],
        [],
        ["WAGES"],
        [
          "Daily Wage",
          labourReport.wages
            .dailyWage,
        ],
        [
          "Total Wages",
          labourReport.wages
            .totalWages,
        ],
        [],
        ["PAYMENTS"],
        [
          "Salary Paid",
          labourReport.payments
            .salaryPaid,
        ],
        [
          "Advance Paid",
          labourReport.payments
            .advancePaid,
        ],
        [
          "Total Paid",
          labourReport.payments
            .totalPaid,
        ],
        [],
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
        URL.createObjectURL(
          blob
        );

      const link =
        document.createElement(
          "a"
        );

      link.href = url;

      link.download =
        "labour-report.csv";

      document.body.appendChild(
        link
      );

      link.click();

      document.body.removeChild(
        link
      );

      URL.revokeObjectURL(
        url
      );

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
          typeof reportData[0][
            key
          ] !== "object"
      );

    const headers =
      columns.map(
        formatColumnName
      );

    const rows =
      reportData.map((row) =>
        columns
          .map((column) =>
            `"${String(
              row[column] ??
                ""
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
      URL.createObjectURL(
        blob
      );

    const link =
      document.createElement(
        "a"
      );

    link.href = url;

    link.download =
      `${activeReport}.csv`;

    document.body.appendChild(
      link
    );

    link.click();

    document.body.removeChild(
      link
    );

    URL.revokeObjectURL(
      url
    );
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
  // NORMAL REPORT TABLE
  // ======================================================

  const getNormalColumns = () => {
    if (!reportData.length) {
      return [];
    }

    return Object.keys(
      reportData[0]
    ).filter((key) => {
      if (
        isHiddenField(key)
      ) {
        return false;
      }

      if (
        typeof reportData[0][
          key
        ] === "object"
      ) {
        return false;
      }

      return true;
    });
  };

  const normalColumns =
    getNormalColumns();

  // ======================================================
  // JSX
  // ======================================================

  return (
    <div className="min-h-screen overflow-x-hidden bg-white">

      {/* SIDEBAR */}

      <div className="no-print">
      <Sidebar isOpen={isSidebarOpen} setIsOpen={setIsSidebarOpen} />
      </div>

      {/* MAIN */}

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

          {/* HEADER */}

          <div className="no-print flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">

            <div>
              <h1 className="text-3xl font-bold text-black">
                Reports
              </h1>

              <p className="mt-1 text-sm text-gray-500">
                View business reports.
              </p>
            </div>

            <div className="flex gap-2">

              <button
                onClick={
                  handlePrint
                }
                className="flex items-center gap-2 rounded-xl border border-slate-300 bg-white px-5 py-3 font-semibold text-gray-700 hover:bg-white"
              >
                <Printer
                  size={18}
                />

                Print
              </button>

              <button
                onClick={
                  handleExport
                }
                className="flex items-center gap-2 rounded-xl bg-[#1E3A8A] px-5 py-3 font-semibold text-white hover:bg-[#17307A]"
              >
                <Download
                  size={18}
                />

                Export
              </button>

            </div>
          </div>

          {/* FILTER */}

          <div className="no-print rounded-3xl border border-gray-300 bg-white p-6 shadow-sm">

            <h2 className="text-xl font-bold text-black">
              Generate Report
            </h2>

            <p className="mt-1 text-sm text-gray-500">
              Select report and filters.
            </p>

            <div className="mt-6 grid grid-cols-1 gap-5 md:grid-cols-2 lg:grid-cols-4">

              {/* REPORT */}

              <div className="lg:col-span-2">

                <label className="mb-2 block text-sm font-medium text-gray-700">
                  Report
                </label>

                <select
                  value={
                    activeReport
                  }
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

                    <label className="mb-2 block text-sm font-medium text-gray-700">
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

                    <label className="mb-2 block text-sm font-medium text-gray-700">
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

                  <label className="mb-2 block text-sm font-medium text-gray-700">
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

                  <label className="mb-2 block text-sm font-medium text-gray-700">
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
                            2026,
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

                  <label className="mb-2 block text-sm font-medium text-gray-700">
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
                onClick={
                  runReport
                }
                disabled={
                  loading ||
                  (
                    activeReport ===
                      "labour" &&
                    !filters.worker
                  )
                }
                className="flex h-12 items-center gap-2 rounded-xl bg-[#1E3A8A] px-7 font-semibold text-white hover:bg-[#1E3A8A] disabled:cursor-not-allowed disabled:opacity-50"
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
                    <FileText
                      size={18}
                    />

                    Run Report
                  </>
                )}

              </button>

            </div>

          </div>

          {/* ==================================================
              LABOUR REPORT
          ================================================== */}

          {activeReport ===
            "labour" &&
            labourReport && (
              <div
                id="printable-report"
                className="rounded-3xl border border-gray-300 bg-white p-6 shadow-sm"
              >

                {/* WORKER HEADER */}

                <div className="border-b border-gray-300 pb-5">

                  <h2 className="text-2xl font-bold text-black">
                    Labour Report
                  </h2>

                  <p className="mt-2 text-lg font-semibold text-black">
                    {
                      labourReport
                        .worker
                        ?.name ||
                      selectedWorker
                        ?.name
                    }
                  </p>

                  <p className="mt-1 text-sm text-gray-500">
                    {monthName}{" "}
                    {filters.year}
                  </p>

                </div>

                {/* ATTENDANCE DETAIL */}

                <div className="mt-8">

                  <h3 className="mb-4 text-lg font-bold text-black">
                    Attendance
                  </h3>

                  <div className="overflow-x-auto rounded-2xl border border-gray-300">

                    <table className="w-full min-w-[500px]">

                      <thead className="bg-white">

                        <tr>

                          <th className="px-5 py-4 text-left text-xs font-semibold uppercase text-gray-500">
                            Date
                          </th>

                          <th className="px-5 py-4 text-left text-xs font-semibold uppercase text-gray-500">
                            Day
                          </th>

                          <th className="px-5 py-4 text-left text-xs font-semibold uppercase text-gray-500">
                            Status
                          </th>

                        </tr>

                      </thead>

                      <tbody className="divide-y divide-slate-100">

                        {(
                          labourReport
                            .attendance ||
                          []
                        ).map(
                          (
                            item,
                            index
                          ) => {

                            const rawDate =
                              item.date ||
                              item.attendanceDate ||
                              item.attendance_date;

                            const status =
                              String(
                                item.status ||
                                  ""
                              ).toLowerCase();

                            return (
                              <tr
                                key={
                                  item._id ||
                                  index
                                }
                              >

                                <td className="px-5 py-4 text-sm text-gray-700">
                                  {formatDate(
                                    rawDate
                                  )}
                                </td>

                                <td className="px-5 py-4 text-sm text-gray-700">
                                  {getDayName(
                                    rawDate
                                  )}
                                </td>

                                <td
                                  className={`px-5 py-4 text-sm font-semibold ${
                                    status ===
                                    "present"
                                      ? "text-black"
                                      : status ===
                                        "absent"
                                      ? "text-black"
                                      : "text-black"
                                  }`}
                                >
                                  {status
                                    ? status
                                        .charAt(
                                          0
                                        )
                                        .toUpperCase() +
                                      status.slice(
                                        1
                                      )
                                    : ""}
                                </td>

                              </tr>
                            );
                          }
                        )}

                      </tbody>

                    </table>

                  </div>

                </div>

                {/* WAGES / PAYMENTS / BALANCE */}

                <div className="mt-8 grid grid-cols-1 gap-5 md:grid-cols-3">

                  {/* WAGES */}

                  <div className="rounded-2xl border border-gray-300 p-5">

                    <h3 className="font-bold text-black">
                      Wages
                    </h3>

                    <div className="mt-4 space-y-3">

                      <div className="flex justify-between">

                        <span className="text-sm text-gray-500">
                          Daily Wage
                        </span>

                        <span className="font-semibold">
                          {formatCurrency(
                            labourReport
                              .wages
                              .dailyWage
                          )}
                        </span>

                      </div>

                      <div className="flex justify-between border-t pt-3">

                        <span className="text-sm font-medium">
                          Total Wages
                        </span>

                        <span className="font-bold">
                          {formatCurrency(
                            labourReport
                              .wages
                              .totalWages
                          )}
                        </span>

                      </div>

                    </div>

                  </div>

                  {/* PAYMENTS */}

                  <div className="rounded-2xl border border-gray-300 p-5">

                    <h3 className="font-bold text-black">
                      Payments
                    </h3>

                    <div className="mt-4 space-y-3">

                      <div className="flex justify-between">

                        <span className="text-sm text-gray-500">
                          Salary Paid
                        </span>

                        <span className="font-semibold">
                          {formatCurrency(
                            labourReport
                              .payments
                              .salaryPaid
                          )}
                        </span>

                      </div>

                      <div className="flex justify-between">

                        <span className="text-sm text-gray-500">
                          Advance Paid
                        </span>

                        <span className="font-semibold">
                          {formatCurrency(
                            labourReport
                              .payments
                              .advancePaid
                          )}
                        </span>

                      </div>

                      <div className="flex justify-between border-t pt-3">

                        <span className="font-medium">
                          Total Paid
                        </span>

                        <span className="font-bold text-black">
                          {formatCurrency(
                            labourReport
                              .payments
                              .totalPaid
                          )}
                        </span>

                      </div>

                    </div>

                  </div>

                  {/* BALANCE */}

                  <div className="rounded-2xl bg-white p-5">

                    <h3 className="font-bold text-black">
                      Balance
                    </h3>

                    <p className="mt-5 text-sm text-black">
                      Remaining Balance
                    </p>

                    <p className="mt-2 text-3xl font-bold text-black">
                      {formatCurrency(
                        labourReport.balance
                      )}
                    </p>

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
              className="overflow-hidden rounded-3xl border border-gray-300 bg-white shadow-sm"
            >

              {loading && (
                <div className="flex min-h-[280px] flex-col items-center justify-center">

                  <Loader2
                    size={35}
                    className="animate-spin text-black"
                  />

                  <p className="mt-3 text-sm text-gray-500">
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

                    <h3 className="mt-3 font-semibold text-gray-700">
                      No records found
                    </h3>

                    <p className="mt-1 text-sm text-gray-400">
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

                        <tr className="border-b border-gray-300 bg-white">

                          {normalColumns.map(
                            (column) => (
                              <th
                                key={
                                  column
                                }
                                className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wide text-gray-500"
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
                              className="border-b border-gray-200 hover:bg-white"
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
                                          ? "font-semibold text-black"
                                          : "text-gray-700"
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
        @media print {

          body {
            background: white !important;
          }

          body * {
            visibility: hidden;
          }

          #printable-report,
          #printable-report * {
            visibility: visible;
          }

          #printable-report {
            position: absolute;
            left: 0;
            top: 0;
            width: 100%;
            border: none !important;
            box-shadow: none !important;
            border-radius: 0 !important;
          }

          .no-print {
            display: none !important;
          }

          table {
            width: 100% !important;
          }

          th,
          td {
            padding: 10px 12px !important;
            border-bottom: 1px solid #ddd;
          }

          @page {
            size: A4 portrait;
            margin: 15mm;
          }
        }
      `}</style>

    </div>
  );
}

export default Reports;