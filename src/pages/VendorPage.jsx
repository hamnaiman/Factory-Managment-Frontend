import React, { useState, useEffect, useCallback } from 'react';
import toast from 'react-hot-toast';
import { Search } from 'lucide-react';

import Sidebar from '../components/Sidebar';
import Navbar from '../components/Navbar';
import VendorModal from '../components/VendorModal';
import VendorHistoryModal from '../components/VendorHistoryModal';
import { vendorService } from '../services/vendorService';

const VendorPage = () => {
  // Desktop standard fixed layout state - starts open by default
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);

  const [vendors, setVendors] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [includeInactive, setIncludeInactive] = useState(true);

  // Modals management
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [selectedVendor, setSelectedVendor] = useState(null);
  const [isHistoryOpen, setIsHistoryOpen] = useState(false);

  const fetchVendors = useCallback(async () => {
    setLoading(true);
    try {
      const res = await vendorService.getVendors(search, includeInactive);
      if (res.success) {
        setVendors(res.data || []);
      }
    } catch (error) {
      const msg = error.response?.data?.message || 'Failed to load vendors';
      toast.error(msg);
    } finally {
      setLoading(false);
    }
  }, [search, includeInactive]);

  useEffect(() => {
    const timer = setTimeout(() => {
      fetchVendors();
    }, 300); // 300ms debounce on search
    return () => clearTimeout(timer);
  }, [fetchVendors]);

  // Toast confirmation action for deactivation
  const handleDeactivatePrompt = (vendor) => {
    toast((t) => (
      <div className="flex flex-col gap-3">
        <p className="text-xs font-medium text-slate-800">
          Deactivate <strong>{vendor.name}</strong>? They will be hidden from new purchases.
        </p>
        <div className="flex justify-end gap-2">
          <button
            onClick={() => toast.dismiss(t.id)}
            className="px-3 py-1 text-xs rounded-lg border border-slate-200 text-slate-600 hover:bg-slate-50 transition"
          >
            Cancel
          </button>
          <button
            onClick={async () => {
              toast.dismiss(t.id);
              try {
                const res = await vendorService.deactivateVendor(vendor._id);
                if (res.success) {
                  toast.success('Vendor deactivated successfully');
                  fetchVendors();
                }
              } catch (error) {
                const msg = error.response?.data?.message || 'Deactivation failed';
                toast.error(msg);
              }
            }}
            className="px-3 py-1 text-xs rounded-lg bg-red-600 text-white font-medium hover:bg-red-700 transition"
          >
            Confirm
          </button>
        </div>
      </div>
    ), {
      duration: 6000,
      position: 'top-center'
    });
  };

  const handleReactivate = async (vendor) => {
    try {
      const res = await vendorService.reactivateVendor(vendor._id);
      if (res.success) {
        toast.success('Vendor reactivated successfully');
        fetchVendors();
      }
    } catch (error) {
      const msg = error.response?.data?.message || 'Reactivation failed';
      toast.error(msg);
    }
  };

  return (
    <div className="min-h-screen overflow-x-hidden bg-slate-100 flex">
      {/* Sidebar Component */}
      <Sidebar
        isOpen={isSidebarOpen}
        setIsOpen={setIsSidebarOpen}
      />

      {/* Main Content Area */}
      <div 
        className={`flex-1 min-w-0 transition-all duration-300 ease-in-out
        ${isSidebarOpen ? "ml-0 lg:ml-72" : "ml-0 lg:ml-20"}`}
      >
        {/* Fixed Navbar */}
        <Navbar
          isSidebarOpen={isSidebarOpen}
          setIsSidebarOpen={setIsSidebarOpen}
        />

        {/* Page Content */}
        <main className="p-4 md:p-6 lg:p-8 space-y-6 max-w-[1600px] mx-auto mt-24">
          
          {/* Header section */}
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
            <div>
              <h1 className="text-2xl font-bold leading-tight text-slate-900 sm:text-3xl">
                Vendor Management
              </h1>
              <p className="mt-1 text-sm text-slate-500">
                Manage raw material suppliers and purchase records
              </p>
            </div>
            <button
              onClick={() => {
                setSelectedVendor(null);
                setIsFormOpen(true);
              }}
              className="h-12 rounded-2xl bg-[#1E3A8A] px-6 font-semibold text-white transition hover:bg-[#17307A] cursor-pointer shadow-xs"
            >
              + New Vendor
            </button>
          </div>

          {/* Control Bar / Search Toolbar */}
          <div className="rounded-3xl border border-slate-200 bg-white p-4 shadow-xs sm:p-5">
            <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
              
              {/* Search */}
              <div className="relative w-full md:max-w-md lg:max-w-sm">
                <Search
                  size={18}
                  className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400"
                />
                <input
                  type="text"
                  placeholder="Search name, company, phone..."
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  className="h-12 w-full rounded-xl border border-slate-300 pl-11 pr-4 text-sm outline-hidden transition focus:border-[#1E3A8A]"
                />
              </div>

              {/* Inactive Toggle */}
              <label className="flex items-center space-x-2 text-sm text-slate-600 cursor-pointer">
                <input
                  type="checkbox"
                  checked={includeInactive}
                  onChange={(e) => setIncludeInactive(e.target.checked)}
                  className="rounded text-[#1E3A8A] focus:ring-[#1E3A8A] h-4 w-4"
                />
                <span>Show inactive vendors</span>
              </label>
            </div>
          </div>

          {/* Table Container */}
          <div className="w-full overflow-x-auto bg-white rounded-3xl border border-slate-200 shadow-xs">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-slate-50 border-b border-slate-200 text-xs font-semibold text-slate-500 uppercase tracking-wider">
                  <th className="py-4 px-6">Name</th>
                  <th className="py-4 px-6">Company</th>
                  <th className="py-4 px-6">Phone</th>
                  <th className="py-4 px-6">Status</th>
                  <th className="py-4 px-6 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-sm text-slate-700">
                {loading ? (
                  <tr>
                    <td colSpan="5" className="text-center py-8 text-slate-400">
                      Loading vendors...
                    </td>
                  </tr>
                ) : vendors.length === 0 ? (
                  <tr>
                    <td colSpan="5" className="text-center py-8 text-slate-400">
                      No vendors found.
                    </td>
                  </tr>
                ) : (
                  vendors.map((v) => (
                    <tr key={v._id} className="hover:bg-slate-50/80 transition-colors">
                      <td className="py-4 px-6 font-semibold text-slate-800">{v.name}</td>
                      <td className="py-4 px-6">{v.companyName || '—'}</td>
                      <td className="py-4 px-6">{v.phone || '—'}</td>
                      <td className="py-4 px-6">
                        {v.isActive ? (
                          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-emerald-50 text-emerald-700 border border-emerald-200">
                            Active
                          </span>
                        ) : (
                          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-slate-100 text-slate-500 border border-slate-200">
                            Inactive
                          </span>
                        )}
                      </td>
                      <td className="py-4 px-6 text-right space-x-2">
                        <button
                          onClick={() => {
                            setSelectedVendor(v);
                            setIsHistoryOpen(true);
                          }}
                          className="text-[#1E3A8A] hover:underline text-xs font-semibold"
                        >
                          View History
                        </button>
                        <button
                          onClick={() => {
                            setSelectedVendor(v);
                            setIsFormOpen(true);
                          }}
                          className="text-slate-600 hover:text-slate-900 text-xs font-semibold"
                        >
                          Edit
                        </button>
                        {v.isActive ? (
                          <button
                            onClick={() => handleDeactivatePrompt(v)}
                            className="text-red-600 hover:underline text-xs font-semibold"
                          >
                            Deactivate
                          </button>
                        ) : (
                          <button
                            onClick={() => handleReactivate(v)}
                            className="text-emerald-600 hover:underline text-xs font-semibold"
                          >
                            Reactivate
                          </button>
                        )}
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>

          {/* Modals */}
          <VendorModal
            isOpen={isFormOpen}
            onClose={() => setIsFormOpen(false)}
            vendor={selectedVendor}
            onSuccess={fetchVendors}
          />

          <VendorHistoryModal
            isOpen={isHistoryOpen}
            onClose={() => setIsHistoryOpen(false)}
            vendor={selectedVendor}
          />
        </main>
      </div>
    </div>
  );
};

export default VendorPage;