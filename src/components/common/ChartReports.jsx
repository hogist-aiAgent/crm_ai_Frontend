import React, { useState } from "react";
import { Bar } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Tooltip,
  Legend,
} from "chart.js";

ChartJS.register(CategoryScale, LinearScale, BarElement, Tooltip, Legend);

/**
 * @param {{
 *   data: any[],
 *   statusField: string,
 *   statusConfig: { key: string, label: string, color: string }[]
 * }} props
 */
const StatusBarChart = ({ data, statusField = "status", statusConfig }) => {
  const monthMap = new Map();

  data.forEach((item) => {
    const date = new Date(item.created_at);
    if (isNaN(date)) return;

    const monthLabel = date.toLocaleString("default", { month: "short", year: "numeric" });
    const sortKey = new Date(date.getFullYear(), date.getMonth());

    if (!monthMap.has(monthLabel)) {
      monthMap.set(monthLabel, {
        sortKey,
        counts: Object.fromEntries(statusConfig.map(({ key }) => [key, 0])),
      });
    }

    const status = item[statusField]?.toLowerCase();
    const configKeys = statusConfig.map(({ key }) => key);
    if (configKeys.includes(status)) {
      monthMap.get(monthLabel).counts[status]++;
    }
  });

  const sortedMonths = [...monthMap.entries()].sort(
    ([, a], [, b]) => a.sortKey - b.sortKey
  );

  const months = sortedMonths.map(([label]) => label);
  const monthlyStatusCounts = {};
  sortedMonths.forEach(([label, data]) => {
    monthlyStatusCounts[label] = data.counts;
  });

  const [selectedMonth, setSelectedMonth] = useState("All");
  const filteredMonths = selectedMonth === "All" ? months : [selectedMonth];

  const chartData = {
    labels: filteredMonths,
    datasets: statusConfig.map(({ key, label, color }) => ({
      label,
      data: filteredMonths.map((month) => monthlyStatusCounts[month]?.[key] || 0),
      backgroundColor: color,
    })),
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: { position: "top", labels: { color: "#e5e7eb" } },
      tooltip: { mode: "index", intersect: false },
    },
    scales: {
      x: { ticks: { color: "#d1d5db" } },
      y: {
        beginAtZero: true,
        ticks: { color: "#d1d5db" },
        title: { display: true, text: "Number of Leads", color: "#e5e7eb" },
      },
    },
  };

  return (
    <div className="mt-8 bg-gray-900 rounded-lg shadow-md p-4 md:p-6 text-white w-full">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-4 gap-3">
        <h2 className="text-lg font-semibold">Month-wise Lead Summary</h2>
        <select
          value={selectedMonth}
          onChange={(e) => setSelectedMonth(e.target.value)}
          className="bg-gray-800 border border-gray-700 text-white text-sm rounded px-3 py-2 w-full md:w-auto"
        >
          <option value="All">All Months</option>
          {months.map((month) => (
            <option key={month} value={month}>
              {month}
            </option>
          ))}
        </select>
      </div>

      <div className="relative w-full h-[300px] md:h-[400px]">
        <Bar data={chartData} options={options} />
      </div>
    </div>
  );
};

export default StatusBarChart;
