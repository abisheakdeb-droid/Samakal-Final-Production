import { clsx } from "clsx";

type StatusType = "published" | "draft" | "archived" | "review";

interface StatusBadgeProps {
  status: StatusType | string;
}

export default function StatusBadge({ status }: StatusBadgeProps) {
  const normalizedStatus = status.toLowerCase() as StatusType;

  const styles = {
    published: "bg-green-100 text-green-700 border-green-200",
    scheduled: "bg-blue-100 text-blue-700 border-blue-200",
    draft: "bg-amber-100 text-amber-700 border-amber-200",
    archived: "bg-slate-100 text-slate-700 border-slate-200",
    review: "bg-purple-100 text-purple-700 border-purple-200",
  };

  const defaultStyle = "bg-gray-100 text-gray-700 border-gray-200";

  return (
    <span
      className={clsx(
        "px-2.5 py-0.5 rounded-full text-xs font-semibold border capitalize",
        styles[normalizedStatus] || defaultStyle
      )}
    >
      {status}
    </span>
  );
}
