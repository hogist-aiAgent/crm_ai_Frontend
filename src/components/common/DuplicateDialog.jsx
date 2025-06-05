import React from "react";

const DuplicateDialog = ({ duplicates, isOpen, onClose }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 px-4">
      <div className="relative bg-white dark:bg-gray-900 text-black dark:text-white border border-gray-300 dark:border-gray-700 p-6 rounded shadow-lg w-full max-w-lg max-h-[80vh] overflow-y-auto">
        
        {/* Close Icon */}
        <button
          onClick={onClose}
          className="absolute top-3 right-3 text-xl font-bold text-gray-700 dark:text-gray-300 hover:text-red-600 dark:hover:text-red-400"
          aria-label="Close"
        >
          &times;
        </button>

        {/* Title */}
        <h2 className="text-xl font-bold mb-4 text-red-600 dark:text-red-400">
          Duplicate Entries
        </h2>

        {/* Description */}
        <p className="mb-2 text-sm">
          The following numbers were already present:
        </p>

        {/* Duplicate List */}
        <ul className="list-disc pl-5 max-h-64 overflow-y-auto text-sm space-y-1">
          {duplicates && duplicates.length > 0 ? (
            duplicates.map((number, index) => (
              <li key={index}>{number}</li>
            ))
          ) : (
            <li className="text-gray-500 dark:text-gray-400">
              No duplicate numbers found.
            </li>
          )}
        </ul>
      </div>
    </div>
  );
};

export default DuplicateDialog;
