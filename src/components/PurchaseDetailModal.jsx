import React from 'react';
import { ExternalLink, X, FileText } from 'lucide-react';

const PurchaseDetailModal = ({ isOpen, onClose, purchase, onEdit, onCancelPrompt }) => {
  if (!isOpen || !purchase) return null;

  const getStatusBadge = (status) => {
    switch (status) {
      case 'Paid':
        return <span className="px-3 py-1 rounded-full text-xs font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200">Paid</span>;
      case 'Partial':
        return <span className="px-3 py-1 rounded-full text-xs font-semibold bg-amber-50 text-amber-700 border border-amber-200">Partial</span>;
      default:
        return <span className="px-3 py-1 rounded-full text-xs font-semibold bg-red-50 text-red-700 border border-red-200">Unpaid</span>;
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 backdrop-blur-sm p-4 overflow-y-auto">
      <div className="bg-white rounded-3xl border border-slate-200 shadow-xl w-full max-w-3xl my-8 overflow-hidden animate-in fade-in zoom-in-95 duration-200">
        <div className="px-6 py-4 border-b border-slate-200 flex justify-between items-center bg-slate-50/50">
          <div className="flex items-center gap-3">
            <h3 className="text-lg font-bold text-slate-800">
              Purchase Order #{purchase.invoiceNumber}
            </h3>
            {getStatusBadge(purchase.paymentStatus)}
          </div>
          <button onClick={onClose} className="text-slate-400 hover:text-slate-600 transition p-1">
            <X size={20} />
          </button>
        </div>

        <div className="p-6 space-y-6 text-sm text-slate-700">
          {/* Vendor & General Details */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 bg-slate-50 p-4 rounded-2xl border border-slate-200">
            <div>
              <p className="text-xs text-slate-400 font-medium">Vendor</p>
              <p className="font-bold text-slate-900">{purchase.vendor?.name || '—'}</p>
              <p className="text-xs text-slate-500">{purchase.vendor?.companyName}</p>
            </div>
            <div>
              <p className="text-xs text-slate-400 font-medium">Purchase Date</p>
              <p className="font-semibold text-slate-800">
                {new Date(purchase.purchaseDate).toLocaleDateString()}
              </p>
            </div>
            <div>
              <p className="text-xs text-slate-400 font-medium">Vendor Phone</p>
              <p className="font-semibold text-slate-800">{purchase.vendor?.phone || '—'}</p>
            </div>
          </div>

          {/* Items Table */}
          <div>
            <h4 className="font-bold text-slate-800 mb-3">Purchased Items</h4>
            <div className="overflow-x-auto border border-slate-200 rounded-2xl">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-slate-50 border-b border-slate-200 text-xs font-semibold text-slate-500">
                    <th className="py-3 px-4">Product</th>
                    <th className="py-3 px-4">Stock Type</th>
                    <th className="py-3 px-4">Qty</th>
                    <th className="py-3 px-4">Rate</th>
                    <th className="py-3 px-4 text-right">Line Total</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 text-xs">
                  {purchase.items?.map((item, idx) => (
                    <tr key={idx}>
                      <td className="py-3 px-4 font-semibold text-slate-800">
                        {item.product?.productName || item.productName || '—'}
                      </td>
                      <td className="py-3 px-4">{item.stockType}</td>
                      <td className="py-3 px-4">{item.quantity}</td>
                      <td className="py-3 px-4">PKR {item.rate?.toLocaleString()}</td>
                      <td className="py-3 px-4 text-right font-bold text-slate-900">
                        PKR {item.lineTotal?.toLocaleString()}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Summary Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div className="p-3.5 bg-slate-50 rounded-2xl border border-slate-200">
              <p className="text-xs text-slate-500">Total Amount</p>
              <p className="text-lg font-bold text-[#1E3A8A]">
                PKR {purchase.totalAmount?.toLocaleString()}
              </p>
            </div>
            <div className="p-3.5 bg-slate-50 rounded-2xl border border-slate-200">
              <p className="text-xs text-slate-500">Paid Amount</p>
              <p className="text-lg font-bold text-emerald-600">
                PKR {purchase.paidAmount?.toLocaleString()}
              </p>
            </div>
            <div className="p-3.5 bg-slate-50 rounded-2xl border border-slate-200">
              <p className="text-xs text-slate-500">Remaining Balance</p>
              <p className="text-lg font-bold text-red-600">
                PKR {purchase.remainingBalance?.toLocaleString()}
              </p>
            </div>
          </div>

          {/* Remarks & Bill */}
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 pt-2">
            <div>
              <p className="text-xs text-slate-400 font-medium">Notes</p>
              <p className="text-xs text-slate-700 italic">{purchase.notes || 'No remarks recorded.'}</p>
            </div>

            {purchase.bill?.url && (
              <a
                href={purchase.bill.url}
                target="_blank"
                rel="noreferrer"
                className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-[#1E3A8A] font-semibold text-xs rounded-xl flex items-center gap-1.5 transition"
              >
                <FileText size={15} /> View Attached Bill <ExternalLink size={12} />
              </a>
            )}
          </div>

          {/* Action Buttons */}
          <div className="flex justify-between items-center pt-4 border-t border-slate-100">
            <button
              onClick={() => {
                onClose();
                onCancelPrompt(purchase);
              }}
              className="px-4 py-2 text-xs font-semibold text-red-600 hover:bg-red-50 rounded-xl transition"
            >
              Cancel Purchase
            </button>

            <div className="flex gap-2">
              <button
                onClick={onClose}
                className="px-5 py-2 rounded-xl border border-slate-200 text-slate-600 text-xs font-medium hover:bg-slate-50 transition"
              >
                Close
              </button>
              <button
                onClick={() => {
                  onClose();
                  onEdit(purchase);
                }}
                className="px-5 py-2 rounded-xl bg-[#1E3A8A] text-white text-xs font-medium hover:bg-blue-900 transition"
              >
                Edit Purchase
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PurchaseDetailModal;