import { useState } from "react";

import {
  CalendarCheck2,
  ArrowRight,
  CircleDollarSign,
  ReceiptText,
  WalletCards,
  CheckCircle2,
  Clock,
} from "lucide-react";

import { useNavigate } from "react-router-dom";

function AttendanceHero({ dashboard }) {
  const navigate = useNavigate();

  const [hoveredCard, setHoveredCard] = useState(null);

  if (!dashboard) {
    return null;
  }

  // ============================================================
  // DATE
  // ============================================================

  const today = new Date().toLocaleDateString("en-GB", {
    weekday: "long",
    day: "numeric",
    month: "long",
    year: "numeric",
  });

  // ============================================================
  // FINANCIAL DATA
  // ============================================================

  const grossProfit = Number(
    dashboard?.grossProfit || 0
  );

  const expenses = Number(
    dashboard?.totalExpenses || 0
  );

  const netProfit = Number(
    dashboard?.netProfit || 0
  );

  // ============================================================
  // ATTENDANCE DATA
  // ============================================================

  const dashboardTotalWorkers = Number(
    dashboard?.totalWorkers || 0
  );

  const presentToday = Number(
    dashboard?.presentToday || 0
  );

  const absentToday = Number(
    dashboard?.absentToday || 0
  );

  const leaveToday = Number(
    dashboard?.leaveToday || 0
  );

  /*
   * Sometimes backend can return:
   *
   * totalWorkers = 0
   * presentToday = 4
   *
   * In that case we should NOT show "Pending".
   *
   * So if totalWorkers is 0 but attendance
   * records exist, calculate total from attendance.
   */

  const attendanceTotal =
    presentToday +
    absentToday +
    leaveToday;

  const totalWorkers =
    dashboardTotalWorkers > 0
      ? dashboardTotalWorkers
      : attendanceTotal;

  // ============================================================
  // ATTENDANCE STATUS
  // ============================================================

  const attendanceRecorded =
    attendanceTotal;

  const attendanceCompleted =
    totalWorkers > 0 &&
    attendanceRecorded >= totalWorkers;

  const pendingWorkers = Math.max(
    totalWorkers - attendanceRecorded,
    0
  );

  const completionPercentage =
    totalWorkers > 0
      ? Math.min(
          100,
          Math.round(
            (attendanceRecorded /
              totalWorkers) *
              100
          )
        )
      : 0;

  // ============================================================
  // CURRENCY
  // ============================================================

  const formatCurrency = (value) => {
    return `Rs. ${Number(
      value || 0
    ).toLocaleString("en-PK", {
      maximumFractionDigits: 0,
    })}`;
  };

  // ============================================================
  // FINANCIAL CARDS
  // ============================================================

  const financialCards = [
    {
      id: "grossProfit",
      title: "Gross Profit",
      value: grossProfit,
      icon: CircleDollarSign,

      iconBg:
        "bg-emerald-50 text-emerald-600 border border-emerald-100",

      valueColor:
        grossProfit >= 0
          ? "text-emerald-600"
          : "text-rose-600",

      description:
        "Revenue after product cost",
    },

    {
      id: "expenses",
      title: "Expenses",
      value: expenses,
      icon: ReceiptText,

      iconBg:
        "bg-amber-50 text-amber-600 border border-amber-100",

      valueColor:
        "text-amber-600",

      description:
        "Current recorded expenses",
    },

    {
      id: "netProfit",
      title: "Net Profit",
      value: netProfit,
      icon: WalletCards,

      iconBg:
        netProfit >= 0
          ? "bg-emerald-50 text-emerald-600 border border-emerald-100"
          : "bg-rose-50 text-rose-600 border border-rose-100",

      valueColor:
        netProfit >= 0
          ? "text-emerald-600"
          : "text-rose-600",

      description:
        "Profit after all expenses",
    },
  ];

  return (
    <section className="w-full bg-white p-6 rounded-2xl border border-slate-200">

      <div className="grid min-w-0 grid-cols-1 gap-5 lg:grid-cols-12">

        {/* =====================================================
            LEFT SIDE
        ===================================================== */}

        <div className="min-w-0 lg:col-span-7 xl:col-span-8">

          {/* Header */}

          <div>

            

            <h1 className="mt-2 text-2xl font-bold tracking-tight text-slate-900 sm:text-3xl">
              Dashboard Overview
            </h1>

            <p className="mt-1 max-w-2xl text-xs leading-relaxed text-slate-500 sm:text-sm">
              Monitor your factory's financial performance,
              expenses and daily workforce activity from one
              centralized dashboard.
            </p>

          </div>

          {/* =================================================
              FINANCIAL CARDS
          ================================================= */}

          <div className="mt-5 grid grid-cols-1 gap-3 sm:grid-cols-3">

            {financialCards.map((card) => {
              const Icon = card.icon;

              const formattedValue =
                formatCurrency(
                  card.value
                );

              return (
                <div
                  key={card.id}
                  onMouseEnter={() =>
                    setHoveredCard(card.id)
                  }
                  onMouseLeave={() =>
                    setHoveredCard(null)
                  }
                  className="relative min-w-0 rounded-xl border border-slate-200 bg-white p-4 shadow-sm transition-all duration-200 hover:-translate-y-0.5 hover:border-slate-300 hover:shadow-md"
                >

                  {/* Card header */}

                  <div className="flex items-center justify-between gap-2">

                    <span className="min-w-0 truncate text-[11px] font-semibold uppercase tracking-wider text-slate-400">
                      {card.title}
                    </span>

                    <div
                      className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-lg ${card.iconBg}`}
                    >
                      <Icon
                        size={16}
                        strokeWidth={2}
                      />
                    </div>

                  </div>

                  {/* Value */}

                  <div className="my-3 min-w-0">

                    <p
                      className={`truncate text-base font-bold tracking-tight sm:text-lg xl:text-xl ${card.valueColor}`}
                    >
                      {formattedValue}
                    </p>

                  </div>

                  {/* Description */}

                  <p className="truncate border-t border-slate-100 pt-2 text-[11px] font-medium text-slate-400">
                    {card.description}
                  </p>

                  {/* Tooltip */}

                  {hoveredCard === card.id && (
                    <div className="absolute left-1/2 top-0 z-30 -translate-x-1/2 -translate-y-full rounded-lg bg-slate-900 px-3 py-2 text-center text-white shadow-xl">

                      <p className="text-[10px] font-medium uppercase text-slate-300">
                        Exact Amount
                      </p>

                      <p className="mt-0.5 text-xs font-bold">
                        {formattedValue}
                      </p>

                    </div>
                  )}

                </div>
              );
            })}

          </div>
        </div>

        {/* =====================================================
            RIGHT SIDE — MINIMAL ATTENDANCE
        ===================================================== */}

     <div className="min-w-0 lg:col-span-5 xl:col-span-4">

  <div
    className={`min-h-[280px] rounded-2xl border-2 bg-white p-4 shadow-md ${
      attendanceCompleted
        ? "border-emerald-200"
        : "border-amber-200"
    }`}
  >

    {/* HEADER */}
    <div className="flex items-center justify-between">

      <div className="flex items-center gap-3">

        <div
          className={`flex h-10 w-10 items-center justify-center rounded-xl ${
            attendanceCompleted
              ? "bg-emerald-100 text-emerald-700"
              : "bg-amber-100 text-amber-700"
          }`}
        >
          <CalendarCheck2 size={19} />
        </div>

        <div>
          <p className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
            TODAY
          </p>

          <h2 className="text-base font-bold text-slate-900">
            Attendance
          </h2>

          <p
            className={`text-xs font-semibold ${
              attendanceCompleted
                ? "text-emerald-600"
                : "text-amber-600"
            }`}
          >
            {attendanceCompleted
              ? "Attendance Completed"
              : "Attendance Pending"}
          </p>
        </div>

      </div>

      {/* STATUS */}
      <div
        className={`flex items-center gap-1 rounded-full px-2.5 py-1 text-[11px] font-bold ${
          attendanceCompleted
            ? "bg-emerald-100 text-emerald-700"
            : "bg-amber-100 text-amber-700"
        }`}
      >
        {attendanceCompleted ? (
          <CheckCircle2 size={12} />
        ) : (
          <Clock size={12} />
        )}

        {completionPercentage}%
      </div>

    </div>

    {/* ATTENDANCE */}
    <div className="mt-4 rounded-xl bg-slate-50 px-4 py-4">

      <div className="flex items-center justify-between">

        <div>
          <p className="text-3xl font-extrabold tracking-tight text-slate-900">
            {attendanceRecorded}

            <span className="ml-1 text-base font-semibold text-slate-400">
              / {totalWorkers}
            </span>
          </p>

          <p className="mt-0.5 text-[11px] font-medium text-slate-500">
            Workers recorded today
          </p>
        </div>

        {/* BREAKDOWN */}
        <div className="space-y-1.5 text-right">

          <p className="text-xs font-semibold text-emerald-600">
            {presentToday} Present
          </p>

          <p className="text-xs font-semibold text-rose-500">
            {absentToday} Absent
          </p>

          <p className="text-xs font-semibold text-amber-600">
            {leaveToday} Leave
          </p>

        </div>

      </div>

      {/* PROGRESS */}
      <div className="mt-4 h-2 w-full overflow-hidden rounded-full bg-slate-200">

        <div
          className={`h-full rounded-full transition-all duration-500 ${
            attendanceCompleted
              ? "bg-emerald-500"
              : "bg-[#1E3A8A]"
          }`}
          style={{
            width: `${completionPercentage}%`,
          }}
        />

      </div>

    </div>

    {/* PENDING */}
    {!attendanceCompleted &&
      totalWorkers > 0 && (
        <p className="mt-2 text-[11px] font-medium text-slate-500">
          {pendingWorkers} worker
          {pendingWorkers !== 1 ? "s" : ""} still pending.
        </p>
      )}

    {/* BUTTON */}
    <button
      type="button"
      onClick={() => navigate("/attendance")}
      className={`group mt-4 flex h-10 w-full items-center justify-center gap-2 rounded-xl text-xs font-semibold text-white transition-all ${
        attendanceCompleted
          ? "bg-emerald-600 hover:bg-emerald-700"
          : "bg-[#1E3A8A] hover:bg-[#17307A]"
      }`}
    >
      <span>
        {attendanceCompleted
          ? "View Today's Attendance"
          : "Mark Today's Attendance"}
      </span>

      <ArrowRight
        size={15}
        className="transition-transform group-hover:translate-x-1"
      />
    </button>

  </div>

</div>

      </div>
    </section>
  );
}

export default AttendanceHero;