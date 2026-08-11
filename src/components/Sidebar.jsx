import React from "react";
import { useNavigate, NavLink } from "react-router-dom";
import { logoutUser } from "../services/authService";

import {
  LayoutDashboard,
  CalendarCheck,
  History,
  Users,
  Wallet,
  Package,
  Boxes,
  ShoppingCart,
  ShoppingBag,
  FileBarChart2,
  Truck,
  LogOut,
  X,
  Menu,
} from "lucide-react";

const menus = [
  { name: "Dashboard", icon: LayoutDashboard, path: "/dashboard" },
  { name: "Attendance", icon: CalendarCheck, path: "/attendance" },
  { name: "Attendance History", icon: History, path: "/attendance-history" },
  { name: "Labour", icon: Users, path: "/labour" },
  { name: "Payments", icon: Wallet, path: "/payments" },
  { name: "Products", icon: Package, path: "/products" },
  { name: "Clients", icon: Users, path: "/clients" },
  { name: "Vendors", icon: Truck, path: "/vendors" },
  {
    name: "Profit & Expenses",
    icon: FileBarChart2,
    path: "/expenses",
  },
  {
    name: "Purchase",
    icon: ShoppingBag,
    path: "/purchase",
  },
  {
    name: "Stock",
    icon: Boxes,
    path: "/stock",
  },
  // { name: "Production", icon: Factory, path: "/production" },
  {
    name: "Sales",
    icon: ShoppingCart,
    path: "/sales",
  },
  {
    name: "Reports",
    icon: FileBarChart2,
    path: "/reports",
  },
];

function Sidebar({ isOpen, setIsOpen }) {
  const navigate = useNavigate();

  // ============================================================
  // MOBILE / TABLET NAVIGATION
  // ============================================================
  // When user selects any menu item on small screens:
  // 1. Navigate to that page
  // 2. Automatically close sidebar
  //
  // Desktop behavior remains unchanged.
  // ============================================================

  const handleNavLinkClick = () => {
    if (window.innerWidth < 1024) {
      setIsOpen(false);
    }
  };

  // ============================================================
  // LOGOUT
  // ============================================================

  const handleLogout = async () => {
    try {
      await logoutUser();
      localStorage.clear();
      navigate("/");
    } catch (error) {
      console.error("Logout failed:", error);
    }
  };

  return (
    <>
      {/* ========================================================
          MOBILE BACKDROP
      ======================================================== */}

      {isOpen && (
        <div
          className="fixed inset-0 z-40 bg-slate-900/30 backdrop-blur-xs lg:hidden"
          onClick={() => setIsOpen(false)}
        />
      )}

      {/* ========================================================
          SIDEBAR
      ======================================================== */}

      <aside
        className={`fixed top-0 left-0 z-50 flex h-screen flex-col overflow-hidden border-r border-slate-200 bg-white shadow-xs transition-all duration-300 ease-in-out ${
          isOpen
            ? "w-72 translate-x-0"
            : "-translate-x-full lg:translate-x-0 lg:w-20"
        }`}
      >
        {/* ======================================================
            HEADER
        ======================================================= */}

        <div className="flex h-20 shrink-0 items-center justify-between overflow-hidden border-b border-slate-200 px-5">
          <div
            className={`overflow-hidden transition-all duration-300 ${
              isOpen
                ? "w-auto opacity-100"
                : "w-0 opacity-0"
            }`}
          >
            <h2 className="whitespace-nowrap text-lg font-bold text-slate-900">
              Factory ERP
            </h2>

            <p className="whitespace-nowrap text-xs text-slate-400">
              Management System
            </p>
          </div>

          <button
            type="button"
            onClick={() => setIsOpen(!isOpen)}
            className="shrink-0 cursor-pointer rounded-lg p-1.5 text-slate-500 transition-colors hover:bg-slate-100"
            aria-label={isOpen ? "Close sidebar" : "Open sidebar"}
          >
            {isOpen ? <X size={20} /> : <Menu size={20} />}
          </button>
        </div>

        {/* ======================================================
            NAVIGATION
        ======================================================= */}

        <nav className="flex-1 overflow-y-auto overflow-x-hidden px-3 py-6">
          <div className="space-y-1.5">
            {menus.map((item) => {
              const Icon = item.icon;

              return (
                <NavLink
                  key={item.name}
                  to={item.path}
                  onClick={handleNavLinkClick}
                  className={({ isActive }) =>
                    `group relative flex items-center rounded-xl px-4 py-3 font-medium transition-all duration-200 ${
                      isActive
                        ? "bg-[#1E3A8A] text-white shadow-xs"
                        : "text-slate-600 hover:bg-slate-50"
                    }`
                  }
                >
                  <Icon size={20} className="shrink-0" />

                  <span
                    className={`ml-4 inline-block overflow-hidden whitespace-nowrap transition-all duration-300 ${
                      isOpen
                        ? "w-auto opacity-100"
                        : "w-0 opacity-0"
                    }`}
                  >
                    {item.name}
                  </span>

                  {/* Desktop collapsed sidebar tooltip */}
                  {!isOpen && (
                    <div className="invisible absolute left-full z-50 ml-4 hidden whitespace-nowrap rounded-md bg-slate-900 px-2.5 py-1.5 text-xs font-semibold text-white opacity-0 shadow-sm transition-all duration-200 group-hover:visible group-hover:opacity-100 lg:block">
                      {item.name}
                    </div>
                  )}
                </NavLink>
              );
            })}
          </div>
        </nav>

        {/* ======================================================
            LOGOUT
        ======================================================= */}

        <div className="shrink-0 overflow-hidden border-t border-slate-200 p-3">
          <button
            type="button"
            onClick={handleLogout}
            className="group relative flex w-full cursor-pointer items-center rounded-xl px-4 py-3 font-medium text-red-500 transition-colors hover:bg-red-50"
          >
            <LogOut size={20} className="shrink-0" />

            <span
              className={`ml-4 inline-block overflow-hidden whitespace-nowrap transition-all duration-300 ${
                isOpen
                  ? "w-auto opacity-100"
                  : "w-0 opacity-0"
              }`}
            >
              Logout
            </span>

            {/* Desktop collapsed sidebar tooltip */}
            {!isOpen && (
              <div className="invisible absolute left-full z-50 ml-4 hidden whitespace-nowrap rounded-md bg-red-600 px-2.5 py-1.5 text-xs font-semibold text-white opacity-0 shadow-sm transition-all duration-200 group-hover:visible group-hover:opacity-100 lg:block">
                Logout
              </div>
            )}
          </button>
        </div>
      </aside>
    </>
  );
}

export default Sidebar;