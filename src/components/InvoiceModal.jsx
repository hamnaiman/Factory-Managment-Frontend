import React, { useEffect } from "react";
import { X, Printer, FileText } from "lucide-react";

// --- Simple number-to-words for "Amount in Words" line (common on factory bills) ---
const ONES = ["", "One", "Two", "Three", "Four", "Five", "Six", "Seven", "Eight", "Nine"];
const TEENS = ["Ten", "Eleven", "Twelve", "Thirteen", "Fourteen", "Fifteen", "Sixteen", "Seventeen", "Eighteen", "Nineteen"];
const TENS = ["", "", "Twenty", "Thirty", "Forty", "Fifty", "Sixty", "Seventy", "Eighty", "Ninety"];

const threeDigitsToWords = (num) => {
  let str = "";
  if (num >= 100) {
    str += ONES[Math.floor(num / 100)] + " Hundred ";
    num %= 100;
  }
  if (num >= 10 && num < 20) {
    str += TEENS[num - 10] + " ";
    return str.trim();
  }
  if (num >= 20) {
    str += TENS[Math.floor(num / 10)] + " ";
    num %= 10;
  }
  if (num > 0) {
    str += ONES[num] + " ";
  }
  return str.trim();
};

// Pakistani numbering: Crore / Lakh / Thousand
const numberToWords = (value) => {
  let num = Math.floor(Number(value) || 0);
  if (num === 0) return "Zero";

  const crore = Math.floor(num / 10000000);
  num %= 10000000;
  const lakh = Math.floor(num / 100000);
  num %= 100000;
  const thousand = Math.floor(num / 1000);
  num %= 1000;
  const rest = num;

  let words = "";
  if (crore) words += threeDigitsToWords(crore) + " Crore ";
  if (lakh) words += threeDigitsToWords(lakh) + " Lakh ";
  if (thousand) words += threeDigitsToWords(thousand) + " Thousand ";
  if (rest) words += threeDigitsToWords(rest);

  return words.trim();
};

const amountInWords = (value) => {
  const rupees = Math.floor(Number(value) || 0);
  return `Rupees ${numberToWords(rupees)} Only`;
};

const formatDate = (date) =>
  new Date(date).toLocaleDateString("en-GB", { day: "2-digit", month: "short", year: "numeric" });

const InvoiceModal = ({ isOpen, open, onClose, invoice, sale, saleData, autoPrint = false }) => {
  const isModalOpen = isOpen ?? open;
  const data = invoice || sale || saleData;

  if (!isModalOpen || !data) return null;

  const paymentStatusText = (data.paymentStatus || data.status || "Unpaid").toUpperCase();
  const balanceDue = Number(data.dueAmount ?? data.remainingBalance ?? 0);

  const handlePrint = () => {
    const printWindow = window.open("", "_blank", "width=850,height=1000");

    if (!printWindow) {
      alert("Please allow popups in your browser to print the invoice.");
      return;
    }

    const itemsRows =
      data.items
        ?.map(
          (item, idx) => `
      <tr>
        <td class="cell center">${idx + 1}</td>
        <td class="cell">${item.productName || item.product?.name || "Product"}</td>
        <td class="cell center">${item.stockType || "Local"}</td>
        <td class="cell center">${item.quantity || 0}</td>
        <td class="cell right">${Number(item.rate || item.unitPrice || 0).toLocaleString()}</td>
        <td class="cell right">${Number(item.amount || item.totalPrice || 0).toLocaleString()}</td>
      </tr>`
        )
        .join("") || "";

    printWindow.document.write(`
      <!DOCTYPE html>
      <html>
        <head>
          <title>Invoice #${data.invoiceNumber || data._id}</title>
          <style>
            * { box-sizing: border-box; }
            body {
              font-family: Arial, Helvetica, sans-serif;
              margin: 0;
              padding: 24px;
              color: #111827;
              font-size: 13px;
            }
            .sheet {
              max-width: 800px;
              margin: 0 auto;
              border: 2px solid #111827;
              padding: 0;
            }
            .letterhead {
              text-align: center;
              padding: 18px 20px 14px;
              border-bottom: 2px solid #111827;
            }
            .letterhead h1 {
              margin: 0;
              font-size: 22px;
              letter-spacing: 1px;
              text-transform: uppercase;
            }
            .letterhead p {
              margin: 4px 0 0;
              font-size: 11px;
              color: #4b5563;
            }
            .bill-title {
              text-align: center;
              padding: 8px 0;
              border-bottom: 1px solid #111827;
              font-size: 15px;
              font-weight: bold;
              letter-spacing: 3px;
              text-transform: uppercase;
              background: #f3f4f6;
            }
            .meta-row {
              display: flex;
              border-bottom: 1px solid #111827;
            }
            .meta-col {
              flex: 1;
              padding: 12px 20px;
              font-size: 12px;
            }
            .meta-col + .meta-col {
              border-left: 1px solid #111827;
            }
            .meta-label {
              font-size: 10px;
              text-transform: uppercase;
              color: #6b7280;
              font-weight: bold;
              margin-bottom: 4px;
              letter-spacing: 0.5px;
            }
            .meta-value { font-size: 13px; font-weight: 600; }
            .meta-line { margin: 2px 0; font-size: 12px; }

            table.items { width: 100%; border-collapse: collapse; }
            table.items th {
              background: #111827;
              color: #fff;
              padding: 8px 10px;
              font-size: 11px;
              text-transform: uppercase;
              text-align: left;
              letter-spacing: 0.5px;
            }
            table.items th.center, table.items th.right { text-align: inherit; }
            .cell { padding: 8px 10px; border-bottom: 1px solid #d1d5db; font-size: 12px; }
            .center { text-align: center; }
            .right { text-align: right; }

            .totals-wrap {
              display: flex;
              border-top: 2px solid #111827;
            }
            .amount-words {
              flex: 1.4;
              padding: 14px 20px;
              border-right: 1px solid #111827;
              font-size: 11px;
            }
            .amount-words .label {
              font-size: 10px;
              text-transform: uppercase;
              color: #6b7280;
              font-weight: bold;
              margin-bottom: 4px;
            }
            .totals {
              flex: 1;
              padding: 0;
            }
            .totals table { width: 100%; border-collapse: collapse; }
            .totals td {
              padding: 6px 16px;
              font-size: 12px;
              border-bottom: 1px solid #e5e7eb;
            }
            .totals td:last-child { text-align: right; font-weight: 600; }
            .totals tr.grand td {
              border-top: 2px solid #111827;
              border-bottom: none;
              font-size: 14px;
              font-weight: bold;
              padding-top: 8px;
            }
            .totals tr.balance td { font-weight: bold; }

            .terms {
              padding: 14px 20px;
              border-top: 1px solid #111827;
              font-size: 10.5px;
              color: #374151;
            }
            .terms .label {
              font-size: 10px;
              text-transform: uppercase;
              color: #6b7280;
              font-weight: bold;
              margin-bottom: 4px;
            }

            .signatures {
              display: flex;
              justify-content: space-between;
              padding: 40px 30px 20px;
              border-top: 1px solid #111827;
            }
            .sig-box { text-align: center; width: 180px; }
            .sig-line { border-top: 1px solid #111827; margin-top: 40px; padding-top: 6px; font-size: 11px; }

            @media print {
              body { padding: 0; }
              .sheet { border: none; max-width: 100%; }
            }
          </style>
        </head>
        <body>
          <div class="sheet">
            <div class="letterhead">
              <h1>Factory Management System</h1>
              <p>Manufacturing &amp; Trading | Sales Invoice</p>
            </div>

            <div class="bill-title">Sales Invoice / Bill</div>

            <div class="meta-row">
              <div class="meta-col">
                <div class="meta-label">Bill To</div>
                <div class="meta-value">${data.client?.clientName || data.client?.name || "Walk-in Customer"}</div>
                ${data.client?.companyName ? `<div class="meta-line">${data.client.companyName}</div>` : ""}
                ${data.client?.phone ? `<div class="meta-line">Ph: ${data.client.phone}</div>` : ""}
                ${data.client?.address ? `<div class="meta-line">${data.client.address}</div>` : ""}
              </div>
              <div class="meta-col">
                <div class="meta-line"><strong>Invoice No:</strong> ${data.invoiceNumber || data._id}</div>
                <div class="meta-line"><strong>Date:</strong> ${formatDate(data.createdAt || data.invoiceDate)}</div>
                <div class="meta-line"><strong>Payment Method:</strong> ${data.paymentMethod || "Cash"}</div>
                <div class="meta-line"><strong>Payment Status:</strong> ${paymentStatusText}</div>
              </div>
            </div>

            <table class="items">
              <thead>
                <tr>
                  <th class="center" style="width:36px;">Sr#</th>
                  <th>Product Description</th>
                  <th class="center" style="width:70px;">Type</th>
                  <th class="center" style="width:60px;">Qty</th>
                  <th class="right" style="width:90px;">Rate</th>
                  <th class="right" style="width:100px;">Amount</th>
                </tr>
              </thead>
              <tbody>
                ${itemsRows}
              </tbody>
            </table>

            <div class="totals-wrap">
              <div class="amount-words">
                <div class="label">Amount In Words</div>
                ${amountInWords(data.grandTotal)}
              </div>
              <div class="totals">
                <table>
                  <tr><td>Subtotal</td><td>Rs. ${Number(data.subtotal || 0).toLocaleString()}</td></tr>
                  ${data.taxRate ? `<tr><td>Tax (${data.taxRate}%)</td><td>Rs. ${Number(data.tax || 0).toLocaleString()}</td></tr>` : ""}
                  ${
                    data.discountAmount || data.discount
                      ? `<tr><td>Discount</td><td>- Rs. ${Number(data.discountAmount || data.discount || 0).toLocaleString()}</td></tr>`
                      : ""
                  }
                  <tr class="grand"><td>Grand Total</td><td>Rs. ${Number(data.grandTotal || 0).toLocaleString()}</td></tr>
                  <tr><td>Paid Amount</td><td>Rs. ${Number(data.paidAmount || 0).toLocaleString()}</td></tr>
                  <tr class="balance"><td>Balance Due</td><td>Rs. ${balanceDue.toLocaleString()}</td></tr>
                </table>
              </div>
            </div>

            ${
              data.notes
                ? `<div class="terms"><div class="label">Notes</div>${data.notes}</div>`
                : ""
            }

            <div class="terms">
              <div class="label">Terms &amp; Conditions</div>
              1. Goods once sold will not be taken back or exchanged.<br/>
              2. Payment is due as per agreed terms; late payments may incur additional charges.<br/>
              3. Please verify quantity and quality at the time of delivery.
            </div>

            <div class="signatures">
              <div class="sig-box">
                <div class="sig-line">Prepared By</div>
              </div>
              <div class="sig-box">
                <div class="sig-line">Authorized Signature</div>
              </div>
              <div class="sig-box">
                <div class="sig-line">Received By</div>
              </div>
            </div>
          </div>
        </body>
      </html>
    `);

    printWindow.document.close();
    printWindow.focus();
    setTimeout(() => {
      printWindow.print();
    }, 400);
  };

  useEffect(() => {
    if (isModalOpen && autoPrint) {
      handlePrint();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isModalOpen, autoPrint]);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 overflow-y-auto">
      <div className="bg-white w-full max-w-3xl rounded-lg shadow-2xl border-2 border-slate-900 overflow-hidden my-8">

        {/* Modal chrome (on-screen only, not printed) */}
        <div className="flex items-center justify-between px-6 py-3 bg-slate-900 text-white">
          <div className="flex items-center gap-3">
            <FileText className="w-5 h-5" />
            <div>
              <h2 className="text-base font-bold">Invoice #{data.invoiceNumber || data._id?.slice(-8)}</h2>
              <p className="text-xs text-slate-300">Sales Invoice / Bill</p>
            </div>
          </div>
          <button onClick={onClose} className="p-1.5 rounded hover:bg-white/10 transition cursor-pointer">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Bill body — styled to mirror the printed layout */}
        <div className="p-0 max-h-[75vh] overflow-y-auto">
          <div className="text-center py-4 border-b-2 border-slate-900">
            <h1 className="text-xl font-bold uppercase tracking-wide text-slate-900">
              Factory Management System
            </h1>
            <p className="text-xs text-slate-500 mt-1">Manufacturing &amp; Trading | Sales Invoice</p>
          </div>

          <div className="text-center py-2 border-b border-slate-900 bg-slate-100 text-sm font-bold uppercase tracking-widest">
            Sales Invoice / Bill
          </div>

          <div className="flex border-b border-slate-900">
            <div className="flex-1 p-4 text-sm border-r border-slate-900">
              <p className="text-[10px] uppercase font-bold text-slate-500 mb-1">Bill To</p>
              <p className="font-semibold text-slate-900">
                {data.client?.clientName || data.client?.name || "Walk-in Customer"}
              </p>
              {data.client?.companyName && <p className="text-xs text-slate-600">{data.client.companyName}</p>}
              {data.client?.phone && <p className="text-xs text-slate-600">Ph: {data.client.phone}</p>}
              {data.client?.address && <p className="text-xs text-slate-600">{data.client.address}</p>}
            </div>
            <div className="flex-1 p-4 text-xs space-y-1">
              <p><strong>Invoice No:</strong> {data.invoiceNumber || data._id}</p>
              <p><strong>Date:</strong> {formatDate(data.createdAt || data.invoiceDate)}</p>
              <p><strong>Payment Method:</strong> {data.paymentMethod || "Cash"}</p>
              <p><strong>Payment Status:</strong> {paymentStatusText}</p>
            </div>
          </div>

          <table className="w-full text-sm">
            <thead>
              <tr className="bg-slate-900 text-white text-xs uppercase">
                <th className="p-2 w-10 text-center">Sr#</th>
                <th className="p-2 text-left">Product Description</th>
                <th className="p-2 w-20 text-center">Type</th>
                <th className="p-2 w-16 text-center">Qty</th>
                <th className="p-2 w-24 text-right">Rate</th>
                <th className="p-2 w-28 text-right">Amount</th>
              </tr>
            </thead>
            <tbody>
              {data.items?.length > 0 ? (
                data.items.map((item, idx) => (
                  <tr key={idx} className="border-b border-slate-200">
                    <td className="p-2 text-center text-slate-600">{idx + 1}</td>
                    <td className="p-2 font-medium text-slate-900">
                      {item.productName || item.product?.name || "Product"}
                    </td>
                    <td className="p-2 text-center text-slate-600">{item.stockType || "Local"}</td>
                    <td className="p-2 text-center text-slate-600">{item.quantity || 0}</td>
                    <td className="p-2 text-right text-slate-600">
                      {Number(item.rate || item.unitPrice || 0).toLocaleString()}
                    </td>
                    <td className="p-2 text-right font-semibold text-slate-900">
                      {Number(item.amount || item.totalPrice || 0).toLocaleString()}
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="6" className="p-4 text-center text-slate-400 italic">
                    No items attached to this invoice
                  </td>
                </tr>
              )}
            </tbody>
          </table>

          <div className="flex border-t-2 border-slate-900">
            <div className="flex-[1.4] p-4 border-r border-slate-900 text-xs">
              <p className="text-[10px] uppercase font-bold text-slate-500 mb-1">Amount In Words</p>
              <p className="text-slate-800">{amountInWords(data.grandTotal)}</p>
            </div>
            <div className="flex-1 text-sm">
              <table className="w-full">
                <tbody>
                  <tr className="border-b border-slate-200">
                    <td className="p-2 px-4">Subtotal</td>
                    <td className="p-2 px-4 text-right font-medium">
                      Rs. {Number(data.subtotal || 0).toLocaleString()}
                    </td>
                  </tr>
                  {Number(data.taxRate) > 0 && (
                    <tr className="border-b border-slate-200">
                      <td className="p-2 px-4">Tax ({data.taxRate}%)</td>
                      <td className="p-2 px-4 text-right font-medium">
                        Rs. {Number(data.tax || 0).toLocaleString()}
                      </td>
                    </tr>
                  )}
                  {Number(data.discountAmount || data.discount) > 0 && (
                    <tr className="border-b border-slate-200">
                      <td className="p-2 px-4">Discount</td>
                      <td className="p-2 px-4 text-right font-medium">
                        - Rs. {Number(data.discountAmount || data.discount || 0).toLocaleString()}
                      </td>
                    </tr>
                  )}
                  <tr className="border-t-2 border-slate-900">
                    <td className="p-2 px-4 pt-3 font-bold">Grand Total</td>
                    <td className="p-2 px-4 pt-3 text-right font-bold">
                      Rs. {Number(data.grandTotal || 0).toLocaleString()}
                    </td>
                  </tr>
                  <tr className="border-b border-slate-200">
                    <td className="p-2 px-4">Paid Amount</td>
                    <td className="p-2 px-4 text-right font-medium">
                      Rs. {Number(data.paidAmount || 0).toLocaleString()}
                    </td>
                  </tr>
                  <tr>
                    <td className="p-2 px-4 font-bold">Balance Due</td>
                    <td className="p-2 px-4 text-right font-bold">Rs. {balanceDue.toLocaleString()}</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>

          {data.notes && (
            <div className="p-4 border-t border-slate-900 text-xs text-slate-700">
              <p className="text-[10px] uppercase font-bold text-slate-500 mb-1">Notes</p>
              {data.notes}
            </div>
          )}

          <div className="p-4 border-t border-slate-900 text-[11px] text-slate-600">
            <p className="text-[10px] uppercase font-bold text-slate-500 mb-1">Terms &amp; Conditions</p>
            1. Goods once sold will not be taken back or exchanged.<br />
            2. Payment is due as per agreed terms; late payments may incur additional charges.<br />
            3. Please verify quantity and quality at the time of delivery.
          </div>
        </div>

        {/* Footer Actions */}
        <div className="flex items-center justify-end gap-3 px-6 py-3 bg-slate-100 border-t border-slate-900">
          <button
            onClick={onClose}
            className="px-4 py-2 text-sm font-medium text-slate-600 hover:bg-slate-200 rounded-lg transition cursor-pointer"
          >
            Close
          </button>
          <button
            onClick={handlePrint}
            className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-white bg-slate-900 hover:bg-slate-800 rounded-lg shadow-sm transition cursor-pointer"
          >
            <Printer className="w-4 h-4" /> Print Invoice
          </button>
        </div>
      </div>
    </div>
  );
};

export default InvoiceModal;