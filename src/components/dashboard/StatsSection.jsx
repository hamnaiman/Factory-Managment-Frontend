import {
  Package,
  Wallet,
  Banknote,
  TrendingUp,
  Boxes,
} from "lucide-react";

import StatCard from "./StatCard";

function StatsSection({ dashboard }) {
  if (!dashboard) return null;

  const safeNumber = (value) => {
    const number = Number(value);

    return Number.isFinite(number) ? number : 0;
  };

  const formatNumber = (value) => {
    return safeNumber(value).toLocaleString("en-PK");
  };

  const formatCurrency = (value) => {
    return `Rs. ${formatNumber(value)}`;
  };

  const stats = [
    {
      title: "Revenue",
      value: formatCurrency(dashboard.totalRevenue),
      subtitle: "Total completed sales",
      icon: TrendingUp,
      iconBg: "bg-blue-100",
      iconColor: "text-blue-700",
      border: "hover:border-blue-500",
    },

    {
      title: "Products",
      value: formatNumber(dashboard.totalProducts),
      subtitle: "Inventory Items",
      icon: Package,
      iconBg: "bg-emerald-100",
      iconColor: "text-emerald-700",
      border: "hover:border-emerald-500",
    },

    {
      title: "Total Stock",
      value: formatNumber(
        dashboard.totalStock ??
        dashboard.currentStockUnits ??
        0
      ),
      subtitle: "Current inventory quantity",
      icon: Boxes,
      iconBg: "bg-blue-100",
      iconColor: "text-blue-700",
      border: "hover:border-blue-500",
    },

    {
      title: "Pending Salary",
      value: formatCurrency(dashboard.pendingSalary),
      subtitle: "Outstanding Payroll",
      icon: Wallet,
      iconBg: "bg-orange-100",
      iconColor: "text-orange-700",
      border: "hover:border-orange-500",
    },

    {
      title: "Today's Payments",
      value: formatCurrency(dashboard.todayPaymentTotal),
      subtitle: "Processed Today",
      icon: Banknote,
      iconBg: "bg-violet-100",
      iconColor: "text-violet-700",
      border: "hover:border-violet-500",
    },
  ];

  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-5">
      {stats.map((item) => (
        <StatCard
          key={item.title}
          {...item}
        />
      ))}
    </div>
  );
}

export default StatsSection;