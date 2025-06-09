import React from "react";
import { FaUserPlus, FaPhoneAlt, FaCheckCircle, FaDatabase ,FaPlay,FaSpinner, FaCompass, FaSyncAlt, FaHourglassStart } from "react-icons/fa";


const StatusSummaryCards = ({ data, statusField = "status", config }) => {
  return (
    <div className="grid grid-cols-2 md:grid-cols-5 gap-4 mb-6">
      {config.map(({ label, color, key, icon }) => {
        const count =
          key === "all"
            ? data.length
            : data.filter((item) =>
                item[statusField]?.toLowerCase() === key
              ).length;

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
            <div className="text-xs text-gray-300 mt-1">
              Total for this filter
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default StatusSummaryCards;

