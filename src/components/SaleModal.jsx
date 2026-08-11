import { useEffect, useMemo, useState } from "react";
import { Plus, Trash2, Loader2 } from "lucide-react";
import toast from "react-hot-toast";

import { getClients } from "../services/clientService";

function SaleModal({
  open,
  onClose,
  onSubmit,
  initialData,
  products = [],
}) {
  const [clients, setClients] = useState([]);
  const [loadingClients, setLoadingClients] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  const createEmptyItem = () => ({
    product: "",
    productName: "",
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
                  productName:
                    i.productName || i.product?.productName || "",
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
      console.error("Failed to load clients:", error);
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

    setFormData((prev) => ({
      ...prev,
      items,
    }));
  };

  const subtotal = useMemo(() => {
    return formData.items.reduce(
      (sum, item) => sum + (Number(item.amount) || 0),
      0
    );
  }, [formData.items]);

  const grandTotal = useMemo(() => {
    return Math.max(
      0,
      subtotal - (Number(formData.discount) || 0)
    );
  }, [subtotal, formData.discount]);

  const dueAmount = useMemo(() => {
    return Math.max(
      0,
      grandTotal - (Number(formData.paidAmount) || 0)
    );
  }, [grandTotal, formData.paidAmount]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.client) {
      return toast.error("Please select a client.");
    }

    for (const item of formData.items) {
      if (!item.product) {
        return toast.error("Please select a product for all rows.");
      }

      if (!item.productName) {
        return toast.error("Product name is required.");
      }

      if (Number(item.quantity) <= 0) {
        return toast.error("Quantity must be at least 1.");
      }

      if (Number(item.rate) < 0) {
        return toast.error("Rate cannot be negative.");
      }
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
    <div className="fixed inset-0 z-50 flex items-start justify-center overflow-y-auto bg-slate-900/50 p-3 sm:items-center sm:p-4">
      <div className="my-3 flex max-h-[calc(100vh-1.5rem)] w-full max-w-6xl flex-col overflow-hidden rounded-2xl bg-white shadow-2xl sm:my-4 sm:max-h-[95vh] sm:rounded-3xl">

        {/* Header */}
        <div className="flex shrink-0 items-start justify-between border-b border-slate-200 px-4 py-4 sm:items-center sm:px-6 sm:py-5">
          <div className="min-w-0 pr-3">
            <h2 className="text-lg font-bold text-slate-900 sm:text-xl">
              {initialData ? "Edit Sale" : "Create New Sale"}
            </h2>

            <p className="mt-1 text-xs text-slate-500 sm:text-sm">
              Fill in the details to generate an invoice.
            </p>
          </div>

          <button
            type="button"
            onClick={onClose}
            disabled={submitting}
            className="shrink-0 rounded-xl p-2 text-slate-400 transition hover:bg-slate-100 hover:text-slate-700"
          >
            <span className="sr-only">Close</span>
            ✕
          </button>
        </div>

        {/* Body */}
        <div className="min-h-0 flex-1 overflow-y-auto px-4 py-5 sm:px-6 sm:py-6">

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
                    {loadingClients
                      ? "Loading clients..."
                      : "Select Client"}
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
            <div className="mt-6 overflow-x-auto rounded-2xl border border-slate-200 sm:mt-8">

              {/* Header */}
              <div className="grid min-w-[700px] grid-cols-12 bg-slate-50 px-5 py-3.5 text-sm font-semibold text-slate-700">

                <div className="col-span-4">
                  Product
                </div>

                <div className="col-span-2 text-center">
                  Qty
                </div>

                <div className="col-span-2 text-center">
                  Rate (PKR)
                </div>

                <div className="col-span-3 text-center">
                  Amount
                </div>

                <div className="col-span-1 text-center">
                  Action
                </div>

              </div>

              {/* Items */}
              {formData.items.map((item, index) => (
                <div
                  key={index}
                  className="grid min-w-[700px] grid-cols-12 items-center gap-3 border-t px-5 py-3 text-sm hover:bg-slate-50/50"
                >

                  {/* Product */}
                  <div className="col-span-4">
                    <select
                      value={item.product}
                      onChange={(e) =>
                        handleItemChange(
                          index,
                          "product",
                          e.target.value
                        )
                      }
                      className="h-11 w-full rounded-xl border border-slate-200 px-3 focus:outline-none focus:ring-2 focus:ring-[#1E3A8A]"
                    >
                      <option value="">
                        Select Product
                      </option>

                      {(products || []).map((prod) => (
                        <option
                          key={prod._id}
                          value={prod._id}
                        >
                          {prod.productName || prod.name}
                        </option>
                      ))}
                    </select>
                  </div>

                  {/* Quantity */}
                  <div className="col-span-2">
                    <input
                      type="number"
                      min="1"
                      value={
                        item.quantity === 0
                          ? ""
                          : item.quantity
                      }
                      onChange={(e) =>
                        handleItemChange(
                          index,
                          "quantity",
                          e.target.value
                        )
                      }
                      className="h-11 w-full rounded-xl border border-slate-200 px-3 text-center focus:outline-none focus:ring-2 focus:ring-[#1E3A8A]"
                    />
                  </div>

                  {/* Rate */}
                  <div className="col-span-2">
                    <input
                      type="number"
                      min="0"
                      value={
                        item.rate === 0
                          ? ""
                          : item.rate
                      }
                      onChange={(e) =>
                        handleItemChange(
                          index,
                          "rate",
                          e.target.value
                        )
                      }
                      className="h-11 w-full rounded-xl border border-slate-200 px-3 text-center focus:outline-none focus:ring-2 focus:ring-[#1E3A8A]"
                    />
                  </div>

                  {/* Amount */}
                  <div className="col-span-3 text-center font-semibold text-slate-800">
                    Rs.{" "}
                    {Number(item.amount || 0).toLocaleString()}
                  </div>

                  {/* Action */}
                  <div className="col-span-1 flex justify-center">
                    <button
                      type="button"
                      onClick={() => removeItem(index)}
                      className="rounded-xl bg-red-50 p-2 text-red-600 transition hover:bg-red-100"
                    >
                      <Trash2 size={18} />
                    </button>
                  </div>

                </div>
              ))}

              {/* Add Item */}
              <div className="border-t bg-slate-50/50 p-4">
                <button
                  type="button"
                  onClick={addItem}
                  className="flex items-center gap-2 rounded-xl bg-[#1E3A8A] px-4 py-2 text-sm font-medium text-white transition hover:bg-[#17307A]"
                >
                  <Plus size={16} />
                  Add Line Item
                </button>
              </div>

            </div>

            {/* Bottom Summary */}
            <div className="mt-6 grid grid-cols-1 gap-5 lg:mt-8 lg:grid-cols-2 lg:gap-6">

              {/* Notes */}
              <div>
                <label className="mb-2 block text-sm font-medium text-slate-700">
                  Notes & Terms
                </label>

                <textarea
                  rows={5}
                  name="notes"
                  value={formData.notes}
                  onChange={handleChange}
                  placeholder="Add special notes or payment terms..."
                  className="w-full resize-none rounded-xl border border-slate-200 px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-[#1E3A8A]"
                />
              </div>

              {/* Summary */}
              <div className="space-y-3 rounded-2xl border border-slate-200 bg-slate-50 p-4 sm:p-6">

                <div className="flex items-center justify-between gap-4 text-sm">
                  <span className="font-medium text-slate-600">
                    Subtotal
                  </span>

                  <span className="shrink-0 font-semibold text-slate-900">
                    Rs. {subtotal.toLocaleString()}
                  </span>
                </div>

                <div className="flex items-center justify-between gap-4 text-sm">
                  <span className="font-medium text-slate-600">
                    Discount (PKR)
                  </span>

                  <input
                    type="number"
                    name="discount"
                    min="0"
                    value={
                      formData.discount === 0
                        ? ""
                        : formData.discount
                    }
                    onChange={handleChange}
                    className="h-10 w-28 shrink-0 rounded-xl border border-slate-200 px-3 text-right focus:outline-none focus:ring-2 focus:ring-[#1E3A8A] sm:w-32"
                  />
                </div>

                <div className="flex items-center justify-between gap-4 border-t border-slate-200 pt-3">
                  <span className="text-base font-bold text-slate-800">
                    Grand Total
                  </span>

                  <span className="shrink-0 text-lg font-bold text-[#1E3A8A]">
                    Rs. {grandTotal.toLocaleString()}
                  </span>
                </div>

                <div className="flex items-center justify-between gap-4 text-sm">
                  <span className="font-medium text-slate-600">
                    Paid Amount (PKR)
                  </span>

                  <input
                    type="number"
                    name="paidAmount"
                    min="0"
                    value={
                      formData.paidAmount === 0
                        ? ""
                        : formData.paidAmount
                    }
                    onChange={handleChange}
                    className="h-10 w-28 shrink-0 rounded-xl border border-slate-200 px-3 text-right focus:outline-none focus:ring-2 focus:ring-[#1E3A8A] sm:w-32"
                  />
                </div>

                <div className="flex items-center justify-between gap-4 border-t border-slate-200 pt-3">
                  <span className="text-base font-bold text-red-600">
                    Due Balance
                  </span>

                  <span className="shrink-0 text-lg font-bold text-red-600">
                    Rs. {dueAmount.toLocaleString()}
                  </span>
                </div>

              </div>
            </div>

            {/* Action Buttons */}
            <div className="mt-6 flex flex-col-reverse gap-3 border-t pt-4 sm:mt-8 sm:flex-row sm:justify-end">

              <button
                type="button"
                onClick={onClose}
                disabled={submitting}
                className="w-full rounded-xl border border-slate-300 px-6 py-2.5 font-medium text-slate-700 transition hover:bg-slate-100 sm:w-auto"
              >
                Cancel
              </button>

              <button
                type="submit"
                disabled={submitting}
                className="flex w-full items-center justify-center gap-2 rounded-xl bg-[#1E3A8A] px-6 py-2.5 font-medium text-white transition hover:bg-[#17307A] disabled:opacity-50 sm:w-auto"
              >
                {submitting && (
                  <Loader2
                    className="animate-spin"
                    size={18}
                  />
                )}

                {initialData
                  ? "Update Sale"
                  : "Save Sale"}
              </button>

            </div>

          </form>
        </div>
      </div>
    </div>
  );
}

export default SaleModal;