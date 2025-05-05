// import { useState, useEffect } from "react";
// import { toast } from "react-toastify";

// export const OutsourceDB = () => {
//     const [tableData, setTableData] = useState([]);
//     const [loading, setLoading] = useState(true);
//     const [error, setError] = useState(null);
//     const [filter, setFilter] = useState("year");
//     const [start, setStart] = useState(false);

//     const startCall = async () => {
//         // ✅ Check if at least one row has status === "new"
//         // const hasNewLead = filteredData.some(row => row.status?.toLowerCase() === "new");

//         // if (!hasNewLead) {
//         //     toast.warning("No new leads to call");
//         //     return;
//         // }

//         try {
//             const response = await fetch("https://hogist.com/food-api/call-ai-agent/", {
//                 method: "GET",
//                 headers: {
//                     "ngrok-skip-browser-warning": "true"
//                 }
//             });

//             const result = await response.json();
//             setStart(true);

//             if (response.ok) {
//                 toast.success("Call started successfully!");
//                 console.log("Call result:", result);
//             } else {
//                 toast.error("Failed to trigger call process.");
//             }
//         } catch (error) {
//             console.error("Error starting call process:", error);
//             toast.error("Error starting call process");
//         }
//     };

//     const stopCall = async () => {
//         // if (!start) {
//         //     toast.warning("No call is currently running to stop.");
//         //     return;  //  Exit early if no call was started
//         // }

//         try {
//             const response = await fetch("https://hogist.com/food-api/stop-call/", {
//                 method: "POST",
//                 headers: {
//                     "ngrok-skip-browser-warning": "true"
//                 }
//             });

//             const result = await response.json();
//             setStart(false);

//             if (response.ok) {
//                 toast.success("Call process stopped successfully");
//             } else {
//                 toast.error("Failed to stop the call process.");
//             }
//         } catch (error) {
//             console.error("Error stopping call process:", error);
//             toast.error("Error stopping call process:");
//         }
//     };



//     useEffect(() => {
//         const fetchData = async () => {
//             try {
//                 const response = await fetch("https://hogist.com/food-api/outsource/", {

//                     method: "GET",
//                     headers: {
//                         'Content-Type': 'application/json',
//                         "ngrok-skip-browser-warning": "true"
//                     },
//                 })
//                 const res = await response.json();
//                 console.log("FULL Response:", res);
//                 setTableData(Array.isArray(res) ? res : []);
//             } catch (err) {
//                 console.error("Error fetching data:", err);
//                 setError(err.message || "Failed to load data.");
//             }
//             finally {
//                 setLoading(false);
//             }
//         };
//         fetchData();
//     }, []);


//     if (loading) return (<div className="flex justify-center items-center h-screen w-full">
//         <span className="loader"></span>
//     </div>);
//     if (error) return (<div className="flex justify-center items-center h-screen w-full">
//         <p className="text-center p-4 text-red-500 flex justify-center">{error}</p>
//     </div>)


//     const filteredData = tableData.filter((row) => {
//         const createdData = new Date(row.created_at);
//         const now = new Date();

//         if (filter === "today") {
//             return createdData.toDateString() === now.toDateString();
//         }
//         else if (filter === "month") {
//             return createdData.getMonth() === now.getMonth() && createdData.getFullYear() === now.getFullYear()
//         }
//         else if (filter === "year") {
//             return createdData.getFullYear() === now.getFullYear()
//         }
//         return true;
//     })


//     return (
//         <div className="px-4 pt-5 ibm">
//             <h1 className="font-bold text-4xl text-green-600 text-center py-5">OutSource Database</h1>
//             <div className="flex justify-between gap-10">

//                 <select value={filter} onChange={(e) => setFilter(e.target.value)} className="cursor-pointer  border rounded border-white py-1 px-4 my-2 ">
//                     <option value="year" className=" cursor-pointer bg-black">This Year</option>
//                     <option value="month" className="cursor-pointer bg-black">This Month</option>
//                     <option value="today" className=" cursor-pointer appearance-none focus:outline-none  bg-black">Today</option>
//                 </select>
//                 <div className="flex flex-col md:flex-row md:gap-5 ">
//                     <button className="bg-red-600 text-white px-4 py-1 text-md rounded cursor-pointer hover:bg-red-700 my-2 " onClick={stopCall}>
//                         Stop Call
//                     </button>
//                     <button
//                         onClick={startCall}
//                         disabled={start}
//                         className={`px-4 py-1 text-md rounded my-2 cursor-pointer ${start
//                             ? "bg-gray-400 text-white cursor-not-allowed"
//                             : "bg-green-600 text-white hover:bg-green-700"
//                             }`}
//                     >
//                         {start ? "Calling..." : "Start Call"}
//                     </button>

//                 </div>
//             </div>
//             <div className="overflow-x-auto">
//                 <div className="h-[73vh] overflow-y-auto border border-gray-300">
//                     <table className="w-full min-w-[1200px] ">
//                         <thead className="bg-gray-200 sticky top-0 z-10">
//                             <tr>
//                                 {[
//                                     "Name", "Organization", "Designation", "Address",
//                                     "Contact Number", "Email", "Status", "Source",
//                                     "Created At"
//                                 ].map((header, index) => (
//                                     <th key={index} className="px-3 py-3 text-left text-xs font-medium text-gray-900 uppercase tracking-wider whitespace-nowrap">
//                                         {header}
//                                     </th>
//                                 ))}
//                             </tr>
//                         </thead>
//                         <tbody>
//                             {Array.isArray(filteredData) && filteredData.length > 0 ? (
//                                 filteredData.map((row, index) => (
//                                     <tr key={index} className="hover:bg-gray-900">
//                                         <td className="px-3 py-5 whitespace-nowrap text-sm text-gray-200">{row.name || "N/A"}</td>
//                                         <td className="px-3 py-5 whitespace-nowrap text-sm text-gray-200">{row.org_name || "N/A"}</td>
//                                         <td className="px-3 py-5 whitespace-nowrap text-sm text-gray-200">{row.designation || "N/A"}</td>
//                                         <td className="px-3 py-5 whitespace-nowrap text-sm text-gray-200">{row.Address || "N/A"}</td>
//                                         <td className="px-3 py-5 whitespace-nowrap text-sm text-gray-200">{row.contact_number}</td>
//                                         <td className="px- py-5 whitespace-nowrap text-sm text-gray-200">{row.mail_id || "N/A"}</td>
//                                         <td className="px-3 py-5 whitespace-nowrap text-sm font-medium">
//                                             <span className={`px-3 py-1 rounded-full capitalize text-white
//                                                     ${row.status?.toLowerCase() === 'called' ? 'bg-green-600' :
//                                                     row.status?.toLowerCase() === 'initiated' ? 'bg-blue-600' :
//                                                         row.status?.toLowerCase() === 'pending' ? 'bg-orange-400' : 'bg-red-600'}`}>
//                                                 {row.status || "N/A"}
//                                             </span>
//                                         </td>

//                                         <td className="px-3 py-5 whitespace-nowrap text-sm text-gray-200">{row.source_come_from || "N/A"}</td>
//                                         <td className="px-3 py-5 whitespace-nowrap text-sm text-gray-200">{new Date(row.created_at).toLocaleString()}</td>
//                                     </tr>
//                                 ))
//                             ) : (
//                                 <tr>
//                                     <td colSpan={9} className="text-center p-4 text-sm text-gray-500">
//                                         No data available
//                                     </td>
//                                 </tr>
//                             )}
//                         </tbody>
//                     </table>
//                 </div>
//             </div>
//         </div>
//     );
// };

import { useState, useEffect } from "react";
import { BiRefresh } from "react-icons/bi";
import { toast } from "react-toastify";

export const OutsourceDB = () => {
    const [tableData, setTableData] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [filter, setFilter] = useState("year");
    const [start, setStart] = useState(false);

    const startCall = async () => {
        toast.info("📞 Calling process started...");
        setStart(true);
    
        try {
            const response = await fetch("https://hogist.com/food-api/call-ai-agent/", {
                method: "GET",
                headers: {
                    "ngrok-skip-browser-warning": "true"
                }
            });
    
            const result = await response.json();
    
            if (response.ok) {
                toast.success("✅ Call process triggered successfully");
                console.log("✅ Backend call sequencing started:", result);
            } else {
                toast.error("❌ Failed to trigger call process");
                console.error("Error response:", result);
            }
    
        } catch (err) {
            toast.error("❌ Error starting call process");
            console.error("❌ Fetch error:", err);
        }
    
        setStart(false);
    };
    


    const stopCall = async () => {
        if (!start) {
            toast.warning("No call is currently running to stop.");
            return;  //  Exit early if no call was started
        }

        try {
            const response = await fetch("https://hogist.com/food-api/stop-call/", {
                method: "POST",
                headers: {
                    "ngrok-skip-browser-warning": "true"
                }
            });

            const result = await response.json();
            setStart(false);

            if (response.ok) {
                toast.success("Call process stopped successfully");
            } else {
                toast.error("Failed to stop the call process.");
            }
        } catch (error) {
            console.error("Error stopping call process:", error);
            toast.error("Error stopping call process:", error);
        }
    };


    const fetchData = async () => {
        setLoading(true);  // <-- Show loader while fetching
        try {
            const response = await fetch("https://hogist.com/food-api/outsource/", {
                method: "GET",
                headers: {
                    'Content-Type': 'application/json',
                    "ngrok-skip-browser-warning": "true"
                },
            });
            const res = await response.json();
            setTableData(Array.isArray(res) ? res : []);
        } catch (err) {
            console.error("Error fetching data:", err);
            setError(err.message || "Failed to load data.");
        } finally {
            setLoading(false);  // <-- Stop loader
        }
    };
    

    useEffect(() => {
        fetchData();  // initial load
    }, []);


    if (loading) return <div className="flex justify-center items-center h-screen w-full">
        <span className="loader"></span>
    </div>;
    if (error) return; <div className="flex justify-center items-center h-screen w-full">
        <p className="text-center p-4 text-red-500 flex justify-center">{error}</p>
    </div>

    const filteredData = tableData.filter((row) => {
        const createdData = new Date(row.created_at);
        const now = new Date();

        if (filter === "today") {
            return createdData.toDateString() === now.toDateString();
        }
        else if (filter === "month") {
            return createdData.getMonth() === now.getMonth() && createdData.getFullYear() === now.getFullYear()
        }
        else if (filter === "year") {
            return createdData.getFullYear() === now.getFullYear()
        }
        return true;
    })


    return (
        <div className="px-4 pt-5 ibm">
            <h1 className="font-bold text-4xl text-green-600 text-center py-5">OutSource Database</h1>
            <div className="flex justify-between gap-10">

                <div className="flex items-center gap-5">
                <select value={filter} onChange={(e) => setFilter(e.target.value)} className="cursor-pointer  border rounded border-white py-1 px-4 my-2 ">
                    <option value="year" className=" cursor-pointer bg-black">This Year</option>
                    <option value="month" className="cursor-pointer bg-black">This Month</option>
                    <option value="today" className=" cursor-pointer appearance-none focus:outline-none  bg-black">Today</option>
                </select>
                <button
                        className=" border border-white text-white px-4 py-1 text-md rounded cursor-pointer  my-2"
                        onClick={fetchData}
                    >
                        <BiRefresh size={24}/>
                    </button>
                </div>
                <div className="flex flex-col md:flex-row md:gap-5 ">
                    <button className="bg-red-600 text-white px-4 py-1 text-md rounded cursor-pointer hover:bg-red-700 my-2 " onClick={stopCall}>
                        Stop Call
                    </button>
                    <button
                        onClick={startCall}
                        disabled={start}
                        className={`px-4 py-1 text-md rounded my-2 cursor-pointer ${start
                            ? "bg-gray-400 text-white cursor-not-allowed"
                            : "bg-green-600 text-white hover:bg-green-700"
                            }`}
                    >
                        {start ? "Calling..." : "Start Call"}
                    </button>

                </div>
            </div>
            <div className="overflow-x-auto">
                <div className="h-[73vh] overflow-y-auto border border-gray-300">
                    <table className="w-full min-w-[1200px] ">
                        <thead className="bg-gray-200 sticky top-0 z-10">
                            <tr>
                                {[
                                    "Name", "Organization", "Designation", "Address",
                                    "Contact Number", "Email", "Status", "Source",
                                    "Created At"
                                ].map((header, index) => (
                                    <th key={index} className="px-3 py-3 text-left text-xs font-medium text-gray-900 uppercase tracking-wider whitespace-nowrap">
                                        {header}
                                    </th>
                                ))}
                            </tr>
                        </thead>
                        <tbody>
                            {Array.isArray(filteredData) && filteredData.length > 0 ? (
                                filteredData.map((row, index) => (
                                    <tr key={index} className="hover:bg-gray-900">
                                        <td className="px-3 py-5 whitespace-nowrap text-sm text-gray-200">{row.name || "N/A"}</td>
                                        <td className="px-3 py-5 whitespace-nowrap text-sm text-gray-200">{row.org_name || "N/A"}</td>
                                        <td className="px-3 py-5 whitespace-nowrap text-sm text-gray-200">{row.designation || "N/A"}</td>
                                        <td className="px-3 py-5 whitespace-nowrap text-sm text-gray-200">{row.Address || "N/A"}</td>
                                        <td className="px-3 py-5 whitespace-nowrap text-sm text-gray-200">{row.contact_number}</td>
                                        <td className="px-3 py-5 whitespace-nowrap text-sm text-gray-200">{row.mail_id || "N/A"}</td>
                                        <td className="px-3 py-5 whitespace-nowrap text-sm font-medium">
                                            <span className={`px-3 py-1 rounded-full capitalize text-white
                                                    ${row.status?.toLowerCase() === 'called' ? 'bg-green-600' :
                                                    row.status?.toLowerCase() === 'initiated' ? 'bg-blue-600' :
                                                        row.status?.toLowerCase() === 'pending' ? 'bg-orange-400' : 'bg-red-600'}`}>
                                                {row.status || "N/A"}
                                            </span>
                                        </td>

                                        <td className="px-3 py-5 whitespace-nowrap text-sm text-gray-200">{row.source_come_from || "N/A"}</td>
                                        <td className="px-3 py-5 whitespace-nowrap text-sm text-gray-200">{new Date(row.created_at).toLocaleString()}</td>
                                    </tr>
                                ))
                            ) : (
                                <tr>
                                    <td colSpan={9} className="text-center p-4 text-sm text-gray-500">
                                        No data available
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
};