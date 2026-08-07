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

  const loadClients = async () => {
    try {
      const res = await getClients();
      setClients(res.data.data || []);
    } catch (error) {
      toast.error("Failed to load clients");
    }
  };

  useEffect(() => {
    loadClients();
  }, []);

  const handleAdd = () => {
    setEditingClient(null);
    setOpenModal(true);
  };

  const handleEdit = (client) => {
    setEditingClient(client);
    setOpenModal(true);
  };
    const handleSubmit = async (formData) => {
    try {
      if (editingClient) {
        await updateClient(editingClient._id, formData);

        toast.success("Client updated successfully");
      } else {
        await createClient(formData);

        toast.success("Client created successfully");
      }

      setOpenModal(false);
      setEditingClient(null);

      loadClients();
    } catch (error) {
      toast.error(
        error?.response?.data?.message ||
          "Failed to save client"
      );
    }
  };

  const handleDelete = async (id) => {
    const confirmDelete = window.confirm(
      "Are you sure you want to delete this client?"
    );

    if (!confirmDelete) return;

    try {
      await deleteClient(id);

      toast.success("Client deleted successfully");

      loadClients();
    } catch (error) {
      toast.error(
        error?.response?.data?.message ||
          "Failed to delete client"
      );
    }
  };
    return (
    <div className="min-h-screen bg-slate-100 flex overflow-x-hidden">

      <Sidebar
        isOpen={isSidebarOpen}
        setIsOpen={setIsSidebarOpen}
      />

      <div
        className={`flex-1 transition-all duration-300 ${
          isSidebarOpen ? "lg:ml-72" : "lg:ml-20"
        }`}
      >
       <Navbar
  isSidebarOpen={isSidebarOpen}
  setIsSidebarOpen={setIsSidebarOpen}
/>

       <main className="p-4 md:p-6 lg:p-8 space-y-6 max-w-[1600px] mx-auto mt-24">
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
              onClick={handleAdd}
              className="rounded-xl bg-[#1E3A8A] px-6 py-3 text-white hover:bg-[#17307A]"
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
              onChange={(e) => setSearch(e.target.value)}
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