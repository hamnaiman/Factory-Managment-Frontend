import { useEffect, useState } from "react";
import toast from "react-hot-toast";

import Sidebar from "../components/Sidebar";
import Navbar from "../components/Navbar";
import AttendanceTable from "../components/AttendanceTable";
import AttendanceSummary from "../components/AttendanceSummary";
import PaymentModal from "../components/PaymentModal";

import { addPayment } from "../services/paymentService";

import { Search } from "lucide-react";

import { getLabours } from "../services/labourService";

import {
  markAttendance,
  getAttendanceByDate,
} from "../services/attendanceService";

// =====================================================
// DATE HELPER
// =====================================================

const getTodayDate = () => {
  const now = new Date();

  const year = now.getFullYear();

  const month = String(
    now.getMonth() + 1
  ).padStart(2, "0");

  const day = String(
    now.getDate()
  ).padStart(2, "0");

  return `${year}-${month}-${day}`;
};

// =====================================================
// COMPONENT
// =====================================================

function Attendance() {
  // ===================================================
  // SIDEBAR
  // ===================================================

  const [isSidebarOpen, setIsSidebarOpen] =
    useState(true);

  // ===================================================
  // WORKERS
  // ===================================================

  const [workers, setWorkers] =
    useState([]);

  // ===================================================
  // ATTENDANCE
  // ===================================================

  const [attendance, setAttendance] =
    useState([]);

  // ===================================================
  // SEARCH
  // ===================================================

  const [search, setSearch] =
    useState("");

  // ===================================================
  // SELECTED DATE
  // ===================================================

  const [selectedDate, setSelectedDate] =
    useState(getTodayDate());

  // ===================================================
  // PAYMENTS
  // ===================================================

  const [payments, setPayments] =
    useState({});

  // ===================================================
  // PAYMENT MODAL
  // ===================================================

  const [openPaymentModal, setOpenPaymentModal] =
    useState(false);

  const [selectedWorker, setSelectedWorker] =
    useState(null);

  // ===================================================
  // TODAY
  // ===================================================

  const today = getTodayDate();

  const isToday =
    selectedDate === today;

  const isFutureDate =
    selectedDate > today;

  // ===================================================
  // LOAD WORKERS
  // ===================================================

  const loadWorkers = async () => {
    try {
      const response = await getLabours();

      const workerData =
        response?.data?.data;

      setWorkers(
        Array.isArray(workerData)
          ? workerData
          : []
      );
    } catch (error) {
      console.error(
        "Worker load error:",
        error
      );

      setWorkers([]);

      toast.error(
        "Failed to load workers"
      );
    }
  };

  // ===================================================
  // LOAD ATTENDANCE BY DATE
  // ===================================================

  const loadAttendanceByDate = async (
    date
  ) => {
    try {
      if (!date) {
        setAttendance([]);
        return;
      }

      const response =
        await getAttendanceByDate(date);

      const records =
        response?.data?.data;

      const safeRecords =
        Array.isArray(records)
          ? records
          : [];

      const formattedAttendance =
        safeRecords
          .map((item) => {
            const workerId =
              item?.worker?._id ||
              item?.worker;

            if (!workerId) {
              return null;
            }

            return {
              worker: String(workerId),
              status: String(
                item?.status || ""
              ).toLowerCase(),
              date,
            };
          })
          .filter(
            (item) =>
              item &&
              item.worker &&
              item.status
          );

      setAttendance(
        formattedAttendance
      );
    } catch (error) {
      console.error(
        "Attendance load error:",
        error
      );

      setAttendance([]);

      toast.error(
        "Failed to load attendance"
      );
    }
  };

  // ===================================================
  // INITIAL LOAD
  // ===================================================

  useEffect(() => {
    loadWorkers();
  }, []);

  // ===================================================
  // LOAD ATTENDANCE WHEN DATE CHANGES
  // ===================================================

  useEffect(() => {
    if (!selectedDate) {
      return;
    }

    loadAttendanceByDate(
      selectedDate
    );
  }, [selectedDate]);

  // ===================================================
  // LOAD AGAIN AFTER WORKERS LOAD
  // ===================================================

  useEffect(() => {
    if (workers.length > 0) {
      loadAttendanceByDate(
        selectedDate
      );
    }
  }, [workers.length]);

  // ===================================================
  // STATUS CHANGE
  // ===================================================

  const handleStatusChange = (
    workerId,
    status
  ) => {
    // -----------------------------------------------
    // Future date protection
    // -----------------------------------------------

    if (isFutureDate) {
      toast.error(
        "Future date ki attendance add nahi kar sakte."
      );

      return;
    }

    if (!workerId || !status) {
      return;
    }

    const normalizedWorkerId =
      String(workerId);

    const normalizedStatus =
      String(status)
        .toLowerCase()
        .trim();

    // -----------------------------------------------
    // UPDATE EXISTING OR ADD NEW
    //
    // IMPORTANT:
    // Existing attendance ko block NAHI karna.
    //
    // Present -> Absent
    // Present -> Leave
    // Absent -> Present
    // Leave -> Present
    //
    // Same worker/date ka sirf ONE record rahega.
    // -----------------------------------------------

    setAttendance((prev) => {
      const existingIndex =
        prev.findIndex((item) => {
          return (
            String(item?.worker) ===
            normalizedWorkerId
          );
        });

      // ---------------------------------------------
      // EXISTING ATTENDANCE
      // ---------------------------------------------

      if (existingIndex !== -1) {
        return prev.map(
          (item, index) => {
            if (
              index !==
              existingIndex
            ) {
              return item;
            }

            return {
              ...item,
              worker:
                normalizedWorkerId,
              status:
                normalizedStatus,
              date:
                selectedDate,
            };
          }
        );
      }

      // ---------------------------------------------
      // NEW ATTENDANCE
      // ---------------------------------------------

      return [
        ...prev,
        {
          worker:
            normalizedWorkerId,
          status:
            normalizedStatus,
          date:
            selectedDate,
        },
      ];
    });
  };

  // ===================================================
  // ADD PAYMENT
  // ===================================================

  const handleAddPayment = (
    worker
  ) => {
    setSelectedWorker(worker);
    setOpenPaymentModal(true);
  };

  // ===================================================
  // SAVE / UPDATE ATTENDANCE
  // ===================================================

  const handleSaveAttendance =
    async () => {
      try {
        // ---------------------------------------------
        // DATE VALIDATION
        // ---------------------------------------------

        if (!selectedDate) {
          toast.error(
            "Please select attendance date."
          );

          return;
        }

        // ---------------------------------------------
        // FUTURE DATE
        // ---------------------------------------------

        if (selectedDate > today) {
          toast.error(
            "Future date ki attendance add nahi kar sakte."
          );

          return;
        }

        // ---------------------------------------------
        // NO ATTENDANCE
        // ---------------------------------------------

        if (
          !Array.isArray(
            attendance
          ) ||
          attendance.length === 0
        ) {
          toast.error(
            "Please mark attendance first."
          );

          return;
        }

        // ---------------------------------------------
        // BUILD PAYLOAD
        //
        // IMPORTANT:
        // Existing records bhi send honge.
        //
        // Backend:
        // Existing -> UPDATE
        // New -> CREATE
        //
        // Duplicate create nahi hoga.
        // ---------------------------------------------

        const payload =
          attendance
            .filter(
              (item) =>
                item?.worker &&
                item?.status
            )
            .map((item) => ({
              worker:
                typeof item.worker ===
                "object"
                  ? item.worker._id
                  : item.worker,

              status:
                String(
                  item.status
                )
                  .toLowerCase()
                  .trim(),

              date:
                selectedDate,
            }));

        // ---------------------------------------------
        // VALID PAYLOAD CHECK
        // ---------------------------------------------

        if (
          payload.length === 0
        ) {
          toast.error(
            "Please mark attendance first."
          );

          return;
        }

        // ---------------------------------------------
        // SAVE / UPDATE
        // ---------------------------------------------

        await markAttendance(
          payload
        );

        toast.success(
          "Attendance saved successfully."
        );

        // ---------------------------------------------
        // RELOAD FROM DATABASE
        // ---------------------------------------------

        await loadAttendanceByDate(
          selectedDate
        );
      } catch (error) {
        console.error(
          "Save attendance error:",
          error
        );

        toast.error(
          error?.response?.data
            ?.message ||
            error?.message ||
            "Failed to save attendance."
        );
      }
    };

  // ===================================================
  // DATE CHANGE
  // ===================================================

  const handleDateChange = (
    e
  ) => {
    const date =
      e.target.value;

    if (!date) {
      return;
    }

    // -----------------------------------------------
    // FUTURE DATE PROTECTION
    // -----------------------------------------------

    if (date > today) {
      toast.error(
        "Future date ki attendance add nahi kar sakte."
      );

      return;
    }

    setSelectedDate(date);
  };

  // ===================================================
  // RENDER
  // ===================================================

  return (
    <div className="flex min-h-screen bg-slate-50">

      {/* =================================================
          SIDEBAR
      ================================================= */}

      <Sidebar
        isOpen={isSidebarOpen}
        setIsOpen={setIsSidebarOpen}
      />

      {/* =================================================
          MAIN CONTENT
      ================================================= */}

      <div
        className={`flex-1 min-w-0 transition-all duration-300 ease-in-out ${
          isSidebarOpen
            ? "ml-0 lg:ml-72"
            : "ml-0 lg:ml-20"
        }`}
      >

        {/* =================================================
            NAVBAR
        ================================================= */}

        <Navbar
          isSidebarOpen={
            isSidebarOpen
          }
          setIsSidebarOpen={
            setIsSidebarOpen
          }
        />

        {/* =================================================
            PAGE
        ================================================= */}

        <main className="mx-auto mt-24 max-w-[1600px] space-y-6 p-4 md:p-6 lg:p-8">

          {/* =================================================
              HEADER
          ================================================= */}

          <div>
            <h1 className="text-2xl font-bold leading-tight text-slate-900 sm:text-3xl">
              Attendance
            </h1>

            <p className="mt-1 text-sm text-slate-500">
              {isToday
                ? "Mark today's workers attendance."
                : "Add or update attendance for the selected date."}
            </p>
          </div>

          {/* =================================================
              TOOLBAR
          ================================================= */}

          <div className="rounded-3xl border border-slate-200 bg-white p-4 shadow-sm sm:p-5">

            <div className="flex flex-col gap-5 md:flex-row md:items-end md:justify-between">

              {/* SEARCH */}

              <div className="w-full md:max-w-md">

                <label className="mb-2 block text-sm font-medium text-slate-700">
                  Search Worker
                </label>

                <div className="relative">

                  <Search
                    size={18}
                    className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400"
                  />

                  <input
                    type="text"
                    placeholder="Search Worker..."
                    value={search}
                    onChange={(e) =>
                      setSearch(
                        e.target.value
                      )
                    }
                    className="h-12 w-full rounded-xl border border-slate-300 bg-white pl-11 pr-4 text-sm outline-none transition focus:border-[#1E3A8A]"
                  />

                </div>
              </div>

              {/* DATE */}

              <div className="w-full md:w-auto">

                <label className="mb-2 block text-sm font-medium text-slate-700">
                  Attendance Date
                </label>

                <input
                  type="date"
                  value={
                    selectedDate
                  }
                  max={today}
                  onChange={
                    handleDateChange
                  }
                  className="h-12 w-full rounded-xl border border-slate-300 bg-white px-4 text-sm outline-none focus:border-[#1E3A8A] md:w-72"
                />

              </div>

            </div>
          </div>

          {/* =================================================
              FUTURE DATE MESSAGE
          ================================================= */}

          {isFutureDate && (
            <div className="rounded-2xl border border-slate-200 bg-white p-4 text-sm font-medium text-slate-600">
              Future date ki attendance add nahi kar sakte.
            </div>
          )}

          {/* =================================================
              ATTENDANCE TABLE
          ================================================= */}

          <div className="w-full overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-sm">

            <AttendanceTable
              workers={workers}
              attendance={
                attendance
              }
              search={search}
              onStatusChange={
                handleStatusChange
              }
              onAddPayment={
                handleAddPayment
              }
            />

          </div>

          {/* =================================================
              SAVE BUTTON
          ================================================= */}

          <div className="flex justify-stretch sm:justify-end">

            <button
              type="button"
              onClick={
                handleSaveAttendance
              }

              // IMPORTANT:
              // Existing attendance hone par
              // button DISABLE nahi hoga.
              //
              // Sirf future date disabled.
              disabled={
                isFutureDate
              }

              className={`h-12 w-full rounded-2xl px-8 font-semibold text-white transition sm:w-auto ${
                isFutureDate
                  ? "cursor-not-allowed bg-slate-400"
                  : "cursor-pointer bg-[#1E3A8A] hover:bg-[#17307A]"
              }`}
            >
              {isFutureDate
                ? "Future Date Not Allowed"
                : "Save / Update Attendance"}
            </button>

          </div>

          {/* =================================================
              TODAY'S SUMMARY
          ================================================= */}

          {isToday && (
            <div className="mt-8">

              <AttendanceSummary
                workers={
                  workers
                }
                attendance={
                  attendance
                }
                attendanceDate={
                  selectedDate
                }
              />

            </div>
          )}

          {/* =================================================
              PAYMENT MODAL
          ================================================= */}

          <PaymentModal
            open={
              openPaymentModal
            }

            onClose={() => {
              setOpenPaymentModal(
                false
              );

              setSelectedWorker(
                null
              );
            }}

            onSubmit={async (
              data
            ) => {
              try {
                if (
                  !selectedWorker?._id
                ) {
                  toast.error(
                    "Worker not selected."
                  );

                  return;
                }

                if (
                  !selectedDate
                ) {
                  toast.error(
                    "Attendance date not selected."
                  );

                  return;
                }

                await addPayment({
                  ...data,

                  worker:
                    selectedWorker._id,

                  paymentDate:
                    selectedDate,
                });

                toast.success(
                  `Payment added for ${selectedDate}`
                );

                setOpenPaymentModal(
                  false
                );

                setSelectedWorker(
                  null
                );
              } catch (error) {
                console.error(
                  "Payment error:",
                  error
                );

                toast.error(
                  error?.response
                    ?.data
                    ?.message ||
                    error?.message ||
                    "Payment failed"
                );
              }
            }}

            initialData={
              selectedWorker
                ? {
                    worker:
                      selectedWorker,

                    amount: "",

                    paymentType:
                      "Salary",

                    paymentMethod:
                      "Cash",

                    remark: "",

                    paymentDate:
                      selectedDate,
                  }
                : null
            }
          />

        </main>
      </div>
    </div>
  );
}

export default Attendance;