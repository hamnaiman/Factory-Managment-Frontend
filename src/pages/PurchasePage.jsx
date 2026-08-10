import React, { useState, useEffect, useCallback } from 'react';
import toast from 'react-hot-toast';
import { Search, FileText, ExternalLink, Eye, Edit2, AlertCircle } from 'lucide-react';

import Sidebar from '../components/Sidebar';
import Navbar from '../components/Navbar';
import VendorSelect from '../components/VendorSelect';
import PurchaseModal from '../components/PurchaseModal';
import PurchaseDetailModal from '../components/PurchaseDetailModal';
import { purchaseService } from '../services/purchaseService';

const PurchasePage = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);

  // Filters & List Data
  const [purchases, setPurchases] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [selectedVendor, setSelectedVendor] = useState('');
  const [paymentStatus, setPaymentStatus] = useState('');
  const [fromDate, setFromDate] = useState('');
  const [toDate, setToDate] = useState('');

  // Pagination
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  // Modals Management
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [isDetailOpen, setIsDetailOpen] = useState(false);
  const [activePurchase, setActivePurchase] = useState(null);

  const fetchPurchases = useCallback(async () => {
    setLoading(true);
    try {
      const res = await purchaseService.getPurchases({
        search,
        vendor: selectedVendor,
        paymentStatus,
        fromDate,
        toDate,
        page,
        limit: 15
      });
      if (res.success) {
        setPurchases(res.data || []);
        if (res.pagination) {
          setTotalPages(res.pagination.totalPages || 1);
        }
      }
    } catch (error) {
      toast.error('Failed to load purchases');
    } finally {
      setLoading(false);
    }
  }, [search, selectedVendor, paymentStatus, fromDate, toDate, page]);

  useEffect(() => {
    const timer = setTimeout(() => {
      fetchPurchases();
    }, 300);
    return () => clearTimeout(timer);
  }, [fetchPurchases]);

  // Toast confirmation dialog for stock reversal cancel operation
  const handleCancelPrompt = (purchase) => {
    toast((t) => (
      <div className="flex flex-col gap-3 p-1">
        <div className="flex items-start gap-2">
          <AlertCircle className="text-red-600 shrink-0 mt-0.5" size={18} />
          <div>
            <p className="text-xs font-bold text-slate-800">Cancel Purchase #{purchase.invoiceNumber}?</p>
            <p className="text-xs text-slate-600 mt-1">
              This will reverse the stock added by this purchase (products will be reduced back). Continue?
            </p>
          </div>
        </div>
        <div className="flex justify-end gap-2 pt-1">
          <button
            onClick={() => toast.dismiss(t.id)}
            className="px-3 py-1 text-xs rounded-lg border border-slate-200 text-slate-600 hover:bg-slate-50 transition"
          >
            No, keep it
          </button>
          <button
            onClick={async () => {
              toast.dismiss(t.id);
              try {
                const res = await purchaseService.cancelPurchase(purchase._id);
                if (res.success) {
                  toast.success('Purchase cancelled & stock reversed');
                  fetchPurchases();
                }
              } catch (error) {
                const msg = error.response?.data?.message || 'Cancellation failed';
                toast.error(msg);
              }
            }}
            className="px-3 py-1 text-xs rounded-lg bg-red-600 text-white font-medium hover:bg-red-700 transition"
          >
            Yes, Cancel
          </button>
        </div>
      </div>
    ), {
      duration: 8000,
      position: 'top-center'
    });
  };

  const renderStatusBadge = (status) => {
    switch (status) {
      case 'Paid':
        return <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200">Paid</span>;
      case 'Partial':
        return <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-amber-50 text-amber-700 border border-amber-200">Partial</span>;
      default:
        return <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-red-50 text-red-700 border border-red-200">Unpaid</span>;
    }
  };

  return (
    <div className="min-h-screen overflow-x-hidden bg-slate-100 flex">
      <Sidebar isOpen={isSidebarOpen} setIsOpen={setIsSidebarOpen} />

      <div className={`flex-1 min-w-0 transition-all duration-300 ease-in-out ${isSidebarOpen ? 'ml-0 lg:ml-72' : 'ml-0 lg:ml-20'}`}>
        <Navbar isSidebarOpen={isSidebarOpen} setIsSidebarOpen={setIsSidebarOpen} />

        <main className="p-4 md:p-6 lg:p-8 space-y-6 max-w-[1600px] mx-auto mt-24">
          {/* Header */}
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
            <div>
              <h1 className="text-2xl font-bold leading-tight text-slate-900 sm:text-3xl">
                Purchase Management
              </h1>
              <p className="mt-1 text-sm text-slate-500">
                Record raw material purchases and auto-update stock
              </p>
            </div>
            <button
              onClick={() => {
                setActivePurchase(null);
                setIsFormOpen(true);
              }}
              className="h-12 rounded-2xl bg-[#1E3A8A] px-6 font-semibold text-white transition hover:bg-blue-900 shadow-xs cursor-pointer"
            >
              + Record Purchase
            </button>
          </div>

          {/* Filters Bar */}
          <div className="rounded-3xl border border-slate-200 bg-white p-4 shadow-xs space-y-3">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3">
              <div className="relative">
                <Search size={18} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
                <input
                  type="text"
                  placeholder="Invoice #"
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  className="h-10 w-full rounded-xl border border-slate-200 pl-10 pr-3 text-xs outline-none focus:border-[#1E3A8A]"
                />
              </div>

              <div>
                <VendorSelect
                  value={selectedVendor}
                  onChange={(val) => setSelectedVendor(val)}
                  className="h-10 text-xs"
                />
              </div>

              <div>
                <select
                  value={paymentStatus}
                  onChange={(e) => setPaymentStatus(e.target.value)}
                  className="h-10 w-full rounded-xl border border-slate-200 px-3 text-xs outline-none focus:border-[#1E3A8A] bg-white text-slate-700"
                >
                  <option value="">All Payment Statuses</option>
                  <option value="Paid">Paid</option>
                  <option value="Partial">Partial</option>
                  <option value="Unpaid">Unpaid</option>
                </select>
              </div>

              <div>
                <input
                  type="date"
                  value={fromDate}
                  onChange={(e) => setFromDate(e.target.value)}
                  className="h-10 w-full rounded-xl border border-slate-200 px-3 text-xs outline-none focus:border-[#1E3A8A] text-slate-700"
                />
              </div>

              <div>
                <input
                  type="date"
                  value={toDate}
                  onChange={(e) => setToDate(e.target.value)}
                  className="h-10 w-full rounded-xl border border-slate-200 px-3 text-xs outline-none focus:border-[#1E3A8A] text-slate-700"
                />
              </div>
            </div>
          </div>

          {/* Purchases Data Table */}
          <div className="w-full overflow-x-auto bg-white rounded-3xl border border-slate-200 shadow-xs">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-slate-50 border-b border-slate-200 text-xs font-semibold text-slate-500 uppercase tracking-wider">
                  <th className="py-4 px-6">Invoice #</th>
                  <th className="py-4 px-6">Vendor</th>
                  <th className="py-4 px-6">Date</th>
                  <th className="py-4 px-6">Total Amount</th>
                  <th className="py-4 px-6">Payment Status</th>
                  <th className="py-4 px-6">Bill</th>
                  <th className="py-4 px-6 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-sm text-slate-700">
                {loading ? (
                  <tr>
                    <td colSpan="7" className="text-center py-8 text-slate-400">Loading purchases...</td>
                  </tr>
                ) : purchases.length === 0 ? (
                  <tr>
                    <td colSpan="7" className="text-center py-8 text-slate-400">No purchases found.</td>
                  </tr>
                ) : (
                  purchases.map((p) => (
                    <tr key={p._id} className="hover:bg-slate-50/80 transition-colors">
                      <td className="py-4 px-6 font-bold text-slate-800">{p.invoiceNumber}</td>
                      <td className="py-4 px-6">
                        <div className="font-semibold text-slate-800">{p.vendor?.name || '—'}</div>
                        <div className="text-xs text-slate-400">{p.vendor?.companyName}</div>
                      </td>
                      <td className="py-4 px-6 text-xs text-slate-600">
                        {new Date(p.purchaseDate).toLocaleDateString()}
                      </td>
                      <td className="py-4 px-6 font-bold text-[#1E3A8A]">
                        PKR {p.totalAmount?.toLocaleString()}
                      </td>
                      <td className="py-4 px-6">{renderStatusBadge(p.paymentStatus)}</td>
                      <td className="py-4 px-6">
                        {p.bill?.url ? (
                          <a
                            href={p.bill.url}
                            target="_blank"
                            rel="noreferrer"
                            className="inline-flex items-center gap-1 text-xs text-[#1E3A8A] font-semibold hover:underline"
                          >
                            <FileText size={14} /> View <ExternalLink size={10} />
                          </a>
                        ) : (
                          <span className="text-slate-300 text-xs">—</span>
                        )}
                      </td>
                      <td className="py-4 px-6 text-right space-x-2">
                        <button
                          onClick={() => {
                            setActivePurchase(p);
                            setIsDetailOpen(true);
                          }}
                          className="p-1.5 text-slate-500 hover:text-[#1E3A8A] transition rounded-lg hover:bg-slate-100 inline-flex items-center"
                          title="View Details"
                        >
                          <Eye size={16} />
                        </button>
                        <button
                          onClick={() => {
                            setActivePurchase(p);
                            setIsFormOpen(true);
                          }}
                          className="p-1.5 text-slate-500 hover:text-slate-900 transition rounded-lg hover:bg-slate-100 inline-flex items-center"
                          title="Edit"
                        >
                          <Edit2 size={16} />
                        </button>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="flex justify-end items-center gap-2 pt-2">
              <button
                disabled={page <= 1}
                onClick={() => setPage((prev) => prev - 1)}
                className="px-4 py-2 text-xs font-semibold rounded-xl border border-slate-200 text-slate-600 disabled:opacity-40 hover:bg-slate-50 transition"
              >
                Previous
              </button>
              <span className="text-xs text-slate-500 px-2">Page {page} of {totalPages}</span>
              <button
                disabled={page >= totalPages}
                onClick={() => setPage((prev) => prev + 1)}
                className="px-4 py-2 text-xs font-semibold rounded-xl border border-slate-200 text-slate-600 disabled:opacity-40 hover:bg-slate-50 transition"
              >
                Next
              </button>
            </div>
          )}

          {/* Modals */}
          <PurchaseModal
            isOpen={isFormOpen}
            onClose={() => setIsFormOpen(false)}
            purchase={activePurchase}
            onSuccess={fetchPurchases}
          />

          <PurchaseDetailModal
            isOpen={isDetailOpen}
            onClose={() => setIsDetailOpen(false)}
            purchase={activePurchase}
            onEdit={(purch) => {
              setActivePurchase(purch);
              setIsFormOpen(true);
            }}
            onCancelPrompt={handleCancelPrompt}
          />
        </main>
      </div>
    </div>
  );
};

export default PurchasePage;