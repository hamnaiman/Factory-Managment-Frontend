import React, {
  useState,
  useEffect,
  useMemo,
} from "react";

import toast from "react-hot-toast";

import {
  Plus,
  Trash2,
  Upload,
  FileText,
  ExternalLink,
  Loader2,
  X,
} from "lucide-react";

import VendorSelect from "./VendorSelect";

import {
  purchaseService,
  uploadToCloudinary,
} from "../services/purchaseService";

import API from "../services/api";

const getToday = () => {
  return new Date().toISOString().split("T")[0];
};

const emptyItem = () => ({
  product: "",
  productName: "",
  quantity: 1,
  rate: 0,
});

const PurchaseModal = ({
  isOpen,
  onClose,
  purchase,
  onSuccess,
}) => {
  const [invoiceNumber, setInvoiceNumber] = useState("");
  const [vendor, setVendor] = useState("");
  const [purchaseDate, setPurchaseDate] =
    useState(getToday());

  const [paidAmount, setPaidAmount] =
    useState(0);

  const [notes, setNotes] = useState("");
  const [bill, setBill] = useState(null);

  const [items, setItems] = useState([
    emptyItem(),
  ]);

  const [productsList, setProductsList] =
    useState([]);

  const [uploadingBill, setUploadingBill] =
    useState(false);

  const [uploadProgress, setUploadProgress] =
    useState(0);

  const [submitting, setSubmitting] =
    useState(false);

  const [errors, setErrors] = useState({});

  // =====================================================
  // LOAD PRODUCTS
  // =====================================================

  useEffect(() => {
    if (!isOpen) return;

    const loadProducts = async () => {
      try {
        const response =
          await API.get("/products");

        const payload = response?.data;

        const list = Array.isArray(payload)
          ? payload
          : payload?.data ||
            payload?.products ||
            [];

        setProductsList(
          Array.isArray(list)
            ? list
            : []
        );
      } catch (error) {
        console.error(
          "Failed to load products:",
          error
        );

        setProductsList([]);

        toast.error(
          "Failed to load products list"
        );
      }
    };

    loadProducts();
  }, [isOpen]);

  // =====================================================
  // INITIALIZE / EDIT PURCHASE
  // =====================================================

  useEffect(() => {
    if (!isOpen) return;

    setErrors({});

    if (purchase?._id) {
      setInvoiceNumber(
        purchase.invoiceNumber || ""
      );

      setVendor(
        purchase.vendor?._id ||
          purchase.vendor ||
          ""
      );

      setPurchaseDate(
        purchase.purchaseDate
          ? new Date(
              purchase.purchaseDate
            )
              .toISOString()
              .split("T")[0]
          : getToday()
      );

      setPaidAmount(
        purchase.paidAmount || 0
      );

      setNotes(
        purchase.notes || ""
      );

      setBill(
        purchase.bill || null
      );

      if (
        Array.isArray(purchase.items) &&
        purchase.items.length > 0
      ) {
        setItems(
          purchase.items.map((item) => ({
            product:
              item.product?._id ||
              item.product ||
              "",

            productName:
              item.productName ||
              item.product?.productName ||
              "",

            quantity:
              item.quantity || 1,

            rate:
              item.rate || 0,
          }))
        );
      } else {
        setItems([emptyItem()]);
      }
    } else {
      setInvoiceNumber(
        `INV-${Math.floor(
          100000 +
            Math.random() * 900000
        )}`
      );

      setVendor("");
      setPurchaseDate(getToday());
      setPaidAmount(0);
      setNotes("");
      setBill(null);
      setItems([emptyItem()]);
    }
  }, [purchase, isOpen]);

  // =====================================================
  // PRODUCT SELECT
  // =====================================================

  const handleProductSelect = (
    index,
    productId
  ) => {
    const selectedProduct =
      productsList.find(
        (product) =>
          product._id === productId
      );

    setItems((prev) =>
      prev.map((item, itemIndex) => {
        if (itemIndex !== index) {
          return item;
        }

        return {
          ...item,

          product: productId,

          productName:
            selectedProduct
              ? selectedProduct.productName
              : "",
        };
      })
    );
  };

  // =====================================================
  // ITEM CHANGE
  // =====================================================

  const handleItemChange = (
    index,
    field,
    value
  ) => {
    setItems((prev) =>
      prev.map((item, itemIndex) => {
        if (itemIndex !== index) {
          return item;
        }

        return {
          ...item,
          [field]: value,
        };
      })
    );
  };

  // =====================================================
  // ADD ITEM
  // =====================================================

  const addItemRow = () => {
    setItems((prev) => [
      ...prev,
      emptyItem(),
    ]);
  };

  // =====================================================
  // REMOVE ITEM
  // =====================================================

  const removeItemRow = (index) => {
    if (items.length === 1) {
      toast.error(
        "At least one item is required"
      );

      return;
    }

    setItems((prev) =>
      prev.filter(
        (_, itemIndex) =>
          itemIndex !== index
      )
    );
  };

  // =====================================================
  // TOTAL
  // =====================================================

  const runningTotal = useMemo(() => {
    return items.reduce(
      (total, item) => {
        const quantity =
          Number(item.quantity) || 0;

        const rate =
          Number(item.rate) || 0;

        return (
          total +
          quantity * rate
        );
      },
      0
    );
  }, [items]);

  // =====================================================
  // FILE UPLOAD
  // =====================================================

  const handleFileUpload = async (
    event
  ) => {
    const file =
      event.target.files?.[0];

    if (!file) return;

    setUploadingBill(true);
    setUploadProgress(0);

    try {
      const fileData =
        await uploadToCloudinary(
          file,
          (percent) =>
            setUploadProgress(percent)
        );

      setBill({
        url:
          fileData?.url ||
          fileData?.secure_url ||
          "",

        fileName:
          fileData?.original_filename ||
          file.name,

        fileType:
          file.type ||
          "application/pdf",
      });

      toast.success(
        "Bill document attached successfully"
      );
    } catch (error) {
      console.error(
        "Cloudinary upload error:",
        error
      );

      toast.error(
        "Failed to upload bill attachment"
      );
    } finally {
      setUploadingBill(false);
      setUploadProgress(0);

      // Allow selecting same file again
      event.target.value = "";
    }
  };

  // =====================================================
  // VALIDATION
  // =====================================================

  const validateForm = () => {
    const newErrors = {};

    if (!invoiceNumber.trim()) {
      newErrors.invoiceNumber =
        "Invoice Number is required";
    }

    const selectedVendorId =
      typeof vendor === "object"
        ? vendor?._id
        : vendor;

    if (!selectedVendorId) {
      newErrors.vendor =
        "Please select a vendor";
    }

    if (!purchaseDate) {
      newErrors.purchaseDate =
        "Purchase date is required";
    }

    if (!items.length) {
      toast.error(
        "At least one product item is required"
      );

      return false;
    }

    const invalidItem =
      items.some((item) => {
        const quantity =
          Number(item.quantity);

        const rate =
          Number(item.rate);

        return (
          !item.product ||
          !Number.isFinite(quantity) ||
          quantity <= 0 ||
          !Number.isFinite(rate) ||
          rate < 0
        );
      });

    if (invalidItem) {
      toast.error(
        "Please complete all product details correctly"
      );

      return false;
    }

    const paid =
      Number(paidAmount) || 0;

    if (paid < 0) {
      toast.error(
        "Paid amount cannot be negative"
      );

      return false;
    }

    if (paid > runningTotal) {
      toast.error(
        "Paid amount cannot be greater than total purchase amount"
      );

      return false;
    }

    setErrors(newErrors);

    if (Object.keys(newErrors).length > 0) {
      return false;
    }

    return true;
  };

  // =====================================================
  // SUBMIT
  // =====================================================

  const handleSubmit = async (
    event
  ) => {
    event.preventDefault();

    setErrors({});

    if (!validateForm()) {
      return;
    }

    const selectedVendorId =
      typeof vendor === "object"
        ? vendor?._id
        : vendor;

    // =================================================
    // BACKEND PAYLOAD
    // No Local / Imported / stockType
    // =================================================

    const formattedItems =
      items.map((item) => {
        const quantity =
          Number(item.quantity) || 0;

        const rate =
          Number(item.rate) || 0;

        return {
          product:
            typeof item.product ===
            "object"
              ? item.product?._id
              : item.product,

          productName:
            item.productName || "",

          quantity,

          rate,

          lineTotal:
            quantity * rate,
        };
      });

    const payload = {
      invoiceNumber:
        invoiceNumber.trim(),

      vendor:
        selectedVendorId,

      purchaseDate,

      items:
        formattedItems,

      totalAmount:
        runningTotal,

      paidAmount:
        Number(paidAmount) || 0,

      notes:
        notes
          ? notes.trim()
          : "",

      bill:
        bill?.url
          ? bill
          : null,
    };

    setSubmitting(true);

    try {
      let response;

      if (purchase?._id) {
        response =
          await purchaseService.updatePurchase(
            purchase._id,
            payload
          );
      } else {
        response =
          await purchaseService.createPurchase(
            payload
          );
      }

      const success =
        response?.data?.success ||
        response?.success;

      if (success) {
        toast.success(
          purchase?._id
            ? "Purchase updated successfully"
            : "Purchase recorded successfully"
        );

        if (onSuccess) {
          await onSuccess();
        }

        onClose();
      } else {
        toast.error(
          "Purchase could not be saved"
        );
      }
    } catch (error) {
      console.error(
        "Save Purchase Error:",
        error
      );

      console.error(
        "Save Purchase Error Payload:",
        error?.response?.data
      );

      const message =
        error?.response?.data
          ?.message ||
        error?.response?.data
          ?.error ||
        "Failed to save purchase";

      if (
        message
          .toLowerCase()
          .includes("invoice")
      ) {
        setErrors({
          invoiceNumber: message,
        });
      }

      toast.error(message);
    } finally {
      setSubmitting(false);
    }
  };

  // =====================================================
  // MODAL CLOSED
  // =====================================================

  if (!isOpen) {
    return null;
  }

  // =====================================================
  // UI
  // =====================================================

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-slate-950/50 p-3 sm:p-5 backdrop-blur-sm">
      <div className="flex max-h-[95vh] w-full max-w-5xl flex-col overflow-hidden rounded-2xl sm:rounded-3xl bg-white shadow-2xl">

        {/* =================================================
            HEADER
        ================================================= */}

        <div className="flex shrink-0 items-center justify-between border-b border-slate-200 bg-slate-50/80 px-4 py-3.5 backdrop-blur sm:px-6 sm:py-4">
          <div>
            <h3 className="text-base font-bold text-slate-800 sm:text-lg">
              {purchase
                ? "Edit Purchase Record"
                : "Record New Purchase"}
            </h3>

            <p className="mt-0.5 text-xs text-slate-500">
              Record purchased products and update stock.
            </p>
          </div>

          <button
            type="button"
            onClick={onClose}
            disabled={submitting}
            className="rounded-lg p-1.5 text-slate-400 transition hover:bg-slate-200/60 hover:text-slate-600 disabled:cursor-not-allowed disabled:opacity-50"
            aria-label="Close"
          >
            <X size={20} />
          </button>
        </div>

        {/* =================================================
            FORM
        ================================================= */}

        <form
          onSubmit={handleSubmit}
          className="flex-1 space-y-5 overflow-y-auto p-4 sm:space-y-6 sm:p-6"
        >

          {/* =================================================
              BASIC INFORMATION
          ================================================= */}

          <div className="grid grid-cols-1 gap-3.5 sm:grid-cols-2 lg:grid-cols-3 sm:gap-4">

            {/* Invoice */}

            <div>
              <label className="mb-1 block text-xs font-semibold text-slate-700 sm:text-sm">
                Invoice #
                <span className="text-red-500">
                  {" "}*
                </span>
              </label>

              <input
                type="text"
                required
                value={invoiceNumber}
                onChange={(event) =>
                  setInvoiceNumber(
                    event.target.value
                  )
                }
                placeholder="INV-100021"
                className={`w-full rounded-xl border px-3.5 py-2 text-sm text-slate-800 outline-none transition sm:py-2.5 ${
                  errors.invoiceNumber
                    ? "border-red-500 focus:ring-2 focus:ring-red-100"
                    : "border-slate-200 focus:border-[#1E3A8A] focus:ring-2 focus:ring-[#1E3A8A]/10"
                }`}
              />

              {errors.invoiceNumber && (
                <p className="mt-1 text-xs text-red-500">
                  {
                    errors.invoiceNumber
                  }
                </p>
              )}
            </div>

            {/* Vendor */}

            <div>
              <label className="mb-1 block text-xs font-semibold text-slate-700 sm:text-sm">
                Vendor
                <span className="text-red-500">
                  {" "}*
                </span>
              </label>

              <VendorSelect
                value={vendor}
                onChange={(value) =>
                  setVendor(value)
                }
                className={`w-full ${
                  errors.vendor
                    ? "border-red-500"
                    : ""
                }`}
              />

              {errors.vendor && (
                <p className="mt-1 text-xs text-red-500">
                  {errors.vendor}
                </p>
              )}
            </div>

            {/* Date */}

            <div>
              <label className="mb-1 block text-xs font-semibold text-slate-700 sm:text-sm">
                Purchase Date
                <span className="text-red-500">
                  {" "}*
                </span>
              </label>

              <input
                type="date"
                required
                value={purchaseDate}
                onChange={(event) =>
                  setPurchaseDate(
                    event.target.value
                  )
                }
                className="w-full rounded-xl border border-slate-200 px-3.5 py-2 text-sm text-slate-800 outline-none transition focus:border-[#1E3A8A] focus:ring-2 focus:ring-[#1E3A8A]/10 sm:py-2.5"
              />
            </div>

          </div>

          {/* =================================================
              PURCHASED ITEMS
          ================================================= */}

          <div>
            <div className="mb-2 flex items-center justify-between">
              <div>
                <label className="text-xs font-bold text-slate-800 sm:text-sm">
                  Purchased Items
                  <span className="text-red-500">
                    {" "}*
                  </span>
                </label>

                <p className="mt-0.5 text-[11px] text-slate-400 sm:text-xs">
                  Add the products purchased from this vendor.
                </p>
              </div>
            </div>

            <div className="space-y-3">

              {items.map(
                (item, index) => {
                  const quantity =
                    Number(
                      item.quantity
                    ) || 0;

                  const rate =
                    Number(
                      item.rate
                    ) || 0;

                  const lineTotal =
                    quantity * rate;

                  return (
                    <div
                      key={index}
                      className="rounded-2xl border border-slate-200 bg-slate-50/60 p-3 sm:p-3.5"
                    >

                      <div className="grid grid-cols-12 items-end gap-2.5 sm:gap-3">

                        {/* Product */}

                        <div className="col-span-12 lg:col-span-5">
                          <label className="mb-1 block text-[11px] font-semibold text-slate-500 lg:text-xs">
                            Product
                            <span className="text-red-500">
                              {" "}*
                            </span>
                          </label>

                          <select
                            required
                            value={
                              typeof item.product ===
                              "object"
                                ? item.product?._id ||
                                  ""
                                : item.product
                            }
                            onChange={(event) =>
                              handleProductSelect(
                                index,
                                event.target.value
                              )
                            }
                            className="w-full rounded-xl border border-slate-200 bg-white px-3 py-2 text-xs text-slate-800 outline-none transition focus:border-[#1E3A8A] focus:ring-2 focus:ring-[#1E3A8A]/10 sm:text-sm"
                          >
                            <option value="">
                              {productsList.length ===
                              0
                                ? "No products available"
                                : "Select Product..."}
                            </option>

                            {productsList.map(
                              (product) => (
                                <option
                                  key={
                                    product._id
                                  }
                                  value={
                                    product._id
                                  }
                                >
                                  {
                                    product.productName
                                  }

                                  {product.productCode
                                    ? ` (${product.productCode})`
                                    : ""}
                                </option>
                              )
                            )}
                          </select>
                        </div>

                        {/* Quantity */}

                        <div className="col-span-6 sm:col-span-3 lg:col-span-2">
                          <label className="mb-1 block text-[11px] font-semibold text-slate-500 lg:text-xs">
                            Quantity
                            <span className="text-red-500">
                              {" "}*
                            </span>
                          </label>

                          <input
                            type="number"
                            min="0.01"
                            step="any"
                            required
                            value={
                              item.quantity
                            }
                            onChange={(event) =>
                              handleItemChange(
                                index,
                                "quantity",
                                event.target.value
                              )
                            }
                            placeholder="Qty"
                            className="w-full rounded-xl border border-slate-200 bg-white px-3 py-2 text-xs text-slate-800 outline-none transition focus:border-[#1E3A8A] focus:ring-2 focus:ring-[#1E3A8A]/10 sm:text-sm"
                          />
                        </div>

                        {/* Rate */}

                        <div className="col-span-6 sm:col-span-3 lg:col-span-2">
                          <label className="mb-1 block text-[11px] font-semibold text-slate-500 lg:text-xs">
                            Rate (PKR)
                            <span className="text-red-500">
                              {" "}*
                            </span>
                          </label>

                          <input
                            type="number"
                            min="0"
                            step="any"
                            required
                            value={
                              item.rate
                            }
                            onChange={(event) =>
                              handleItemChange(
                                index,
                                "rate",
                                event.target.value
                              )
                            }
                            placeholder="Rate"
                            className="w-full rounded-xl border border-slate-200 bg-white px-3 py-2 text-xs text-slate-800 outline-none transition focus:border-[#1E3A8A] focus:ring-2 focus:ring-[#1E3A8A]/10 sm:text-sm"
                          />
                        </div>

                        {/* Subtotal */}

                        <div className="col-span-10 sm:col-span-4 lg:col-span-2">
                          <label className="mb-1 block text-[11px] font-semibold text-slate-500 lg:text-xs">
                            Subtotal
                          </label>

                          <div className="flex h-[38px] items-center rounded-xl border border-slate-200 bg-white px-3 text-xs font-semibold text-slate-800 sm:text-sm">
                            PKR{" "}
                            {lineTotal.toLocaleString(
                              "en-PK"
                            )}
                          </div>
                        </div>

                        {/* Remove */}

                        <div className="col-span-2 sm:col-span-1">
                          <button
                            type="button"
                            onClick={() =>
                              removeItemRow(
                                index
                              )
                            }
                            className="flex h-[38px] w-full items-center justify-center rounded-xl border border-slate-200 bg-white text-slate-400 transition hover:border-red-200 hover:bg-red-50 hover:text-red-600"
                            title="Remove item"
                          >
                            <Trash2
                              size={16}
                            />
                          </button>
                        </div>

                      </div>
                    </div>
                  );
                }
              )}

            </div>

            {/* Add item */}

            <button
              type="button"
              onClick={addItemRow}
              className="mt-3 inline-flex items-center gap-1.5 rounded-lg p-1 text-xs font-semibold text-[#1E3A8A] transition hover:bg-blue-50 hover:underline"
            >
              <Plus size={16} />
              Add Product Item
            </button>
          </div>

          {/* =================================================
              TOTALS
          ================================================= */}

          <div className="flex flex-col gap-4 rounded-2xl border border-blue-100 bg-blue-50/60 p-3.5 sm:flex-row sm:items-center sm:justify-between sm:p-4">

            <div>
              <p className="text-[11px] font-medium text-slate-500 sm:text-xs">
                Total Purchase Amount
              </p>

              <p className="mt-0.5 text-xl font-bold text-[#1E3A8A] sm:text-2xl">
                PKR{" "}
                {runningTotal.toLocaleString(
                  "en-PK"
                )}
              </p>
            </div>

            <div className="w-full sm:w-auto">
              <label className="mb-1 block text-xs font-semibold text-slate-700">
                Paid Amount (PKR)
              </label>

              <input
                type="number"
                min="0"
                step="any"
                value={paidAmount}
                onChange={(event) =>
                  setPaidAmount(
                    event.target.value
                  )
                }
                placeholder="0"
                className="w-full rounded-xl border border-slate-200 bg-white px-3.5 py-2 text-sm text-slate-800 outline-none transition focus:border-[#1E3A8A] focus:ring-2 focus:ring-[#1E3A8A]/10 sm:w-52"
              />

              <p className="mt-1 text-[10px] text-slate-400">
                Remaining: PKR{" "}
                {Math.max(
                  runningTotal -
                    (Number(
                      paidAmount
                    ) || 0),
                  0
                ).toLocaleString(
                  "en-PK"
                )}
              </p>
            </div>

          </div>

          {/* =================================================
              BILL + NOTES
          ================================================= */}

          <div className="grid grid-cols-1 gap-4 md:grid-cols-2">

            {/* Bill */}

            <div>
              <label className="mb-1 block text-xs font-semibold text-slate-700 sm:text-sm">
                Attach Bill Document{" "}
                <span className="text-xs font-normal text-slate-400">
                  (Optional)
                </span>
              </label>

              {bill?.url ? (
                <div className="flex items-center justify-between rounded-xl border border-slate-200 bg-slate-50 p-3">

                  <div className="mr-2 flex min-w-0 items-center gap-2">
                    <FileText
                      size={18}
                      className="shrink-0 text-[#1E3A8A]"
                    />

                    <span className="truncate text-xs font-medium text-slate-700">
                      {bill.fileName ||
                        "Uploaded Document"}
                    </span>
                  </div>

                  <div className="flex shrink-0 items-center gap-2">

                    <a
                      href={bill.url}
                      target="_blank"
                      rel="noreferrer"
                      className="flex items-center gap-1 text-xs font-medium text-[#1E3A8A] hover:underline"
                    >
                      View
                      <ExternalLink
                        size={12}
                      />
                    </a>

                    <button
                      type="button"
                      onClick={() =>
                        setBill(null)
                      }
                      className="ml-1.5 text-xs font-bold text-red-500 hover:text-red-700"
                    >
                      Remove
                    </button>

                  </div>
                </div>
              ) : (
                <div className="rounded-xl border-2 border-dashed border-slate-200 bg-slate-50/30 p-3.5 text-center transition hover:border-[#1E3A8A]">

                  {uploadingBill ? (
                    <div className="flex items-center justify-center gap-2 py-1 text-xs text-slate-600">
                      <Loader2
                        size={16}
                        className="animate-spin text-[#1E3A8A]"
                      />

                      <span>
                        Uploading (
                        {
                          uploadProgress
                        }
                        %)...
                      </span>
                    </div>
                  ) : (
                    <label className="block cursor-pointer">
                      <Upload
                        size={18}
                        className="mx-auto mb-1 text-slate-400"
                      />

                      <span className="block text-xs font-medium text-slate-600">
                        Upload bill document
                      </span>

                      <span className="mt-0.5 block text-[10px] text-slate-400">
                        PDF, JPG or PNG
                      </span>

                      <input
                        type="file"
                        accept="image/*,.pdf"
                        onChange={
                          handleFileUpload
                        }
                        className="hidden"
                      />
                    </label>
                  )}

                </div>
              )}
            </div>

            {/* Notes */}

            <div>
              <label className="mb-1 block text-xs font-semibold text-slate-700 sm:text-sm">
                Notes / Remarks
              </label>

              <textarea
                rows={4}
                value={notes}
                onChange={(event) =>
                  setNotes(
                    event.target.value
                  )
                }
                placeholder="Optional remarks..."
                className="w-full resize-none rounded-xl border border-slate-200 px-3.5 py-2 text-xs text-slate-800 outline-none transition focus:border-[#1E3A8A] focus:ring-2 focus:ring-[#1E3A8A]/10 sm:text-sm"
              />
            </div>

          </div>

          {/* =================================================
              FOOTER
          ================================================= */}

          <div className="flex shrink-0 items-center justify-end gap-2.5 border-t border-slate-100 pt-3 sm:gap-3 sm:pt-4">

            <button
              type="button"
              onClick={onClose}
              disabled={submitting}
              className="w-1/2 rounded-xl border border-slate-200 px-4 py-2.5 text-xs font-medium text-slate-600 transition hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-50 sm:w-auto sm:px-5 sm:text-sm"
            >
              Cancel
            </button>

            <button
              type="submit"
              disabled={
                submitting ||
                uploadingBill
              }
              className="flex w-1/2 items-center justify-center gap-2 rounded-xl bg-[#1E3A8A] px-5 py-2.5 text-xs font-medium text-white transition hover:bg-[#17307A] disabled:cursor-not-allowed disabled:opacity-50 sm:w-auto sm:px-6 sm:text-sm"
            >
              {submitting && (
                <Loader2
                  size={14}
                  className="animate-spin"
                />
              )}

              {submitting
                ? "Saving..."
                : purchase
                ? "Update Purchase"
                : "Save Purchase"}
            </button>

          </div>

        </form>
      </div>
    </div>
  );
};

export default PurchaseModal;