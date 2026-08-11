// import { useEffect, useState } from "react";
// import { getPayments } from "../services/paymentService";

// function AttendanceSummary({ workers = [], attendance = [] }) {
//   const [payments, setPayments] = useState([]);

//   // =====================================================
//   // LOAD PAYMENTS
//   // =====================================================

//   useEffect(() => {
//     const loadPayments = async () => {
//       try {
//         const response = await getPayments();

//         const records = response?.data?.data || [];

//         setPayments(records);
//       } catch (error) {
//         console.log("Payment load error:", error);
//         setPayments([]);
//       }
//     };

//     loadPayments();
//   }, []);

//   // =====================================================
//   // HELPER
//   // =====================================================

//   const sameId = (id1, id2) => {
//     if (!id1 || !id2) return false;

//     return String(id1) === String(id2);
//   };

//   // =====================================================
//   // ATTENDANCE
//   // IMPORTANT:
//   // attendance yahan Attendance.jsx se TODAY'S attendance
//   // honi chahiye.
//   // =====================================================

//   const present = workers.filter((worker) =>
//     attendance.some(
//       (item) =>
//         sameId(
//           item?.worker?._id || item?.worker,
//           worker?._id
//         ) && item?.status === "present"
//     )
//   );

//   const absent = workers.filter((worker) =>
//     attendance.some(
//       (item) =>
//         sameId(
//           item?.worker?._id || item?.worker,
//           worker?._id
//         ) && item?.status === "absent"
//     )
//   );

//   const leave = workers.filter((worker) =>
//     attendance.some(
//       (item) =>
//         sameId(
//           item?.worker?._id || item?.worker,
//           worker?._id
//         ) && item?.status === "leave"
//     )
//   );

//   // =====================================================
//   // TODAY
//   // =====================================================

//   const today = new Date();

//   const isSameToday = (dateValue) => {
//     if (!dateValue) return false;

//     const date = new Date(dateValue);

//     return (
//       date.getFullYear() === today.getFullYear() &&
//       date.getMonth() === today.getMonth() &&
//       date.getDate() === today.getDate()
//     );
//   };

//   // =====================================================
//   // WORKER TODAY PAYMENTS
//   // =====================================================

//   const getWorkerTodayPayments = (workerId) => {
//     return payments.filter((payment) => {
//       const paymentWorkerId =
//         payment?.worker?._id ||
//         payment?.worker;

//       if (!paymentWorkerId) {
//         return false;
//       }

//       // Support both createdAt and paymentDate
//       const paymentDate =
//         payment?.paymentDate ||
//         payment?.createdAt;

//       if (!paymentDate) {
//         return false;
//       }

//       return (
//         sameId(paymentWorkerId, workerId) &&
//         isSameToday(paymentDate)
//       );
//     });
//   };

//   // =====================================================
//   // TOTAL TODAY PAYMENT
//   // =====================================================

//   const getWorkerTodayTotal = (workerId) => {
//     const workerPayments =
//       getWorkerTodayPayments(workerId);

//     return workerPayments.reduce(
//       (sum, payment) =>
//         sum + Number(payment?.amount || 0),
//       0
//     );
//   };

//   // =====================================================
//   // WORKER ROW
//   // =====================================================

//   const WorkerPaymentRow = ({ worker }) => {
//     const totalPaid = getWorkerTodayTotal(
//       worker?._id
//     );

//     return (
//       <div className="flex items-center justify-between gap-3 border-b border-slate-100 py-2 last:border-0">
//         <span className="font-medium text-slate-700">
//           {worker?.name || "Unknown Worker"}
//         </span>

//         {totalPaid > 0 ? (
//           <span className="text-sm font-semibold text-green-700">
//             Rs. {totalPaid}
//           </span>
//         ) : (
//           <span className="text-xs text-slate-400">
//             No Payment
//           </span>
//         )}
//       </div>
//     );
//   };

//   // =====================================================
//   // TODAY DATE DISPLAY
//   // =====================================================

//   const todayDisplay = today.toLocaleDateString(
//     "en-US",
//     {
//       weekday: "short",
//       month: "short",
//       day: "2-digit",
//       year: "numeric",
//     }
//   );

//   // =====================================================
//   // UI
//   // =====================================================

//   return (
//     <div>
//       {/* Header */}
//       <div className="flex items-center justify-between">
//         <div>
//           <h2 className="text-2xl font-bold text-slate-900">
//             Today's Attendance Summary
//           </h2>

//           <p className="mt-1 text-slate-500">
//             {todayDisplay}
//           </p>
//         </div>
//       </div>

//       {/* Summary Cards */}
//       <div className="mt-6 grid gap-5 md:grid-cols-3">

//         {/* ================= PRESENT ================= */}

//         <div className="rounded-2xl bg-green-50 p-5">
//           <h3 className="font-semibold text-green-700">
//             Present ({present.length})
//           </h3>

//           <div className="mt-3 space-y-1">
//             {present.length > 0 ? (
//               present.map((worker) => (
//                 <WorkerPaymentRow
//                   key={worker._id}
//                   worker={worker}
//                 />
//               ))
//             ) : (
//               <p className="text-sm text-slate-400">
//                 No workers
//               </p>
//             )}
//           </div>
//         </div>

//         {/* ================= ABSENT ================= */}

//         <div className="rounded-2xl bg-red-50 p-5">
//           <h3 className="font-semibold text-red-700">
//             Absent ({absent.length})
//           </h3>

//           <div className="mt-3 space-y-1">
//             {absent.length > 0 ? (
//               absent.map((worker) => (
//                 <WorkerPaymentRow
//                   key={worker._id}
//                   worker={worker}
//                 />
//               ))
//             ) : (
//               <p className="text-sm text-slate-400">
//                 No workers
//               </p>
//             )}
//           </div>
//         </div>

//         {/* ================= LEAVE ================= */}

//         <div className="rounded-2xl bg-orange-50 p-5">
//           <h3 className="font-semibold text-orange-700">
//             Leave ({leave.length})
//           </h3>

//           <div className="mt-3 space-y-1">
//             {leave.length > 0 ? (
//               leave.map((worker) => (
//                 <WorkerPaymentRow
//                   key={worker._id}
//                   worker={worker}
//                 />
//               ))
//             ) : (
//               <p className="text-sm text-slate-400">
//                 No workers
//               </p>
//             )}
//           </div>
//         </div>

//       </div>
//     </div>
//   );
// }

// export default AttendanceSummary;

import { useEffect, useState } from "react";
import { getPayments } from "../services/paymentService";

function AttendanceSummary({
  workers = [],
  attendance = [],
  attendanceDate = null,
}) {
  const [payments, setPayments] = useState([]);

  // =====================================================
  // LOAD PAYMENTS
  // =====================================================

  useEffect(() => {
    const loadPayments = async () => {
      try {
        const response = await getPayments();

        const records =
          response?.data?.data || [];

        setPayments(records);
      } catch (error) {
        console.log(
          "Payment load error:",
          error
        );

        setPayments([]);
      }
    };

    loadPayments();
  }, []);

  // =====================================================
  // ID HELPER
  // =====================================================

  const sameId = (id1, id2) => {
    if (!id1 || !id2) return false;

    return String(id1) === String(id2);
  };

  // =====================================================
  // DATE HELPER
  // =====================================================

  const getDateKey = (dateValue) => {
    if (!dateValue) return null;

    const date = new Date(dateValue);

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
  // SELECTED ATTENDANCE DATE
  //
  // If attendanceDate is provided from Attendance.jsx,
  // use that date.
  //
  // Otherwise current date is used.
  // =====================================================

  const selectedDate =
    attendanceDate ||
    new Date();

  const selectedDateKey =
    getDateKey(selectedDate);

  // =====================================================
  // ATTENDANCE
  // =====================================================

  const present = workers.filter(
    (worker) =>
      attendance.some(
        (item) =>
          sameId(
            item?.worker?._id ||
              item?.worker,
            worker?._id
          ) &&
          item?.status === "present"
      )
  );

  const absent = workers.filter(
    (worker) =>
      attendance.some(
        (item) =>
          sameId(
            item?.worker?._id ||
              item?.worker,
            worker?._id
          ) &&
          item?.status === "absent"
      )
  );

  const leave = workers.filter(
    (worker) =>
      attendance.some(
        (item) =>
          sameId(
            item?.worker?._id ||
              item?.worker,
            worker?._id
          ) &&
          item?.status === "leave"
      )
  );

  // =====================================================
  // GET PAYMENT DATE
  //
  // IMPORTANT:
  // paymentDate is used first.
  //
  // createdAt is ONLY fallback for old records.
  // =====================================================

  const getPaymentDate = (payment) => {
    return (
      payment?.paymentDate ||
      payment?.createdAt ||
      null
    );
  };

  // =====================================================
  // GET WORKER PAYMENTS FOR SELECTED DATE
  // =====================================================

  const getWorkerPayments = (workerId) => {
    if (!workerId || !selectedDateKey) {
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
        selectedDateKey
      );
    });
  };

  // =====================================================
  // WORKER TOTAL PAYMENT
  // =====================================================

  const getWorkerTotal = (workerId) => {
    const workerPayments =
      getWorkerPayments(workerId);

    return workerPayments.reduce(
      (sum, payment) =>
        sum +
        Number(
          payment?.amount || 0
        ),
      0
    );
  };

  // =====================================================
  // WORKER PAYMENT ROW
  // =====================================================

  const WorkerPaymentRow = ({
    worker,
  }) => {
    const totalPaid =
      getWorkerTotal(
        worker?._id
      );

    return (
      <div className="flex items-center justify-between gap-3 border-b border-slate-100 py-2 last:border-0">

        <span className="font-medium text-slate-700">
          {worker?.name ||
            "Unknown Worker"}
        </span>

        {totalPaid > 0 ? (
          <span className="text-sm font-semibold text-green-700">
            Rs.{" "}
            {totalPaid.toLocaleString(
              "en-PK"
            )}
          </span>
        ) : (
          <span className="text-xs text-slate-400">
            No Payment
          </span>
        )}

      </div>
    );
  };

  // =====================================================
  // DISPLAY DATE
  // =====================================================

  const displayDate =
    selectedDate
      ? new Date(
          selectedDate
        ).toLocaleDateString(
          "en-US",
          {
            weekday: "short",
            month: "short",
            day: "2-digit",
            year: "numeric",
          }
        )
      : "";

  // =====================================================
  // UI
  // =====================================================

  return (
    <div className="w-full">

      {/* =================================================
          HEADER
      ================================================= */}

      <div className="flex items-center justify-between">

        <div>

          <h2 className="text-2xl font-bold text-slate-900">
            Attendance Summary
          </h2>

          <p className="mt-1 text-slate-500">
            {displayDate}
          </p>

        </div>

      </div>

      {/* =================================================
          SUMMARY CARDS
      ================================================= */}

      <div className="mt-6 grid gap-5 md:grid-cols-3">

        {/* =================================================
            PRESENT
        ================================================= */}

        <div className="rounded-2xl bg-green-50 p-5">

          <h3 className="font-semibold text-green-700">
            Present ({present.length})
          </h3>

          <div className="mt-3 space-y-1">

            {present.length > 0 ? (
              present.map(
                (worker) => (
                  <WorkerPaymentRow
                    key={worker._id}
                    worker={worker}
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

        <div className="rounded-2xl bg-red-50 p-5">

          <h3 className="font-semibold text-red-700">
            Absent ({absent.length})
          </h3>

          <div className="mt-3 space-y-1">

            {absent.length > 0 ? (
              absent.map(
                (worker) => (
                  <WorkerPaymentRow
                    key={worker._id}
                    worker={worker}
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

        <div className="rounded-2xl bg-orange-50 p-5">

          <h3 className="font-semibold text-orange-700">
            Leave ({leave.length})
          </h3>

          <div className="mt-3 space-y-1">

            {leave.length > 0 ? (
              leave.map(
                (worker) => (
                  <WorkerPaymentRow
                    key={worker._id}
                    worker={worker}
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
  );
}

export default AttendanceSummary;