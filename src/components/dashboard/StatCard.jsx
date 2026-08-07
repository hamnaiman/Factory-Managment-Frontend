import { ArrowUpRight } from "lucide-react";

function StatCard({
  title,
  value,
  subtitle,
  icon: Icon,
  iconBg,
  iconColor,
  border,
}) {
  return (
    <div
      className={`group relative overflow-hidden rounded-2xl border border-slate-200 bg-white p-6 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-lg ${border}`}
    >
      {/* Top */}

      <div className="flex items-start justify-between">

        <div>

          <p className="text-sm font-medium text-slate-500">
            {title}
          </p>

          <h2 className="mt-3 text-2xl font-bold tracking-tight text-slate-900">
            {value}
          </h2>

        </div>

        <div
          className={`flex h-10 w-10 items-center justify-center rounded-xl ${iconBg}`}
        >
          <Icon
            size={22}
            className={iconColor}
          />
        </div>

      </div>

      {/* Bottom */}

      <div className="mt-8 flex items-center justify-between border-t border-slate-100 pt-4">

        <p className="text-sm text-slate-500">
          {subtitle}
        </p>

        <ArrowUpRight
          size={18}
          className="text-slate-400 transition-transform duration-300 group-hover:translate-x-1 group-hover:-translate-y-1"
        />

      </div>

      {/* Accent Line */}

      <div className="absolute bottom-0 left-0 h-1 w-0 rounded-full bg-[#1E3A8A] transition-all duration-300 group-hover:w-full" />

    </div>
  );
}

export default StatCard;