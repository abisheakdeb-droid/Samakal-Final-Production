import { ArrowUpRight, ArrowDownRight, type LucideIcon } from "lucide-react";
import { clsx } from "clsx";

interface MetricsCardProps {
  label: string;
  value: string | number;
  subValue?: string;
  trend: "up" | "down" | "neutral";
  trendValue: string;
  icon?: LucideIcon;
  colorClass?: string; // e.g. "bg-blue-50 text-blue-600"
}

export default function MetricsCard({
  label,
  value,
  subValue,
  trend,
  trendValue,
  icon: Icon,
  colorClass = "bg-gray-100 text-gray-600"
}: MetricsCardProps) {
  const isUp = trend === "up";
  
  return (
    <div className="bg-white rounded-xl p-6 border border-gray-100 shadow-sm hover:shadow-md transition-shadow">
      <div className="flex justify-between items-start mb-4">
        {Icon && (
          <div className={clsx("p-3 rounded-lg", colorClass)}>
            <Icon size={24} />
          </div>
        )}
        <div className={clsx(
          "flex items-center gap-1 text-xs font-bold px-2 py-1 rounded-full",
          isUp ? "bg-green-50 text-green-600" : "bg-red-50 text-red-600"
        )}>
          {isUp ? <ArrowUpRight size={14} /> : <ArrowDownRight size={14} />}
          {trendValue}
        </div>
      </div>
      
      <div>
        <h3 className="text-3xl font-bold text-gray-900 mb-1">{value}</h3>
        <p className="text-sm text-gray-500 font-medium">{label}</p>
        {subValue && <p className="text-xs text-gray-400 mt-2">{subValue}</p>}
      </div>
    </div>
  );
}
