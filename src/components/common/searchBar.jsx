import React, { useRef } from "react";

const SearchBar = ({
  searchTerm,
  setSearchTerm,
  fromDate,
  toDate,
  setFromDate,
  setToDate,
}) => {
  const fromInputRef = useRef(null);
  const toInputRef = useRef(null);

  const handleFromDateChange = (e) => {
    const selected = e.target.value;
    if (!toDate || selected <= toDate) {
      setFromDate(selected);
    }
  };

  const handleToDateChange = (e) => {
    const selected = e.target.value;
    if (!fromDate || selected >= fromDate) {
      setToDate(selected);
    }
  };

  return (
    <div className="flex sm:flex-row flex-wrap items-end gap-4  pb-6">

      {/* Search Input */}
      <div className="relative w-full sm:w-40 md:w-64">
        <input
          type="text"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          placeholder="Search all fields..."
          className="w-full rounded-md border border-gray-300 py-2 pl-10 pr-10 text-sm placeholder-gray-400 focus:border-blue-500 focus:ring-blue-500"
        />
        <div className="absolute inset-y-0 left-3 flex items-center pointer-events-none">
          <svg className="h-5 w-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-4.35-4.35M16 10a6 6 0 11-12 0 6 6 0 0112 0z" />
          </svg>
        </div>
        {searchTerm && (
          <button
            onClick={() => setSearchTerm("")}
            className="absolute inset-y-0 right-0 flex items-center pr-3 text-gray-400 hover:text-gray-600"
          >
            <svg
              className="h-5 w-5"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        )}
      </div>

      {/* From Date */}
      <div className="relative w-full sm:w-48 text-sm">
        <label className="text-white-600 mb-1 font-medium block">From Date</label>
        <div className="relative">
          <input
            ref={fromInputRef}
            type="date"
            value={fromDate}
            onChange={handleFromDateChange}
            className="w-full rounded-md border border-gray-300 py-2 pr-10 pl-3 focus:border-blue-500 focus:ring-blue-500"
          />
          <button
            type="button"
            onClick={() => fromInputRef.current?.showPicker?.()}
            className="absolute inset-y-0 right-2 flex items-center"
          >
            <svg
              className="h-5 w-5 text-gray-500 hover:text-gray-700"
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
            </svg>
          </button>
        </div>
      </div>

      {/* To Date */}
      <div className="relative w-full sm:w-48 text-sm">
        <label className="text-white-600 mb-1 font-medium block">To Date</label>
        <div className="relative">
          <input
            ref={toInputRef}
            type="date"
            value={toDate}
            onChange={handleToDateChange}
            className="w-full rounded-md border border-gray-300 py-2 pr-10 pl-3 focus:border-blue-500 focus:ring-blue-500"
          />
          <button
            type="button"
            onClick={() => toInputRef.current?.showPicker?.()}
            className="absolute inset-y-0 right-2 flex items-center"
          >
            <svg
              className="h-5 w-5 text-gray-500 hover:text-gray-700"
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
            </svg>
          </button>
        </div>
      </div>
    </div>
  );
};

export default SearchBar;
