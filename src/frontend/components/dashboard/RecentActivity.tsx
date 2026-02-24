import { Clock } from "lucide-react";


interface Activity {
    id: number | string;
    user: string;
    action: string;
    target: string;
    time: string;
}

interface RecentActivityProps {
    activities: Activity[];
}

export default function RecentActivity({ activities = [] }: RecentActivityProps) {
  return (
    <div className="bg-white border border-gray-100 rounded-xl p-6 shadow-sm h-full flex flex-col">
        <div className="flex justify-between items-center mb-6">
            <h3 className="text-lg font-bold text-gray-900">Recent Activity</h3>
            <button className="text-xs text-brand-red font-bold hover:underline">View All</button>
        </div>
        
        <div className="flex-1 overflow-y-auto pr-2">
            {activities.length > 0 ? (
                <div className="space-y-6">
                    {activities.map((activity, idx) => (
                        <div key={activity.id || idx} className="flex gap-3 relative">
                            <div className="mt-1">
                            <div className="w-2 h-2 rounded-full bg-brand-red"></div>
                            </div>
                            <div>
                                <p className="text-sm text-gray-800">
                                    <span className="font-bold">{activity.user}</span> {activity.action} <span className="italic text-gray-600">{activity.target}</span>
                                </p>
                                <p className="text-xs text-gray-400 mt-1 flex items-center gap-1">
                                    <Clock size={10} /> {activity.time}
                                </p>
                            </div>
                        </div>
                    ))}
                </div>
            ) : (
                <p className="text-gray-500 text-sm text-center mt-10">No recent activity.</p>
            )}
        </div>
    </div>
  );
}
