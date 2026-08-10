import { useState } from "react";

import {
  CalendarCheck2,
  ArrowRight,
  TrendingUp,
  CircleDollarSign,
  ReceiptText,
  WalletCards,
  Users,
  CheckCircle2,
  Clock,
  Info,
} from "lucide-react";

import { useNavigate } from "react-router-dom";

function AttendanceHero({ dashboard }) {
  const navigate = useNavigate();

  const [hoveredCard, setHoveredCard] =
    useState(null);

  if (!dashboard) {
    return null;
  }

  // ============================================================
  // DATE
  // ============================================================

  const today =
    new Date().toLocaleDateString(
      "en-GB",
      {
        weekday: "long",
        day: "numeric",
        month: "long",
        year: "numeric",
      }
    );

  // ============================================================
  // FINANCIAL DATA
  // ============================================================

  const revenue = Number(
    dashboard.totalRevenue || 0
  );

  const grossProfit = Number(
    dashboard.grossProfit || 0
  );

  const expenses = Number(
    dashboard.totalExpenses || 0
  );

  const netProfit = Number(
    dashboard.netProfit || 0
  );

  // ============================================================
  // ATTENDANCE DATA
  // ============================================================

  const totalWorkers = Number(
    dashboard.totalWorkers || 0
  );

  const recordedWorkers = Number(
    dashboard.attendanceRecordedToday ??
      dashboard.recordedWorkersToday ??
      dashboard.recordedToday ??
      0
  );

  const presentToday = Number(
    dashboard.presentToday || 0
  );

  const absentToday = Number(
    dashboard.absentToday || 0
  );

  const leaveToday = Number(
    dashboard.leaveToday || 0
  );

  // IMPORTANT:
  // Never allow recorded workers to exceed
  // total active workers.

  const actualRecordedWorkers =
    Math.min(
      Math.max(
        recordedWorkers,
        0
      ),
      totalWorkers
    );

  const attendanceCompleted =
    totalWorkers > 0 &&
    actualRecordedWorkers >=
      totalWorkers;

  const pendingWorkers =
    Math.max(
      totalWorkers -
        actualRecordedWorkers,
      0
    );

  const completionPercentage =
    totalWorkers > 0
      ? Math.round(
          (actualRecordedWorkers /
            totalWorkers) *
            100
        )
      : 0;

  // ============================================================
  // CURRENCY
  // ============================================================

  const formatCurrency = (
    value
  ) => {
    return `Rs. ${Number(
      value || 0
    ).toLocaleString(
      "en-PK",
      {
        maximumFractionDigits: 0,
      }
    )}`;
  };

  // ============================================================
  // FINANCIAL CARDS
  // ============================================================

  const financialCards = [
    {
      id: "revenue",
      title: "Revenue",
      value: revenue,
      icon: TrendingUp,
      iconBg:
        "bg-blue-50 text-blue-600 border border-blue-100",
      valueColor:
        "text-slate-900",
      description:
        "Total completed sales",
    },

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
    <section className="w-full">
      <div className="grid min-w-0 grid-cols-1 gap-5 lg:grid-cols-12">
        {/* ======================================================
            LEFT
        ====================================================== */}

        <div className="min-w-0 lg:col-span-7 xl:col-span-8">
          {/* HEADER */}

          <div>
            <p className="text-xs font-semibold uppercase tracking-wider text-slate-400">
              Workforce Management
            </p>

            <p className="mt-1 text-sm text-slate-500">
              {today}
            </p>

            <h1 className="mt-3 text-2xl font-bold tracking-tight text-slate-900 sm:text-3xl">
              Dashboard Overview
            </h1>

            <p className="mt-1 max-w-2xl text-xs leading-relaxed text-slate-500 sm:text-sm">
              Monitor your factory's financial performance,
              expenses and daily workforce activity from one
              centralized dashboard.
            </p>
          </div>

          {/* FINANCIAL CARDS */}

          <div className="mt-5 grid grid-cols-1 gap-3 sm:grid-cols-2 xl:grid-cols-4">
            {financialCards.map(
              (card) => {
                const Icon =
                  card.icon;

                const formattedVal =
                  formatCurrency(
                    card.value
                  );

                return (
                  <div
                    key={card.id}
                    onMouseEnter={() =>
                      setHoveredCard(
                        card.id
                      )
                    }
                    onMouseLeave={() =>
                      setHoveredCard(
                        null
                      )
                    }
                    className="relative min-w-0 rounded-xl border border-slate-200 bg-white p-4 shadow-sm transition-all duration-200 hover:-translate-y-0.5 hover:border-slate-300 hover:shadow-md"
                  >
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

                    <div className="my-3 min-w-0">
                      <p
                        className={`truncate text-base font-bold tracking-tight sm:text-lg xl:text-xl ${card.valueColor}`}
                        title={
                          formattedVal
                        }
                      >
                        {formattedVal}
                      </p>
                    </div>

                    <p className="truncate border-t border-slate-100 pt-2 text-[11px] font-medium text-slate-400">
                      {card.description}
                    </p>

                    {hoveredCard ===
                      card.id && (
                      <div className="absolute left-1/2 top-0 z-30 -translate-x-1/2 -translate-y-full rounded-lg bg-slate-900 px-3 py-2 text-center text-white shadow-xl">
                        <div className="flex items-center justify-center gap-1.5 text-[10px] font-medium uppercase text-slate-300">
                          <Info
                            size={12}
                            className="text-blue-400"
                          />

                          <span>
                            Exact Amount
                          </span>
                        </div>

                        <p className="mt-0.5 text-xs font-bold">
                          {formattedVal}
                        </p>

                        <div className="absolute -bottom-1 left-1/2 h-2 w-2 -translate-x-1/2 rotate-45 bg-slate-900" />
                      </div>
                    )}
                  </div>
                );
              }
            )}
          </div>
        </div>

        {/* ======================================================
            RIGHT — ATTENDANCE
        ====================================================== */}

        <div className="min-w-0 lg:col-span-5 xl:col-span-4">
          <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm lg:sticky lg:top-5">
            {/* HEADER */}

            <div className="flex items-center justify-between gap-3 border-b border-slate-100 pb-4">
              <div className="flex min-w-0 items-center gap-3">
                <div
                  className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-xl ${
                    attendanceCompleted
                      ? "border border-emerald-100 bg-emerald-50 text-emerald-600"
                      : "border border-amber-100 bg-amber-50 text-amber-600"
                  }`}
                >
                  <CalendarCheck2
                    size={20}
                  />
                </div>

                <div className="min-w-0">
                  <p className="text-[11px] font-medium uppercase tracking-wider text-slate-400">
                    Today's Attendance
                  </p>

                  <h2
                    className={`text-base font-bold ${
                      attendanceCompleted
                        ? "text-emerald-600"
                        : "text-amber-600"
                    }`}
                  >
                    {attendanceCompleted
                      ? "Completed"
                      : "Pending"}
                  </h2>
                </div>
              </div>

              <span
                className={`inline-flex shrink-0 items-center gap-1 rounded-full px-2.5 py-1 text-xs font-semibold ${
                  attendanceCompleted
                    ? "bg-emerald-100 text-emerald-700"
                    : "bg-amber-100 text-amber-700"
                }`}
              >
                {attendanceCompleted ? (
                  <CheckCircle2
                    size={12}
                  />
                ) : (
                  <Clock size={12} />
                )}

                {completionPercentage}%
              </span>
            </div>

            {/* PROGRESS */}

            <div
              className={`mt-4 rounded-xl border p-4 ${
                attendanceCompleted
                  ? "border-emerald-200 bg-emerald-50/40"
                  : "border-amber-200 bg-amber-50/40"
              }`}
            >
              <div className="flex items-center justify-between gap-3">
                <div className="flex min-w-0 items-baseline gap-1">
                  <span
                    className={`text-2xl font-extrabold tracking-tight ${
                      attendanceCompleted
                        ? "text-emerald-700"
                        : "text-amber-700"
                    }`}
                  >
                    {actualRecordedWorkers}
                  </span>

                  <span className="text-xs font-semibold uppercase text-slate-500">
                    / {totalWorkers}
                  </span>
                </div>

                <div className="flex shrink-0 items-center gap-1 text-xs font-medium text-slate-600">
                  <Users
                    size={13}
                    className="text-slate-400"
                  />

                  <span>
                    {presentToday} Present
                  </span>
                </div>
              </div>

              <p
                className={`mt-2 text-xs font-medium leading-relaxed ${
                  attendanceCompleted
                    ? "text-emerald-800"
                    : "text-amber-800"
                }`}
              >
                {attendanceCompleted
                  ? "All active workers recorded for today."
                  : totalWorkers ===
                    0
                  ? "No active workers found."
                  : `${pendingWorkers} worker${
                      pendingWorkers ===
                      1
                        ? ""
                        : "s"
                    } pending.`}
              </p>

              {totalWorkers >
                0 && (
                <div className="mt-3">
                  <div className="h-2 w-full overflow-hidden rounded-full bg-slate-200">
                    <div
                      className={`h-full rounded-full transition-all duration-500 ${
                        attendanceCompleted
                          ? "bg-emerald-500"
                          : "bg-amber-500"
                      }`}
                      style={{
                        width: `${completionPercentage}%`,
                      }}
                    />
                  </div>
                </div>
              )}

              {/* STATUS SUMMARY */}

              <div className="mt-4 grid grid-cols-3 gap-2">
                <div className="rounded-lg bg-white/70 p-2 text-center">
                  <p className="text-xs text-slate-400">
                    Present
                  </p>

                  <p className="mt-1 font-bold text-emerald-600">
                    {presentToday}
                  </p>
                </div>

                <div className="rounded-lg bg-white/70 p-2 text-center">
                  <p className="text-xs text-slate-400">
                    Absent
                  </p>

                  <p className="mt-1 font-bold text-rose-600">
                    {absentToday}
                  </p>
                </div>

                <div className="rounded-lg bg-white/70 p-2 text-center">
                  <p className="text-xs text-slate-400">
                    Leave
                  </p>

                  <p className="mt-1 font-bold text-amber-600">
                    {leaveToday}
                  </p>
                </div>
              </div>
            </div>

            {/* BUTTON */}

            <button
              type="button"
              onClick={() =>
                navigate(
                  "/attendance"
                )
              }
              className={`group mt-4 flex h-10 w-full items-center justify-center gap-2 rounded-xl text-xs font-semibold text-white transition-all duration-200 sm:text-sm ${
                attendanceCompleted
                  ? "bg-emerald-600 hover:bg-emerald-700"
                  : "bg-blue-900 hover:bg-blue-950"
              }`}
            >
              <span>
                {attendanceCompleted
                  ? "View Attendance"
                  : "Mark Today's Attendance"}
              </span>

              <ArrowRight
                size={15}
                className="transition-transform duration-200 group-hover:translate-x-1"
              />
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}

export default AttendanceHero;