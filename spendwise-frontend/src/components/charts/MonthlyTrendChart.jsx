// src/components/charts/MonthlyTrendChart.jsx
// Recharts AreaChart for monthly expense trend.
// Install: npm install recharts

import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import { formatRupees } from "../../utils/expenseHelpers";

const CustomTooltip = ({ active, payload, label }) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-[#0D141B]/95 backdrop-blur-md text-[#E8F1F3] text-xs px-3.5 py-2.5 rounded-xl shadow-xl border border-[#263640]">
        <p className="text-[#9AAEB7] font-semibold mb-0.5">{label}</p>
        <p className="text-sm font-extrabold text-[#22D3EE] tabular-nums">{formatRupees(payload[0].value)}</p>
      </div>
    );
  }
  return null;
};

/**
 * @param {Array} data - [{ month: "Jun 2025", total: 4200 }, ...]
 */
export default function MonthlyTrendChart({ data }) {
  if (!data || data.length === 0) {
    return (
      <div className="flex items-center justify-center h-48 text-[#657983] text-xs font-semibold">
        No data to display
      </div>
    );
  }

  return (
    <ResponsiveContainer width="100%" height={220}>
      <AreaChart data={data} margin={{ top: 12, right: 12, left: -10, bottom: 0 }}>
        <defs>
          <linearGradient id="monthGradient" x1="0" y1="0" x2="0" y2="1">
            <stop offset="5%" stopColor="#22D3EE" stopOpacity={0.35} />
            <stop offset="95%" stopColor="#22D3EE" stopOpacity={0} />
          </linearGradient>
        </defs>
        <CartesianGrid strokeDasharray="3 3" stroke="rgba(38, 54, 64, 0.6)" vertical={false} />
        <XAxis
          dataKey="month"
          tick={{ fontSize: 11, fill: "#9AAEB7", fontWeight: 600 }}
          axisLine={false}
          tickLine={false}
        />
        <YAxis
          tick={{ fontSize: 11, fill: "#9AAEB7", fontWeight: 600 }}
          axisLine={false}
          tickLine={false}
          tickFormatter={(v) => `₹${(v / 1000).toFixed(0)}k`}
          width={45}
        />
        <Tooltip content={<CustomTooltip />} />
        <Area
          type="monotone"
          dataKey="total"
          stroke="#22D3EE"
          strokeWidth={2.5}
          fill="url(#monthGradient)"
          dot={{ fill: "#22D3EE", r: 3.5, strokeWidth: 2, stroke: "#080D12" }}
          activeDot={{ r: 6, fill: "#38E8F5", stroke: "#080D12", strokeWidth: 2 }}
        />
      </AreaChart>
    </ResponsiveContainer>
  );
}
