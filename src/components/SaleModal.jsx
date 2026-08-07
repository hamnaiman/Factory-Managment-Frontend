import { useEffect, useMemo, useState } from "react";
import { X, Plus, Trash2, Loader2 } from "lucide-react";
import toast from "react-hot-toast";

import { getClients } from "../services/clientService";

function SaleModal({ open, onClose, onSubmit, initialData, products = [] }) {
  const [clients, setClients] = useState([]);
  const [loadingClients, setLoadingClients] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  const createEmptyItem = () => ({
    product: "",
    productName: "",
    stockType: "Local",
    quantity: 1,
    rate: 0,
    amount: 0,
  });

  const [formData, setFormData] = useState({
    client: "",
    invoiceDate: new Date().toISOString().split("T")[0],
    items: [createEmptyItem()],
    discount: 0,
    paidAmount: 0,
    notes: "",
  });

  // Fetch clients when modal opens
  useEffect(() => {
    if (open) {
      loadClients();
    }
  }, [open]);

  // Sync state on modal open or initialData change
  useEffect(() => {
    if (!open) return;

    if (initialData) {
      setFormData({
        client: initialData.client?._id || initialData.client || "",
        invoiceDate:
          initialData.invoiceDate?.split("T")[0] ||
          new Date().toISOString().split("T")[0],
        items:
          initialData.items?.length > 0
            ? initialData.items.map((i) => {
                const qty = Number(i.quantity) || 1;
                const rate = Number(i.rate) || 0;
                return {
                  product: i.product?._id || i.product || "",
                  productName: i.productName || i.product?.productName || "",
                  stockType: i.stockType || "Local",
                  quantity: qty,
                  rate: rate,
                  amount: qty * rate,
                };
              })
            : [createEmptyItem()],
        discount: Number(initialData.discount) || 0,
        paidAmount: Number(initialData.paidAmount) || 0,
        notes: initialData.notes || "",
      });
    } else {
      setFormData({
        client: "",
        invoiceDate: new Date().toISOString().split("T")[0],
        items: [createEmptyItem()],
        discount: 0,
        paidAmount: 0,
        notes: "",
      });
    }
  }, [initialData, open]);

  const loadClients = async () => {
    try {
      setLoadingClients(true);
      const clientRes = await getClients();
      const list = clientRes.data?.data || clientRes.data || [];
      setClients(list);
    } catch (error) {
      toast.error("Failed to load clients");
    } finally {
      setLoadingClients(false);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleItemChange = (index, field, value) => {
    const updatedItems = [...formData.items];
    const targetItem = { ...updatedItems[index] };

    if (field === "product") {
      const selectedProd = products.find((p) => p._id === value);
      targetItem.product = value;

      if (selectedProd) {
        targetItem.productName =
          selectedProd.productName || selectedProd.name || "";
        targetItem.rate = Number(
          selectedProd.salePrice ||
            selectedProd.sellingPrice ||
            selectedProd.price ||
            0
        );
        if (selectedProd.stockType) {
          targetItem.stockType = selectedProd.stockType;
        }
      } else {
        targetItem.productName = "";
        targetItem.rate = 0;
      }
    } else {
      targetItem[field] = value;
    }

    const qty = Number(targetItem.quantity) || 0;
    const rate = Number(targetItem.rate) || 0;
    targetItem.amount = qty * rate;

    updatedItems[index] = targetItem;

    setFormData((prev) => ({
      ...prev,
      items: updatedItems,
    }));
  };

  const addItem = () => {
    setFormData((prev) => ({
      ...prev,
      items: [...prev.items, createEmptyItem()],
    }));
  };

  const removeItem = (index) => {
    if (formData.items.length === 1) {
      return toast.error("At least one product is required.");
    }
    const items = formData.items.filter((_, i) => i !== index);
    setFormData((prev) => ({ ...prev, items }));
  };

  const subtotal = useMemo(() => {
    return formData.items.reduce(
      (sum, item) => sum + (Number(item.amount) || 0),
      0
    );
  }, [formData.items]);

  const grandTotal = useMemo(() => {
    return Math.max(0, subtotal - (Number(formData.discount) || 0));
  }, [subtotal, formData.discount]);

  const dueAmount = useMemo(() => {
    return Math.max(0, grandTotal - (Number(formData.paidAmount) || 0));
  }, [grandTotal, formData.paidAmount]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.client) return toast.error("Please select a client.");

    for (const item of formData.items) {
      if (!item.product)
        return toast.error("Please select a product for all rows.");
      if (!item.productName) return toast.error("Product name is required.");
      if (!item.stockType) return toast.error("Stock type is required.");
      if (Number(item.quantity) <= 0)
        return toast.error("Quantity must be at least 1.");
    }

    try {
      setSubmitting(true);
      await onSubmit({
        ...formData,
        subtotal,
        grandTotal,
        paidAmount: Number(formData.paidAmount) || 0,
        discount: Number(formData.discount) || 0,
        remainingBalance: dueAmount,
      });
    } catch (err) {
      console.error(err);
    } finally {
      setSubmitting(false);
    }
  };

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4 backdrop-blur-sm">
      <div className="w-full max-w-6xl rounded-2xl lg:rounded-3xl bg-white p-4 sm:p-6 lg:p-8 shadow-2xl max-h-[95vh] overflow-y-auto">
        {/* Header */}
        <div className="mb-6 flex items-start justify-between gap-4 border-b pb-4">
          <div>
            <h2 className="text-2xl font-bold text-slate-800">
              {initialData ? "Edit Sale" : "Create New Sale"}
            </h2>
            <p className="text-slate-500 text-sm">
              Fill in the details to generate an invoice.
            </p>
          </div>
          <button
            onClick={onClose}
            type="button"
            className="rounded-lg p-1 text-slate-400 hover:bg-slate-100 hover:text-slate-600 transition"
          >
            <X size={22} />
          </button>
        </div>

        <form onSubmit={handleSubmit}>
          {/* Top Info Section */}
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
            <div>
              <label className="mb-1 block text-sm font-medium text-slate-700">
                Client *
              </label>
              <select
                name="client"
                value={formData.client}
                onChange={handleChange}
                className="h-12 w-full rounded-xl border border-slate-200 px-4 focus:outline-none focus:ring-2 focus:ring-[#1E3A8A]"
                required
                disabled={loadingClients}
              >
                <option value="">
                  {loadingClients ? "Loading clients..." : "Select Client"}
                </option>
                {clients.map((client) => (
                  <option key={client._id} value={client._id}>
                    {client.clientName || client.name}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="mb-1 block text-sm font-medium text-slate-700">
                Invoice Date
              </label>
              <input
                type="date"
                name="invoiceDate"
                value={formData.invoiceDate}
                onChange={handleChange}
                className="h-12 w-full rounded-xl border border-slate-200 px-4 focus:outline-none focus:ring-2 focus:ring-[#1E3A8A]"
              />
            </div>
          </div>

          {/* Products Table */}
          <div className="mt-8 overflow-x-auto rounded-2xl border border-slate-200">
            <div className="grid min-w-[850px] grid-cols-12 bg-slate-50 px-5 py-3.5 font-semibold text-slate-700 text-sm">
              <div className="col-span-3">Product</div>
              <div className="col-span-2 text-center">Stock Type</div>
              <div className="col-span-2 text-center">Qty</div>
              <div className="col-span-2 text-center">Rate (PKR)</div>
              <div className="col-span-2 text-center">Amount</div>
              <div className="col-span-1 text-center">Action</div>
            </div>

            {formData.items.map((item, index) => (
              <div
                key={index}
                className="grid min-w-[850px] grid-cols-12 items-center gap-3 border-t px-5 py-3 text-sm hover:bg-slate-50/50"
              >
                <div className="col-span-3">
                  <select
                    value={item.product}
                    onChange={(e) =>
                      handleItemChange(index, "product", e.target.value)
                    }
                    className="h-11 w-full rounded-xl border border-slate-200 px-3 focus:outline-none focus:ring-2 focus:ring-[#1E3A8A]"
                  >
                    <option value="">Select Product</option>
                    {(products || []).map((prod) => (
                      <option key={prod._id} value={prod._id}>
                        {prod.productName || prod.name}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="col-span-2">
                  <select
                    value={item.stockType}
                    onChange={(e) =>
                      handleItemChange(index, "stockType", e.target.value)
                    }
                    className="h-11 w-full rounded-xl border border-slate-200 px-2 text-center focus:outline-none focus:ring-2 focus:ring-[#1E3A8A]"
                  >
                    <option value="Local">Local</option>
                    <option value="Imported">Imported</option>
                  </select>
                </div>

                <div className="col-span-2">
                  <input
                    type="number"
                    min="1"
                    value={item.quantity === 0 ? "" : item.quantity}
                    onChange={(e) =>
                      handleItemChange(index, "quantity", e.target.value)
                    }
                    className="h-11 w-full rounded-xl border border-slate-200 px-3 text-center focus:outline-none focus:ring-2 focus:ring-[#1E3A8A]"
                  />
                </div>

                <div className="col-span-2">
                  <input
                    type="number"
                    min="0"
                    value={item.rate === 0 ? "" : item.rate}
                    onChange={(e) =>
                      handleItemChange(index, "rate", e.target.value)
                    }
                    className="h-11 w-full rounded-xl border border-slate-200 px-3 text-center focus:outline-none focus:ring-2 focus:ring-[#1E3A8A]"
                  />
                </div>

                <div className="col-span-2 text-center font-semibold text-slate-800">
                  Rs. {Number(item.amount || 0).toLocaleString()}
                </div>

                <div className="col-span-1 flex justify-center">
                  <button
                    type="button"
                    onClick={() => removeItem(index)}
                    className="rounded-xl bg-red-50 p-2 text-red-600 hover:bg-red-100 transition"
                  >
                    <Trash2 size={18} />
                  </button>
                </div>
              </div>
            ))}

            <div className="border-t p-4 bg-slate-50/50">
              <button
                type="button"
                onClick={addItem}
                className="flex items-center gap-2 rounded-xl bg-[#1E3A8A] px-4 py-2 text-white text-sm font-medium hover:bg-[#17307A] transition"
              >
                <Plus size={16} />
                Add Line Item
              </button>
            </div>
          </div>

          {/* Bottom Summary Section */}
          <div className="mt-8 grid grid-cols-1 gap-6 lg:grid-cols-2">
            <div>
              <label className="mb-2 block font-medium text-slate-700 text-sm">
                Notes & Terms
              </label>
              <textarea
                rows={5}
                name="notes"
                value={formData.notes}
                onChange={handleChange}
                placeholder="Add special notes or payment terms..."
                className="w-full rounded-xl border border-slate-200 px-4 py-3 resize-none focus:outline-none focus:ring-2 focus:ring-[#1E3A8A] text-sm"
              />
            </div>

            <div className="rounded-2xl border border-slate-200 bg-slate-50 p-6 space-y-3">
              <div className="flex justify-between items-center text-sm">
                <span className="font-medium text-slate-600">Subtotal</span>
                <span className="font-semibold text-slate-900">
                  Rs. {subtotal.toLocaleString()}
                </span>
              </div>

              <div className="flex items-center justify-between text-sm">
                <span className="font-medium text-slate-600">Discount (PKR)</span>
                <input
                  type="number"
                  name="discount"
                  min="0"
                  value={formData.discount === 0 ? "" : formData.discount}
                  onChange={handleChange}
                  className="h-10 w-32 rounded-xl border border-slate-200 px-3 text-right focus:outline-none focus:ring-2 focus:ring-[#1E3A8A]"
                />
              </div>

              <div className="flex justify-between items-center border-t border-slate-200 pt-3">
                <span className="text-base font-bold text-slate-800">
                  Grand Total
                </span>
                <span className="text-lg font-bold text-[#1E3A8A]">
                  Rs. {grandTotal.toLocaleString()}
                </span>
              </div>

              <div className="flex items-center justify-between text-sm">
                <span className="font-medium text-slate-600">Paid Amount (PKR)</span>
                <input
                  type="number"
                  name="paidAmount"
                  min="0"
                  value={formData.paidAmount === 0 ? "" : formData.paidAmount}
                  onChange={handleChange}
                  className="h-10 w-32 rounded-xl border border-slate-200 px-3 text-right focus:outline-none focus:ring-2 focus:ring-[#1E3A8A]"
                />
              </div>

              <div className="flex justify-between items-center border-t border-slate-200 pt-3">
                <span className="text-base font-bold text-red-600">
                  Due Balance
                </span>
                <span className="text-lg font-bold text-red-600">
                  Rs. {dueAmount.toLocaleString()}
                </span>
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="mt-8 flex flex-col-reverse gap-3 sm:flex-row sm:justify-end border-t pt-4">
            <button
              type="button"
              onClick={onClose}
              disabled={submitting}
              className="w-full rounded-xl border border-slate-300 px-6 py-2.5 font-medium hover:bg-slate-100 sm:w-auto text-slate-700 transition"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={submitting}
              className="w-full flex items-center justify-center gap-2 rounded-xl bg-[#1E3A8A] px-6 py-2.5 font-medium text-white hover:bg-[#17307A] sm:w-auto transition disabled:opacity-50"
            >
              {submitting && <Loader2 className="animate-spin" size={18} />}
              {initialData ? "Update Sale" : "Save Sale"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default SaleModal;