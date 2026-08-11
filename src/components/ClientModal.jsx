import { useEffect, useState } from "react";
import { X } from "lucide-react";

function ClientModal({
  open,
  onClose,
  onSubmit,
  initialData,
}) {
  const [formData, setFormData] = useState({
    name: "",
    phone: "",
    address: "",
    status: "active",
  });

  useEffect(() => {
    if (initialData) {
      setFormData({
        name: initialData.clientName || "",
        phone: initialData.phoneNumber || "",
        address: initialData.address || "",
        status: initialData.status || "active",
      });
    } else {
      setFormData({
        name: "",
        phone: "",
        address: "",
        status: "active",
      });
    }
  }, [initialData, open]);

  const handleChange = (e) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    onSubmit({
      clientName: formData.name,
      phoneNumber: formData.phone,
      address: formData.address,
      status: formData.status,
    });
  };

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-3 sm:p-4">
      <div className="w-full max-w-2xl max-h-[90vh] overflow-y-auto rounded-2xl bg-white shadow-xl sm:rounded-3xl">

        {/* Header */}
        <div className="flex items-start justify-between border-b border-slate-200 px-4 py-4 sm:px-6 sm:py-5">
          <div>
            <h2 className="text-lg font-bold text-slate-900 sm:text-xl">
              {initialData ? "Edit Client" : "Add Client"}
            </h2>

            <p className="mt-1 text-sm text-slate-500">
              Enter client details below.
            </p>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="rounded-xl p-2 transition hover:bg-slate-100"
          >
            <X size={20} />
          </button>
        </div>

        {/* Form */}
        <form
          onSubmit={handleSubmit}
          className="space-y-5 p-4 sm:p-6"
        >
          <div className="grid grid-cols-1 gap-5 md:grid-cols-2">

            {/* Client Name */}
            <div>
              <label className="mb-2 block text-sm font-medium text-slate-700">
                Client Name
              </label>

              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                required
                className="h-12 w-full rounded-xl border border-slate-300 px-4 text-sm outline-none transition focus:border-[#1E3A8A] sm:text-base"
              />
            </div>

            {/* Phone */}
            <div>
              <label className="mb-2 block text-sm font-medium text-slate-700">
                Phone
              </label>

              <input
                type="text"
                name="phone"
                value={formData.phone}
                onChange={handleChange}
                required
                className="h-12 w-full rounded-xl border border-slate-300 px-4 text-sm outline-none transition focus:border-[#1E3A8A] sm:text-base"
              />
            </div>

            {/* Status */}
            <div>
              <label className="mb-2 block text-sm font-medium text-slate-700">
                Status
              </label>

              <select
                name="status"
                value={formData.status}
                onChange={handleChange}
                className="h-12 w-full rounded-xl border border-slate-300 px-4 text-sm outline-none transition focus:border-[#1E3A8A] sm:text-base"
              >
                <option value="active">Active</option>
                <option value="inactive">Inactive</option>
              </select>
            </div>

          </div>

          {/* Address */}
          <div>
            <label className="mb-2 block text-sm font-medium text-slate-700">
              Address
            </label>

            <textarea
              rows={3}
              name="address"
              value={formData.address}
              onChange={handleChange}
              className="w-full resize-none rounded-xl border border-slate-300 p-4 text-sm outline-none transition focus:border-[#1E3A8A] sm:text-base"
            />
          </div>

          {/* Buttons */}
          <div className="flex flex-col-reverse gap-3 pt-2 sm:flex-row sm:justify-end">

            <button
              type="button"
              onClick={onClose}
              className="w-full rounded-xl border border-slate-300 px-6 py-3 font-medium transition hover:bg-slate-100 sm:w-auto"
            >
              Cancel
            </button>

            <button
              type="submit"
              className="w-full rounded-xl bg-[#1E3A8A] px-6 py-3 font-medium text-white transition hover:bg-[#17307A] sm:w-auto"
            >
              {initialData ? "Update Client" : "Add Client"}
            </button>

          </div>
        </form>
      </div>
    </div>
  );
}

export default ClientModal;