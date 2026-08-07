import { useEffect, useState, useMemo, useRef } from "react";
import { 
  Search, 
  Plus, 
  DollarSign, 
  CreditCard, 
  AlertCircle, 
  Loader2, 
  Mic, 
  MicOff 
} from "lucide-react";
import toast from "react-hot-toast";

import Sidebar from "../components/Sidebar";
import Navbar from "../components/Navbar";
import SaleTable from "../components/SaleTable";
import SaleModal from "../components/SaleModal";
import InvoiceModal from "../components/InvoiceModal";

import { getProducts } from "../services/productService";
import {
  getSales,
  createSale,
  updateSale,
  deleteSale,
} from "../services/saleService";

function Sales() {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [products, setProducts] = useState([]);
  const [sales, setSales] = useState([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);
  const [openModal, setOpenModal] = useState(false);
  const [editingSale, setEditingSale] = useState(null);

  // Invoice Modal States
  const [isInvoiceModalOpen, setIsInvoiceModalOpen] = useState(false);
  const [saleForInvoice, setSaleForInvoice] = useState(null);

  // Voice Command States
  const [isListening, setIsListening] = useState(false);
  const [transcript, setTranscript] = useState("");
  const recognitionRef = useRef(null);

  useEffect(() => {
    const SpeechRecognition =
      window.SpeechRecognition || window.webkitSpeechRecognition;

    if (SpeechRecognition) {
      const recognition = new SpeechRecognition();
      recognition.continuous = false;
      recognition.interimResults = true;
      recognition.lang = "en-US";

      recognition.onstart = () => setIsListening(true);

      recognition.onresult = (event) => {
        const currentTranscript = Array.from(event.results)
          .map((result) => result[0].transcript)
          .join("");
        
        setTranscript(currentTranscript);
        processVoiceCommand(currentTranscript.toLowerCase());
      };

      recognition.onerror = (event) => {
        console.error("Voice Recognition Error:", event.error);
        toast.error("Voice input error: " + event.error);
        setIsListening(false);
      };

      recognition.onend = () => {
        setIsListening(false);
      };

      recognitionRef.current = recognition;
    }
  }, []);

  const processVoiceCommand = (text) => {
    if (text.startsWith("search") || text.startsWith("find")) {
      const query = text.replace(/search|find/gi, "").trim();
      setSearch(query);
      return;
    }

    if (text.includes("clear search") || text.includes("reset search")) {
      setSearch("");
      return;
    }

    if (
      text.includes("new sale") || 
      text.includes("add sale") || 
      text.includes("create sale") ||
      text.includes("nayi sale")
    ) {
      setEditingSale(null);
      setOpenModal(true);
      toast.success("Opening New Sale Invoice Form...");
      return;
    }

    if (text.includes("close modal") || text.includes("cancel modal")) {
      setOpenModal(false);
      setIsInvoiceModalOpen(false);
      return;
    }
  };

  const toggleListening = () => {
    if (!recognitionRef.current) {
      toast.error("Voice Recognition is not supported in this browser.");
      return;
    }

    if (isListening) {
      recognitionRef.current.stop();
      setIsListening(false);
    } else {
      setTranscript("");
      recognitionRef.current.start();
    }
  };

  const loadSales = async () => {
    try {
      setLoading(true);
      const response = await getSales();
      const salesData = response.data?.data || response.data || [];
      setSales(Array.isArray(salesData) ? salesData : []);
    } catch (error) {
      console.error("❌ Failed to load sales:", error);
      setSales([]);
      toast.error("Failed to load sales history");
    } finally {
      setLoading(false);
    }
  };

  const loadProducts = async () => {
    try {
      const response = await getProducts();
      const productData = response.data?.data || response.data || [];
      setProducts(Array.isArray(productData) ? productData : []);
    } catch (error) {
      console.error("❌ Failed to load products:", error);
    }
  };

  useEffect(() => {
    loadSales();
    loadProducts();
  }, []);

  const summary = useMemo(() => {
    return sales.reduce(
      (acc, sale) => {
        const total = sale.grandTotal || 0;
        const paid = sale.paidAmount || 0;
        const due = sale.remainingBalance ?? sale.dueAmount ?? Math.max(0, total - paid);

        acc.totalSales += total;
        acc.totalCollected += paid;
        acc.totalPending += due;
        return acc;
      },
      { totalSales: 0, totalCollected: 0, totalPending: 0 }
    );
  }, [sales]);

  // 1. New Sale / Edit Form Submit (with Paid status protection)
  const handleSubmit = async (data) => {
    try {
      let savedSaleResponse;
      if (editingSale) {
        savedSaleResponse = await updateSale(editingSale._id, data);
        toast.success("Sale updated successfully!");
      } else {
        savedSaleResponse = await createSale(data);
        toast.success("New sale created successfully!");

        const createdData = savedSaleResponse?.data?.data || savedSaleResponse?.data || data;

        // 🛑 PROTECTION: Agar status Paid hai to Invoice Pop-up nahi khulega
        const isPaid = 
          createdData.paymentStatus === "Paid" || 
          createdData.status === "Paid" ||
          createdData.paidAmount >= createdData.grandTotal;

        if (!isPaid) {
          setSaleForInvoice(createdData);
          setIsInvoiceModalOpen(true);
        } else {
          toast.info("Sale recorded as Paid. No pending invoice generated.");
        }
      }

      setEditingSale(null);
      setOpenModal(false);
      loadSales();
    } catch (error) {
      console.error("Submit Sale Error:", error);
      toast.error(error?.response?.data?.message || "Error saving sale");
    }
  };

  const handleEdit = (sale) => {
    console.log("✏️ Editing Sale:", sale);
    setEditingSale(sale);
    setOpenModal(true);
  };

  // 2. Paid Sales par Print Invoice block karne ki logic
  const handlePrintInvoice = (saleOrId) => {
    const targetSale = typeof saleOrId === "object" 
      ? saleOrId 
      : sales.find((s) => s._id === saleOrId);

    if (!targetSale) {
      toast.error("Invoice details not found!");
      return;
    }

    // 🛑 PROTECTION: Agar Sale Fully PAID hai to Invoice modal open mat karo
    const isPaid = 
      targetSale.paymentStatus === "Paid" || 
      targetSale.status === "Paid" || 
      (targetSale.dueAmount === 0 && targetSale.grandTotal > 0);

    if (isPaid) {
      toast.info("This sale is fully Paid. Invoice generation is disabled for paid sales.");
      return;
    }

    setSaleForInvoice(targetSale);
    setIsInvoiceModalOpen(true);
  };

  // 3. Admin Quick "Mark As Paid" Action Handler
  const handleMarkAsPaid = async (sale) => {
    try {
      const saleId = sale._id;
      const totalAmount = sale.grandTotal || sale.subtotal || 0;

      await updateSale(saleId, {
        paymentStatus: "Paid",
        status: "Paid",
        paidAmount: totalAmount,
        dueAmount: 0,
        remainingBalance: 0,
      });

      toast.success("Payment status updated to Paid!");
      loadSales();
    } catch (error) {
      console.error("Failed to mark as paid:", error);
      toast.error("Could not update payment status.");
    }
  };

  const handleDelete = (id) => {
    toast.custom((t) => (
      <div className="w-[92vw] max-w-md rounded-2xl border border-slate-200 bg-white p-5 shadow-2xl sm:p-6">
        <div className="flex items-center gap-3">
          <div className="rounded-full bg-rose-100 p-2.5 text-rose-600">
            <AlertCircle size={22} />
          </div>
          <div>
            <h3 className="text-lg font-bold text-slate-900">
              Cancel / Delete Sale
            </h3>
            <p className="text-xs text-slate-500">Invoice ID: {id}</p>
          </div>
        </div>

        <p className="mt-3 text-sm text-slate-600">
          Are you sure you want to cancel or remove this invoice? Stock and balances will be adjusted accordingly.
        </p>

        <div className="mt-6 flex flex-col-reverse gap-2.5 sm:flex-row sm:justify-end">
          <button
            onClick={() => toast.dismiss(t.id)}
            className="h-10 w-full rounded-xl border border-slate-300 text-sm font-semibold text-slate-700 hover:bg-slate-50 transition sm:w-24"
          >
            Cancel
          </button>

          <button
            onClick={async () => {
              try {
                toast.dismiss(t.id);
                await deleteSale(id);
                toast.success("Sale record deleted successfully");
                loadSales();
              } catch (error) {
                console.error("❌ Delete Error:", error);
                toast.error(
                  error?.response?.data?.message || "Failed to delete sale"
                );
              }
            }}
            className="h-10 w-full rounded-xl bg-rose-600 text-sm font-semibold text-white hover:bg-rose-700 transition sm:w-28"
          >
            Confirm
          </button>
        </div>
      </div>
    ));
  };

  return (
    <div className="min-h-screen overflow-x-hidden bg-slate-100 flex">
      <Sidebar isOpen={isSidebarOpen} setIsOpen={setIsSidebarOpen} />

      <div
        className={`flex-1 min-w-0 transition-all duration-300 ease-in-out ${
          isSidebarOpen ? "ml-0 lg:ml-72" : "ml-0 lg:ml-20"
        }`}
      >
        <Navbar
          isSidebarOpen={isSidebarOpen}
          setIsSidebarOpen={setIsSidebarOpen}
        />

        <main className="mx-auto mt-24 max-w-[1600px] space-y-6 p-4 md:p-6 lg:p-8">
          <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
            <div>
              <h1 className="text-2xl font-bold text-slate-900 sm:text-3xl">
                Sales Management
              </h1>
              <p className="mt-1 text-sm text-slate-500">
                Track client billing, payment receipts, and overall revenue.
              </p>
            </div>

            <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
              <button
                type="button"
                onClick={toggleListening}
                className={`flex h-12 items-center justify-center gap-2 rounded-2xl px-5 text-sm font-semibold transition shadow-md ${
                  isListening
                    ? "bg-rose-600 text-white animate-pulse hover:bg-rose-700"
                    : "bg-amber-500 text-white hover:bg-amber-600 active:scale-[0.99]"
                }`}
              >
                {isListening ? <MicOff size={18} /> : <Mic size={18} />}
                <span>{isListening ? "Listening..." : "Voice Assistant"}</span>
              </button>

              <button
                onClick={() => {
                  setEditingSale(null);
                  setOpenModal(true);
                }}
                className="flex h-12 w-full items-center justify-center gap-2 rounded-2xl bg-[#1E3A8A] px-6 text-sm font-semibold text-white shadow-md hover:bg-[#17307A] active:scale-[0.99] transition sm:w-auto"
              >
                <Plus size={18} />
                New Sale Invoice
              </button>
            </div>
          </div>

          {isListening || transcript ? (
            <div className="flex items-center gap-3 rounded-2xl border border-amber-200 bg-amber-50/80 p-4 text-amber-900 shadow-xs">
              <div className="relative flex h-3 w-3">
                <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-amber-400 opacity-75"></span>
                <span className="relative inline-flex h-3 w-3 rounded-full bg-amber-500"></span>
              </div>
              <p className="text-sm font-medium">
                <span className="font-bold">Voice:</span>{" "}
                {transcript || "Listening for command... (e.g. 'Search John' or 'New sale')"}
              </p>
            </div>
          ) : null}

          <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
            <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-xs flex items-center gap-4">
              <div className="rounded-xl bg-blue-50 p-3 text-blue-600">
                <DollarSign size={24} />
              </div>
              <div>
                <p className="text-xs font-semibold uppercase tracking-wider text-slate-400">
                  Total Volume
                </p>
                <h4 className="text-xl font-bold text-slate-900">
                  Rs. {summary.totalSales.toLocaleString()}
                </h4>
              </div>
            </div>

            <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-xs flex items-center gap-4">
              <div className="rounded-xl bg-emerald-50 p-3 text-emerald-600">
                <CreditCard size={24} />
              </div>
              <div>
                <p className="text-xs font-semibold uppercase tracking-wider text-slate-400">
                  Collected Amount
                </p>
                <h4 className="text-xl font-bold text-emerald-600">
                  Rs. {summary.totalCollected.toLocaleString()}
                </h4>
              </div>
            </div>

            <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-xs flex items-center gap-4">
              <div className="rounded-xl bg-rose-50 p-3 text-rose-600">
                <AlertCircle size={24} />
              </div>
              <div>
                <p className="text-xs font-semibold uppercase tracking-wider text-slate-400">
                  Pending Receivables
                </p>
                <h4 className="text-xl font-bold text-rose-600">
                  Rs. {summary.totalPending.toLocaleString()}
                </h4>
              </div>
            </div>
          </div>

          <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-xs flex items-center justify-between gap-4">
            <div className="relative w-full md:max-w-md">
              <Search
                size={18}
                className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400"
              />
              <input
                type="text"
                placeholder="Search by Invoice # or Client Name... (or say 'Search [Name]')"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="h-11 w-full rounded-xl border border-slate-200 pl-11 pr-4 text-sm focus:border-[#1E3A8A] focus:outline-none transition"
              />
            </div>
          </div>

          {loading ? (
            <div className="flex h-64 w-full items-center justify-center rounded-3xl border border-slate-200 bg-white">
              <div className="flex flex-col items-center gap-2 text-slate-500">
                <Loader2 className="animate-spin text-[#1E3A8A]" size={32} />
                <p className="text-sm font-medium">Fetching sales records...</p>
              </div>
            </div>
          ) : (
            <SaleTable
              sales={sales}
              search={search}
              onEdit={handleEdit}
              onDelete={handleDelete}
              onPrintInvoice={handlePrintInvoice}
              onMarkAsPaid={handleMarkAsPaid}
            />
          )}
        </main>
      </div>

      <SaleModal
        open={openModal}
        onClose={() => {
          setOpenModal(false);
          setEditingSale(null);
        }}
        onSubmit={handleSubmit}
        initialData={editingSale}
        products={products}
      />

      {isInvoiceModalOpen && saleForInvoice && (
        <InvoiceModal
          open={isInvoiceModalOpen}
          sale={saleForInvoice}
          saleData={saleForInvoice}
          onClose={() => {
            setIsInvoiceModalOpen(false);
            setSaleForInvoice(null);
          }}
        />
      )}
    </div>
  );
}

export default Sales;