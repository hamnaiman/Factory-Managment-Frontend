import { useEffect, useState } from "react";
import toast from "react-hot-toast";

import Sidebar from "../components/Sidebar";
import Navbar from "../components/Navbar";
import AttendanceTable from "../components/AttendanceTable";
import AttendanceSummary from "../components/AttendanceSummary";

import {
  Search,
} from "lucide-react";

import { getLabours } from "../services/labourService";
import { markAttendance, getTodayAttendance } from "../services/attendanceService";

function Attendance() {
  // Desktop standard fixed layout state - starts open by default
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);

  const [workers, setWorkers] = useState([]);
  const [attendance, setAttendance] = useState([]);
  const [search, setSearch] = useState("");
  const [attendanceSaved, setAttendanceSaved] = useState(false);

  const loadWorkers = async () => {
    try {
      const response = await getLabours();
      setWorkers(response.data.data);
    } catch (error) {
      toast.error("Failed to load workers");
    }
  };

  const checkTodayAttendance = async () => {
    try {
      const response = await getTodayAttendance();

      if (response.data.data.length > 0) {
        const formattedAttendance = response.data.data.map((item) => ({
          worker: item.worker._id,
          status: item.status,
        }));

        setAttendance(formattedAttendance);
        setAttendanceSaved(true);
      } else {
        setAttendanceSaved(false);
      }
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    loadWorkers();
    checkTodayAttendance();
  }, []);

  const handleStatusChange = (workerId, status) => {
    setAttendance((prev) => {
      const filtered = prev.filter((item) => item.worker !== workerId);
      return [
        ...filtered,
        {
          worker: workerId,
          status,
        },
      ];
    });
  };

  const handleSaveAttendance = async () => {
    try {
      console.log("Attendance Data =>", attendance);
      const response = await markAttendance(attendance);
      console.log(response.data);
      toast.success("Attendance saved successfully");
      await checkTodayAttendance();
    } catch (error) {
      console.log(error.response?.data);
    }
  };

  return (
    <div className="min-h-screen overflow-x-hidden bg-slate-100 flex">
      {/* Sidebar Component */}
      <Sidebar
        isOpen={isSidebarOpen}
        setIsOpen={setIsSidebarOpen}
      />

      {/* Main Content Area - Fixed dynamic margin to match the new dynamic layout */}
      <div 
        className={`flex-1 min-w-0 transition-all duration-300 ease-in-out
        ${isSidebarOpen ? "ml-0 lg:ml-72" : "ml-0 lg:ml-20"}`}
      >
        {/* Fixed Navbar with current layout synchronization state */}
        <Navbar
          isSidebarOpen={isSidebarOpen}
          setIsSidebarOpen={setIsSidebarOpen}
        />

        {/* Page Content area shifted via mt-24 away from navbar */}
        <main className="p-4 md:p-6 lg:p-8 space-y-6 max-w-[1600px] mx-auto mt-24">
          
          {/* Header */}
          <div>
            <h1 className="text-2xl font-bold leading-tight text-slate-900 sm:text-3xl">
              Attendance
            </h1>
            <p className="mt-1 text-sm text-slate-500">
              Mark today's workers attendance.
            </p>
          </div>

          {/* Toolbar */}
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
                  placeholder="Search Worker..."
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  className="h-12 w-full rounded-xl border border-slate-300 pl-11 pr-4 text-sm outline-hidden transition focus:border-[#1E3A8A]"
                />
              </div>
            </div>
          </div>

          {/* Attendance Table */}
          <div className="w-full overflow-x-auto bg-white rounded-3xl border border-slate-200 shadow-xs">
            <AttendanceTable
              workers={workers}
              attendance={attendance}
              search={search}
              onStatusChange={handleStatusChange}
            />
          </div>

          {/* Save Button */}
          <div className="flex justify-stretch sm:justify-end">
            <button
              onClick={handleSaveAttendance}
              className="h-12 w-full rounded-2xl bg-[#1E3A8A] px-8 font-semibold text-white transition hover:bg-[#17307A] sm:w-auto cursor-pointer"
            >
              Save Attendance
            </button>
          </div>

          {/* Summary */}
          {attendanceSaved && (
            <div className="mt-8">
              <AttendanceSummary
                workers={workers}
                attendance={attendance}
              />
            </div>
          )}
        </main>
      </div>
    </div>
  );
}

export default Attendance;