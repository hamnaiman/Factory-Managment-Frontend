import { useEffect, useState } from "react";
import { Search, Plus } from "lucide-react";
import toast from "react-hot-toast";

import Sidebar from "../components/Sidebar";
import Navbar from "../components/Navbar";
import PaymentTable from "../components/PaymentTable";
import PaymentModal from "../components/PaymentModal";

import {
  getPayments,
  addPayment,
  updatePayment,
  deletePayment,
} from "../services/paymentService";

function Payments() {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);

  const [payments, setPayments] = useState([]);
  const [search, setSearch] = useState("");

  const [openModal, setOpenModal] = useState(false);
  const [editingPayment, setEditingPayment] = useState(null);

  const loadPayments = async () => {
    try {
      const response = await getPayments();
      setPayments(response.data.data);
    } catch (error) {
      console.log(error);
      toast.error("Failed to load payments");
    }
  };

  useEffect(() => {
    loadPayments();
  }, []);

  const handleSubmit = async (data) => {
    try {
      if (editingPayment) {
        await updatePayment(editingPayment._id, data);
        toast.success("Payment updated successfully");
      } else {
        await addPayment(data);
        toast.success("Payment added successfully");
      }

      setOpenModal(false);
      setEditingPayment(null);
      loadPayments();
    } catch (error) {
      toast.error(error?.response?.data?.message || "Something went wrong");
    }
  };

  const handleEdit = (payment) => {
    setEditingPayment(payment);
    setOpenModal(true);
  };

  const handleDelete = (id) => {
    toast.custom((t) => (
      <div className="w-[92vw] max-w-md rounded-2xl border border-slate-200 bg-white p-5 shadow-xl sm:p-6">
        <h3 className="text-lg font-semibold text-slate-900">
          Delete Payment
        </h3>

        <p className="mt-2 text-sm text-slate-500">
          Are you sure you want to delete this payment?
        </p>

        <div className="mt-6 flex flex-col-reverse gap-3 sm:flex-row sm:justify-end">

          <button
            onClick={() => toast.dismiss(t.id)}
            className="h-11 w-full rounded-xl border border-slate-300 text-sm font-medium hover:bg-slate-100 sm:w-28"
          >
            Cancel
          </button>

          <button
            onClick={async () => {
              try {
                await deletePayment(id);

                toast.dismiss(t.id);
                toast.success("Payment deleted successfully");

                loadPayments();
              } catch (error) {
                toast.dismiss(t.id);
                toast.error("Failed to delete payment");
              }
            }}
            className="h-11 w-full rounded-xl bg-red-600 text-white text-sm font-medium hover:bg-red-700 sm:w-28"
          >
            Delete
          </button>

        </div>
      </div>
    ));
  };
    return (
    <div className="min-h-screen overflow-x-hidden bg-slate-100 flex">
      {/* Sidebar */}
      <Sidebar
        isOpen={isSidebarOpen}
        setIsOpen={setIsSidebarOpen}
      />

      {/* Main Content */}
      <div
        className={`flex-1 min-w-0 transition-all duration-300 ease-in-out ${
          isSidebarOpen ? "ml-0 lg:ml-72" : "ml-0 lg:ml-20"
        }`}
      >
        {/* Navbar */}
        <Navbar
  isSidebarOpen={isSidebarOpen}
  setIsSidebarOpen={setIsSidebarOpen}
/>

        {/* Page */}
        <main className="max-w-[1600px] mx-auto mt-24 space-y-6 p-4 md:p-6 lg:p-8">

          {/* Header */}
          <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">

            <div>
              <h1 className="text-2xl font-bold text-slate-900 sm:text-3xl">
                Payment Management
              </h1>

              <p className="mt-1 text-sm text-slate-500">
                Manage salary and advance payments.
              </p>
            </div>

            <button
              onClick={() => {
                setEditingPayment(null);
                setOpenModal(true);
              }}
              className="flex h-12 w-full cursor-pointer items-center justify-center gap-2 rounded-xl bg-[#1E3A8A] px-6 text-sm font-semibold text-white transition hover:bg-[#17307A] sm:w-auto"
            >
              <Plus size={18} />
              Add Payment
            </button>

          </div>

          {/* Search */}
          <div className="rounded-3xl border border-slate-200 bg-white p-5 shadow-xs">

            <div className="relative w-full md:max-w-md lg:max-w-sm">

              <Search
                size={18}
                className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400"
              />

              <input
                type="text"
                placeholder="Search Worker..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="h-12 w-full rounded-xl border border-slate-300 pl-11 pr-4 text-sm outline-hidden transition focus:border-[#1E3A8A]"
              />

            </div>

          </div>

          {/* Table */}

          <div className="w-full overflow-x-auto rounded-3xl border border-slate-200 bg-white shadow-xs">

            <PaymentTable
              payments={payments}
              search={search}
              onEdit={handleEdit}
              onDelete={handleDelete}
            />

          </div>

        </main>
      </div>

      {/* Modal */}

      <PaymentModal
        open={openModal}
        onClose={() => {
          setOpenModal(false);
          setEditingPayment(null);
        }}
        onSubmit={handleSubmit}
        initialData={editingPayment}
      />

    </div>
  );
}

export default Payments;