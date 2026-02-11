export interface DashboardStat {
  label: string;
  value: string;
  change: string;
  icon: React.ElementType;
  color: string;
  bg: string;
}

export interface ActivityItem {
  id: number;
  user: string;
  action: string;
  target: string;
  time: string;
}
