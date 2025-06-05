import React from 'react';
import { HiViewList, HiChartBar } from 'react-icons/hi';

const ToggleButtonGroup = ({ active, setActive }) => {
  const baseBtn = `flex items-center justify-center px-4 py-2 text-sm font-semibold transition focus:outline-none`;

  const activeBtn = `bg-blue-600 text-white border border-blue-600`;
  const inactiveBtn = `bg-transparent text-white border border-gray-600 hover:bg-gray-700`;

  return (
    <div className="inline-flex rounded overflow-hidden">
      <button
        onClick={() => setActive('table')}
        className={`${baseBtn} ${
          active === 'table' ? activeBtn : inactiveBtn
        } rounded-l h-10`}
      >
        <HiViewList className="mr-2 text-lg" />
        Table
      </button>
      <button
        onClick={() => setActive('dashboard')}
        className={`${baseBtn} ${
          active === 'dashboard' ? activeBtn : inactiveBtn
        } rounded-r  h-10`}
      >
        <HiChartBar className="mr-2 text-lg" />
        Dashboard
      </button>
    </div>
  );
};

export default ToggleButtonGroup;
