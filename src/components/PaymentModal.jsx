import { useEffect, useState } from "react";
import { X } from "lucide-react";
import { getLabours } from "../services/labourService";

function PaymentModal({
  open,
  onClose,
  onSubmit,
  initialData,
}) {
  const [workers, setWorkers] = useState([]);

  const [formData, setFormData] = useState({
    worker: "",
    amount: "",
    paymentType: "Salary",
    paymentMethod: "Cash",
    remark: "",
  });

  useEffect(() => {
    loadWorkers();
  }, []);

  useEffect(() => {
    if (initialData) {
      setFormData({
        worker: initialData.worker?._id || "",
        amount: initialData.amount,
        paymentType: initialData.paymentType,
        paymentMethod: initialData.paymentMethod,
        remark: initialData.remark || "",
      });
    } else {
      setFormData({
        worker: "",
        amount: "",
        paymentType: "Salary",
        paymentMethod: "Cash",
        remark: "",
      });
    }
  }, [initialData]);

  const loadWorkers = async () => {
    try {
      const res = await getLabours();
      setWorkers(res.data.data);
    } catch (error) {
      console.log(error);
    }
  };

  const handleChange = (e) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit(formData);
  };

  if (!open) return null;

  return (
   <div className="fixed inset-0 z-50 overflow-y-auto bg-black/40 p-3 sm:p-4">

     <div className="mx-auto my-6 w-full max-w-2xl rounded-3xl bg-white shadow-xl max-h-[95vh] overflow-y-auto">

        {/* Header */}

       <div className="flex items-start justify-between border-b border-slate-200 p-5 sm:p-6">

          <div>
        <h2 className="text-xl font-bold text-slate-900 sm:text-2xl">
              {initialData ? "Edit Payment" : "Add Payment"}
            </h2>

            <p className="mt-1 text-sm text-slate-500">
              Enter payment details.
            </p>
          </div>

          <button
            onClick={onClose}
            className="rounded-xl p-2 hover:bg-slate-100"
          >
            <X size={20} />
          </button>

        </div>

        {/* Form */}

        <form
          onSubmit={handleSubmit}
         className="grid grid-cols-1 gap-5 p-5 sm:p-6 md:grid-cols-2"
        >

          <div>

            <label className="mb-2 block text-sm font-medium">
              Worker
            </label>

            <select
              name="worker"
              value={formData.worker}
              onChange={handleChange}
              required
              className="h-12 w-full rounded-xl border border-slate-300 px-4"
            >
              <option value="">Select Worker</option>

              {workers.map((worker) => (
                <option key={worker._id} value={worker._id}>
                  {worker.name}
                </option>
              ))}
            </select>

          </div>

          <div>

            <label className="mb-2 block text-sm font-medium">
              Amount
            </label>

            <input
              type="number"
              name="amount"
              value={formData.amount}
              onChange={handleChange}
              required
              className="h-12 w-full rounded-xl border border-slate-300 px-4"
            />

          </div>

          <div>

            <label className="mb-2 block text-sm font-medium">
              Payment Type
            </label>

            <select
              name="paymentType"
              value={formData.paymentType}
              onChange={handleChange}
              className="h-12 w-full rounded-xl border border-slate-300 px-4"
            >
              <option>Salary</option>
              <option>Advance</option>
            </select>

          </div>

          <div>

            <label className="mb-2 block text-sm font-medium">
              Payment Method
            </label>

            <select
              name="paymentMethod"
              value={formData.paymentMethod}
              onChange={handleChange}
              className="h-12 w-full rounded-xl border border-slate-300 px-4"
            >
              <option>Cash</option>
              <option>Bank</option>
              <option>JazzCash</option>
              <option>EasyPaisa</option>
            </select>

          </div>

          <div className="md:col-span-2">

            <label className="mb-2 block text-sm font-medium">
              Remark
            </label>

            <textarea
              rows="4"
              name="remark"
              value={formData.remark}
              onChange={handleChange}
              className="w-full rounded-xl border border-slate-300 p-4"
            />

          </div>

          {/* Footer */}
<div className="flex flex-col-reverse gap-3 sm:flex-row sm:justify-end md:col-span-2">

            <button
              type="button"
              onClick={onClose}
            className="w-full rounded-xl border border-slate-300 px-6 py-3 hover:bg-slate-100 sm:w-auto"
            >
              Cancel
            </button>

            <button
             className="w-full rounded-xl bg-[#1E3A8A] px-6 py-3 font-semibold text-white hover:bg-[#17307A] sm:w-auto"
            >
              {initialData ? "Update Payment" : "Save Payment"}
            </button>

          </div>

        </form>

      </div>
    </div>
  );
}

export default PaymentModal;