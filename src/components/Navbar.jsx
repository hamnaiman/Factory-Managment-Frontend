import { useState, useEffect, useRef, useCallback } from "react";
import { Search, Bell, Menu, AlertTriangle, Info, PackageX } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { getNotifications } from "../services/notificationService";

const POLL_INTERVAL_MS = 60000; // refresh every 60s

const NOTIFICATION_ICONS = {
  low_stock: PackageX,
  client_balance: Info,
  labour_balance: Info,
};

function Navbar({ isSidebarOpen, setIsSidebarOpen }) {
  const navigate = useNavigate();
  const dropdownRef = useRef(null);

  const [isOpen, setIsOpen] = useState(false);
  const [notifications, setNotifications] = useState([]);
  const [count, setCount] = useState(0);
  const [hasCritical, setHasCritical] = useState(false);
  const [loading, setLoading] = useState(false);

  const loadNotifications = useCallback(async () => {
    try {
      setLoading(true);
      const data = await getNotifications();
      setNotifications(data?.notifications || []);
      setCount(data?.count || 0);
      setHasCritical(data?.hasCritical || false);
    } catch (error) {
      console.error("Failed to load notifications:", error);
    } finally {
      setLoading(false);
    }
  }, []);

  // Load on mount + poll periodically
  useEffect(() => {
    loadNotifications();
    const interval = setInterval(loadNotifications, POLL_INTERVAL_MS);
    return () => clearInterval(interval);
  }, [loadNotifications]);

  // Close dropdown on outside click
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleBellClick = () => {
    setIsOpen((prev) => !prev);
    if (!isOpen) loadNotifications(); // fresh data every time it's opened
  };

  const handleNotificationClick = (notification) => {
    setIsOpen(false);
    if (notification.link) navigate(notification.link);
  };

  return (
    <header
      className={`fixed top-0 right-0 z-30 flex h-20 items-center justify-between border-b border-slate-200 bg-white px-6 shadow-xs transition-all duration-300 ease-in-out left-0
      ${isSidebarOpen ? "lg:left-72" : "lg:left-20"}`}
    >
      {/* Left Area: Hamburger Menu & Title */}
      <div className="flex items-center gap-4">
        {/* Mobile Hamburger - Only visible on small screens since desktop has sidebar button */}
        <button
          className="rounded-lg p-1.5 text-slate-500 hover:bg-slate-100 transition-colors lg:hidden"
          onClick={() => setIsSidebarOpen(true)}
        >
          <Menu size={22} />
        </button>

        <div>
          <h1 className="text-xl font-bold text-slate-900">Dashboard</h1>
          <p className="text-xs text-slate-500">Admin</p>
        </div>
      </div>

    

      {/* Right Area: Actions & Profile */}
      <div className="flex items-center gap-4">
        {/* Date Display */}
        <div className="hidden text-sm font-medium text-slate-600 md:block">
          {new Date().toLocaleDateString('en-US', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' })}
        </div>
{/* Notification Bell */}
<div className="relative" ref={dropdownRef}>
  <button
    onClick={handleBellClick}
    className="relative rounded-xl border border-slate-200 p-2.5 text-slate-600 transition-colors hover:bg-slate-50"
  >
    <Bell size={18} />

    {count > 0 && (
      <span
        className={`absolute -right-1.5 -top-1.5 flex h-5 min-w-5 items-center justify-center rounded-full px-1 text-[10px] font-bold text-white ${
          hasCritical ? "bg-red-500" : "bg-amber-500"
        }`}
      >
        {count > 9 ? "9+" : count}
      </span>
    )}
  </button>

  {isOpen && (
  <div
  className="
    fixed left-2 right-2 top-[5.5rem] z-50
    w-auto max-w-none
    overflow-hidden
    rounded-2xl
    border border-slate-200
    bg-white
    shadow-xl

    sm:absolute sm:left-auto sm:right-0 sm:top-full
    sm:mt-2 sm:w-96
  "
>
      {/* Header */}
      <div className="flex items-center justify-between border-b border-slate-100 px-4 py-3">
        <h3 className="text-sm font-semibold text-slate-900">
          Notifications
        </h3>

        {count > 0 && (
          <span className="text-xs text-slate-500">
            {count} alert{count !== 1 ? "s" : ""}
          </span>
        )}
      </div>

      {/* Notifications */}
      <div className="max-h-[70vh] overflow-y-auto">
        {loading ? (
          <div className="flex items-center justify-center py-10 text-sm text-slate-400">
            Loading...
          </div>
        ) : notifications.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-10 text-center">
            <Bell
              size={28}
              className="mb-2 text-slate-300"
            />

            <p className="text-sm text-slate-500">
              No alerts right now
            </p>
          </div>
        ) : (
          <div className="divide-y divide-slate-100">
            {notifications.map((n) => {
              const Icon =
                NOTIFICATION_ICONS[n.type] ||
                AlertTriangle;

              const isCritical =
                n.severity === "critical";

              return (
                <button
                  key={n.id}
                  onClick={() =>
                    handleNotificationClick(n)
                  }
                  className="flex w-full items-start gap-3 px-4 py-3 text-left transition-colors hover:bg-slate-50"
                >
                  {/* Icon */}
                  <div
                    className={`flex h-9 w-9 flex-shrink-0 items-center justify-center rounded-xl ${
                      isCritical
                        ? "bg-red-100 text-red-600"
                        : "bg-amber-100 text-amber-600"
                    }`}
                  >
                    <Icon size={16} />
                  </div>

                  {/* Content */}
                  <div className="min-w-0 flex-1">
                    <p className="truncate text-sm font-semibold text-slate-900">
                      {n.title}
                    </p>

                    <p className="mt-0.5 line-clamp-2 text-xs text-slate-500">
                      {n.message}
                    </p>
                  </div>
                </button>
              );
            })}
          </div>
        )}
      </div>
    </div>
  )}
</div>

        {/* User Profile */}
        <div className="flex items-center gap-3 border-l border-slate-200 pl-4">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-blue-50 text-[#1E3A8A]">
            <span className="font-semibold text-sm">AD</span>
          </div>
          <div className="hidden text-left xl:block">
            <h4 className="text-sm font-semibold text-slate-900">Admin</h4>
            <p className="text-xs text-slate-500">Administrator</p>
          </div>
        </div>
      </div>
    </header>
  );
}

export default Navbar;