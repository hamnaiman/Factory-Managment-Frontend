import { useEffect, useMemo, useState } from "react";
import {
  Search,
  Calendar,
  Eye,
  X,
} from "lucide-react";
import toast from "react-hot-toast";

import { getPayments } from "../services/paymentService";

import Sidebar from "../components/Sidebar";
import Navbar from "../components/Navbar";

import {
  getAttendanceHistory,
  getAttendanceByDate,
} from "../services/attendanceService";

function AttendanceHistory() {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);

  const [history, setHistory] = useState([]);
  const [details, setDetails] = useState([]);

  const [search, setSearch] = useState("");
  const [dateFilter, setDateFilter] = useState("");

  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);

  const [payments, setPayments] = useState([]);

  // =====================================================
  // LOAD ATTENDANCE HISTORY
  // =====================================================

  const loadHistory = async () => {
    try {
      setLoading(true);

      const response = await getAttendanceHistory();

      setHistory(response?.data?.data || []);
    } catch (error) {
      console.error(
        "Attendance history error:",
        error
      );

      toast.error(
        "Failed to load attendance history"
      );
    } finally {
      setLoading(false);
    }
  };

  // =====================================================
  // LOAD PAYMENTS
  // =====================================================

  const loadPayments = async () => {
    try {
      const response = await getPayments();

      setPayments(response?.data?.data || []);
    } catch (error) {
      console.error(
        "Payment load error:",
        error
      );

      setPayments([]);
    }
  };

  // =====================================================
  // INITIAL LOAD
  // =====================================================

  useEffect(() => {
    loadHistory();
    loadPayments();
  }, []);

  // =====================================================
  // DATE HELPER
  // =====================================================

  const getDateKey = (value) => {
    if (!value) return null;

    const date = new Date(value);

    if (Number.isNaN(date.getTime())) {
      return null;
    }

    const year = date.getFullYear();

    const month = String(
      date.getMonth() + 1
    ).padStart(2, "0");

    const day = String(
      date.getDate()
    ).padStart(2, "0");

    return `${year}-${month}-${day}`;
  };

  // =====================================================
  // ID HELPER
  // =====================================================

  const sameId = (id1, id2) => {
    if (!id1 || !id2) {
      return false;
    }

    return String(id1) === String(id2);
  };

  // =====================================================
  // PAYMENT DATE
  // =====================================================

  const getPaymentDate = (payment) => {
    return (
      payment?.paymentDate ||
      payment?.date ||
      payment?.createdAt ||
      null
    );
  };

  // =====================================================
  // GET WORKER PAYMENTS
  // =====================================================

  const getWorkerPayments = (
    workerId,
    attendanceDate
  ) => {
    if (!workerId || !attendanceDate) {
      return [];
    }

    const attendanceDateKey =
      getDateKey(attendanceDate);

    if (!attendanceDateKey) {
      return [];
    }

    return payments.filter((payment) => {
      const paymentWorkerId =
        payment?.worker?._id ||
        payment?.worker;

      if (
        !sameId(
          paymentWorkerId,
          workerId
        )
      ) {
        return false;
      }

      const paymentDate =
        getPaymentDate(payment);

      if (!paymentDate) {
        return false;
      }

      const paymentDateKey =
        getDateKey(paymentDate);

      return (
        paymentDateKey ===
        attendanceDateKey
      );
    });
  };

  // =====================================================
  // TOTAL PAYMENT
  // =====================================================

  const getWorkerPaymentTotal = (
    workerId,
    attendanceDate
  ) => {
    const workerPayments =
      getWorkerPayments(
        workerId,
        attendanceDate
      );

    return workerPayments.reduce(
      (total, payment) =>
        total +
        Number(payment?.amount || 0),
      0
    );
  };

  // =====================================================
  // VIEW DETAILS
  // =====================================================

  const viewDetails = async (date) => {
    try {
      const response =
        await getAttendanceByDate(date);

      setDetails(
        response?.data?.data || []
      );

      setShowModal(true);
    } catch (error) {
      console.error(
        "Attendance details error:",
        error
      );

      toast.error(
        "Failed to fetch attendance details"
      );
    }
  };

  // =====================================================
  // FILTER HISTORY
  // =====================================================

  const filteredHistory = useMemo(() => {
    return history.filter((item) => {
      const itemDate = String(
        item?._id || ""
      );

      const searchMatch =
        itemDate
          .toLowerCase()
          .includes(
            search.toLowerCase()
          );

      const dateMatch =
        !dateFilter ||
        itemDate === dateFilter;

      return (
        searchMatch &&
        dateMatch
      );
    });
  }, [
    history,
    search,
    dateFilter,
  ]);

  // =====================================================
  // ATTENDANCE GROUPS
  // =====================================================

  const presentWorkers =
    details.filter(
      (item) =>
        item?.status === "present"
    );

  const absentWorkers =
    details.filter(
      (item) =>
        item?.status === "absent"
    );

  const leaveWorkers =
    details.filter(
      (item) =>
        item?.status === "leave"
    );

  // =====================================================
  // MOBILE DATE FORMAT
  // =====================================================

  const formatAttendanceDate = (date) => {
    if (!date) return "Unknown Date";

    const parsedDate = new Date(date);

    if (
      Number.isNaN(
        parsedDate.getTime()
      )
    ) {
      return date;
    }

    return parsedDate.toLocaleDateString(
      "en-US",
      {
        weekday: "short",
        month: "short",
        day: "numeric",
        year: "numeric",
      }
    );
  };

  // =====================================================
  // PAYMENT INFO
  // =====================================================

  const PaymentInfo = ({ item }) => {
    const workerId =
      item?.worker?._id ||
      item?.worker;

    const attendanceDate =
      item?.date;

    const workerPayments =
      getWorkerPayments(
        workerId,
        attendanceDate
      );

    const totalPaid =
      getWorkerPaymentTotal(
        workerId,
        attendanceDate
      );

    if (
      workerPayments.length === 0
    ) {
      return (
        <p className="mt-1 text-xs text-slate-400">
          No Payment
        </p>
      );
    }

    return (
      <div className="mt-2 space-y-1">
        <p className="text-sm font-semibold text-blue-700">
          Rs.{" "}
          {totalPaid.toLocaleString(
            "en-PK"
          )}
        </p>

        {workerPayments.map(
          (payment) => (
            <p
              key={payment?._id}
              className="text-[11px] text-slate-400"
            >
              {payment?.paymentType ||
                "Payment"}{" "}
              •{" "}
              {payment?.paymentMethod ||
                "Cash"}
            </p>
          )
        )}
      </div>
    );
  };

  // =====================================================
  // WORKER CARD
  // =====================================================

  const WorkerCard = ({ item }) => {
    return (
      <div className="rounded-xl border border-slate-100 bg-white p-3 shadow-sm">
        <p className="text-sm font-medium text-slate-700">
          {item?.worker?.name ||
            "Unknown Worker"}
        </p>

        <PaymentInfo item={item} />
      </div>
    );
  };

  // =====================================================
  // ATTENDANCE HISTORY CARD
  // =====================================================

  const AttendanceCard = ({ item }) => {
    return (
      <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">

        {/* Card Header */}

        <div className="flex items-center justify-between border-b border-slate-100 px-4 py-4">
          <div className="flex min-w-0 items-center gap-3">

            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-blue-50">
              <Calendar
                size={19}
                className="text-[#1E3A8A]"
              />
            </div>

            <div className="min-w-0">
              <p className="text-[11px] font-medium uppercase tracking-wide text-slate-400">
                Attendance Date
              </p>

              <h3 className="truncate text-sm font-bold text-slate-900">
                {formatAttendanceDate(
                  item._id
                )}
              </h3>
            </div>

          </div>
        </div>

        {/* Statistics */}

        <div className="grid grid-cols-2 gap-3 p-4">

          {/* Total */}

          <div className="rounded-xl bg-slate-50 p-3">
            <p className="text-xs text-slate-500">
              Total
            </p>

            <p className="mt-1 text-xl font-bold text-slate-800">
              {item.total}
            </p>
          </div>

          {/* Present */}

          <div className="rounded-xl bg-green-50 p-3">
            <p className="text-xs text-green-700">
              Present
            </p>

            <p className="mt-1 text-xl font-bold text-green-700">
              {item.present}
            </p>
          </div>

          {/* Absent */}

          <div className="rounded-xl bg-red-50 p-3">
            <p className="text-xs text-red-700">
              Absent
            </p>

            <p className="mt-1 text-xl font-bold text-red-700">
              {item.absent}
            </p>
          </div>

          {/* Leave */}

          <div className="rounded-xl bg-orange-50 p-3">
            <p className="text-xs text-orange-700">
              Leave
            </p>

            <p className="mt-1 text-xl font-bold text-orange-600">
              {item.leave}
            </p>
          </div>

        </div>

        {/* View Button */}

        <div className="border-t border-slate-100 p-4 pt-0">
          <button
            type="button"
            onClick={() =>
              viewDetails(item._id)
            }
            className="flex w-full cursor-pointer items-center justify-center gap-2 rounded-xl bg-[#1E3A8A] py-3 text-sm font-semibold text-white transition hover:bg-[#17307A]"
          >
            <Eye size={17} />
            View Details
          </button>
        </div>

      </div>
    );
  };

  return (
    <div className="flex min-h-screen overflow-x-hidden bg-slate-100">

      {/* =================================================
          SIDEBAR
      ================================================= */}

      <Sidebar
        isOpen={isSidebarOpen}
        setIsOpen={
          setIsSidebarOpen
        }
      />

      {/* =================================================
          MAIN CONTENT
      ================================================= */}

      <div
        className={`min-w-0 flex-1 transition-all duration-300 ${
          isSidebarOpen
            ? "ml-0 lg:ml-72"
            : "ml-0 lg:ml-20"
        }`}
      >

        {/* NAVBAR */}

        <Navbar
          isSidebarOpen={
            isSidebarOpen
          }
          setIsSidebarOpen={
            setIsSidebarOpen
          }
        />

        <main className="mx-auto mt-24 w-full max-w-[1600px] space-y-6 px-4 pb-8 md:px-6 lg:p-8">

          {/* =================================================
              HEADER
          ================================================= */}

          <div>
            <h1 className="text-2xl font-bold leading-tight text-slate-900 sm:text-3xl">
              Attendance History
            </h1>

            <p className="mt-1 text-sm text-slate-500">
              View all saved attendance records.
            </p>
          </div>

          {/* =================================================
              FILTERS
          ================================================= */}

          <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm sm:rounded-3xl sm:p-5">

            <div className="flex flex-col gap-3 lg:flex-row lg:gap-4">

              {/* Search */}

              <div className="relative min-w-0 flex-1">

                <Search
                  size={18}
                  className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400"
                />

                <input
                  type="text"
                  placeholder="Search by date..."
                  value={search}
                  onChange={(e) =>
                    setSearch(
                      e.target.value
                    )
                  }
                  className="h-12 w-full rounded-xl border border-slate-300 bg-white pl-11 pr-4 text-sm outline-none transition focus:border-[#1E3A8A] focus:ring-1 focus:ring-[#1E3A8A]"
                />

              </div>

              {/* Date Filter */}

              <div className="relative w-full lg:w-72">

                <Calendar
                  size={18}
                  className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-slate-400"
                />

                <input
                  type="date"
                  value={dateFilter}
                  onChange={(e) =>
                    setDateFilter(
                      e.target.value
                    )
                  }
                  className="h-12 w-full rounded-xl border border-slate-300 bg-white pl-11 pr-4 text-sm outline-none transition focus:border-[#1E3A8A] focus:ring-1 focus:ring-[#1E3A8A]"
                />

              </div>

            </div>

          </div>

          {/* =================================================
              CONTENT
          ================================================= */}

          {loading ? (

            <div className="rounded-2xl border border-slate-200 bg-white p-10 text-center shadow-sm sm:rounded-3xl">
              <p className="text-sm text-slate-500">
                Loading attendance history...
              </p>
            </div>

          ) : filteredHistory.length === 0 ? (

            <div className="rounded-2xl border border-slate-200 bg-white p-10 text-center shadow-sm sm:rounded-3xl">
              <Calendar
                size={32}
                className="mx-auto text-slate-300"
              />

              <p className="mt-3 font-medium text-slate-600">
                No attendance history found.
              </p>

              <p className="mt-1 text-sm text-slate-400">
                Try changing your search or date filter.
              </p>
            </div>

          ) : (

            <>
              {/* =================================================
                  DESKTOP TABLE
              ================================================= */}

              <div className="hidden overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-sm lg:block">

                <div className="overflow-x-auto">

                  <table className="w-full">

                    <thead className="bg-slate-50">

                      <tr className="border-b border-slate-200 text-left text-sm text-slate-700">

                        <th className="px-6 py-4">
                          Date
                        </th>

                        <th className="px-6 py-4">
                          Total
                        </th>

                        <th className="px-6 py-4">
                          Present
                        </th>

                        <th className="px-6 py-4">
                          Absent
                        </th>

                        <th className="px-6 py-4">
                          Leave
                        </th>

                        <th className="px-6 py-4 text-center">
                          Action
                        </th>

                      </tr>

                    </thead>

                    <tbody>

                      {filteredHistory.map(
                        (item) => (

                          <tr
                            key={item._id}
                            className="border-b border-slate-100 transition-colors last:border-0 hover:bg-slate-50/50"
                          >

                            <td className="px-6 py-5 font-medium text-slate-900">
                              {item._id}
                            </td>

                            <td className="px-6 text-slate-700">
                              {item.total}
                            </td>

                            <td className="px-6 font-semibold text-green-600">
                              {item.present}
                            </td>

                            <td className="px-6 font-semibold text-red-600">
                              {item.absent}
                            </td>

                            <td className="px-6 font-semibold text-orange-500">
                              {item.leave}
                            </td>

                            <td className="px-6 text-center">

                              <button
                                type="button"
                                onClick={() =>
                                  viewDetails(
                                    item._id
                                  )
                                }
                                className="inline-flex cursor-pointer items-center gap-2 rounded-xl bg-[#1E3A8A] px-4 py-2 text-sm font-medium text-white transition hover:bg-[#17307A]"
                              >
                                <Eye size={16} />
                                View
                              </button>

                            </td>

                          </tr>

                        )
                      )}

                    </tbody>

                  </table>

                </div>

              </div>

              {/* =================================================
                  MOBILE / TABLET CARDS
              ================================================= */}

              <div className="grid grid-cols-1 gap-4 lg:hidden">

                {filteredHistory.map(
                  (item) => (
                    <AttendanceCard
                      key={item._id}
                      item={item}
                    />
                  )
                )}

              </div>
            </>

          )}

          {/* =================================================
              DETAILS MODAL
          ================================================= */}

          {showModal && (

            <div
              className="fixed inset-0 z-[100] flex items-center justify-center bg-slate-900/50 p-3 backdrop-blur-sm sm:p-5"
              onClick={() =>
                setShowModal(false)
              }
            >

              <div
                className="flex max-h-[90vh] w-full max-w-5xl flex-col overflow-hidden rounded-2xl bg-white shadow-2xl sm:rounded-3xl"
                onClick={(e) =>
                  e.stopPropagation()
                }
              >

                {/* MODAL HEADER */}

                <div className="flex shrink-0 items-center justify-between border-b border-slate-200 px-4 py-4 sm:px-6 sm:py-5">

                  <div className="min-w-0 pr-3">

                    <h2 className="text-lg font-bold text-slate-900 sm:text-xl">
                      Attendance Details
                    </h2>

                    {details[0]?.date && (
                      <p className="mt-1 text-xs text-slate-500 sm:text-sm">
                        {new Date(
                          details[0].date
                        ).toLocaleDateString(
                          "en-US",
                          {
                            weekday:
                              "short",
                            day: "2-digit",
                            month:
                              "short",
                            year:
                              "numeric",
                          }
                        )}
                      </p>
                    )}

                  </div>

                  <button
                    type="button"
                    onClick={() =>
                      setShowModal(false)
                    }
                    className="shrink-0 cursor-pointer rounded-xl p-2 text-slate-500 transition hover:bg-slate-100 hover:text-slate-800"
                    aria-label="Close"
                  >
                    <X size={20} />
                  </button>

                </div>

                {/* MODAL CONTENT */}

                <div className="overflow-y-auto p-4 sm:p-6">

                  <div className="grid gap-4 lg:grid-cols-3 lg:gap-6">

                    {/* =================================================
                        PRESENT
                    ================================================= */}

                    <div className="rounded-2xl border border-green-100 bg-green-50/70 p-4 sm:p-5">

                      <h3 className="mb-4 font-bold text-green-700">
                        Present (
                        {
                          presentWorkers.length
                        }
                        )
                      </h3>

                      <div className="space-y-2">

                        {presentWorkers.length >
                        0 ? (

                          presentWorkers.map(
                            (item) => (
                              <WorkerCard
                                key={
                                  item._id
                                }
                                item={
                                  item
                                }
                              />
                            )
                          )

                        ) : (

                          <p className="text-sm text-slate-400">
                            No workers
                          </p>

                        )}

                      </div>

                    </div>

                    {/* =================================================
                        ABSENT
                    ================================================= */}

                    <div className="rounded-2xl border border-red-100 bg-red-50/70 p-4 sm:p-5">

                      <h3 className="mb-4 font-bold text-red-700">
                        Absent (
                        {
                          absentWorkers.length
                        }
                        )
                      </h3>

                      <div className="space-y-2">

                        {absentWorkers.length >
                        0 ? (

                          absentWorkers.map(
                            (item) => (
                              <WorkerCard
                                key={
                                  item._id
                                }
                                item={
                                  item
                                }
                              />
                            )
                          )

                        ) : (

                          <p className="text-sm text-slate-400">
                            No workers
                          </p>

                        )}

                      </div>

                    </div>

                    {/* =================================================
                        LEAVE
                    ================================================= */}

                    <div className="rounded-2xl border border-orange-100 bg-orange-50/70 p-4 sm:p-5">

                      <h3 className="mb-4 font-bold text-orange-700">
                        Leave (
                        {
                          leaveWorkers.length
                        }
                        )
                      </h3>

                      <div className="space-y-2">

                        {leaveWorkers.length >
                        0 ? (

                          leaveWorkers.map(
                            (item) => (
                              <WorkerCard
                                key={
                                  item._id
                                }
                                item={
                                  item
                                }
                              />
                            )
                          )

                        ) : (

                          <p className="text-sm text-slate-400">
                            No workers
                          </p>

                        )}

                      </div>

                    </div>

                  </div>

                </div>

              </div>

            </div>

          )}

        </main>

      </div>

    </div>
  );
}

export default AttendanceHistory;