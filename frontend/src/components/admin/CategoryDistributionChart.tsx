"use client";

import type { ICategoryDistributionItem } from "@/types/admin";
import React from "react";
import {
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

interface CategoryDistributionChartProps {
  data: ICategoryDistributionItem[];
}

const COLORS = [
  "#4f46e5",
  "#7c3aed",
  "#9333ea",
  "#c026d3",
  "#db2777",
  "#e11d48",
  "#0ea5e9",
  "#0d9488",
];

export const CategoryDistributionChart: React.FC<
  CategoryDistributionChartProps
> = ({ data }) => {
  // Display at most the latest 3 categories that have at least one job vacancy (completely exclude count === 0)
  const chartData = React.useMemo(() => {
    if (!data || data.length === 0) return [];
    return data
      .filter((cat) => (cat.count || 0) > 0)
      .slice(0, 3);
  }, [data]);

  if (!chartData || chartData.length === 0) {
    return (
      <div className="flex h-72 items-center justify-center text-xs text-slate-400">
        No active category vacancy distribution data available.
      </div>
    );
  }

  return (
    <div className="h-72 w-full">
      <ResponsiveContainer width="100%" height="100%">
        <BarChart
          data={chartData}
          margin={{ top: 10, right: 10, left: -20, bottom: 25 }}
        >
          <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
          <XAxis
            dataKey="name"
            axisLine={false}
            tickLine={false}
            tick={{ fill: "#64748b", fontSize: 10 }}
            interval={0}
            angle={-25}
            textAnchor="end"
          />
          <YAxis
            axisLine={false}
            tickLine={false}
            tick={{ fill: "#64748b", fontSize: 11 }}
            allowDecimals={false}
          />
          <Tooltip
            contentStyle={{
              backgroundColor: "#ffffff",
              borderRadius: "12px",
              border: "1px solid #e2e8f0",
              boxShadow: "0 10px 15px -3px rgba(0, 0, 0, 0.08)",
              fontSize: "12px",
            }}
          />
          <Bar dataKey="count" name="Open Vacancies" radius={[6, 6, 0, 0]}>
            {chartData.map((_, index) => (
              <Cell
                key={`cell-${index}`}
                fill={COLORS[index % COLORS.length]}
              />
            ))}
          </Bar>
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
};

export default CategoryDistributionChart;

