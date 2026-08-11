import React, { useEffect, useState } from "react";
import {
  X,
  Loader2,
  Building2,
  Phone,
  MapPin,
  Package,
  CalendarDays,
  Receipt,
  ChevronDown,
  ChevronUp,
} from "lucide-react";
import { vendorService } from "../services/vendorService";
import toast from "react-hot-toast";

const VendorHistoryModal = ({
  isOpen,
  onClose,
  vendor,
}) => {
  const [summary, setSummary] = useState({
    totalPurchases: 0,
    purchaseCount: 0,
  });

  const [purchases, setPurchases] = useState([]);
  const [loading, setLoading] = useState(false);
  const [expandedPurchase, setExpandedPurchase] = useState(null);

  // ======================================================
  // FETCH VENDOR PURCHASE HISTORY + SUMMARY
  // ======================================================

  useEffect(() => {
    if (!isOpen || !vendor?._id) {
      return;
    }

    const fetchVendorHistory = async () => {
      setLoading(true);

      try {
        // Summary
        const summaryResponse =
          await vendorService.getVendorPurchaseSummary(
            vendor._id
          );

        if (summaryResponse?.success) {
          setSummary(
            summaryResponse.data || {
              totalPurchases: 0,
              purchaseCount: 0,
            }
          );
        } else {
          setSummary({
            totalPurchases: 0,
            purchaseCount: 0,
          });
        }

        // Detailed purchase history
        const purchaseResponse = await vendorService.getPurchasesByVendor(
          vendor._id
        );

        if (purchaseResponse?.success) {
          setPurchases(
            purchaseResponse.data || []
          );
        } else {
          setPurchases([]);
        }
      } catch (error) {
        console.error(
          "Vendor purchase history error:",
          error
        );

        const msg =
          error?.response?.data?.message ||
          "Failed to fetch vendor purchase history";

        toast.error(msg);

        setSummary({
          totalPurchases: 0,
          purchaseCount: 0,
        });

        setPurchases([]);
      } finally {
        setLoading(false);
      }
    };

    fetchVendorHistory();
  }, [isOpen, vendor?._id]);

  // ======================================================
  // CLOSE ON ESCAPE
  // ======================================================

  useEffect(() => {
    if (!isOpen) {
      return;
    }

    const handleEscape = (event) => {
      if (event.key === "Escape") {
        onClose();
      }
    };

    document.addEventListener(
      "keydown",
      handleEscape
    );

    return () => {
      document.removeEventListener(
        "keydown",
        handleEscape
      );
    };
  }, [isOpen, onClose]);

  // ======================================================
  // BODY SCROLL LOCK
  // ======================================================

  useEffect(() => {
    if (!isOpen) {
      return;
    }

    const originalOverflow =
      document.body.style.overflow;

    document.body.style.overflow = "hidden";

    return () => {
      document.body.style.overflow =
        originalOverflow;
    };
  }, [isOpen]);

  // ======================================================
  // HELPERS
  // ======================================================

  const formatCurrency = (value) => {
    const amount = Number(value) || 0;

    return `Rs. ${amount.toLocaleString(
      "en-PK"
    )}`;
  };

  const formatDate = (date) => {
    if (!date) return "—";

    const parsedDate = new Date(date);

    if (Number.isNaN(parsedDate.getTime())) {
      return "—";
    }

    return parsedDate.toLocaleDateString(
      "en-PK",
      {
        day: "2-digit",
        month: "short",
        year: "numeric",
      }
    );
  };

  const togglePurchase = (id) => {
    setExpandedPurchase((current) =>
      current === id ? null : id
    );
  };

  const getPaymentStatusClasses = (status) => {
    switch (status) {
      case "Paid":
        return "bg-green-100 text-green-700";

      case "Partial":
        return "bg-amber-100 text-amber-700";

      case "Unpaid":
      default:
        return "bg-red-100 text-red-700";
    }
  };

  // ======================================================
  // CONDITIONAL RENDER
  // ======================================================

  if (!isOpen || !vendor) {
    return null;
  }

  // ======================================================
  // JSX
  // ======================================================

  return (
    <div
      className="
        fixed
        inset-0
        z-[100]
        flex
        items-center
        justify-center
        bg-slate-950/50
        p-3
        sm:p-4
        md:p-6
      "
      onMouseDown={(event) => {
        if (
          event.target === event.currentTarget
        ) {
          onClose();
        }
      }}
    >
      {/* ==================================================
          MODAL
      ================================================== */}

      <div
        className="
          flex
          w-full
          max-w-4xl
          max-h-[calc(100vh-1.5rem)]
          sm:max-h-[calc(100vh-2rem)]
          md:max-h-[calc(100vh-3rem)]
          flex-col
          overflow-hidden
          rounded-2xl
          sm:rounded-3xl
          border
          border-slate-200
          bg-white
          shadow-2xl
        "
        onMouseDown={(event) =>
          event.stopPropagation()
        }
      >
        {/* ==================================================
            HEADER
        ================================================== */}

        <div
          className="
            flex
            shrink-0
            items-center
            justify-between
            gap-3
            border-b
            border-slate-200
            bg-slate-50/90
            px-4
            py-3.5
            sm:px-6
            sm:py-4
          "
        >
          <div className="min-w-0 flex-1">
            <div className="flex min-w-0 items-center gap-3">
              <div
                className="
                  flex
                  h-9
                  w-9
                  shrink-0
                  items-center
                  justify-center
                  rounded-xl
                  bg-blue-100
                  text-[#1E3A8A]
                  sm:h-10
                  sm:w-10
                "
              >
                <Building2
                  size={18}
                  className="sm:h-5 sm:w-5"
                />
              </div>

              <div className="min-w-0">
                <h3
                  className="
                    truncate
                    text-base
                    font-bold
                    text-slate-800
                    sm:text-lg
                  "
                >
                  {vendor.name || "Vendor"}
                </h3>

                <p
                  className="
                    truncate
                    text-xs
                    text-slate-500
                    sm:text-sm
                  "
                >
                  {vendor.companyName ||
                    "Vendor Purchase History"}
                </p>
              </div>
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            aria-label="Close modal"
            className="
              flex
              h-9
              w-9
              shrink-0
              items-center
              justify-center
              rounded-xl
              text-slate-400
              transition
              hover:bg-slate-200
              hover:text-slate-700
              focus:outline-none
              focus:ring-2
              focus:ring-[#1E3A8A]/30
              sm:h-10
              sm:w-10
            "
          >
            <X
              size={20}
              className="sm:h-[21px] sm:w-[21px]"
            />
          </button>
        </div>

        {/* ==================================================
            SCROLLABLE BODY
        ================================================== */}

        <div
          className="
            min-h-0
            flex-1
            overflow-y-auto
            overflow-x-hidden
          "
        >
          <div
            className="
              space-y-5
              p-4
              sm:space-y-6
              sm:p-6
            "
          >
            {/* ==================================================
                VENDOR INFORMATION
            ================================================== */}

            <section>
              <div className="mb-3">
                <h4
                  className="
                    text-sm
                    font-bold
                    text-slate-800
                    sm:text-base
                  "
                >
                  Vendor Information
                </h4>

                <p className="mt-0.5 text-xs text-slate-400 sm:text-sm">
                  Contact and business details
                </p>
              </div>

              <div
                className="
                  grid
                  grid-cols-1
                  gap-3
                  sm:grid-cols-2
                "
              >
                {/* Phone */}

                <div
                  className="
                    min-w-0
                    rounded-2xl
                    border
                    border-slate-100
                    bg-slate-50
                    p-3.5
                    sm:p-4
                  "
                >
                  <div className="flex items-start gap-3">
                    <div
                      className="
                        flex
                        h-8
                        w-8
                        shrink-0
                        items-center
                        justify-center
                        rounded-lg
                        bg-white
                        text-slate-500
                      "
                    >
                      <Phone size={15} />
                    </div>

                    <div className="min-w-0">
                      <span className="block text-[11px] font-medium uppercase tracking-wide text-slate-400">
                        Phone
                      </span>

                      <span className="mt-1 block break-words text-sm font-medium text-slate-700">
                        {vendor.phone || "—"}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Address */}

                <div
                  className="
                    min-w-0
                    rounded-2xl
                    border
                    border-slate-100
                    bg-slate-50
                    p-3.5
                    sm:p-4
                  "
                >
                  <div className="flex items-start gap-3">
                    <div
                      className="
                        flex
                        h-8
                        w-8
                        shrink-0
                        items-center
                        justify-center
                        rounded-lg
                        bg-white
                        text-slate-500
                      "
                    >
                      <MapPin size={15} />
                    </div>

                    <div className="min-w-0">
                      <span className="block text-[11px] font-medium uppercase tracking-wide text-slate-400">
                        Address
                      </span>

                      <span className="mt-1 block break-words text-sm font-medium leading-5 text-slate-700">
                        {vendor.address || "—"}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Notes */}

                {vendor.notes && (
                  <div
                    className="
                      min-w-0
                      rounded-2xl
                      border
                      border-slate-100
                      bg-slate-50
                      p-3.5
                      sm:col-span-2
                      sm:p-4
                    "
                  >
                    <span className="block text-[11px] font-medium uppercase tracking-wide text-slate-400">
                      Notes
                    </span>

                    <p className="mt-1 break-words text-sm leading-5 text-slate-700">
                      {vendor.notes}
                    </p>
                  </div>
                )}
              </div>
            </section>

            {/* ==================================================
                PURCHASE OVERVIEW
            ================================================== */}

            <section>
              <div className="mb-3">
                <h4
                  className="
                    text-sm
                    font-bold
                    text-slate-800
                    sm:text-base
                  "
                >
                  Purchase Overview
                </h4>

                <p className="mt-0.5 text-xs text-slate-400 sm:text-sm">
                  Summary of purchases from this vendor
                </p>
              </div>

              {loading ? (
                <div
                  className="
                    flex
                    min-h-[130px]
                    items-center
                    justify-center
                    rounded-2xl
                    border
                    border-slate-200
                    bg-slate-50
                  "
                >
                  <div className="flex items-center gap-2 text-sm text-slate-500">
                    <Loader2
                      size={18}
                      className="animate-spin text-[#1E3A8A]"
                    />

                    <span>
                      Loading purchase history...
                    </span>
                  </div>
                </div>
              ) : (
                <div
                  className="
                    grid
                    grid-cols-1
                    gap-3
                    sm:grid-cols-2
                  "
                >
                  {/* Total Purchase Amount */}

                  <div
                    className="
                      min-w-0
                      rounded-2xl
                      border
                      border-blue-100
                      bg-blue-50
                      p-4
                      sm:p-5
                    "
                  >
                    <span
                      className="
                        block
                        text-[11px]
                        font-bold
                        uppercase
                        tracking-wider
                        text-[#1E3A8A]
                      "
                    >
                      Total Purchase Value
                    </span>

                    <div
                      className="
                        mt-1.5
                        break-words
                        text-xl
                        font-bold
                        text-[#1E3A8A]
                        sm:text-2xl
                      "
                    >
                      {formatCurrency(
                        summary.totalPurchases
                      )}
                    </div>

                    <p className="mt-1 text-xs text-blue-700/70">
                      Total value purchased
                    </p>
                  </div>

                  {/* Purchase Count */}

                  <div
                    className="
                      min-w-0
                      rounded-2xl
                      border
                      border-slate-200
                      bg-slate-50
                      p-4
                      sm:p-5
                    "
                  >
                    <span
                      className="
                        block
                        text-[11px]
                        font-bold
                        uppercase
                        tracking-wider
                        text-slate-500
                      "
                    >
                      Total Purchases
                    </span>

                    <div
                      className="
                        mt-1.5
                        break-words
                        text-xl
                        font-bold
                        text-slate-800
                        sm:text-2xl
                      "
                    >
                      {Number(
                        summary.purchaseCount || 0
                      ).toLocaleString("en-PK")}
                    </div>

                    <p className="mt-1 text-xs text-slate-400">
                      Purchase records
                    </p>
                  </div>
                </div>
              )}
            </section>

            {/* ==================================================
                PURCHASE HISTORY
            ================================================== */}

            <section>
              <div className="mb-3">
                <h4
                  className="
                    text-sm
                    font-bold
                    text-slate-800
                    sm:text-base
                  "
                >
                  Purchase History
                </h4>

                <p className="mt-0.5 text-xs text-slate-400 sm:text-sm">
                  Products purchased from this vendor
                </p>
              </div>

              {loading ? (
                <div
                  className="
                    flex
                    min-h-[180px]
                    items-center
                    justify-center
                    rounded-2xl
                    border
                    border-slate-200
                    bg-slate-50
                  "
                >
                  <div className="flex items-center gap-2 text-sm text-slate-500">
                    <Loader2
                      size={18}
                      className="animate-spin text-[#1E3A8A]"
                    />

                    <span>
                      Loading purchases...
                    </span>
                  </div>
                </div>
              ) : purchases.length === 0 ? (
                <div
                  className="
                    flex
                    min-h-[180px]
                    flex-col
                    items-center
                    justify-center
                    rounded-2xl
                    border
                    border-dashed
                    border-slate-300
                    bg-slate-50
                    px-5
                    text-center
                  "
                >
                  <Package
                    size={30}
                    className="text-slate-400"
                  />

                  <p className="mt-3 text-sm font-semibold text-slate-700">
                    No purchases found
                  </p>

                  <p className="mt-1 text-xs text-slate-400">
                    No completed purchases are recorded for this vendor.
                  </p>
                </div>
              ) : (
                <div className="space-y-3">
                  {purchases.map((purchase) => {
                    const purchaseId =
                      purchase._id;

                    const isExpanded =
                      expandedPurchase ===
                      purchaseId;

                    return (
                      <div
                        key={purchaseId}
                        className="
                          overflow-hidden
                          rounded-2xl
                          border
                          border-slate-200
                          bg-white
                        "
                      >
                        {/* Purchase Header */}

                        <button
                          type="button"
                          onClick={() =>
                            togglePurchase(
                              purchaseId
                            )
                          }
                          className="
                            flex
                            w-full
                            items-center
                            justify-between
                            gap-3
                            p-4
                            text-left
                            transition
                            hover:bg-slate-50
                            sm:p-5
                          "
                        >
                          <div className="min-w-0 flex-1">
                            <div className="flex flex-wrap items-center gap-2">
                              <div className="flex items-center gap-2">
                                <Receipt
                                  size={16}
                                  className="shrink-0 text-[#1E3A8A]"
                                />

                                <span className="text-sm font-bold text-slate-800">
                                  {purchase.invoiceNumber ||
                                    "Purchase"}
                                </span>
                              </div>

                              <span
                                className={`
                                  rounded-full
                                  px-2.5
                                  py-1
                                  text-[10px]
                                  font-bold
                                  ${getPaymentStatusClasses(
                                    purchase.paymentStatus
                                  )}
                                `}
                              >
                                {purchase.paymentStatus ||
                                  "Unpaid"}
                              </span>
                            </div>

                            <div
                              className="
                                mt-2
                                flex
                                flex-wrap
                                gap-x-4
                                gap-y-1
                                text-xs
                                text-slate-500
                              "
                            >
                              <span className="flex items-center gap-1">
                                <CalendarDays
                                  size={13}
                                />

                                {formatDate(
                                  purchase.purchaseDate
                                )}
                              </span>

                              <span>
                                {purchase.items?.length ||
                                  0}{" "}
                                item
                                {(purchase.items?.length ||
                                  0) !== 1
                                  ? "s"
                                  : ""}
                              </span>
                            </div>
                          </div>

                          <div className="flex shrink-0 items-center gap-3">
                            <div className="hidden text-right sm:block">
                              <p className="text-[10px] uppercase tracking-wide text-slate-400">
                                Total
                              </p>

                              <p className="text-sm font-bold text-slate-800">
                                {formatCurrency(
                                  purchase.totalAmount
                                )}
                              </p>
                            </div>

                            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-slate-100 text-slate-500">
                              {isExpanded ? (
                                <ChevronUp
                                  size={17}
                                />
                              ) : (
                                <ChevronDown
                                  size={17}
                                />
                              )}
                            </div>
                          </div>
                        </button>

                        {/* Expanded Purchase Details */}

                        {isExpanded && (
                          <div
                            className="
                              border-t
                              border-slate-200
                              bg-slate-50/70
                              p-4
                              sm:p-5
                            "
                          >
                            {/* Mobile Total */}

                            <div className="mb-4 flex items-center justify-between sm:hidden">
                              <span className="text-xs text-slate-500">
                                Total
                              </span>

                              <span className="text-sm font-bold text-slate-800">
                                {formatCurrency(
                                  purchase.totalAmount
                                )}
                              </span>
                            </div>

                            {/* Items */}

                            <div className="space-y-2">
                              <p className="text-xs font-bold uppercase tracking-wide text-slate-500">
                                Purchased Products
                              </p>

                              {purchase.items?.length ? (
                                <div className="space-y-2">
                                  {purchase.items.map(
                                    (
                                      item,
                                      index
                                    ) => (
                                      <div
                                        key={`${purchaseId}-${index}`}
                                        className="
                                          rounded-xl
                                          border
                                          border-slate-200
                                          bg-white
                                          p-3
                                        "
                                      >
                                        <div
                                          className="
                                            flex
                                            flex-col
                                            gap-3
                                            sm:flex-row
                                            sm:items-center
                                            sm:justify-between
                                          "
                                        >
                                          <div className="min-w-0">
                                            <p className="break-words text-sm font-semibold text-slate-800">
                                              {item.productName ||
                                                item
                                                  .product
                                                  ?.productName ||
                                                "Product"}
                                            </p>

                                            <div className="mt-1 flex flex-wrap gap-x-3 gap-y-1 text-xs text-slate-500">
                                              <span>
                                                Qty:{" "}
                                                {item.quantity ??
                                                  0}
                                              </span>

                                              <span>
                                                Rate:{" "}
                                                {formatCurrency(
                                                  item.rate
                                                )}
                                              </span>

                                              {item.stockType && (
                                                <span>
                                                  Stock:{" "}
                                                  {
                                                    item.stockType
                                                  }
                                                </span>
                                              )}
                                            </div>
                                          </div>

                                          <div className="shrink-0 sm:text-right">
                                            <p className="text-[10px] uppercase tracking-wide text-slate-400">
                                              Line Total
                                            </p>

                                            <p className="text-sm font-bold text-slate-800">
                                              {formatCurrency(
                                                item.lineTotal ??
                                                  Number(
                                                    item.quantity ||
                                                      0
                                                  ) *
                                                    Number(
                                                      item.rate ||
                                                        0
                                                    )
                                              )}
                                            </p>
                                          </div>
                                        </div>
                                      </div>
                                    )
                                  )}
                                </div>
                              ) : (
                                <p className="text-sm text-slate-400">
                                  No item details available.
                                </p>
                              )}
                            </div>

                            {/* Payment Details */}

                            <div className="mt-4 grid grid-cols-1 gap-2 sm:grid-cols-3">
                              <div className="rounded-xl border border-slate-200 bg-white p-3">
                                <p className="text-[10px] uppercase tracking-wide text-slate-400">
                                  Total
                                </p>

                                <p className="mt-1 text-sm font-bold text-slate-800">
                                  {formatCurrency(
                                    purchase.totalAmount
                                  )}
                                </p>
                              </div>

                              <div className="rounded-xl border border-green-100 bg-green-50 p-3">
                                <p className="text-[10px] uppercase tracking-wide text-green-600">
                                  Paid
                                </p>

                                <p className="mt-1 text-sm font-bold text-green-700">
                                  {formatCurrency(
                                    purchase.paidAmount
                                  )}
                                </p>
                              </div>

                              <div className="rounded-xl border border-red-100 bg-red-50 p-3">
                                <p className="text-[10px] uppercase tracking-wide text-red-600">
                                  Remaining
                                </p>

                                <p className="mt-1 text-sm font-bold text-red-700">
                                  {formatCurrency(
                                    purchase.remainingBalance
                                  )}
                                </p>
                              </div>
                            </div>

                            {/* Notes */}

                            {purchase.notes && (
                              <div className="mt-4 rounded-xl border border-slate-200 bg-white p-3">
                                <p className="text-[10px] font-bold uppercase tracking-wide text-slate-400">
                                  Purchase Notes
                                </p>

                                <p className="mt-1 break-words text-sm leading-5 text-slate-700">
                                  {purchase.notes}
                                </p>
                              </div>
                            )}
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              )}
            </section>
          </div>
        </div>

        {/* ==================================================
            FOOTER
        ================================================== */}

        <div
          className="
            flex
            shrink-0
            border-t
            border-slate-200
            bg-slate-50/80
            px-4
            py-3
            sm:justify-end
            sm:px-6
            sm:py-4
          "
        >
          <button
            type="button"
            onClick={onClose}
            className="
              w-full
              rounded-xl
              bg-slate-200
              px-5
              py-2.5
              text-sm
              font-semibold
              text-slate-700
              transition
              hover:bg-slate-300
              focus:outline-none
              focus:ring-2
              focus:ring-slate-400/30
              sm:w-auto
            "
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};

export default VendorHistoryModal;