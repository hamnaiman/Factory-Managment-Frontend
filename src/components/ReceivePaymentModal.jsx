import { useEffect, useState } from "react";
import { X } from "lucide-react";

function ReceivePaymentModal({
  open,
  onClose,
  onSubmit,
  outstanding = 0,
}) {
  const [formData, setFormData] = useState({
    amount: "",
    paymentDate: new Date().toISOString().split("T")[0],
    paymentMethod: "Cash",
    reference: "",
    notes: "",
  });

  useEffect(() => {
    if (open) {
      setFormData({
        amount: "",
        paymentDate: new Date().toISOString().split("T")[0],
        paymentMethod: "Cash",
        reference: "",
        notes: "",
      });
    }
  }, [open]);

  const handleChange = (e) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!formData.amount || Number(formData.amount) <= 0) return;

    onSubmit({
      ...formData,
      amount: Number(formData.amount),
    });
  };

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-[9999] bg-black/50 backdrop-blur-sm overflow-y-auto">
      <div className="flex min-h-screen items-center justify-center p-4">

        <div className="w-full max-w-3xl rounded-3xl bg-white shadow-2xl">

          {/* Header */}

          <div className="sticky top-0 z-10 flex items-center justify-between rounded-t-3xl border-b border-slate-200 bg-white px-8 py-6">

            <div>
              <h2 className="text-2xl font-bold text-slate-900">
                Receive Payment
              </h2>

              <p className="mt-1 text-sm text-slate-500">
                Record a payment received from this client.
              </p>
            </div>

            <button
              onClick={onClose}
              className="rounded-xl p-2 transition hover:bg-slate-100"
            >
              <X size={22} />
            </button>

          </div>

          <form onSubmit={handleSubmit}>

            <div className="max-h-[70vh] overflow-y-auto p-8 space-y-6">

              {/* Outstanding */}

              <div className="rounded-2xl border border-red-200 bg-red-50 p-6">

                <p className="text-sm font-medium text-red-600">
                  Outstanding Balance
                </p>

                <h3 className="mt-2 text-4xl font-bold text-red-700">
                  Rs. {Number(outstanding).toLocaleString()}
                </h3>

              </div>

              {/* Amount */}

              <div>

                <label className="mb-2 block text-sm font-semibold">
                  Payment Amount
                </label>

                <input
                  type="number"
                  name="amount"
                  required
                  min="1"
                  value={formData.amount}
                  onChange={handleChange}
                  placeholder="Enter amount"
                  className="h-12 w-full rounded-xl border border-slate-300 px-4 outline-none transition focus:border-[#1E3A8A] focus:ring-2 focus:ring-[#1E3A8A]/20"
                />

              </div>

              <div className="grid gap-5 md:grid-cols-2">

                <div>

                  <label className="mb-2 block text-sm font-semibold">
                    Payment Date
                  </label>

                  <input
                    type="date"
                    name="paymentDate"
                    value={formData.paymentDate}
                    onChange={handleChange}
                    className="h-12 w-full rounded-xl border border-slate-300 px-4 outline-none transition focus:border-[#1E3A8A] focus:ring-2 focus:ring-[#1E3A8A]/20"
                  />

                </div>

                <div>

                  <label className="mb-2 block text-sm font-semibold">
                    Payment Method
                  </label>

                  <select
                    name="paymentMethod"
                    value={formData.paymentMethod}
                    onChange={handleChange}
                    className="h-12 w-full rounded-xl border border-slate-300 px-4 outline-none transition focus:border-[#1E3A8A] focus:ring-2 focus:ring-[#1E3A8A]/20"
                  >
                    <option>Cash</option>
                    <option>Bank Transfer</option>
                    <option>UPI</option>
                    <option>Cheque</option>
                  </select>

                </div>

              </div>

              <div>

                <label className="mb-2 block text-sm font-semibold">
                  Reference No.
                </label>

                <input
                  type="text"
                  name="reference"
                  value={formData.reference}
                  onChange={handleChange}
                  placeholder="Optional"
                  className="h-12 w-full rounded-xl border border-slate-300 px-4 outline-none transition focus:border-[#1E3A8A] focus:ring-2 focus:ring-[#1E3A8A]/20"
                />

              </div>

              <div>

                <label className="mb-2 block text-sm font-semibold">
                  Notes
                </label>

                <textarea
                  rows={5}
                  name="notes"
                  value={formData.notes}
                  onChange={handleChange}
                  placeholder="Optional notes..."
                  className="w-full rounded-xl border border-slate-300 p-4 outline-none transition focus:border-[#1E3A8A] focus:ring-2 focus:ring-[#1E3A8A]/20 resize-none"
                />

              </div>

            </div>

            {/* Footer */}

            <div className="sticky bottom-0 flex justify-end gap-3 rounded-b-3xl border-t border-slate-200 bg-white px-8 py-5">

              <button
                type="button"
                onClick={onClose}
                className="rounded-xl border border-slate-300 px-6 py-3 font-medium transition hover:bg-slate-100"
              >
                Cancel
              </button>

              <button
                type="submit"
                className="rounded-xl bg-[#1E3A8A] px-6 py-3 font-medium text-white transition hover:bg-[#17307A]"
              >
                Receive Payment
              </button>

            </div>

          </form>

        </div>

      </div>
    </div>
  );
}

export default ReceivePaymentModal;