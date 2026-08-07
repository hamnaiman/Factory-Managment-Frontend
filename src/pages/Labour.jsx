import { useEffect, useState } from "react";
import { Search, Plus } from "lucide-react";
import toast from "react-hot-toast";

import Sidebar from "../components/Sidebar";
import Navbar from "../components/Navbar";
import LabourTable from "../components/LabourTable";
import LabourModal from "../components/LabourModal";

import {
  getLabours,
  addLabour,
  updateLabour,
  deleteLabour,
} from "../services/labourService";

function Labour() {
  // Desktop standard fixed layout state - starts open by default
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [labours, setLabours] = useState([]);
  const [search, setSearch] = useState("");
  const [openModal, setOpenModal] = useState(false);
  const [editingWorker, setEditingWorker] = useState(null);

  const loadLabours = async () => {
    try {
      const response = await getLabours();
      setLabours(response.data.data);
    } catch (error) {
      console.log(error);
      toast.error("Failed to load workers");
    }
  };

  useEffect(() => {
    loadLabours();
  }, []);

  const handleSubmit = async (data) => {
    try {
      if (editingWorker) {
        await updateLabour(editingWorker._id, data);
        toast.success("Worker updated successfully");
      } else {
        await addLabour(data);
        toast.success("Worker added successfully");
      }

      setOpenModal(false);
      setEditingWorker(null);
      loadLabours();
    } catch (error) {
      toast.error(error?.response?.data?.message || "Something went wrong");
    }
  };

  const handleEdit = (worker) => {
    setEditingWorker(worker);
    setOpenModal(true);
  };

  const handleDelete = (id) => {
    toast.custom((t) => (
      <div className="w-[92vw] max-w-md rounded-2xl border border-slate-200 bg-white p-5 shadow-xl sm:p-6">
        <h3 className="text-lg font-semibold text-slate-900">
          Delete Worker
        </h3>

        <p className="mt-2 text-sm text-slate-500">
          Are you sure you want to delete this worker?
        </p>

        <div className="mt-6 flex flex-col-reverse gap-3 sm:flex-row sm:justify-end">
          <button
            onClick={() => toast.dismiss(t.id)}
            className="h-11 w-full rounded-xl border border-slate-300 text-sm font-medium transition hover:bg-slate-100 sm:w-28 cursor-pointer"
          >
            Cancel
          </button>

          <button
            onClick={async () => {
              try {
                await deleteLabour(id);

                toast.dismiss(t.id);
                toast.success("Worker deleted successfully");

                loadLabours();
              } catch (error) {
                toast.dismiss(t.id);
                toast.error("Failed to delete worker");
              }
            }}
            className="h-11 w-full rounded-xl bg-red-600 text-sm font-medium text-white transition hover:bg-red-700 sm:w-28 cursor-pointer"
          >
            Delete
          </button>
        </div>
      </div>
    ));
  };

  return (
    <div className="min-h-screen overflow-x-hidden bg-slate-100 flex">
      {/* Sidebar Component */}
      <Sidebar
        isOpen={isSidebarOpen}
        setIsOpen={setIsSidebarOpen}
      />

      {/* Main Content Area - Fixed dynamic margin to sync with layout changes */}
      <div 
        className={`flex-1 min-w-0 transition-all duration-300 ease-in-out
        ${isSidebarOpen ? "ml-0 lg:ml-72" : "ml-0 lg:ml-20"}`}
      >
        {/* Fixed Navbar with current layout state */}
        <Navbar
          isSidebarOpen={isSidebarOpen}
          setIsSidebarOpen={setIsSidebarOpen}
        />

        {/* Page Content layout wrapper shifted below navbar via mt-24 */}
        <main className="p-4 md:p-6 lg:p-8 space-y-6 max-w-[1600px] mx-auto mt-24">
          {/* Header */}
          <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
            <div>
              <h1 className="text-2xl font-bold leading-tight text-slate-900 sm:text-3xl">
                Labour Management
              </h1>

              <p className="mt-1 text-sm text-slate-500">
                Manage all factory workers.
              </p>
            </div>

            <button
              onClick={() => {
                setEditingWorker(null);
                setOpenModal(true);
              }}
              className="flex h-12 w-full items-center justify-center gap-2 rounded-xl bg-[#1E3A8A] px-6 text-sm font-semibold text-white transition hover:bg-[#17307A] sm:w-auto cursor-pointer"
            >
              <Plus size={18} />
              Add Worker
            </button>
          </div>

          {/* Search Toolbar */}
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

          {/* Labour Data Table Layout Wrapper */}
          <div className="w-full overflow-x-auto bg-white rounded-3xl border border-slate-200 shadow-xs">
            <LabourTable
              labours={labours}
              search={search}
              onEdit={handleEdit}
              onDelete={handleDelete}
            />
          </div>
        </main>
      </div>

      {/* Modal Popup Component */}
      <LabourModal
        open={openModal}
        onClose={() => {
          setOpenModal(false);
          setEditingWorker(null);
        }}
        onSubmit={handleSubmit}
        initialData={editingWorker}
      />
    </div>
  );
}

export default Labour;