// import { useState, useEffect } from "react";
// import toast from "react-hot-toast";

// import Sidebar from "../components/Sidebar";
// import Navbar from "../components/Navbar";

// import AttendanceHero from "../components/dashboard/AttendanceHero";
// import StatsSection from "../components/dashboard/StatsSection";
// import RevenueChart from "../components/dashboard/RevenueChart";
// import TodaySummary from "../components/dashboard/TodaySummary";
// import LowStock from "../components/dashboard/LowStock";
// import RecentActivity from "../components/dashboard/RecentActivities";

// import { getDashboard } from "../services/dashboardService";

// function Dashboard() {
//   const [isSidebarOpen, setIsSidebarOpen] = useState(true);

//   const [dashboard, setDashboard] = useState(null);
//   const [loading, setLoading] = useState(true);

//   const loadDashboard = async () => {
//     try {
//       const data = await getDashboard();
//       setDashboard(data);
//     } catch (error) {
//       toast.error("Failed to load dashboard");
//     } finally {
//       setLoading(false);
//     }
//   };

//   useEffect(() => {
//     loadDashboard();
//   }, []);

//   if (loading) {
//     return (
//       <div className="flex items-center justify-center h-screen bg-slate-100">
//         <h2 className="text-xl font-semibold text-slate-700">
//           Loading Dashboard...
//         </h2>
//       </div>
//     );
//   }

//   return (
//     <div className="min-h-screen bg-slate-100 flex overflow-x-hidden">
//       <Sidebar
//         isOpen={isSidebarOpen}
//         setIsOpen={setIsSidebarOpen}
//       />

//       <div
//         className={`flex-1 min-w-0 transition-all duration-300 ease-in-out ${
//           isSidebarOpen ? "ml-0 lg:ml-72" : "ml-0 lg:ml-20"
//         }`}
//       >
//         <Navbar
//           isSidebarOpen={isSidebarOpen}
//           setIsSidebarOpen={setIsSidebarOpen}
//         />

//         <main className="p-4 md:p-6 lg:p-8 space-y-6 max-w-[1600px] mx-auto mt-24">
//           {/* Hero */}
//           <AttendanceHero dashboard={dashboard} />

//           {/* Stats */}
//           <StatsSection dashboard={dashboard} />

        
//           {/* Low Stock + Activity */}
//           <section className="grid grid-cols-1 lg:grid-cols-2 gap-6">
//             <div className="w-full">
//               <LowStock dashboard={dashboard} />
//             </div>

//             <div className="w-full">
//               <RecentActivity dashboard={dashboard} />
//             </div>
//           </section>
//         </main>
//       </div>
//     </div>
//   );
// }

// export default Dashboard;



import { useState, useEffect } from "react";
import toast from "react-hot-toast";

import Sidebar from "../components/Sidebar";
import Navbar from "../components/Navbar";

import AttendanceHero from "../components/dashboard/AttendanceHero";
import StatsSection from "../components/dashboard/StatsSection";
import RevenueChart from "../components/dashboard/RevenueChart";
import LowStock from "../components/dashboard/LowStock";
import RecentActivity from "../components/dashboard/RecentActivities";

import { getDashboard } from "../services/dashboardService";

function Dashboard() {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);

  const [dashboard, setDashboard] = useState(null);
  const [loading, setLoading] = useState(true);

  const loadDashboard = async () => {
    try {
      const data = await getDashboard();
      setDashboard(data);
    } catch (error) {
      toast.error("Failed to load dashboard");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadDashboard();
  }, []);

  if (loading) {
    return (
      <div className="flex h-screen items-center justify-center bg-slate-100">
        <h2 className="text-xl font-semibold text-slate-700">
          Loading Dashboard...
        </h2>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen overflow-x-hidden bg-slate-100">
      <Sidebar
        isOpen={isSidebarOpen}
        setIsOpen={setIsSidebarOpen}
      />

      <div
        className={`flex-1 min-w-0 transition-all duration-300 ${
          isSidebarOpen ? "ml-0 lg:ml-72" : "ml-0 lg:ml-20"
        }`}
      >
        <Navbar
          isSidebarOpen={isSidebarOpen}
          setIsSidebarOpen={setIsSidebarOpen}
        />

        <main className="mx-auto mt-24 max-w-[1600px] space-y-6 p-4 md:p-6 lg:p-8">
          {/* Hero */}
          <AttendanceHero dashboard={dashboard} />

          {/* Stats */}
          <StatsSection dashboard={dashboard} />

          {/* Dashboard Layout */}
          <section className="grid grid-cols-1 lg:grid-cols-2 gap-6 items-start">
            {/* Left Side */}
            <div className="space-y-6">
              <LowStock dashboard={dashboard} />

              <RevenueChart dashboard={dashboard} />
            </div>

            {/* Right Side */}
            <div>
              <RecentActivity dashboard={dashboard} />
            </div>
          </section>
        </main>
      </div>
    </div>
  );
}

export default Dashboard;