import {
  Users,
  Package,
  Wallet,
  Banknote,
} from "lucide-react";
import StatCard from "./StatCard";

function StatsSection({ dashboard }) {
  if (!dashboard) return null;

  const stats = [
    {
      title: "Total Workers",
      value: dashboard.totalWorkers,
      subtitle: `${dashboard.presentToday} Present Today`,
      icon: Users,
      iconBg: "bg-blue-100",
      iconColor: "text-blue-700",
      border: "hover:border-blue-500",
    },
    {
      title: "Products",
      value: dashboard.totalProducts,
      subtitle: "Inventory Items",
      icon: Package,
      iconBg: "bg-emerald-100",
      iconColor: "text-emerald-700",
      border: "hover:border-emerald-500",
    },
    {
      title: "Pending Salary",
      value: `Rs. ${dashboard.pendingSalary.toLocaleString()}`,
      subtitle: "Outstanding Payroll",
      icon: Wallet,
      iconBg: "bg-orange-100",
      iconColor: "text-orange-700",
      border: "hover:border-orange-500",
    },
    {
      title: "Today's Payments",
      value: `Rs. ${dashboard.todaySalaryExpense.toLocaleString()}`,
      subtitle: "Processed Today",
      icon: Banknote,
      iconBg: "bg-violet-100",
      iconColor: "text-violet-700",
      border: "hover:border-violet-500",
    },
  ];

  return (
    <section className="mb-8">
      <div className="grid gap-6 sm:grid-cols-2 xl:grid-cols-4">
        {stats.map((item) => (
          <StatCard
            key={item.title}
            {...item}
          />
        ))}
      </div>
    </section>
  );
}

export default StatsSection;