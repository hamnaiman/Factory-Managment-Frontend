import {
  CalendarCheck2,
  DollarSign,
  Clock3,
} from "lucide-react";

function RecentActivity({ dashboard }) {
  if (!dashboard) return null;

  const attendance = dashboard.recentAttendance || [];
  const payments = dashboard.recentPayments || [];

  const activities = [
    ...attendance.map((item) => ({
      id: `attendance-${item._id}`,
      type: "attendance",
      title: item.worker?.name || "Worker",
      description: `Marked ${item.status}`,
      date: item.date,
    })),
    ...payments.map((item) => ({
      id: `payment-${item._id}`,
      type: "payment",
      title: item.worker?.name || "Worker",
      description: `Salary Paid • Rs. ${Number(item.amount).toLocaleString()}`,
      date: item.paymentDate,
    })),
  ].sort((a, b) => new Date(b.date) - new Date(a.date));

  return (
    <div className="rounded-2xl border border-slate-200 bg-white shadow-sm">

      <div className="flex items-center justify-between border-b border-slate-200 px-6 py-2">

        <div>

          <h2 className="text-xl font-semibold text-slate-900">
            Recent Activity
          </h2>

          <p className="mt-1 text-sm text-slate-500">
            Latest attendance and payment records
          </p>

        </div>

      </div>

      <div className="max-h-[520px] overflow-y-auto">

        {activities.length === 0 ? (

          <div className="flex h-52 items-center justify-center text-slate-500">
            No recent activity available.
          </div>

        ) : (

          <div className="divide-y divide-slate-100">

            {activities.map((item) => {

              const attendanceItem = item.type === "attendance";

              return (

                <div
                  key={item.id}
                  className="flex items-start gap-4 px-6 py-4 transition-colors duration-200 hover:bg-slate-50"
                >

                  <div
                    className={`flex h-11 w-11 flex-shrink-0 items-center justify-center rounded-xl ${
                      attendanceItem
                        ? "bg-green-100 text-green-600"
                        : "bg-blue-100 text-blue-600"
                    }`}
                  >

                    {attendanceItem ? (
                      <CalendarCheck2 size={20} />
                    ) : (
                      <DollarSign size={20} />
                    )}

                  </div>

                  <div className="min-w-0 flex-1">

                    <div className="flex items-center justify-between gap-4">

                      <h3 className="truncate text-sm font-semibold text-slate-900">
                        {item.title}
                      </h3>

                      <div className="flex items-center gap-1 text-xs text-slate-500">

                        <Clock3 size={14} />

                        {new Date(item.date).toLocaleDateString("en-GB")}

                      </div>

                    </div>

                    <p className="mt-1 text-sm text-slate-600">
                      {item.description}
                    </p>

                  </div>

                </div>

              );

            })}

          </div>

        )}

      </div>

    </div>
  );
}

export default RecentActivity;