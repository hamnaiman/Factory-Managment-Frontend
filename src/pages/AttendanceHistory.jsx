// import { useEffect, useMemo, useState } from "react";
// import {
//   Search,
//   Calendar,
//   Eye,
//   X,
// } from "lucide-react";
// import toast from "react-hot-toast";

// import { getPayments } from "../services/paymentService";

// import Sidebar from "../components/Sidebar";
// import Navbar from "../components/Navbar";

// import {
//   getAttendanceHistory,
//   getAttendanceByDate,
// } from "../services/attendanceService";

// function AttendanceHistory() {
//   // Desktop standard fixed layout state - starts open by default
//   const [isSidebarOpen, setIsSidebarOpen] = useState(true);

//   const [history, setHistory] = useState([]);
//   const [details, setDetails] = useState([]);

//   const [search, setSearch] = useState("");
//   const [dateFilter, setDateFilter] = useState("");

//   const [loading, setLoading] = useState(true);
//   const [showModal, setShowModal] = useState(false);
//   const [payments, setPayments] = useState([]);

//   const loadHistory = async () => {
//     try {
//       setLoading(true);
//       const response = await getAttendanceHistory();
//       setHistory(response.data.data);
//     } catch (error) {
//       toast.error("Failed to load attendance history");
//     } finally {
//       setLoading(false);
//     }
//   };


//   const loadPayments = async () => {
//   try {
//     const res = await getPayments();
//     setPayments(res.data.data);
//   } catch (error) {
//     console.log(error);
//   }
// };

//   useEffect(() => {
//     loadHistory();
//     loadPayments();
//   }, []);

//   const viewDetails = async (date) => {
//     try {
//       const response = await getAttendanceByDate(date);
//       setDetails(response.data.data);
//       setShowModal(true);
//     } catch (error) {
//       toast.error("Failed to fetch attendance details");
//     }
//   };

//   const filteredHistory = useMemo(() => {
//     return history.filter((item) => {
//       const searchMatch = item._id
//         .toLowerCase()
//         .includes(search.toLowerCase());

//       const dateMatch = !dateFilter || item._id === dateFilter;

//       return searchMatch && dateMatch;
//     });
//   }, [history, search, dateFilter]);

//   const presentWorkers = details.filter((item) => item.status === "present");
//   const absentWorkers = details.filter((item) => item.status === "absent");
//   const leaveWorkers = details.filter((item) => item.status === "leave");

//   return (
//     <div className="min-h-screen bg-slate-100 flex overflow-x-hidden">
//       {/* Sidebar Component */}
//       <Sidebar
//         isOpen={isSidebarOpen}
//         setIsOpen={setIsSidebarOpen}
//       />

//       {/* Main Content Area - Fixed dynamic margin to match layout sizing */}
//       <div 
//         className={`flex-1 min-w-0 transition-all duration-300 ease-in-out
//         ${isSidebarOpen ? "ml-0 lg:ml-72" : "ml-0 lg:ml-20"}`}
//       >
//         {/* Fixed Navbar with synchronized state */}
//         <Navbar
//           isSidebarOpen={isSidebarOpen}
//           setIsSidebarOpen={setIsSidebarOpen}
//         />

//         {/* Page Content layout wrapper shifted below navbar via mt-24 */}
//         <main className="p-4 md:p-6 lg:p-8 space-y-6 max-w-[1600px] mx-auto mt-24">
          
//           {/* Header */}
//           <div>
//             <h1 className="text-2xl font-bold leading-tight text-slate-900 sm:text-3xl">
//               Attendance History
//             </h1>
//             <p className="mt-1 text-sm text-slate-500">
//               View all saved attendance records.
//             </p>
//           </div>

//           {/* Toolbar */}
//           <div className="rounded-3xl border border-slate-200 bg-white p-5 shadow-xs">
//             <div className="flex flex-col gap-4 lg:flex-row">
//               <div className="relative flex-1">
//                 <Search
//                   size={18}
//                   className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400"
//                 />
//                 <input
//                   type="text"
//                   placeholder="Search by Date..."
//                   value={search}
//                   onChange={(e) => setSearch(e.target.value)}
//                   className="h-12 w-full rounded-xl border border-slate-300 pl-11 pr-4 outline-hidden focus:border-[#1E3A8A]"
//                 />
//               </div>

//               <div className="relative w-full lg:w-72">
//                 <Calendar
//                   size={18}
//                   className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400"
//                 />
//                 <input
//                   type="date"
//                   value={dateFilter}
//                   onChange={(e) => setDateFilter(e.target.value)}
//                   className="h-12 w-full rounded-xl border border-slate-300 pl-11 pr-4 outline-hidden focus:border-[#1E3A8A]"
//                 />
//               </div>
//             </div>
//           </div>

//           {/* Loading States / Data Tables */}
//           {loading ? (
//             <div className="rounded-3xl bg-white p-10 text-center shadow-xs border border-slate-200">
//               <p className="text-slate-500">Loading attendance history...</p>
//             </div>
//           ) : filteredHistory.length === 0 ? (
//             <div className="rounded-3xl bg-white p-10 text-center shadow-xs border border-slate-200">
//               <p className="text-slate-500">No attendance history found.</p>
//             </div>
//           ) : (
//             <>
//               {/* Desktop Table View */}
//               <div className="hidden overflow-x-auto rounded-3xl border border-slate-200 bg-white shadow-xs lg:block">
//                 <table className="w-full">
//                   <thead className="bg-slate-50">
//                     <tr className="text-left text-slate-700 border-b border-slate-200">
//                       <th className="px-6 py-4">Date</th>
//                       <th className="px-6 py-4">Total</th>
//                       <th className="px-6 py-4">Present</th>
//                       <th className="px-6 py-4">Absent</th>
//                       <th className="px-6 py-4">Leave</th>
//                       <th className="px-6 py-4 text-center">Action</th>
//                     </tr>
//                   </thead>
//                   <tbody>
//                     {filteredHistory.map((item) => (
//                       <tr
//                         key={item._id}
//                         className="border-b border-slate-100 last:border-0 hover:bg-slate-50/50 transition-colors"
//                       >
//                         <td className="px-6 py-5 font-medium text-slate-900">{item._id}</td>
//                         <td className="px-6 text-slate-700">{item.total}</td>
//                         <td className="px-6 text-green-600 font-semibold">{item.present}</td>
//                         <td className="px-6 text-red-600 font-semibold">{item.absent}</td>
//                         <td className="px-6 text-orange-500 font-semibold">{item.leave}</td>
//                         <td className="px-6 text-center">
//                           <button
//                             onClick={() => viewDetails(item._id)}
//                             className="inline-flex items-center gap-2 rounded-xl bg-[#1E3A8A] px-4 py-2 text-sm font-medium text-white hover:bg-[#17307A] transition-colors cursor-pointer"
//                           >
//                             <Eye size={16} />
//                             View
//                           </button>
//                         </td>
//                       </tr>
//                     ))}
//                   </tbody>
//                 </table>
//               </div>

//               {/* Mobile Cards View */}
//               <div className="space-y-4 lg:hidden">
//                 {filteredHistory.map((item) => (
//                   <div
//                     key={item._id}
//                     className="rounded-3xl border border-slate-200 bg-white p-5 shadow-xs"
//                   >
//                     <h3 className="text-lg font-bold text-slate-900">{item._id}</h3>
//                     <div className="mt-4 grid grid-cols-2 gap-4 text-sm">
//                       <div>
//                         <p className="text-slate-500">Total</p>
//                         <p className="font-semibold text-slate-800">{item.total}</p>
//                       </div>
//                       <div>
//                         <p className="text-slate-500">Present</p>
//                         <p className="font-semibold text-green-600">{item.present}</p>
//                       </div>
//                       <div>
//                         <p className="text-slate-500">Absent</p>
//                         <p className="font-semibold text-red-600">{item.absent}</p>
//                       </div>
//                       <div>
//                         <p className="text-slate-500">Leave</p>
//                         <p className="font-semibold text-orange-500">{item.leave}</p>
//                       </div>
//                     </div>
//                     <button
//                       onClick={() => viewDetails(item._id)}
//                       className="mt-5 flex w-full items-center justify-center gap-2 rounded-xl bg-[#1E3A8A] py-3 text-sm font-semibold text-white hover:bg-[#17307A] transition-colors cursor-pointer"
//                     >
//                       <Eye size={18} />
//                       View Details
//                     </button>
//                   </div>
//                 ))}
//               </div>
//             </>
//           )}

//           {/* Details Overlay Modal */}
//           {showModal && (
//             <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/40 backdrop-blur-xs p-4">
//               <div className="max-h-[85vh] w-full max-w-4xl overflow-y-auto rounded-3xl bg-white shadow-xl flex flex-col">
//                 <div className="flex items-center justify-between border-b border-slate-200 p-6 shrink-0">
//                   <h2 className="text-xl font-bold text-slate-900">Attendance Details</h2>
//                   <button 
//                     onClick={() => setShowModal(false)}
//                     className="rounded-lg p-1 text-slate-500 hover:bg-slate-100 transition-colors cursor-pointer"
//                   >
//                     <X size={20} />
//                   </button>
//                 </div>

//                 <div className="grid gap-6 p-6 lg:grid-cols-3 overflow-y-auto">
//                   {/* Present Column */}
//                   <div className="rounded-2xl bg-green-50/70 p-5 border border-green-100">
//                     <h3 className="mb-4 font-bold text-green-700">
//                       Present ({presentWorkers.length})
//                     </h3>
//                     <div className="space-y-2">
//                      <div className="space-y-2">
//   {presentWorkers.map((item) => {

//     const payment = payments.find(
//       (p) =>
//         p.worker?._id === item.worker?._id &&
//         new Date(p.createdAt).toDateString() ===
//           new Date(item.date).toDateString()
//     );

//     return (
//       <div
//         key={item._id}
//         className="rounded-xl border border-slate-100 bg-white p-3 shadow-2xs"
//       >
//         <p className="font-medium text-slate-700">
//           {item.worker?.name}
//         </p>

//         {payment ? (
//           <div className="mt-2 text-sm">
//             <p className="font-semibold text-green-600">
//               Rs. {payment.amount}
//             </p>

//             <p className="text-slate-500">
//               {payment.paymentType}
//             </p>
//           </div>
//         ) : (
//           <p className="mt-2 text-xs text-slate-400">
//             No Payment
//           </p>
//         )}
//       </div>
//     );

//   })}
// </div>
//                     </div>
//                   </div>

//                   {/* Absent Column */}
//                   <div className="rounded-2xl bg-red-50/70 p-5 border border-red-100">
//                     <h3 className="mb-4 font-bold text-red-700">
//                       Absent ({absentWorkers.length})
//                     </h3>
//                     <div className="space-y-2">
//                       {absentWorkers.map((item) => (
//                         <div key={item._id} className="rounded-xl border border-slate-100 bg-white p-3 text-sm font-medium text-slate-700 shadow-2xs">
//                           {item.worker?.name}
//                         </div>
//                       ))}
//                     </div>
//                   </div>

//                   {/* Leave Column */}
//                   <div className="rounded-2xl bg-orange-50/70 p-5 border border-orange-100">
//                     <h3 className="mb-4 font-bold text-orange-700">
//                       Leave ({leaveWorkers.length})
//                     </h3>
//                     <div className="space-y-2">
//                       {leaveWorkers.map((item) => (
//                         <div key={item._id} className="rounded-xl border border-slate-100 bg-white p-3 text-sm font-medium text-slate-700 shadow-2xs">
//                           {item.worker?.name}
//                         </div>
//                       ))}
//                     </div>
//                   </div>
//                 </div>
//               </div>
//             </div>
//           )}
//         </main>
//       </div>
//     </div>
//   );
// }

// export default AttendanceHistory;


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
  const [isSidebarOpen, setIsSidebarOpen] =
    useState(true);

  const [history, setHistory] = useState([]);
  const [details, setDetails] = useState([]);

  const [search, setSearch] = useState("");
  const [dateFilter, setDateFilter] = useState("");

  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);

  const [payments, setPayments] = useState([]);

  // =====================================================
  // LOAD HISTORY
  // =====================================================

  const loadHistory = async () => {
    try {
      setLoading(true);

      const response =
        await getAttendanceHistory();

      setHistory(
        response?.data?.data || []
      );
    } catch (error) {
      console.error(error);

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
      const response =
        await getPayments();

      setPayments(
        response?.data?.data || []
      );
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

    if (
      Number.isNaN(
        date.getTime()
      )
    ) {
      return null;
    }

    const year =
      date.getFullYear();

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

    return (
      String(id1) ===
      String(id2)
    );
  };

  // =====================================================
  // GET PAYMENT DATE
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
  // GET PAYMENTS FOR WORKER + ATTENDANCE DATE
  // =====================================================

  const getWorkerPayments = (
    workerId,
    attendanceDate
  ) => {
    if (
      !workerId ||
      !attendanceDate
    ) {
      return [];
    }

    const attendanceDateKey =
      getDateKey(
        attendanceDate
      );

    if (!attendanceDateKey) {
      return [];
    }

    return payments.filter(
      (payment) => {
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
          getPaymentDate(
            payment
          );

        if (!paymentDate) {
          return false;
        }

        const paymentDateKey =
          getDateKey(
            paymentDate
          );

        return (
          paymentDateKey ===
          attendanceDateKey
        );
      }
    );
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
        Number(
          payment?.amount || 0
        ),
      0
    );
  };

  // =====================================================
  // VIEW DETAILS
  // =====================================================

  const viewDetails = async (
    date
  ) => {
    try {
      const response =
        await getAttendanceByDate(
          date
        );

      setDetails(
        response?.data?.data || []
      );

      setShowModal(true);
    } catch (error) {
      console.error(error);

      toast.error(
        "Failed to fetch attendance details"
      );
    }
  };

  // =====================================================
  // FILTER HISTORY
  // =====================================================

  const filteredHistory =
    useMemo(() => {
      return history.filter(
        (item) => {
          const searchMatch =
            String(item?._id || "")
              .toLowerCase()
              .includes(
                search.toLowerCase()
              );

          const dateMatch =
            !dateFilter ||
            item?._id ===
              dateFilter;

          return (
            searchMatch &&
            dateMatch
          );
        }
      );
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
        item?.status ===
        "present"
    );

  const absentWorkers =
    details.filter(
      (item) =>
        item?.status ===
        "absent"
    );

  const leaveWorkers =
    details.filter(
      (item) =>
        item?.status ===
        "leave"
    );

  // =====================================================
  // PAYMENT DISPLAY
  // =====================================================

  const PaymentInfo = ({
    item,
  }) => {
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
      workerPayments.length ===
      0
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
              key={
                payment?._id
              }
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

  const WorkerCard = ({
    item,
  }) => {
    return (
      <div className="rounded-xl border border-slate-100 bg-white p-3 shadow-sm">

        <p className="text-sm font-medium text-slate-700">
          {item?.worker?.name ||
            "Unknown Worker"}
        </p>

        <PaymentInfo
          item={item}
        />

      </div>
    );
  };

  return (
    <div className="flex min-h-screen overflow-x-hidden bg-slate-100">

      {/* SIDEBAR */}

      <Sidebar
        isOpen={isSidebarOpen}
        setIsOpen={
          setIsSidebarOpen
        }
      />

      {/* MAIN */}

      <div
        className={`min-w-0 flex-1 transition-all duration-300 ${
          isSidebarOpen
            ? "ml-0 lg:ml-72"
            : "ml-0 lg:ml-20"
        }`}
      >

        <Navbar
          isSidebarOpen={
            isSidebarOpen
          }
          setIsSidebarOpen={
            setIsSidebarOpen
          }
        />

        <main className="mx-auto mt-24 max-w-[1600px] space-y-6 p-4 md:p-6 lg:p-8">

          {/* HEADER */}

          <div>
            <h1 className="text-2xl font-bold leading-tight text-slate-900 sm:text-3xl">
              Attendance History
            </h1>

            <p className="mt-1 text-sm text-slate-500">
              View all saved attendance records.
            </p>
          </div>

          {/* FILTERS */}

          <div className="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm">

            <div className="flex flex-col gap-4 lg:flex-row">

              <div className="relative flex-1">

                <Search
                  size={18}
                  className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400"
                />

                <input
                  type="text"
                  placeholder="Search by Date..."
                  value={search}
                  onChange={(e) =>
                    setSearch(
                      e.target.value
                    )
                  }
                  className="h-12 w-full rounded-xl border border-slate-300 pl-11 pr-4 outline-none focus:border-[#1E3A8A]"
                />

              </div>

              <div className="relative w-full lg:w-72">

                <Calendar
                  size={18}
                  className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400"
                />

                <input
                  type="date"
                  value={dateFilter}
                  onChange={(e) =>
                    setDateFilter(
                      e.target.value
                    )
                  }
                  className="h-12 w-full rounded-xl border border-slate-300 pl-11 pr-4 outline-none focus:border-[#1E3A8A]"
                />

              </div>

            </div>

          </div>

          {/* TABLE */}

          {loading ? (
            <div className="rounded-3xl border border-slate-200 bg-white p-10 text-center shadow-sm">
              <p className="text-slate-500">
                Loading attendance history...
              </p>
            </div>
          ) : filteredHistory.length === 0 ? (
            <div className="rounded-3xl border border-slate-200 bg-white p-10 text-center shadow-sm">
              <p className="text-slate-500">
                No attendance history found.
              </p>
            </div>
          ) : (
            <div className="hidden overflow-x-auto rounded-3xl border border-slate-200 bg-white shadow-sm lg:block">

              <table className="w-full">

                <thead className="bg-slate-50">

                  <tr className="border-b border-slate-200 text-left text-slate-700">

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
                        key={
                          item._id
                        }
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
                            onClick={() =>
                              viewDetails(
                                item._id
                              )
                            }
                            className="inline-flex cursor-pointer items-center gap-2 rounded-xl bg-[#1E3A8A] px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-[#17307A]"
                          >
                            <Eye
                              size={16}
                            />

                            View
                          </button>

                        </td>

                      </tr>
                    )
                  )}

                </tbody>

              </table>

            </div>
          )}

          {/* =================================================
              DETAILS MODAL
          ================================================= */}

          {showModal && (
            <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/40 p-4 backdrop-blur-sm">

              <div className="flex max-h-[85vh] w-full max-w-5xl flex-col overflow-y-auto rounded-3xl bg-white shadow-xl">

                {/* HEADER */}

                <div className="flex shrink-0 items-center justify-between border-b border-slate-200 p-6">

                  <div>

                    <h2 className="text-xl font-bold text-slate-900">
                      Attendance Details
                    </h2>

                    {details[0]?.date && (
                      <p className="mt-1 text-sm text-slate-500">
                        {new Date(
                          details[0].date
                        ).toLocaleDateString(
                          "en-US",
                          {
                            day: "2-digit",
                            month: "2-digit",
                            year: "numeric",
                          }
                        )}
                      </p>
                    )}

                  </div>

                  <button
                    onClick={() =>
                      setShowModal(
                        false
                      )
                    }
                    className="cursor-pointer rounded-lg p-1 text-slate-500 transition-colors hover:bg-slate-100"
                  >
                    <X size={20} />
                  </button>

                </div>

                {/* COLUMNS */}

                <div className="grid gap-6 overflow-y-auto p-6 lg:grid-cols-3">

                  {/* PRESENT */}

                  <div className="rounded-2xl border border-green-100 bg-green-50/70 p-5">

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

                  {/* ABSENT */}

                  <div className="rounded-2xl border border-red-100 bg-red-50/70 p-5">

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

                  {/* LEAVE */}

                  <div className="rounded-2xl border border-orange-100 bg-orange-50/70 p-5">

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
          )}

        </main>

      </div>

    </div>
  );
}

export default AttendanceHistory;