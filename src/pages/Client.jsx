import { useEffect, useState } from "react";
import toast from "react-hot-toast";

import Sidebar from "../components/Sidebar";
import Navbar from "../components/Navbar";
import ClientTable from "../components/ClientTable";
import ClientModal from "../components/ClientModal";

import {
  getClients,
  createClient,
  updateClient,
  deleteClient,
} from "../services/clientService";

function Client() {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);

  const [clients, setClients] = useState([]);
  const [search, setSearch] = useState("");

  const [openModal, setOpenModal] = useState(false);
  const [editingClient, setEditingClient] = useState(null);

  // =====================================================
  // LOAD CLIENTS
  // =====================================================

  const loadClients = async () => {
    try {
      const res = await getClients();

      setClients(res?.data?.data || []);
    } catch (error) {
      console.error("Load clients error:", error);

      toast.error(
        error?.response?.data?.message ||
          "Failed to load clients"
      );
    }
  };

  useEffect(() => {
    loadClients();
  }, []);

  // =====================================================
  // ADD CLIENT
  // =====================================================

  const handleAdd = () => {
    setEditingClient(null);
    setOpenModal(true);
  };

  // =====================================================
  // EDIT CLIENT
  // =====================================================

  const handleEdit = (client) => {
    setEditingClient(client);
    setOpenModal(true);
  };

  // =====================================================
  // CREATE / UPDATE CLIENT
  // =====================================================

  const handleSubmit = async (formData) => {
    try {
      if (editingClient) {
        await updateClient(
          editingClient._id,
          formData
        );

        toast.success(
          "Client updated successfully"
        );
      } else {
        await createClient(formData);

        toast.success(
          "Client created successfully"
        );
      }

      setOpenModal(false);
      setEditingClient(null);

      await loadClients();
    } catch (error) {
      console.error(
        "Save client error:",
        error
      );

      toast.error(
        error?.response?.data?.message ||
          "Failed to save client"
      );
    }
  };

  // =====================================================
  // DELETE CLIENT
  // =====================================================

  const handleDelete = (id) => {
    const client = clients.find(
      (item) => item._id === id
    );

    const clientName =
      client?.clientName || "this client";

    toast.custom(
      (t) => (
        <div
          className={`${
            t.visible
              ? "animate-enter"
              : "animate-leave"
          } w-full max-w-sm rounded-2xl border border-slate-200 bg-white p-5 shadow-xl`}
        >
          <div>
            <h3 className="font-semibold text-slate-900">
              Delete Client?
            </h3>

            <p className="mt-1 text-sm text-slate-500">
              Are you sure you want to delete{" "}
              <span className="font-semibold text-slate-700">
                {clientName}
              </span>
              ?
            </p>
          </div>

          <div className="mt-4 flex justify-end gap-3">
            {/* Cancel */}
            <button
              type="button"
              onClick={() => toast.dismiss(t.id)}
              className="rounded-xl border border-slate-300 px-4 py-2 text-sm font-medium text-slate-700 transition hover:bg-slate-100"
            >
              Cancel
            </button>

            {/* Delete */}
            <button
              type="button"
              onClick={async () => {
                toast.dismiss(t.id);

                try {
                  await deleteClient(id);

                  toast.success(
                    "Client deleted successfully"
                  );

                  await loadClients();
                } catch (error) {
                  console.error(
                    "Delete client error:",
                    error
                  );

                  toast.error(
                    error?.response?.data?.message ||
                      "Failed to delete client"
                  );
                }
              }}
              className="rounded-xl bg-red-600 px-4 py-2 text-sm font-medium text-white transition hover:bg-red-700"
            >
              Delete
            </button>
          </div>
        </div>
      ),
      {
        duration: Infinity,
        position: "top-center",
      }
    );
  };

  // =====================================================
  // RENDER
  // =====================================================

  return (
    <div className="flex min-h-screen overflow-x-hidden bg-slate-100">

      {/* Sidebar */}
      <Sidebar
        isOpen={isSidebarOpen}
        setIsOpen={setIsSidebarOpen}
      />

      {/* Main */}
      <div
        className={`flex-1 transition-all duration-300 ${
          isSidebarOpen
            ? "lg:ml-72"
            : "lg:ml-20"
        }`}
      >
        {/* Navbar */}
        <Navbar
          isSidebarOpen={isSidebarOpen}
          setIsSidebarOpen={
            setIsSidebarOpen
          }
        />

        <main className="mx-auto mt-24 max-w-[1600px] space-y-6 p-4 md:p-6 lg:p-8">

          {/* Header */}
          <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">

            <div>
              <h1 className="text-3xl font-bold text-slate-900">
                Clients
              </h1>

              <p className="mt-1 text-slate-500">
                Manage all your clients.
              </p>
            </div>

            <button
              type="button"
              onClick={handleAdd}
              className="rounded-xl bg-[#1E3A8A] px-6 py-3 text-white transition hover:bg-[#17307A]"
            >
              + Add Client
            </button>
          </div>

          {/* Search */}
          <div className="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm">

            <input
              type="text"
              placeholder="Search client..."
              value={search}
              onChange={(e) =>
                setSearch(e.target.value)
              }
              className="w-full rounded-xl border border-slate-300 px-4 py-3 outline-none focus:border-[#1E3A8A]"
            />

          </div>

          {/* Table */}
          <ClientTable
            clients={clients}
            search={search}
            onEdit={handleEdit}
            onDelete={handleDelete}
          />

        </main>
      </div>

      {/* Client Modal */}
      <ClientModal
        open={openModal}
        onClose={() => {
          setOpenModal(false);
          setEditingClient(null);
        }}
        onSubmit={handleSubmit}
        initialData={editingClient}
      />

    </div>
  );
}

export default Client;