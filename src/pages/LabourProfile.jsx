import {
  CalendarDays,
  Wallet,
  Plus,
  CreditCard,
} from "lucide-react";
// export default LabourProfile;


import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import toast from "react-hot-toast";

import Sidebar from "../components/Sidebar";
import Navbar from "../components/Navbar";
import PaymentModal from "../components/PaymentModal";

import { getLabourProfile } from "../services/labourProfileService";
import { addPayment } from "../services/paymentService";

function LabourProfile() {
  const { id } = useParams();

  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [profile, setProfile] = useState(null);
  const [openPaymentModal, setOpenPaymentModal] = useState(false);

  const loadProfile = async () => {
    try {
      const res = await getLabourProfile(id);
      setProfile(res.data.data);
    } catch {
      toast.error("Failed to load profile");
    }
  };

  const handlePayment = async (data) => {
    try {
      await addPayment({
        ...data,
        worker: profile.worker._id,
      });

      toast.success("Payment added successfully");
      setOpenPaymentModal(false);
      loadProfile();
    } catch {
      toast.error("Failed to add payment");
    }
  };

  useEffect(() => {
    loadProfile();
  }, [id]);

  if (!profile) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-slate-100">
        <p className="text-lg font-semibold text-slate-700">
          Loading...
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
        className={`flex-1 min-w-0 transition-all duration-300 ease-in-out ${
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

        <main className="mt-20 sm:mt-24 mx-auto w-full max-w-7xl space-y-6 p-3 sm:p-5 lg:p-8">

          <div className="flex flex-col gap-2">

            <h1 className="text-2xl sm:text-3xl font-bold text-slate-900">
              Labour Profile
            </h1>

            <p className="text-sm sm:text-base text-slate-500">
              Complete worker information
            </p>

          </div>
                    {/* Worker Information */}

          <div className="rounded-3xl border border-slate-200 bg-white p-4 sm:p-6 shadow-sm">

            <h2 className="break-words text-xl sm:text-2xl font-bold text-slate-900">
              {profile.worker.name}
            </h2>

            <div className="mt-6 grid grid-cols-1 gap-5 sm:grid-cols-2 xl:grid-cols-4">

              <div className="rounded-2xl bg-slate-50 p-4">
                <p className="text-sm text-slate-500">
                  Department
                </p>

                <h3 className="mt-1 font-semibold break-words">
                  {profile.worker.department}
                </h3>
              </div>

              <div className="rounded-2xl bg-slate-50 p-4">
                <p className="text-sm text-slate-500">
                  Phone
                </p>

                <h3 className="mt-1 font-semibold break-all">
                  {profile.worker.phone}
                </h3>
              </div>

              <div className="rounded-2xl bg-slate-50 p-4">
                <p className="text-sm text-slate-500">
                  Daily Wage
                </p>

                <h3 className="mt-1 font-semibold">
                  Rs. {profile.worker.dailyWage}
                </h3>
              </div>

              <div className="rounded-2xl bg-slate-50 p-4">
                <p className="text-sm text-slate-500">
                  Status
                </p>

                <span
                  className={`mt-2 inline-flex rounded-full px-3 py-1 text-sm font-medium ${
                    profile.worker.status === "active"
                      ? "bg-green-100 text-green-700"
                      : "bg-red-100 text-red-700"
                  }`}
                >
                  {profile.worker.status}
                </span>
              </div>

            </div>

          </div>





          {/* Salary Summary */}

          <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 xl:grid-cols-4">

            <div className="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm">

              <p className="text-sm text-slate-500">
                Present Days
              </p>

              <h2 className="mt-2 text-2xl sm:text-3xl font-bold text-green-600">
                {profile.salary.presentDays}
              </h2>

            </div>

            <div className="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm">

              <p className="text-sm text-slate-500">
                Earned Salary
              </p>

              <h2 className="mt-2 break-words text-2xl sm:text-3xl font-bold text-blue-700">
                Rs. {profile.salary.earnedSalary}
              </h2>

            </div>

            <div className="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm">

              <p className="text-sm text-slate-500">
                Paid Amount
              </p>

              <h2 className="mt-2 break-words text-2xl sm:text-3xl font-bold text-green-600">
                Rs. {profile.salary.paidAmount}
              </h2>

            </div>

            <div className="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm">

              <p className="text-sm text-slate-500">
                Remaining Salary
              </p>

              <h2 className="mt-2 break-words text-2xl sm:text-3xl font-bold text-red-600">
                Rs. {profile.salary.remainingSalary}
              </h2>

            </div>

          </div>

          {/* Attendance */}

       <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
                  <div className="rounded-3xl bg-white p-6 shadow-sm">

  <h2 className="mb-5 text-xl font-bold text-slate-800">
    Attendance History
  </h2>

<div className="h-[300px] overflow-y-auto overflow-x-auto">

    <table className="w-full">

     <thead className="sticky top-0 bg-white z-10">

        <tr className="border-b border-slate-200">

          <th className="pb-4 text-left text-sm font-semibold text-slate-500">
            Date
          </th>

          <th className="pb-4 text-left text-sm font-semibold text-slate-500">
            Status
          </th>

        </tr>

      </thead>

      <tbody>

        {profile.attendanceHistory.map((item) => (

          <tr
            key={item._id}
            className="hover:bg-slate-50 transition"
          >

            <td className="py-4">
              {new Date(item.date).toLocaleDateString()}
            </td>

            <td className="py-4">

              <span
                className={`rounded-full px-4 py-2 text-xs font-semibold capitalize ${
                  item.status === "present"
                    ? "bg-green-100 text-green-700"
                    : item.status === "leave"
                    ? "bg-yellow-100 text-yellow-700"
                    : "bg-red-100 text-red-700"
                }`}
              >
                {item.status}
              </span>

            </td>

          </tr>

        ))}

      </tbody>

    </table>

  </div>

</div>
                  {/* Payment History */}

<div className="rounded-3xl bg-white p-6 shadow-sm">

  <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">

    <div className="flex items-center gap-3">

      <div className="rounded-xl bg-green-100 p-2 text-green-700">
        <Wallet size={20} />
      </div>

      <h2 className="text-xl font-bold text-slate-800">
        Payment History
      </h2>

    </div>

    <button
      onClick={() => setOpenPaymentModal(true)}
      className="inline-flex items-center justify-center gap-2 rounded-xl bg-[#1E3A8A] px-5 py-3 font-medium text-white transition hover:bg-[#17307A]"
    >
      <Plus size={18} />
      Give Payment
    </button>

  </div>

  {profile.paymentHistory.length === 0 ? (

    <div className="rounded-2xl bg-slate-50 py-10 text-center text-slate-500">
      No payment history found.
    </div>

  ) : (

  <div className="h-[300px] overflow-y-auto space-y-4 pr-2">
      {profile.paymentHistory.map((payment) => (

        <div
          key={payment._id}
          className="rounded-2xl border border-slate-200 bg-slate-50 p-5 transition hover:border-blue-300 hover:shadow-md"
        >

          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">

            <div>

              <h3 className="text-xl font-bold text-[#1E3A8A]">
                Rs. {payment.amount}
              </h3>

              <p className="mt-1 text-slate-500 capitalize">
                {payment.paymentType}
              </p>

            </div>

            <div className="flex flex-col gap-2 text-sm text-slate-600 sm:items-end">

              <div className="flex items-center gap-2">
                <CalendarDays size={16} />
                {new Date(payment.paymentDate).toLocaleDateString()}
              </div>

              <div className="flex items-center gap-2">
                <CreditCard size={16} />
                {payment.paymentMethod}
              </div>

            </div>

          </div>

        </div>

      ))}

    </div>

  )}

</div>
</div>

        </main>

      </div>

      <PaymentModal
        open={openPaymentModal}
        onClose={() => setOpenPaymentModal(false)}
        onSubmit={handlePayment}
        initialData={{
          worker: profile.worker._id,
        }}
      />

    </div>
  );
}

export default LabourProfile;