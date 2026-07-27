"use client";

import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

interface ResponseTimeChartProps {
  checks: { response_time_ms: number | null; checked_at: string }[];
}

export function ResponseTimeChart({ checks }: ResponseTimeChartProps) {
  const data = checks
    .slice(0, 20)
    .reverse()
    .map((c) => ({
      time: new Date(c.checked_at).toLocaleTimeString([], {
        hour: "2-digit",
        minute: "2-digit",
      }),
      ms: c.response_time_ms ?? 0,
    }));

  if (data.length === 0) {
    return (
      <div className="flex h-48 items-center justify-center text-sm text-[#86868b]">
        No data yet
      </div>
    );
  }

  return (
    <div className="h-48 w-full">
      <ResponsiveContainer width="100%" height="100%">
        <BarChart data={data} margin={{ top: 5, right: 5, left: -20, bottom: 5 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" vertical={false} />
          <XAxis
            dataKey="time"
            tick={{ fontSize: 11, fill: "#86868b" }}
            axisLine={{ stroke: "#e5e5ea" }}
            tickLine={false}
          />
          <YAxis
            tick={{ fontSize: 11, fill: "#86868b" }}
            axisLine={false}
            tickLine={false}
            unit="ms"
          />
          <Tooltip
            contentStyle={{
              borderRadius: "12px",
              border: "1px solid #e5e5ea",
              fontSize: "13px",
              boxShadow: "0 4px 12px rgba(0,0,0,0.08)",
              padding: "8px 12px",
            }}
            formatter={(value: unknown) => [`${value}ms`, "Response Time"]}
            cursor={{ fill: "#f5f5f7" }}
          />
          <Bar dataKey="ms" fill="#0071e3" radius={[4, 4, 0, 0]} maxBarSize={24} />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}
