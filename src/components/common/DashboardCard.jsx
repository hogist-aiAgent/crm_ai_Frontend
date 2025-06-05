import React from "react";
import { FaUserPlus, FaPhoneAlt, FaCheckCircle, FaDatabase ,FaPlay,FaSpinner, FaCompass, FaSyncAlt, FaHourglassStart } from "react-icons/fa";


const StatusSummaryCards = ({ data }) => {
  const statuses = [
    {
      label: "New",
      color: "bg-indigo-700",
      key: "new",
      icon: <FaUserPlus className="text-white text-xl" />,
    },
    {
      label: "Pending",
      color: "bg-yellow-600",
      key: "pending",
      icon: <FaPhoneAlt className="text-white text-xl" />,
    },
    {
      label: "Called",
      color: "bg-emerald-700",
      key: "called",
      icon: <FaCheckCircle className="text-white text-xl" />,
    },
    {
      label: "Initiated",
      color: "bg-orange-600",
      key: "initiated",
      icon: <FaHourglassStart className="text-white text-xl" />,
    },
    {
      label: "All",
      color: "bg-gray-800",
      key: "all",
      icon: <FaDatabase className="text-white text-xl" />,
    },
  ];

  return (
    <div className="grid grid-cols-2 md:grid-cols-5 gap-4 mb-6">
      {statuses.map(({ label, color, key, icon }) => {
        const count =
          key === "all"
            ? data.length
            : data.filter((item) => item.status?.toLowerCase() === key).length;

        return (
          <div
            key={key}
            className={`rounded-xl p-5 text-white shadow-lg flex flex-col justify-between ${color} hover:scale-[1.02] transition-transform duration-200`}
          >
            <div className="flex items-center justify-between mb-3">
              <span className="text-sm text-gray-200">{label} Leads</span>
              {icon}
            </div>
            <div className="text-3xl font-extrabold">{count}</div>
            <div className="text-xs text-gray-300 mt-1">Total for this filter</div>
          </div>
        );
      })}
    </div>
  );
};


export default StatusSummaryCards;
