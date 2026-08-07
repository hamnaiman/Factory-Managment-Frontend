import {
  Users,
  CheckCircle2,
  XCircle,
  Clock3,
  Wallet,
} from "lucide-react";

function TodaySummary({ dashboard }) {
  if (!dashboard) return null;

  const summary = [
    {
      title: "Total Workers",
      value: dashboard.totalWorkers,
      icon: Users,
      bg: "bg-blue-50",
      color: "text-blue-600",
    },
    {
      title: "Present Today",
      value: dashboard.presentToday,
      icon: CheckCircle2,
      bg: "bg-green-50",
      color: "text-green-600",
    },
    {
      title: "Absent Today",
      value: dashboard.absentToday,
      icon: XCircle,
      bg: "bg-red-50",
      color: "text-red-600",
    },
    {
      title: "Leave Today",
      value: dashboard.leaveToday,
      icon: Clock3,
      bg: "bg-amber-50",
      color: "text-amber-600",
    },
    {
      title: "Advance Payments",
      value: `Rs. ${dashboard.advancePayments.toLocaleString()}`,
      icon: Wallet,
      bg: "bg-emerald-50",
      color: "text-emerald-600",
    },
  ];

  return (
    <div className="rounded-2xl border border-slate-200 bg-white shadow-sm">

      <div className="border-b border-slate-200 px-6 py-2">

        <h2 className="text-xl font-semibold text-slate-900">
          Today's Summary
        </h2>

        <p className="mt-1 text-sm text-slate-500">
          Daily workforce and payroll overview
        </p>

      </div>

      <div className="p-6 space-y-3">

        {summary.map((item) => {

          const Icon = item.icon;

          return (

            <div
              key={item.title}
              className="group flex items-center justify-between rounded-xl border border-slate-200 bg-slate-50 p-2 transition-all duration-300 hover:border-blue-200 hover:bg-white hover:shadow-md"
            >

              <div className="flex items-center gap-2">

                <div
                  className={`flex h-11 w-11 items-center justify-center rounded-xl ${item.bg}`}
                >

                  <Icon
                    size={20}
                    className={item.color}
                  />

                </div>

                <div>

                  <p className="text-sm font-medium text-slate-500">
                    {item.title}
                  </p>

                  <p className="mt-1 text-lg font-semibold text-slate-900">
                    {item.value}
                  </p>

                </div>

              </div>

            </div>

          );

        })}

      </div>

    </div>
  );
}

export default TodaySummary;