import React from "react";
import { useNavigate, NavLink } from "react-router-dom";
// 1. Apni API Service se logoutUser import karein
import { logoutUser } from "../services/authService"; // <-- Apna correct relative path dein

import {
  LayoutDashboard,
  CalendarCheck,
  History,
  Users,
  Wallet,
  Package,
  Boxes,
  Factory,
  ShoppingCart,
  FileBarChart2,
  LogOut,
  X,
  Menu
} from "lucide-react";

const menus = [
  { name: "Dashboard", icon: LayoutDashboard, path: "/dashboard" },
  { name: "Attendance", icon: CalendarCheck, path: "/attendance" },
  { name: "Attendance History", icon: History, path: "/attendance-history" },
  { name: "Labour", icon: Users, path: "/labour" },
  { name: "Payments", icon: Wallet, path: "/payments" },
  { name: "Products", icon: Package, path: "/products" },
  { name: "Clients", icon: Users, path: "/clients" },
  { name: "Stock", icon: Boxes, path: "/stock" },
  { name: "Production", icon: Factory, path: "/production" },
  { name: "Sales", icon: ShoppingCart, path: "/sales" },
  { name: "Reports", icon: FileBarChart2, path: "/reports" },
];

function Sidebar({ isOpen, setIsOpen }) {
  const navigate = useNavigate();

  const handleNavLinkClick = () => {
    if (window.innerWidth < 1024) {
      setIsOpen(false);
    }
  };

  // 2. Updated Clean Logout Handler
  const handleLogout = async () => {
    try {
      await logoutUser(); // Call your centralized API service

      // Token / Auth state clear karein
      localStorage.clear();

      // Login route par bhej dein
      navigate("/");
    } catch (error) {
      console.error("Logout failed:", error);
    }
  };

  return (
    <>
      {/* Mobile Backdrop Overlay */}
      {isOpen && (
        <div
          className="fixed inset-0 z-40 bg-slate-900/30 backdrop-blur-xs lg:hidden"
          onClick={() => setIsOpen(false)}
        />
      )}

      {/* Sidebar Layout Container */}
      <aside
        className={`fixed top-0 left-0 z-50 flex h-screen flex-col border-r border-slate-200 bg-white shadow-xs transition-all duration-300 ease-in-out overflow-hidden
        ${isOpen ? "w-72 translate-x-0" : "-translate-x-full lg:translate-x-0 lg:w-20"}`}
      >
        {/* Header Section */}
        <div className="flex h-20 shrink-0 items-center justify-between px-5 border-b border-slate-200 overflow-hidden">
          <div className={`transition-all duration-300 overflow-hidden ${isOpen ? "w-auto opacity-100" : "w-0 opacity-0"}`}>
            <h2 className="text-lg font-bold text-slate-900 whitespace-nowrap">Factory ERP</h2>
            <p className="text-xs text-slate-400 whitespace-nowrap">Management System</p>
          </div>

          <button
            className="rounded-lg p-1.5 text-slate-500 hover:bg-slate-100 transition-colors cursor-pointer shrink-0"
            onClick={() => setIsOpen(!isOpen)}
          >
            {isOpen ? <X size={20} /> : <Menu size={20} />}
          </button>
        </div>

        {/* Navigation Section */}
        <nav className="flex-1 overflow-y-auto px-3 py-6 overflow-x-hidden">
          <div className="space-y-1.5">
            {menus.map((item) => {
              const Icon = item.icon;
              return (
                <NavLink
                  key={item.name}
                  to={item.path}
                  onClick={handleNavLinkClick}
                  className={({ isActive }) =>
                    `flex items-center rounded-xl px-4 py-3 font-medium transition-all duration-200 group relative
                    ${isActive ? "bg-[#1E3A8A] text-white shadow-xs" : "text-slate-600 hover:bg-slate-50"}`
                  }
                >
                  <Icon size={20} className="shrink-0" />
                  <span className={`transition-all duration-300 ml-4 whitespace-nowrap inline-block overflow-hidden
                    ${isOpen ? "w-auto opacity-100" : "w-0 opacity-0"}`}>
                    {item.name}
                  </span>

                  {!isOpen && (
                    <div className="hidden lg:block absolute left-full ml-4 rounded-md bg-slate-900 px-2.5 py-1.5 text-xs font-semibold text-white opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 z-50 shadow-sm whitespace-nowrap">
                      {item.name}
                    </div>
                  )}
                </NavLink>
              );
            })}
          </div>
        </nav>

        {/* Logout Button with onClick */}
        <div className="border-t border-slate-200 p-3 shrink-0 overflow-hidden">
          <button 
            onClick={handleLogout}
            className="flex items-center w-full rounded-xl px-4 py-3 font-medium text-red-500 hover:bg-red-50 transition-colors cursor-pointer group relative"
          >
            <LogOut size={20} className="shrink-0" />
            
            <span className={`transition-all duration-300 ml-4 whitespace-nowrap inline-block overflow-hidden
              ${isOpen ? "w-auto opacity-100" : "w-0 opacity-0"}`}>
              Logout
            </span>
            
            {!isOpen && (
              <div className="hidden lg:block absolute left-full ml-4 rounded-md bg-red-600 px-2.5 py-1.5 text-xs font-semibold text-white opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 z-50 shadow-sm whitespace-nowrap">
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