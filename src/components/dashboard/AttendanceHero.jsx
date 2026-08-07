// import {
//   CalendarCheck2,
//   ArrowRight,
//   Users,
//   CheckCircle2,
//   XCircle,
//   Clock3,
// } from "lucide-react";
// import { useNavigate } from "react-router-dom";

// function AttendanceHero({ dashboard }) {
//   const navigate = useNavigate();

//   const hour = new Date().getHours();

//   const greeting =
//     hour < 12
//       ? "Good Morning"
//       : hour < 17
//       ? "Good Afternoon"
//       : "Good Evening";

//   const today = new Date().toLocaleDateString("en-GB", {
//     weekday: "long",
//     day: "numeric",
//     month: "long",
//     year: "numeric",
//   });

//   const attendanceCompleted =
//     (dashboard?.presentToday || 0) +
//       (dashboard?.absentToday || 0) +
//       (dashboard?.leaveToday || 0) >
//     0;

//   return (
//     <section className="mb-8">

//       <div className="relative overflow-hidden rounded-3xl border border-slate-200 bg-gradient-to-r from-white via-slate-50 to-blue-50 shadow-sm">

//         <div className="absolute -top-28 -right-24 h-72 w-72 rounded-full bg-blue-100/40 blur-3xl" />

//         <div className="absolute bottom-0 left-0 h-1 w-full bg-gradient-to-r from-[#1E3A8A] via-blue-500 to-cyan-400" />

//         <div className="relative grid gap-8 lg:grid-cols-[1.7fr_1fr] p-8">

//           {/* LEFT */}

//           <div>

//             <span className="inline-flex rounded-full border border-blue-100 bg-blue-50 px-4 py-2 text-sm font-medium text-[#1E3A8A]">
//               {greeting}
//             </span>

//             <h1 className="mt-6 text-5xl font-bold tracking-tight text-slate-900">
//               Welcome Back, Admin
//             </h1>

//             <p className="mt-3 text-slate-500 text-lg">
//               {today}
//             </p>

//             <p className="mt-6 max-w-2xl text-lg leading-8 text-slate-600">
//               Monitor workforce attendance, manage payroll,
//               oversee inventory and keep production operations
//               running efficiently from a single dashboard.
//             </p>

//             <div className="mt-10 grid grid-cols-2 gap-4 md:grid-cols-4">

//               <div className="rounded-2xl border bg-white p-5">
//                 <Users className="text-[#1E3A8A]" size={22} />
//                 <h3 className="mt-4 text-3xl font-bold">
//                   {dashboard?.totalWorkers || 0}
//                 </h3>
//                 <p className="mt-1 text-sm text-slate-500">
//                   Workers
//                 </p>
//               </div>

//               <div className="rounded-2xl border bg-white p-5">
//                 <CheckCircle2 className="text-green-600" size={22} />
//                 <h3 className="mt-4 text-3xl font-bold">
//                   {dashboard?.presentToday || 0}
//                 </h3>
//                 <p className="mt-1 text-sm text-slate-500">
//                   Present
//                 </p>
//               </div>

//               <div className="rounded-2xl border bg-white p-5">
//                 <XCircle className="text-red-500" size={22} />
//                 <h3 className="mt-4 text-3xl font-bold">
//                   {dashboard?.absentToday || 0}
//                 </h3>
//                 <p className="mt-1 text-sm text-slate-500">
//                   Absent
//                 </p>
//               </div>

//               <div className="rounded-2xl border bg-white p-5">
//                 <Clock3 className="text-amber-500" size={22} />
//                 <h3 className="mt-4 text-3xl font-bold">
//                   {dashboard?.leaveToday || 0}
//                 </h3>
//                 <p className="mt-1 text-sm text-slate-500">
//                   Leave
//                 </p>
//               </div>

//             </div>

//           </div>

//           {/* RIGHT */}

//           <div className="rounded-3xl border border-slate-200 bg-white/80 backdrop-blur-sm p-7 shadow-sm">

//             <div className="flex items-center justify-between">

//               <div className="flex items-center gap-4">

//                 <div
//                   className={`flex h-16 w-16 items-center justify-center rounded-2xl ${
//                     attendanceCompleted
//                       ? "bg-green-100"
//                       : "bg-amber-100"
//                   }`}
//                 >
//                   <CalendarCheck2
//                     size={30}
//                     className={
//                       attendanceCompleted
//                         ? "text-green-600"
//                         : "text-amber-600"
//                     }
//                   />
//                 </div>

//                 <div>

//                   <p className="text-sm text-slate-500">
//                     Today's Attendance
//                   </p>

//                   <h2 className="mt-1 text-3xl font-bold text-slate-900">
//                     {attendanceCompleted
//                       ? "Completed"
//                       : "Pending"}
//                   </h2>

//                 </div>

//               </div>

//             </div>

//             <div className="mt-8 rounded-2xl border border-slate-200 bg-slate-50 p-5">

//               <p className="text-sm leading-7 text-slate-600">

//                 {attendanceCompleted
//                   ? "Attendance has been recorded for today. You can continue managing payroll, inventory and production."
//                   : "Attendance has not been recorded yet. Complete today's attendance before proceeding with payroll activities."}

//               </p>

//             </div>

//             <button
//               onClick={() => navigate("/attendance")}
//               className={`mt-8 flex h-14 w-full items-center justify-center gap-3 rounded-2xl text-base font-semibold text-white transition ${
//                 attendanceCompleted
//                   ? "bg-green-600 hover:bg-green-700"
//                   : "bg-[#1E3A8A] hover:bg-[#17307A]"
//               }`}
//             >
//               {attendanceCompleted
//                 ? "View Attendance"
//                 : "Mark Today's Attendance"}

//               <ArrowRight size={18} />

//             </button>

//           </div>

//         </div>

//       </div>

//     </section>
//   );
// }

// export default AttendanceHero;


import {
  CalendarCheck2,
  ArrowRight,
  Users,
  CheckCircle2,
  XCircle,
  Clock3,
} from "lucide-react";
import { useNavigate } from "react-router-dom";

function AttendanceHero({ dashboard }) {
  const navigate = useNavigate();

  const today = new Date().toLocaleDateString("en-GB", {
    weekday: "long",
    day: "numeric",
    month: "long",
    year: "numeric",
  });

  const attendanceCompleted =
    (dashboard?.presentToday || 0) +
      (dashboard?.absentToday || 0) +
      (dashboard?.leaveToday || 0) >
    0;

  const stats = [
    {
      title: "Workers",
      value: dashboard?.totalWorkers || 0,
      icon: Users,
      color: "text-blue-600",
      bg: "bg-blue-50",
    },
    {
      title: "Present",
      value: dashboard?.presentToday || 0,
      icon: CheckCircle2,
      color: "text-green-600",
      bg: "bg-green-50",
    },
    {
      title: "Absent",
      value: dashboard?.absentToday || 0,
      icon: XCircle,
      color: "text-red-600",
      bg: "bg-red-50",
    },
    {
      title: "Leave",
      value: dashboard?.leaveToday || 0,
      icon: Clock3,
      color: "text-amber-600",
      bg: "bg-amber-50",
    },
  ];

  return (
    <section className="mb-8">
      <div className="rounded-3xl border border-slate-200 bg-white shadow-sm">

        <div className="grid gap-6 lg:grid-cols-[2fr_360px] p-4">

          {/* Left Side */}
          <div>

            <p className="text-sm font-medium uppercase tracking-wider text-[#1E3A8A]">
              Workforce Management
            </p>

            <h1 className="mt-2 text-3xl font-bold text-slate-900">
              Dashboard Overview
            </h1>

            <p className="mt-1 text-sm text-slate-500">
              {today}
            </p>

            <p className="mt-4 max-w-2xl text-slate-600">
              Monitor labour attendance, payroll status and daily workforce
              activity from a centralized dashboard.
            </p>

            <div className="mt-6 grid grid-cols-2 gap-4 lg:grid-cols-4">

              {stats.map((item) => {
                const Icon = item.icon;

                return (
                  <div
                    key={item.title}
                    className="rounded-2xl border border-slate-200 bg-slate-50 p-4 transition-all duration-300 hover:border-[#1E3A8A] hover:shadow-md"
                  >

                    <div
                      className={`flex h-10 w-10 items-center justify-center rounded-xl ${item.bg}`}
                    >
                      <Icon
                        size={20}
                        className={item.color}
                      />
                    </div>

                    <h3 className="mt-4 text-2xl font-bold text-slate-900">
                      {item.value}
                    </h3>

                    <p className="mt-1 text-sm text-slate-500">
                      {item.title}
                    </p>

                  </div>
                );
              })}

            </div>

          </div>

          {/* Right Side */}

          <div className="rounded-2xl border border-slate-200 bg-slate-50 p-6">

            <div className="flex items-center gap-4">

              <div
                className={`flex h-14 w-14 items-center justify-center rounded-xl ${
                  attendanceCompleted
                    ? "bg-green-100"
                    : "bg-orange-100"
                }`}
              >

                <CalendarCheck2
                  size={24}
                  className={
                    attendanceCompleted
                      ? "text-green-600"
                      : "text-orange-600"
                  }
                />

              </div>

              <div>

                <p className="text-sm text-slate-500">
                  Attendance Status
                </p>

                <h2 className="text-xl font-bold text-slate-900">
                  {attendanceCompleted ? "Completed" : "Pending"}
                </h2>

              </div>

            </div>

            <div
              className={`mt-5 rounded-xl border p-4 ${
                attendanceCompleted
                  ? "border-green-200 bg-green-50"
                  : "border-orange-200 bg-orange-50"
              }`}
            >
              <p className="text-sm leading-6 text-slate-700">
                {attendanceCompleted
                  ? "Today's attendance has been completed successfully."
                  : "Attendance has not been recorded for today. Please complete it before processing payroll."}
              </p>
            </div>

            <button
              onClick={() => navigate("/attendance")}
              className={`mt-6 flex h-11 w-full items-center justify-center gap-2 rounded-xl text-sm font-semibold text-white transition ${
                attendanceCompleted
                  ? "bg-green-600 hover:bg-green-700"
                  : "bg-[#1E3A8A] hover:bg-[#17307A]"
              }`}
            >
              {attendanceCompleted
                ? "View Attendance"
                : "Mark Attendance"}

              <ArrowRight size={18} />
            </button>

          </div>

        </div>

      </div>
    </section>
  );
}

export default AttendanceHero;