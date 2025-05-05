import { useEffect, useRef, useState } from "react";
import UploadFile from "./UploadFile";
import { FaUpload, FaChevronLeft, FaChevronRight, FaHome, FaDatabase, FaGetPocket, FaComments } from "react-icons/fa";
import { Home } from "./Home";
import { B2B } from "./B2B";
import { B2C } from "./B2C";
import logo from '../assets/logo.png'
import { OutsourceDB } from "./OutsourceDB";
import { FaTable, FaTableList } from "react-icons/fa6";
import { FaUser } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';
import { WhatsappChatBot } from "./WhatsappChatBot";



const Dashboard = () => {
    const [activeSection, setActiveSection] = useState("home");
    const [isCollapsed, setIsCollapsed] = useState(true);
    const [isActive, setIsActive] = useState(false);
    const [mobileDrawerOpen, setMobileDrawerOpen] = useState(false);
    const profileRef = useRef(null);
    const popupRef = useRef(null);
    const drawerRef = useRef(null);
    const navigate = useNavigate();

    useEffect(() => {
        const handleClickOutside = (event) => {
            if (
                profileRef.current &&
                !profileRef.current.contains(event.target) &&
                popupRef.current &&
                !popupRef.current.contains(event.target)) {
                setIsActive(false);
            }

            if (
                drawerRef.current &&
                !drawerRef.current.contains(event.target) &&
                !event.target.closest("#burger-menu")
            ) {
                setMobileDrawerOpen(false);
            }
        };

        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    const handleLogout = () => {
        localStorage.removeItem("isLoggedIn");
        navigate("/ai-login");
        window.location.reload();
    };

    // const HandlefetchData = async () => {
    //     try {
    //         const response = await fetch("https://hogist.com/food-api/fetch-bot-leads/", {
    //             method: "GET",
    //             headers: {
    //                 "ngrok-skip-browser-warning": "true"
    //             }
    //         });
    //         const result = await response.json();
    //         if (response.ok) {
    //             alert("Data fetched successfully");
    //             console.log("Call result:", result);
    //         } else {
    //             alert("Failed to fetch");
    //         }
    //     } catch (error) {
    //         console.error("Error while fetch:", error);
    //     }
    // };

    const sidebarItems = [
        { id: "home", label: "Home", icon: <FaHome size={18} /> },
        { id: "upload", label: "Upload", icon: <FaUpload size={18} /> },
        { id: "b2b", label: "B2B", icon: <FaTable size={18} /> },
        { id: "b2c", label: "B2C", icon: <FaTableList size={18} /> },
        { id: "outsource", label: "OutSourceDB", icon: <FaDatabase size={18} /> },
        { id: "chatbot", label: "Chatbot", icon: <FaComments size={18} /> },
    ];

    return (
        <>
            <div className="flex w-screen overflow-visible justify-start items-start ibm">
                {/* Laptop Sidebar - remains unchanged */}
                <div className={`hidden md:flex text-white flex-col justify-between px-2  fixed z-30 h-screen transition-all duration-300 ease-in-out ${isCollapsed ? 'w-22' : 'w-56'} overflow-hidden`}>
                    <div className="flex flex-col flex-grow gap-6 my-5 ml-4 overflow-visible justify-between bg-gray-800 rounded-2xl ">
                        <div className="flex flex-col flex-grow gap-3">
                            <div className="flex px-2 items-center justify-start gap-2 py-4 cursor-pointer">
                                <img src={logo} alt="Logo" className="w-10" />
                                {!isCollapsed && <span className="text-xl font-bold">Hogist</span>}
                            </div>

                            <button className="py-2  pl-4 flex items-center justify-start gap-4 mb-4 cursor-pointer border-l-4 border-gray-800" onClick={() => setIsCollapsed(!isCollapsed)}>
                                <span className="transition-all duration-300 ease-in-out transform" >
                                    {isCollapsed ? <FaChevronRight size={18} /> : <FaChevronLeft size={18} />}
                                </span>
                                <span
                                    className={`font-medium transition-all duration-300 ease-in-out origin-left ${isCollapsed ? 'opacity-0 scale-x-0 w-0' : 'opacity-100 scale-x-100 w-auto'
                                        } overflow-hidden whitespace-nowrap`}
                                >
                                    Close
                                </span>
                            </button>
                            <div className="flex flex-col gap-5 ">
                                {sidebarItems.map(({ id, label, icon }) => (
                                    <button
                                        key={id}
                                        onClick={() => setActiveSection(id)}
                                        className={`py-2 pl-4 flex items-center gap-4 min-h-[40px] justify-start cursor-pointer 
                                      ${activeSection === id ? "border-l-4 border-green-600 text-green-600" : "border-l-4 border-gray-800 text-white"}`}
                                    >
                                        <span className="flex items-center">{icon}</span>
                                        <span className={`transition-all duration-300 ease-in-out origin-left 
                                      ${isCollapsed ? 'opacity-0 w-0 scale-x-0' : 'opacity-100 w-auto scale-x-100'} 
                                      whitespace-nowrap`}>
                                            {label}
                                        </span>
                                    </button>

                                ))}
                            </div>
                        </div>
                        <div className="flex flex-col justify-center items-center">
                            {/* <button className={`py-3 pl-4 px-1 flex items-center gap-4 my-2 cursor-pointer  justify-left }`} onClick={HandlefetchData}>
                                <span className="transition-all duration-300 ease-in-out transform" >
                                    <FaGetPocket size={24} />
                                </span>
                                <span
                                    className={`font-medium transition-all duration-300 ease-in-out origin-left ${isCollapsed ? 'opacity-0 scale-x-0 w-0' : 'opacity-100 scale-x-100 w-auto'
                                        } overflow-hidden whitespace-nowrap`}>
                                    Fetch
                                </span>
                            </button> */}
                            <div className="relative z-50 overflow-visible" ref={profileRef}>
                                <button
                                    className="py-2 pl-4 flex items-center gap-4 my-2 justify-start cursor-pointer"
                                    onClick={() => setIsActive((prev) => !prev)}
                                >
                                    <span className="transition-all duration-300 ease-in-out transform">
                                        <FaUser size={18} />
                                    </span>
                                    <span
                                        className={`font-medium transition-all duration-300 ease-in-out origin-left ${isCollapsed ? "opacity-0 scale-x-0 w-0" : "opacity-100 scale-x-100 w-auto"
                                            } overflow-hidden whitespace-nowrap`}
                                    >
                                        Profile
                                    </span>
                                </button>
                            </div>
                        </div>
                        {isActive && (
                            <div className="fixed left-[1.5rem] -bottom-6 translate-y-[-100%] w-42 bg-[#1f1f1f] text-white rounded-lg shadow-xl z-[9999]" ref={popupRef}>
                                <div className="p-4 border-b border-gray-700">
                                    <p className="text-sm font-medium text-gray-300">Hogist</p>
                                </div>
                                <div className="px-4 py-3 border-t border-gray-700">
                                    <button
                                        onClick={handleLogout}
                                        className="text-left w-full text-sm text-red-400 hover:text-red-500 font-semibold transition"
                                    >
                                        Sign out
                                    </button>
                                </div>
                            </div>
                        )}

                    </div>
                </div>

                {/* Mobile Menu Button - Only visible when drawer is closed */}
                {!mobileDrawerOpen && (
                    <div className="md:hidden fixed top-0 left-0 z-50 p-4">
                        <button
                            id="burger-menu"
                            className="text-white text-2xl"
                            onClick={() => setMobileDrawerOpen(true)}
                        >
                            ☰
                        </button>
                    </div>
                )}

                {/* Mobile Drawer Menu */}
                {mobileDrawerOpen && (
                    <div className="md:hidden fixed inset-0 z-40">
                        {/* Overlay */}
                        <div
                            className={`absolute inset-0 bg-black bg-opacity-50 transition-opacity duration-300 ${mobileDrawerOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'}`}
                            onClick={() => setMobileDrawerOpen(false)}
                        ></div>

                        {/* Drawer */}
                        <div
                            ref={drawerRef}
                            className={`absolute top-0 left-0 h-full w-2/3 bg-gray-900 text-white p-6 flex flex-col gap-4 transform transition-transform duration-300 ease-in-out ${mobileDrawerOpen ? 'translate-x-0' : '-translate-x-full'}`}
                        >
                            <button
                                className="text-xl mb-4 self-start"
                                onClick={() => setMobileDrawerOpen(false)}
                            >
                                ✕
                            </button>
                            <div className="flex items-center gap-2 mb-6">
                                <img src={logo} alt="Logo" className="w-10" />
                                <span className="text-xl font-bold">Hogist</span>
                            </div>
                            <div className="flex flex-col gap-4">
                                {sidebarItems.map(({ id, label, icon }) => (
                                    <button
                                        key={id}
                                        onClick={() => {
                                            setActiveSection(id);
                                            setMobileDrawerOpen(false);
                                        }}
                                        className={`flex items-center gap-4 py-2 px-4 rounded-md ${activeSection === id ? 'bg-green-500 text-white' : 'text-white hover:bg-gray-800'}`}
                                    >
                                        {icon}
                                        <span>{label}</span>
                                    </button>
                                ))}
                            </div>
                            <div className="mt-auto">
                                <button onClick={HandlefetchData} className="flex items-center gap-4 py-2 px-4 rounded-md w-full text-white hover:bg-gray-800"
                         > <FaGetPocket size={18} /> <span>Fetch</span></button>
                                <button onClick={handleLogout} className="flex items-center gap-4 py-2 px-4 rounded-md w-full text-red-400 hover:bg-gray-800"> <FaUser size={18} /> <span>Logout</span>
                                </button>
                            </div>
                        </div>
                    </div>
                )}

                {/* Main Content Area */}
                <div className={`flex flex-col h-screen bg-black transition-all duration-300 overflow-hidden ease-in-out w-full ${isCollapsed ? 'md:ml-[4rem]' : 'md:ml-[12rem]'}`}>
                    <div className=" px-4 sm:px-6 md:px-8 overflow-auto text-white  h-full">
                        {activeSection === "upload" && <UploadFile />}
                        {activeSection === "home" && <Home />}
                        {activeSection === "b2b" && <B2B />}
                        {activeSection === "b2c" && <B2C />}
                        {activeSection === "outsource" && <OutsourceDB />}
                        {activeSection === "chatbot" && <WhatsappChatBot />}
                    </div>
                </div>
            </div>
        </>
    );
};

export default Dashboard;










