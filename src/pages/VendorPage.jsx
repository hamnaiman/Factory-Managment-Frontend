import React, {
  useState,
  useEffect,
  useCallback,
} from "react";

import toast from "react-hot-toast";

import {
  Search,
  Pencil,
  Trash2,
} from "lucide-react";

import Sidebar from "../components/Sidebar";
import Navbar from "../components/Navbar";
import VendorModal from "../components/VendorModal";
import VendorHistoryModal from "../components/VendorHistoryModal";

import { vendorService } from "../services/vendorService";

const VendorPage = () => {
  // =====================================================
  // SIDEBAR
  // =====================================================

  const [isSidebarOpen, setIsSidebarOpen] =
    useState(true);

  // =====================================================
  // VENDORS
  // =====================================================

  const [vendors, setVendors] =
    useState([]);

  const [loading, setLoading] =
    useState(true);

  const [search, setSearch] =
    useState("");

  const [includeInactive, setIncludeInactive] =
    useState(true);

  // =====================================================
  // MODALS
  // =====================================================

  const [isFormOpen, setIsFormOpen] =
    useState(false);

  const [selectedVendor, setSelectedVendor] =
    useState(null);

  const [isHistoryOpen, setIsHistoryOpen] =
    useState(false);

  // =====================================================
  // FETCH VENDORS
  // =====================================================

  const fetchVendors = useCallback(
    async () => {
      setLoading(true);

      try {
        const res =
          await vendorService.getVendors(
            search,
            includeInactive
          );

        if (res?.success) {
          setVendors(
            res?.data || []
          );
        } else {
          setVendors([]);
        }
      } catch (error) {
        console.error(
          "Vendor fetch error:",
          error
        );

        toast.error(
          error?.response?.data?.message ||
            "Failed to load vendors"
        );

        setVendors([]);
      } finally {
        setLoading(false);
      }
    },
    [search, includeInactive]
  );

  // =====================================================
  // SEARCH DEBOUNCE
  // =====================================================

  useEffect(() => {
    const timer =
      setTimeout(() => {
        fetchVendors();
      }, 300);

    return () =>
      clearTimeout(timer);
  }, [fetchVendors]);

  // =====================================================
  // NEW VENDOR
  // =====================================================

  const handleNewVendor = () => {
    setSelectedVendor(null);
    setIsFormOpen(true);
  };

  // =====================================================
  // EDIT VENDOR
  // =====================================================

  const handleEdit = (vendor) => {
    setSelectedVendor(vendor);
    setIsFormOpen(true);
  };

  // =====================================================
  // VIEW HISTORY
  // =====================================================

  const handleViewHistory = (
    vendor
  ) => {
    setSelectedVendor(vendor);
    setIsHistoryOpen(true);
  };

  // =====================================================
  // DEACTIVATE VENDOR
  // =====================================================

  const handleDeactivatePrompt = (
    vendor
  ) => {
    toast(
      (t) => (
        <div className="flex min-w-[280px] flex-col gap-3">

          <p className="text-sm font-medium text-slate-800">
            Deactivate{" "}
            <span className="font-bold">
              {vendor?.name}
            </span>
            ?
          </p>

          <p className="text-xs leading-5 text-slate-500">
            This vendor will be hidden
            from new purchases.
          </p>

          <div className="flex justify-end gap-2">

            <button
              type="button"
              onClick={() =>
                toast.dismiss(t.id)
              }
              className="rounded-lg border border-slate-200 px-3 py-1.5 text-xs font-semibold text-slate-600 transition hover:bg-slate-50"
            >
              Cancel
            </button>

            <button
              type="button"
              onClick={async () => {
                toast.dismiss(t.id);

                try {
                  const res =
                    await vendorService.deactivateVendor(
                      vendor._id
                    );

                  if (res?.success) {
                    toast.success(
                      "Vendor deactivated successfully"
                    );

                    fetchVendors();
                  }
                } catch (error) {
                  console.error(
                    error
                  );

                  toast.error(
                    error?.response?.data?.message ||
                      "Deactivation failed"
                  );
                }
              }}
              className="rounded-lg bg-red-600 px-3 py-1.5 text-xs font-semibold text-white transition hover:bg-red-700"
            >
              Confirm
            </button>

          </div>

        </div>
      ),
      {
        duration: 6000,
        position: "top-center",
      }
    );
  };

  // =====================================================
  // REACTIVATE VENDOR
  // =====================================================

  const handleReactivate = async (
    vendor
  ) => {
    try {
      const res =
        await vendorService.reactivateVendor(
          vendor._id
        );

      if (res?.success) {
        toast.success(
          "Vendor reactivated successfully"
        );

        fetchVendors();
      }
    } catch (error) {
      console.error(
        error
      );

      toast.error(
        error?.response?.data?.message ||
          "Reactivation failed"
      );
    }
  };

  // =====================================================
  // RENDER
  // =====================================================

  return (
    <div className="flex min-h-screen overflow-x-hidden bg-slate-100">

      {/* =================================================
          SIDEBAR
      ================================================= */}

      <Sidebar
        isOpen={isSidebarOpen}
        setIsOpen={
          setIsSidebarOpen
        }
      />

      {/* =================================================
          MAIN CONTENT
      ================================================= */}

      <div
        className={`min-w-0 flex-1 transition-all duration-300 ease-in-out ${
          isSidebarOpen
            ? "ml-0 lg:ml-72"
            : "ml-0 lg:ml-20"
        }`}
      >

        {/* =================================================
            NAVBAR
        ================================================= */}

        <Navbar
          isSidebarOpen={
            isSidebarOpen
          }
          setIsSidebarOpen={
            setIsSidebarOpen
          }
        />

        {/* =================================================
            PAGE
        ================================================= */}

        <main className="mx-auto mt-24 w-full max-w-[1600px] space-y-6 p-4 sm:p-5 md:p-6 lg:p-8">

          {/* =================================================
              HEADER
          ================================================= */}

          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">

            <div>

              <h1 className="text-2xl font-bold leading-tight text-slate-900 sm:text-3xl">
                Vendor Management
              </h1>

              <p className="mt-1 text-sm text-slate-500">
                Manage raw material
                suppliers and purchase
                records
              </p>

            </div>

            <button
              type="button"
              onClick={
                handleNewVendor
              }
              className="h-12 w-full rounded-2xl bg-[#1E3A8A] px-6 font-semibold text-white shadow-sm transition hover:bg-[#17307A] sm:w-auto"
            >
              + New Vendor
            </button>

          </div>

          {/* =================================================
              SEARCH / FILTER
          ================================================= */}

          <div className="rounded-3xl border border-slate-200 bg-white p-4 shadow-sm sm:p-5">

            <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">

              {/* SEARCH */}

              <div className="relative w-full md:max-w-md">

                <Search
                  size={18}
                  className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400"
                />

                <input
                  type="text"
                  placeholder="Search name, company, phone..."
                  value={search}
                  onChange={(e) =>
                    setSearch(
                      e.target.value
                    )
                  }
                  className="h-12 w-full rounded-xl border border-slate-300 bg-white pl-11 pr-4 text-sm outline-none transition placeholder:text-slate-400 focus:border-[#1E3A8A] focus:ring-2 focus:ring-blue-100"
                />

              </div>

              {/* INACTIVE */}

              <label className="flex cursor-pointer items-center gap-2 text-sm text-slate-600">

                <input
                  type="checkbox"
                  checked={
                    includeInactive
                  }
                  onChange={(e) =>
                    setIncludeInactive(
                      e.target.checked
                    )
                  }
                  className="h-4 w-4 rounded border-slate-300 text-[#1E3A8A] focus:ring-[#1E3A8A]"
                />

                <span>
                  Show inactive
                  vendors
                </span>

              </label>

            </div>

          </div>

          {/* =================================================
              VENDOR LIST
          ================================================= */}

          <div className="overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-sm">

            {/* =================================================
                DESKTOP
            ================================================= */}

            <div className="hidden lg:block">

              {/* HEADER */}

              <div className="grid grid-cols-12 bg-slate-50 px-6 py-4 font-semibold text-slate-700">

                <div className="col-span-3">
                  Name
                </div>

                <div className="col-span-2">
                  Company
                </div>

                <div className="col-span-2">
                  Phone
                </div>

                <div className="col-span-2">
                  Status
                </div>

                <div className="col-span-3 text-center">
                  Actions
                </div>

              </div>

              {/* LOADING */}

              {loading ? (

                <div className="px-6 py-12 text-center text-sm text-slate-400">
                  Loading vendors...
                </div>

              ) : vendors.length ===
                0 ? (

                <div className="px-6 py-12 text-center text-sm text-slate-400">
                  No vendors found.
                </div>

              ) : (

                vendors.map(
                  (vendor) => (

                    <div
                      key={
                        vendor._id
                      }
                      className="grid grid-cols-12 items-center border-t border-slate-100 px-6 py-5 transition hover:bg-slate-50"
                    >

                      {/* NAME */}

                      <div className="col-span-3">

                        <p className="font-semibold text-[#1E3A8A]">
                          {
                            vendor.name
                          }
                        </p>

                      </div>

                      {/* COMPANY */}

                      <div className="col-span-2 text-slate-700">

                        {
                          vendor.companyName ||
                          "—"
                        }

                      </div>

                      {/* PHONE */}

                      <div className="col-span-2 text-slate-700">

                        {
                          vendor.phone ||
                          "—"
                        }

                      </div>

                      {/* STATUS */}

                      <div className="col-span-2">

                        <span
                          className={`rounded-full px-3 py-1 text-xs font-medium ${
                            vendor.isActive
                              ? "bg-green-100 text-green-700"
                              : "bg-red-100 text-red-700"
                          }`}
                        >
                          {vendor.isActive
                            ? "active"
                            : "inactive"}
                        </span>

                      </div>

                      {/* ACTIONS */}

                      <div className="col-span-3 flex justify-center gap-3">

                        {/* HISTORY */}

                        <button
                          type="button"
                          onClick={() =>
                            handleViewHistory(
                              vendor
                            )
                          }
                          className="rounded-xl bg-slate-100 px-3 py-2 text-xs font-semibold text-[#1E3A8A] transition hover:bg-slate-200"
                        >
                          History
                        </button>

                        {/* EDIT */}

                        <button
                          type="button"
                          onClick={() =>
                            handleEdit(
                              vendor
                            )
                          }
                          className="rounded-xl bg-blue-50 p-2 text-blue-600 transition hover:bg-blue-100"
                        >
                          <Pencil
                            size={18}
                          />
                        </button>

                        {/* DELETE */}

                        {vendor.isActive ? (

                          <button
                            type="button"
                            onClick={() =>
                              handleDeactivatePrompt(
                                vendor
                              )
                            }
                            className="rounded-xl bg-red-50 p-2 text-red-600 transition hover:bg-red-100"
                          >
                            <Trash2
                              size={18}
                            />
                          </button>

                        ) : (

                          <button
                            type="button"
                            onClick={() =>
                              handleReactivate(
                                vendor
                              )
                            }
                            className="rounded-xl bg-green-50 px-3 py-2 text-xs font-semibold text-green-600 transition hover:bg-green-100"
                          >
                            Reactivate
                          </button>

                        )}

                      </div>

                    </div>

                  )
                )

              )}

            </div>

            {/* =================================================
                MOBILE
            ================================================= */}

            <div className="grid gap-4 p-4 lg:hidden">

              {loading ? (

                <div className="py-10 text-center text-sm text-slate-400">
                  Loading vendors...
                </div>

              ) : vendors.length ===
                0 ? (

                <div className="py-10 text-center text-sm text-slate-400">
                  No vendors found.
                </div>

              ) : (

                vendors.map(
                  (vendor) => (

                    <div
                      key={
                        vendor._id
                      }
                      className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm"
                    >

                      {/* CARD HEADER */}

                      <div className="flex items-start justify-between gap-3">

                        <div>

                          <p className="text-lg font-bold text-[#1E3A8A]">
                            {
                              vendor.name
                            }
                          </p>

                          <p className="mt-1 text-sm text-slate-500">
                            {
                              vendor.companyName ||
                              "—"
                            }
                          </p>

                        </div>

                        <span
                          className={`shrink-0 rounded-full px-3 py-1 text-xs font-medium ${
                            vendor.isActive
                              ? "bg-green-100 text-green-700"
                              : "bg-red-100 text-red-700"
                          }`}
                        >
                          {vendor.isActive
                            ? "active"
                            : "inactive"}
                        </span>

                      </div>

                      {/* DETAILS */}

                      <div className="mt-5 space-y-2 text-sm">

                        <div className="flex justify-between gap-4">

                          <span className="text-slate-500">
                            Phone
                          </span>

                          <span className="text-right font-medium text-slate-700">
                            {
                              vendor.phone ||
                              "—"
                            }
                          </span>

                        </div>

                        <div className="flex justify-between gap-4">

                          <span className="text-slate-500">
                            Company
                          </span>

                          <span className="text-right font-medium text-slate-700">
                            {
                              vendor.companyName ||
                              "—"
                            }
                          </span>

                        </div>

                      </div>

                      {/* ACTIONS */}

                      <div className="mt-6 flex gap-3">

                        <button
                          type="button"
                          onClick={() =>
                            handleViewHistory(
                              vendor
                            )
                          }
                          className="flex-1 rounded-xl bg-slate-100 py-2 text-sm font-semibold text-[#1E3A8A] transition hover:bg-slate-200"
                        >
                          History
                        </button>

                        <button
                          type="button"
                          onClick={() =>
                            handleEdit(
                              vendor
                            )
                          }
                          className="flex-1 rounded-xl bg-blue-600 py-2 text-sm font-semibold text-white transition hover:bg-blue-700"
                        >
                          Edit
                        </button>

                        {vendor.isActive ? (

                          <button
                            type="button"
                            onClick={() =>
                              handleDeactivatePrompt(
                                vendor
                              )
                            }
                            className="flex-1 rounded-xl bg-red-600 py-2 text-sm font-semibold text-white transition hover:bg-red-700"
                          >
                            Delete
                          </button>

                        ) : (

                          <button
                            type="button"
                            onClick={() =>
                              handleReactivate(
                                vendor
                              )
                            }
                            className="flex-1 rounded-xl bg-green-600 py-2 text-sm font-semibold text-white transition hover:bg-green-700"
                          >
                            Reactivate
                          </button>

                        )}

                      </div>

                    </div>

                  )
                )

              )}

            </div>

          </div>

          {/* =================================================
              VENDOR MODAL
          ================================================= */}

          <VendorModal
            isOpen={isFormOpen}
            onClose={() => {
              setIsFormOpen(false);
              setSelectedVendor(null);
            }}
            vendor={
              selectedVendor
            }
            onSuccess={() => {
              fetchVendors();

              setIsFormOpen(false);

              setSelectedVendor(
                null
              );
            }}
          />

          {/* =================================================
              HISTORY MODAL
          ================================================= */}

          <VendorHistoryModal
            isOpen={
              isHistoryOpen
            }
            onClose={() => {
              setIsHistoryOpen(
                false
              );

              setSelectedVendor(
                null
              );
            }}
            vendor={
              selectedVendor
            }
          />

        </main>

      </div>

    </div>
  );
};

export default VendorPage;