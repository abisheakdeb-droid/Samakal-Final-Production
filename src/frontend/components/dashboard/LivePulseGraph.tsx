"use client";

import {
  AreaChart,
  Area,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { useState, useEffect } from "react";
import { fetchRealTimeTraffic } from "@/lib/actions-tracker";

interface TrafficData {
  time: string;
  visitors: number;
}

export default function LivePulseGraph() {
  const [data, setData] = useState<TrafficData[]>([]);
  const [currentVisitors, setCurrentVisitors] = useState(0);

  // Fetch Data Function
  const loadData = async () => {
    const traffic = await fetchRealTimeTraffic();
    if (traffic && traffic.length > 0) {
      setData(traffic);
      // Set current visitors to the last data point or sum if appropriate
      // Here we just take the last bucket count for "Real-time" effect
      setCurrentVisitors(traffic[traffic.length - 1].visitors);
    }
  };

  useEffect(() => {
    // Initial Load
    // eslint-disable-next-line react-hooks/set-state-in-effect
    loadData();

    // Poll every 5 seconds
    const interval = setInterval(loadData, 5000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="bg-white border border-gray-100 rounded-xl p-6 shadow-sm h-full flex flex-col">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h3 className="text-lg font-bold text-gray-900 flex items-center gap-2">
            <span className="relative flex h-3 w-3">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-3 w-3 bg-red-500"></span>
            </span>
            Live Pulse
          </h3>
          <p className="text-sm text-gray-500">
            Real-time readership (Last Hour)
          </p>
        </div>
        <div className="text-right">
          <p className="text-2xl font-bold text-gray-900">{currentVisitors}</p>
          <p className="text-xs font-bold text-green-600">Active Now</p>
        </div>
      </div>

      <div className="flex-1 w-full min-h-[200px]">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={data}>
            <defs>
              <linearGradient id="colorVisitors" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#ef4444" stopOpacity={0.1} />
                <stop offset="95%" stopColor="#ef4444" stopOpacity={0} />
              </linearGradient>
            </defs>
            <XAxis dataKey="time" hide />
            <YAxis hide domain={["auto", "auto"]} />
            <Tooltip
              contentStyle={{
                borderRadius: "8px",
                border: "none",
                boxShadow: "0 4px 12px rgba(0,0,0,0.1)",
              }}
              itemStyle={{ color: "#ef4444", fontWeight: "bold" }}
            />
            <Area
              type="monotone"
              dataKey="visitors"
              stroke="#ef4444"
              strokeWidth={3}
              fillOpacity={1}
              fill="url(#colorVisitors)"
              animationDuration={1000}
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
