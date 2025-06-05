import { useEffect } from 'react';

const Snackbar = ({ message, isOpen, onClose, duration = 3000 }) => {
  useEffect(() => {
    if (isOpen) {
      const timer = setTimeout(onClose, duration);
      return () => clearTimeout(timer);
    }
  }, [isOpen, duration, onClose]);

  return (
    <div
      className={`fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 
        bg-gray-800 text-white px-4 py-2 rounded shadow-lg z-50 transition-opacity duration-300 
        ${isOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'}`}
    >
      <span>{message}</span>
      <button
        onClick={onClose}
        className="ml-4 text-sm text-gray-300 hover:underline"
      >
        Dismiss
      </button>
    </div>
  );
};

export default Snackbar;
