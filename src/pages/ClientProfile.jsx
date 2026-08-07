// import { useEffect, useState } from "react";
// import { useParams } from "react-router-dom";

// import Sidebar from "../components/Sidebar";
// import Navbar from "../components/Navbar";
// import ReceivePaymentModal from "../components/ReceivePaymentModal";

// import {
//   getClientProfile,
//   receiveClientPayment,
// } from "../services/clientProfileService";

// import toast from "react-hot-toast";

// function ClientProfile() {
//   const { id } = useParams();

//   const [isSidebarOpen, setIsSidebarOpen] = useState(true);

//   const [profile, setProfile] = useState(null);

//   const [openPaymentModal, setOpenPaymentModal] = useState(false);

//   // const loadProfile = async () => {
//   //   try {
//   //     const res = await getClientProfile(id);
//   //     setProfile(res.data.data);
//   //   } catch (error) {
//   //     toast.error("Failed to load client profile");
//   //   }
//   // };

//   const loadProfile = async () => {
//   try {
//     const res = await getClientProfile(id);

//     console.log("PROFILE DATA:", res.data.data);

//     setProfile(res.data.data);
//   } catch (error) {
//     toast.error("Failed to load client profile");
//   }
// };

//   const handleReceivePayment = async (data) => {
//     try {
//       await receiveClientPayment(id, data);

//       toast.success("Payment received successfully");

//       setOpenPaymentModal(false);

//       loadProfile();
//     } catch (error) {
//       toast.error("Failed to receive payment");
//     }
//   };

//   useEffect(() => {
//     loadProfile();
//   }, [id]);

//   if (!profile) {
//     return (
//       <div className="flex h-screen items-center justify-center">
//         Loading...
//       </div>
//     );
//   }

//   return (
//     <div className="min-h-screen bg-slate-100 flex overflow-x-hidden">
//       <Sidebar
//         isOpen={isSidebarOpen}
//         setIsOpen={setIsSidebarOpen}
//       />

//       <div
//         className={`flex-1 transition-all duration-300 ${
//           isSidebarOpen ? "lg:ml-72" : "lg:ml-20"
//         }`}
//       >
//         <Navbar
//           isSidebarOpen={isSidebarOpen}
//           setIsOpen={setIsSidebarOpen}
//         />

//         <main className="mt-24 max-w-[1600px] mx-auto space-y-6 p-4 md:p-6 lg:p-8">

//         {/* Header */}

// <div>
//   <h1 className="text-3xl font-bold text-slate-900">
//     Client Profile
//   </h1>

//   <p className="mt-1 text-slate-500">
//     Complete client information.
//   </p>
// </div>

// {/* Client Card */}

// <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">

//   <h2 className="text-2xl font-bold">
//     {profile.client.clientName}
//   </h2>

//   <div className="mt-6 grid gap-5 md:grid-cols-2 lg:grid-cols-4">

//     <div>
//       <p className="text-sm text-slate-500">
//         Phone
//       </p>

//       <h3 className="font-semibold">
//         {profile.client.phoneNumber || "-"}
//       </h3>
//     </div>

//     <div>
//       <p className="text-sm text-slate-500">
//         Email
//       </p>

//       <h3 className="font-semibold">
//         {profile.client.email || "-"}
//       </h3>
//     </div>

//     <div>
//       <p className="text-sm text-slate-500">
//         Opening Balance
//       </p>

//       <h3 className="font-semibold">
//         Rs. {profile.client.openingBalance || 0}
//       </h3>
//     </div>

//     <div>
//       <p className="text-sm text-slate-500">
//         Status
//       </p>

//       <span
//         className={`rounded-full px-3 py-1 text-sm ${
//           profile.client.status === "active"
//             ? "bg-green-100 text-green-700"
//             : "bg-red-100 text-red-700"
//         }`}
//       >
//         {profile.client.status}
//       </span>
//     </div>

//   </div>

//   <div className="mt-6">
//     <p className="text-sm text-slate-500">
//       Address
//     </p>

//     <p className="mt-1 font-medium">
//       {profile.client.address || "-"}
//     </p>
//   </div>

// </div>


// {/* Summary Cards */}

// <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-4">

//   <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
//     <p className="text-sm text-slate-500">
//       Opening Balance
//     </p>

//     <h2 className="mt-2 text-3xl font-bold text-blue-700">
//       Rs. {profile.client.openingBalance || 0}
//     </h2>
//   </div>

//   <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
//     <p className="text-sm text-slate-500">
//       Total Purchases
//     </p>

//     <h2 className="mt-2 text-3xl font-bold text-indigo-600">
//       Rs. {profile.client.totalPurchases || 0}
//     </h2>
//   </div>

//   <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
//     <p className="text-sm text-slate-500">
//       Total Payments
//     </p>

//     <h2 className="mt-2 text-3xl font-bold text-green-600">
//       Rs. {profile.client.totalPayments || 0}
//     </h2>
//   </div>

//   <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
//     <p className="text-sm text-slate-500">
//       Outstanding Balance
//     </p>

//     <h2 className="mt-2 text-3xl font-bold text-red-600">
//       Rs. {profile.client.outstandingBalance || 0}
//     </h2>
//   </div>

// </div>

// {/* Payment History */}

// <div className="rounded-3xl border border-slate-200 bg-white shadow-sm">

//   <div className="flex items-center justify-between border-b border-slate-200 p-6">

//     <h2 className="text-xl font-bold">
//       Payment History
//     </h2>

//     <button
//       onClick={() => setOpenPaymentModal(true)}
//       className="rounded-xl bg-[#1E3A8A] px-5 py-3 text-white hover:bg-[#17307A]"
//     >
//       Receive Payment
//     </button>

//   </div>

//   <table className="w-full">

//     <thead>

//       <tr className="bg-slate-50">

//         <th className="p-4 text-left">
//           Date
//         </th>

//         <th className="p-4 text-left">
//           Amount
//         </th>

//         <th className="p-4 text-left">
//           Method
//         </th>

//         <th className="p-4 text-left">
//           Remarks
//         </th>

//       </tr>

//     </thead>

//     <tbody>

//       {profile.paymentHistory.length === 0 ? (

//         <tr>

//           <td
//             colSpan="4"
//             className="p-6 text-center text-slate-500"
//           >
//             No payment history found.
//           </td>

//         </tr>

//       ) : (

//         profile.paymentHistory.map((payment) => (

//           <tr
//             key={payment._id}
//             className="border-t"
//           >

//             <td className="p-4">
//               {new Date(payment.paymentDate).toLocaleDateString()}
//             </td>

//             <td className="p-4 font-semibold text-green-600">
//               Rs. {payment.amount}
//             </td>

//             <td className="p-4">
//               {payment.paymentMethod}
//             </td>

//             <td className="p-4">
//               {payment.remarks || "-"}
//             </td>

//           </tr>

//         ))

//       )}

//     </tbody>

//   </table>

// </div>

// {/* Client Ledger */}

// <div className="rounded-3xl border border-slate-200 bg-white shadow-sm">

//   <div className="border-b border-slate-200 p-6">

//     <h2 className="text-xl font-bold">
//       Client Ledger
//     </h2>

//   </div>

//   <table className="w-full">

//     <thead>

//       <tr className="bg-slate-50">

//         <th className="p-4 text-left">
//           Date
//         </th>

//         <th className="p-4 text-left">
//           Particular
//         </th>

//         <th className="p-4 text-left">
//           Debit
//         </th>

//         <th className="p-4 text-left">
//           Credit
//         </th>

//         <th className="p-4 text-left">
//           Balance
//         </th>

//       </tr>

//     </thead>

//     <tbody>

//    {profile.ledger.ledger.length === 0 ? (

//         <tr>

//           <td
//             colSpan="5"
//             className="p-6 text-center text-slate-500"
//           >
//             No ledger entries found.
//           </td>

//         </tr>

//       ) : (

//       profile.ledger.ledger.map((entry) => (

//           <tr
//             key={index}
//             className="border-t"
//           >

//             <td className="p-4">
//               {entry.date
//                 ? new Date(entry.date).toLocaleDateString()
//                 : "-"}
//             </td>

//             <td className="p-4">
//               {entry.particular}
//             </td>

//             <td className="p-4 text-red-600 font-semibold">
//               {entry.debit ? `Rs. ${entry.debit}` : "-"}
//             </td>

//             <td className="p-4 text-green-600 font-semibold">
//               {entry.credit ? `Rs. ${entry.credit}` : "-"}
//             </td>

//             <td className="p-4 font-semibold text-[#1E3A8A]">
//               Rs. {entry.balance}
//             </td>

//           </tr>

//         ))

//       )}

//     </tbody>

//   </table>

// </div>

//         </main>
//       </div>

//       <ReceivePaymentModal
//         open={openPaymentModal}
//         onClose={() => setOpenPaymentModal(false)}
//         onSubmit={handleReceivePayment}
//         outstanding={profile.client.outstandingBalance}
//       />
//     </div>
//   );
// }

// export default ClientProfile;


import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import {
  Phone,
  Mail,
  MapPin,
  Wallet,
  ShoppingCart,
  CreditCard,
  BadgeCheck,
} from "lucide-react";

import toast from "react-hot-toast";

import Sidebar from "../components/Sidebar";
import Navbar from "../components/Navbar";
import ReceivePaymentModal from "../components/ReceivePaymentModal";

import {
  getClientProfile,
  receiveClientPayment,
} from "../services/clientProfileService";

function ClientProfile() {
  const { id } = useParams();

  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [profile, setProfile] = useState(null);
  const [openPaymentModal, setOpenPaymentModal] = useState(false);

  const loadProfile = async () => {
    try {
      const res = await getClientProfile(id);
      setProfile(res.data.data);
    } catch (err) {
      toast.error("Failed to load client profile");
    }
  };

  const handleReceivePayment = async (data) => {
    try {
      await receiveClientPayment(id, data);

      toast.success("Payment received successfully");

      setOpenPaymentModal(false);

      loadProfile();
    } catch {
      toast.error("Failed to receive payment");
    }
  };

  useEffect(() => {
    loadProfile();
  }, [id]);

  if (!profile) {
    return (
      <div className="flex h-screen items-center justify-center bg-slate-100">
        <p className="text-lg font-semibold text-slate-600">
          Loading Client...
        </p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-100 overflow-x-hidden">

      <Sidebar
        isOpen={isSidebarOpen}
        setIsOpen={setIsSidebarOpen}
      />

      <div
        className={`transition-all duration-300 ${
          isSidebarOpen ? "lg:ml-72" : "lg:ml-20"
        }`}
      >

        <Navbar
          isSidebarOpen={isSidebarOpen}
          setIsSidebarOpen={setIsSidebarOpen}
        />

        <main className="mx-auto mt-20 sm:mt-24 w-full max-w-7xl space-y-6 p-3 sm:p-5 lg:p-8">

          {/* Page Header */}

          <div>

            <h1 className="text-2xl sm:text-3xl font-bold text-slate-900">
              Client Profile
            </h1>

            <p className="mt-1 text-sm sm:text-base text-slate-500">
              Complete client information and account details.
            </p>

          </div>

          {/* Client Card */}

          <div className="rounded-3xl border border-slate-200 bg-white p-5 sm:p-6 shadow-sm">

            <div className="flex flex-col gap-5 lg:flex-row lg:items-center lg:justify-between">

              <div>

                <h2 className="text-2xl font-bold text-slate-900 break-words">
                  {profile.client.clientName}
                </h2>

                <span
                  className={`mt-3 inline-flex rounded-full px-3 py-1 text-sm font-medium ${
                    profile.client.status === "active"
                      ? "bg-green-100 text-green-700"
                      : "bg-red-100 text-red-700"
                  }`}
                >
                  {profile.client.status}
                </span>

              </div>

              <button
                onClick={() => setOpenPaymentModal(true)}
                className="w-full lg:w-auto rounded-xl bg-[#1E3A8A] px-6 py-3 font-medium text-white transition hover:bg-[#17307A]"
              >
                Receive Payment
              </button>

            </div>

            <div className="mt-8 grid grid-cols-1 gap-5 sm:grid-cols-2 xl:grid-cols-4">

              <div className="rounded-2xl bg-slate-50 p-4">

                <div className="flex items-center gap-2 text-slate-500">
                  <Phone size={18} />
                  <span className="text-sm">
                    Phone
                  </span>
                </div>

                <h3 className="mt-2 font-semibold break-all">
                  {profile.client.phoneNumber || "-"}
                </h3>

              </div>

              <div className="rounded-2xl bg-slate-50 p-4">

                <div className="flex items-center gap-2 text-slate-500">
                  <Mail size={18} />
                  <span className="text-sm">
                    Email
                  </span>
                </div>

                <h3 className="mt-2 font-semibold break-all">
                  {profile.client.email || "-"}
                </h3>

              </div>

              <div className="rounded-2xl bg-slate-50 p-4">

                <div className="flex items-center gap-2 text-slate-500">
                  <Wallet size={18} />
                  <span className="text-sm">
                    Opening Balance
                  </span>
                </div>

                <h3 className="mt-2 font-semibold text-blue-700">
                  Rs. {profile.client.openingBalance || 0}
                </h3>

              </div>

              <div className="rounded-2xl bg-slate-50 p-4">

                <div className="flex items-center gap-2 text-slate-500">
                  <MapPin size={18} />
                  <span className="text-sm">
                    Address
                  </span>
                </div>

                <h3 className="mt-2 font-semibold break-words">
                  {profile.client.address || "-"}
                </h3>

              </div>

            </div>

          </div>

          {/* Summary Cards */}

          <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 xl:grid-cols-4">

            <div className="rounded-3xl bg-white p-5 shadow-sm">

              <div className="flex items-center gap-3">

                <Wallet className="text-blue-600" />

                <div>

                  <p className="text-sm text-slate-500">
                    Opening Balance
                  </p>

                  <h2 className="text-2xl font-bold text-blue-700">
                    Rs. {profile.client.openingBalance || 0}
                  </h2>

                </div>

              </div>

            </div>

            <div className="rounded-3xl bg-white p-5 shadow-sm">

              <div className="flex items-center gap-3">

                <ShoppingCart className="text-indigo-600" />

                <div>

                  <p className="text-sm text-slate-500">
                    Total Purchases
                  </p>

                  <h2 className="text-2xl font-bold text-indigo-600">
                    Rs. {profile.client.totalPurchases || 0}
                  </h2>

                </div>

              </div>

            </div>

            <div className="rounded-3xl bg-white p-5 shadow-sm">

              <div className="flex items-center gap-3">

                <CreditCard className="text-green-600" />

                <div>

                  <p className="text-sm text-slate-500">
                    Total Payments
                  </p>

                  <h2 className="text-2xl font-bold text-green-600">
                    Rs. {profile.client.totalPayments || 0}
                  </h2>

                </div>

              </div>

            </div>

            <div className="rounded-3xl bg-white p-5 shadow-sm">

              <div className="flex items-center gap-3">

                <BadgeCheck className="text-red-600" />

                <div>

                  <p className="text-sm text-slate-500">
                    Outstanding Balance
                  </p>

                  <h2 className="text-2xl font-bold text-red-600">
                    Rs. {profile.client.outstandingBalance || 0}
                  </h2>

                </div>

              </div>

            </div>

          </div>
          {/* ===================== Payment History ===================== */}

<div className="rounded-3xl border border-slate-200 bg-white shadow-sm">

  {/* Header */}

  <div className="flex flex-col gap-4 border-b border-slate-200 p-4 sm:flex-row sm:items-center sm:justify-between sm:p-6">

    <div>

      <h2 className="text-xl font-bold text-slate-900">
        Payment History
      </h2>

      <p className="mt-1 text-sm text-slate-500">
        Complete payment records.
      </p>

    </div>

    <button
      onClick={() => setOpenPaymentModal(true)}
      className="w-full rounded-xl bg-[#1E3A8A] px-5 py-3 font-medium text-white transition hover:bg-[#17307A] sm:w-auto"
    >
      Receive Payment
    </button>

  </div>

  {/* Desktop Table */}

  <div className="hidden md:block">

    <div className="h-[420px] overflow-auto">

      <table className="w-full">

        <thead className="sticky top-0 bg-slate-50 z-10">

          <tr>

            <th className="px-6 py-4 text-left text-sm font-semibold text-slate-600">
              Date
            </th>

            <th className="px-6 py-4 text-left text-sm font-semibold text-slate-600">
              Amount
            </th>

            <th className="px-6 py-4 text-left text-sm font-semibold text-slate-600">
              Method
            </th>

            <th className="px-6 py-4 text-left text-sm font-semibold text-slate-600">
              Remarks
            </th>

          </tr>

        </thead>

        <tbody>

          {profile.paymentHistory.length === 0 ? (

            <tr>

              <td
                colSpan={4}
                className="py-12 text-center text-slate-500"
              >
                No payment history found.
              </td>

            </tr>

          ) : (

            profile.paymentHistory.map((payment) => (

              <tr
                key={payment._id}
                className="border-t hover:bg-slate-50 transition"
              >

                <td className="px-6 py-4">

                  {new Date(
                    payment.paymentDate
                  ).toLocaleDateString()}

                </td>

                <td className="px-6 py-4">

                  <span className="font-semibold text-green-600">
                    Rs. {payment.amount}
                  </span>

                </td>

                <td className="px-6 py-4">

                  <span className="rounded-full bg-blue-100 px-3 py-1 text-xs font-semibold text-blue-700">
                    {payment.paymentMethod}
                  </span>

                </td>

                <td className="px-6 py-4 text-slate-600">

                  {payment.remarks || "-"}

                </td>

              </tr>

            ))

          )}

        </tbody>

      </table>

    </div>

  </div>

  {/* Mobile Cards */}

  <div className="space-y-4 p-4 md:hidden">

    {profile.paymentHistory.length === 0 ? (

      <div className="rounded-2xl border border-dashed border-slate-300 py-10 text-center text-slate-500">

        No payment history found.

      </div>

    ) : (

      profile.paymentHistory.map((payment) => (

        <div
          key={payment._id}
          className="rounded-2xl border border-slate-200 bg-slate-50 p-4"
        >

          <div className="flex items-center justify-between">

            <span className="text-sm text-slate-500">
              Date
            </span>

            <span className="font-semibold">
              {new Date(
                payment.paymentDate
              ).toLocaleDateString()}
            </span>

          </div>

          <div className="mt-3 flex items-center justify-between">

            <span className="text-sm text-slate-500">
              Amount
            </span>

            <span className="font-bold text-green-600">
              Rs. {payment.amount}
            </span>

          </div>

          <div className="mt-3 flex items-center justify-between">

            <span className="text-sm text-slate-500">
              Method
            </span>

            <span className="rounded-full bg-blue-100 px-3 py-1 text-xs font-semibold text-blue-700">
              {payment.paymentMethod}
            </span>

          </div>

          <div className="mt-3">

            <p className="text-sm text-slate-500">
              Remarks
            </p>

            <p className="mt-1 font-medium text-slate-700 break-words">
              {payment.remarks || "-"}
            </p>

          </div>

        </div>

      ))

    )}

  </div>

</div>
{/* ===================== Client Ledger ===================== */}

<div className="rounded-3xl border border-slate-200 bg-white shadow-sm">

  <div className="border-b border-slate-200 p-4 sm:p-6">

    <h2 className="text-xl font-bold text-slate-900">
      Client Ledger
    </h2>

    <p className="mt-1 text-sm text-slate-500">
      Complete debit / credit history.
    </p>

  </div>

  {/* Desktop */}

  <div className="hidden md:block">

    <div className="h-[420px] overflow-auto">

      <table className="w-full">

        <thead className="sticky top-0 z-10 bg-slate-50">

          <tr>

            <th className="px-6 py-4 text-left text-sm font-semibold text-slate-600">
              Date
            </th>

            <th className="px-6 py-4 text-left text-sm font-semibold text-slate-600">
              Particular
            </th>

            <th className="px-6 py-4 text-left text-sm font-semibold text-slate-600">
              Debit
            </th>

            <th className="px-6 py-4 text-left text-sm font-semibold text-slate-600">
              Credit
            </th>

            <th className="px-6 py-4 text-left text-sm font-semibold text-slate-600">
              Balance
            </th>

          </tr>

        </thead>

        <tbody>

          {!profile.ledger?.ledger?.length ? (

            <tr>

              <td
                colSpan={5}
                className="py-12 text-center text-slate-500"
              >
                No ledger entries found.
              </td>

            </tr>

          ) : (

            profile.ledger.ledger.map((entry, index) => (

              <tr
                key={index}
                className="border-t hover:bg-slate-50 transition"
              >

                <td className="px-6 py-4">

                  {entry.date
                    ? new Date(entry.date).toLocaleDateString()
                    : "-"}

                </td>

                <td className="px-6 py-4 font-medium">

                  {entry.particular}

                </td>

                <td className="px-6 py-4">

                  {entry.debit ? (

                    <span className="font-semibold text-red-600">
                      Rs. {entry.debit}
                    </span>

                  ) : "-"}

                </td>

                <td className="px-6 py-4">

                  {entry.credit ? (

                    <span className="font-semibold text-green-600">
                      Rs. {entry.credit}
                    </span>

                  ) : "-"}

                </td>

                <td className="px-6 py-4">

                  <span className="font-bold text-[#1E3A8A]">
                    Rs. {entry.balance}
                  </span>

                </td>

              </tr>

            ))

          )}

        </tbody>

      </table>

    </div>

  </div>

  {/* Mobile */}

  <div className="space-y-4 p-4 md:hidden">

    {!profile.ledger?.ledger?.length ? (

      <div className="rounded-2xl border border-dashed border-slate-300 py-10 text-center text-slate-500">

        No ledger entries found.

      </div>

    ) : (

      profile.ledger.ledger.map((entry, index) => (

        <div
          key={index}
          className="rounded-2xl border border-slate-200 bg-slate-50 p-4"
        >

          <div className="flex items-center justify-between">

            <span className="text-sm text-slate-500">
              Date
            </span>

            <span className="font-semibold">

              {entry.date
                ? new Date(entry.date).toLocaleDateString()
                : "-"}

            </span>

          </div>

          <div className="mt-3">

            <p className="text-sm text-slate-500">
              Particular
            </p>

            <p className="mt-1 font-semibold">
              {entry.particular}
            </p>

          </div>

          <div className="mt-4 grid grid-cols-3 gap-3">

            <div>

              <p className="text-xs text-slate-500">
                Debit
              </p>

              <p className="font-bold text-red-600">
                {entry.debit ? `Rs. ${entry.debit}` : "-"}
              </p>

            </div>

            <div>

              <p className="text-xs text-slate-500">
                Credit
              </p>

              <p className="font-bold text-green-600">
                {entry.credit ? `Rs. ${entry.credit}` : "-"}
              </p>

            </div>

            <div>

              <p className="text-xs text-slate-500">
                Balance
              </p>

              <p className="font-bold text-[#1E3A8A]">
                Rs. {entry.balance}
              </p>

            </div>

          </div>

        </div>

      ))

    )}

  </div>

</div>
        </main>
      </div>

      <ReceivePaymentModal
        open={openPaymentModal}
        onClose={() => setOpenPaymentModal(false)}
        onSubmit={handleReceivePayment}
        outstanding={profile.client.outstandingBalance || 0}
      />
    </div>
  );
}

export default ClientProfile;