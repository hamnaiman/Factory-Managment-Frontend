import React, { useEffect, useState } from "react";
import { X, Loader2, Building2, Phone, Mail, MapPin } from "lucide-react";
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

  const [loading, setLoading] = useState(false);

  // ======================================================
  // FETCH VENDOR PURCHASE SUMMARY
  // ======================================================

  useEffect(() => {
    if (!isOpen || !vendor?._id) {
      return;
    }

    const fetchSummary = async () => {
      setLoading(true);

      try {
        const res =
          await vendorService.getVendorPurchaseSummary(
            vendor._id
          );

        if (res?.success) {
          setSummary(
            res.data || {
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
      } catch (error) {
        console.error(
          "Vendor purchase summary error:",
          error
        );

        const msg =
          error?.response?.data?.message ||
          "Failed to fetch purchase summary";

        toast.error(msg);

        setSummary({
          totalPurchases: 0,
          purchaseCount: 0,
        });
      } finally {
        setLoading(false);
      }
    };

    fetchSummary();
  }, [isOpen, vendor]);

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

    return `Rs. ${amount.toLocaleString("en-PK")}`;
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
      className="fixed inset-0 z-[100] flex items-center justify-center bg-slate-950/50 p-3 sm:p-4 md:p-6"
      onMouseDown={(event) => {
        if (event.target === event.currentTarget) {
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
          max-w-2xl
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
          {/* Vendor Heading */}

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
                    "No Company Name"}
                </p>
              </div>
            </div>
          </div>

          {/* Close */}

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

                {/* Email */}

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
                      <Mail size={15} />
                    </div>

                    <div className="min-w-0">
                      <span className="block text-[11px] font-medium uppercase tracking-wide text-slate-400">
                        Email
                      </span>

                      <span className="mt-1 block break-all text-sm font-medium text-slate-700">
                        {vendor.email || "—"}
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
                    sm:col-span-2
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
                    min-h-[150px]
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
                      Loading purchase summary...
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
                  {/* Total Volume */}

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
                      Total Volume
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
                      Total purchase value
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
                      Purchase orders
                    </p>
                  </div>
                </div>
              )}
            </section>

            {/* ==================================================
                FUTURE HISTORY
            ================================================== */}

            <section
              className="
                border-t
                border-slate-200
                pt-4
                sm:pt-5
              "
            >
              <div
                className="
                  flex
                  flex-col
                  gap-3
                  rounded-2xl
                  border
                  border-amber-200
                  bg-amber-50
                  p-3.5
                  sm:flex-row
                  sm:items-center
                  sm:justify-between
                  sm:p-4
                "
              >
                <p className="text-xs leading-5 text-amber-800 sm:text-sm">
                  Detailed line-item purchase history
                  integration coming soon.
                </p>

                <span
                  className="
                    inline-flex
                    w-fit
                    shrink-0
                    items-center
                    rounded-md
                    bg-amber-200
                    px-2
                    py-1
                    text-[10px]
                    font-bold
                    uppercase
                    tracking-wide
                    text-amber-800
                  "
                >
                  Notice
                </span>
              </div>
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