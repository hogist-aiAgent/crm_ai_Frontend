import React, { useState, useRef, useEffect } from 'react';
import { FaUser } from 'react-icons/fa';
import { FiLogOut } from 'react-icons/fi';
import { useNavigate } from 'react-router-dom';

export const Navbar = () => {
  const [isActive, setIsActive] = useState(false);
  const profileRef = useRef(null);
  const navigate = useNavigate();

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (profileRef.current && !profileRef.current.contains(event.target)) {
        setIsActive(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("isLoggedIn");
    navigate("/login");
    window.location.reload(); // ⬅️ reload to reset state in App
  };


  return (
    <>
      <div className="shadow-white shadow-2xs text-white font-bold text-center z-50 sticky top-0 py-6 px-6 ibm bg-black">
        <div className="flex justify-between items-center px-4">
          <div className=""></div>
          <div >
            <h1 className="whitespace-nowrap text-2xl ">SELLIENT – Hogist’s Voice AI CRM</h1>
            <h1 className="whitespace-nowrap text-md italic font-normal">From First Hello to Final Deal — Seamlessly.</h1>
          </div>
          {/* <h1 className="whitespace-nowrap text-3xl">SELLIENT - YOUR AI AGENT DASHBOARD. POWERED BY HOGIST</h1> */}
          <div className="relative" ref={profileRef}>
            <button
              className="py-2 px-2 flex items-center gap-2 bg-green-600 rounded-full"
              onClick={() => setIsActive((prev) => !prev)}
            >
              <FaUser size={16} />
            </button>

            {isActive && (
              <div className="absolute right-0 mt-2 w-48 bg-white  text-black rounded-lg shadow-lg p-5 z-50">
                <div className="flex items-center gap-2 mb-4 px-2">
                  <FaUser size={16} />
                  <span className="font-semibold">Hogist</span>
                </div>
                <button
                  className="w-full text-left flex items-center gap-2 py-2 px-3 rounded-md bg-green-600 text-white hover:bg-green-700"
                  onClick={handleLogout}
                >
                  <FiLogOut size={16} /> Log out
                </button>

              </div>
            )}
          </div>
        </div>
      </div>
    </>
  );
};
