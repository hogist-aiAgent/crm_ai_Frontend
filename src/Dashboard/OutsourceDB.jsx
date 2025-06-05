import { useState, useEffect } from "react";
import { BiRefresh } from "react-icons/bi";
import { RiDeleteBinLine } from "react-icons/ri";
import { FaFilter } from "react-icons/fa";
import { toast } from "react-toastify";
import * as XLSX from "xlsx";
import { saveAs } from "file-saver";
import SearchBar from "../components/common/searchBar";
import { PhoneIcon, PhoneXMarkIcon } from '@heroicons/react/24/solid';
import StatusSummaryCards from "../components/common/DashboardCard";
import CallStatusBarChart from "../components/common/ChartReports";
import ToggleButtonGroup from "../components/common/ToggleButton";
export const OutsourceDB = () => {
  const [tableData, setTableData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [filter, setFilter] = useState("year");
  const [start, setStart] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedStatuses, setSelectedStatuses] = useState([]);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 50;
    const [fromDate, setFromDate] = useState("");
const [toDate, setToDate] = useState("");
  const exportToExcel = (data, fileName = "Outsource_Leads") => {
    const worksheet = XLSX.utils.json_to_sheet(data);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Sheet1");

    const excelBuffer = XLSX.write(workbook, { bookType: "xlsx", type: "array" });
    const dataBlob = new Blob([excelBuffer], { type: "application/octet-stream" });
    saveAs(dataBlob, `${fileName}.xlsx`);
  };
    const [activeView, setActiveView] = useState('table');
useEffect(()=>{if(searchTerm){
  setCurrentPage(1)
}},[searchTerm,])

  useEffect(() => {
    const handleClickOutside = () => {
      setDropdownOpen(false);
    };
    document.addEventListener("click", handleClickOutside);
    return () => document.removeEventListener("click", handleClickOutside);
  }, []);

  const startCall = async () => {
    const hasNewLead = filteredData.some((row) => row.status?.toLowerCase() === "new");

    if (!hasNewLead) {
      toast.warning("No new leads to call");
      return;
    }

    toast.info("📞 Calling process started...");
    setStart(true);

    try {
      const response = await fetch("https://hogist.com/food-api/call-ai-agent/", {
        method: "GET",
        headers: {
          "ngrok-skip-browser-warning": "true",
        },
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
      return;
    }

    try {
      const response = await fetch("https://hogist.com/food-api/stop-call/", {
        method: "POST",
        headers: {
          "ngrok-skip-browser-warning": "true",
        },
      });

      const result = await response.json();
      setStart(false);

      if (response.ok) {
        toast.success("Call process stopped successfully");
      } else {
        toast.error("Failed to stop the call process.");
      }
    } catch (error) {
      toast.error("Error stopping call process");
      console.error("Error:", error);
    }
  };

  const fetchData = async () => {
    setLoading(true);
    try {
      const response = await fetch("https://hogist.com/food-api/outsource/", {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          "ngrok-skip-browser-warning": "true",
        },
      });
      const res = await response.json();
      setTableData(Array.isArray(res) ? res : []);
    } catch (err) {
      console.error("Error fetching data:", err);
      setError(err.message || "Failed to load data.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);
useEffect(()=>{
setSearchTerm("")
  
},[activeView])
  const deleteLead = async (phone) => {
    if (!window.confirm("Are you sure you want to delete this lead?")) return;

    try {
      const response = await fetch("https://hogist.com/food-api/delete-outsource-lead/", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "ngrok-skip-browser-warning": "true",
        },
        body: JSON.stringify({ contact_number: phone }),
      });

      const result = await response.json();

      if (response.ok) {
        toast.success("✅ Lead deleted successfully");
        fetchData();
      } else {
        toast.error("❌ Failed to delete lead");
        console.error("Error:", result);
      }
    } catch (err) {
      toast.error("❌ Network error while deleting lead");
      console.error("❌ Delete error:", err);
    }
  };

const filteredData = tableData.filter((row) => {
 
  const createdData = new Date(row.created_at);
  const now = new Date();

  let dateMatch = true;
  if (filter === "today") {
    dateMatch = createdData.toDateString() === now.toDateString();
  } else if (filter === "month") {
    dateMatch =
      createdData.getMonth() === now.getMonth() &&
      createdData.getFullYear() === now.getFullYear();
  } else if (filter === "year") {
    dateMatch = createdData.getFullYear() === now.getFullYear();
  }
//test
  // Filter by fromDate and toDate if provided
  if (fromDate) {
    const from = new Date(fromDate);
    dateMatch = dateMatch && createdData >= from;
  }
  if (toDate) {
    const to = new Date(toDate);
    // Adding a full day to include 'toDate' till the end of the day
    to.setHours(23, 59, 59, 999);
    dateMatch = dateMatch && createdData <= to;
  }

  let statusMatch = true;
  if (selectedStatuses.length > 0) {
    statusMatch = selectedStatuses.includes(row.status?.toLowerCase());
  }

  const searchMatch = Object.values(row).some((value) =>
    value?.toString().toLowerCase().includes(searchTerm.toLowerCase())
  );

  return dateMatch && statusMatch && searchMatch;
});

  const totalPages = Math.ceil(filteredData.length / itemsPerPage);
  const paginatedData = filteredData.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);

  if (loading)
    return (
      <div className="flex justify-center items-center h-screen w-full">
        <span className="loader"></span>
      </div>
    );

  if (error)
    return (
      <div className="flex justify-center items-center h-screen w-full">
        <p className="text-red-500">{error}</p>
      </div>
    );

  return (
    <div className="px-4 pt-5 ibm">
      <h1 className="font-bold text-4xl text-green-600 text-center py-5">OutSource Database</h1>
    <div className="flex justify-between items-center flex-wrap-reverse">
<div>
    <SearchBar
    searchBarDisplay={activeView!=="table"}
  searchTerm={searchTerm}
  setSearchTerm={setSearchTerm}
  fromDate={fromDate}
  toDate={toDate}
  setFromDate={setFromDate}
  setToDate={setToDate}
/>
</div>
<div className=" mb-2 sm:mb-0">

          <ToggleButtonGroup active={activeView} setActive={setActiveView} />
</div>
        </div>
      
          {

          activeView==="dashboard"&& 

      <div className="p-1 pb-3">
      <StatusSummaryCards data={filteredData} />
<CallStatusBarChart data={tableData} />

      </div>
        
        }

    
          {

          activeView==="table"&& 

     <>
       <div className="flex flex-wrap justify-between items-center  gap-x-4  ">
        <div className="flex items-center  gap-x-4 flex-wrap w-full ">
             <button
            onClick={() => exportToExcel(filteredData)}
            className="bg-green-600 text-white    px-4 py-[6px] mb-5 sm:mb-0  rounded hover:bg-green-700"
          >
            Export file
          </button>
          <div className="relative inline-block w-40 mb-5 sm:mb-0 ">
            <select
              value={filter}
              onChange={(e) =>{
                    setFromDate("")
           setToDate("")
                setFilter(e.target.value)}}
              className="cursor-pointer appearance-none w-full rounded border border-white bg-black text-white py-[6px] px-4 pr-8"
            >
              <option value="year" className="bg-black">This Year</option>
              <option value="month" className="bg-black">This Month</option>
              <option value="today" className="bg-black">Today</option>
            </select>
            <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-white">
              <svg className="fill-current h-4 w-4" viewBox="0 0 20 20">
                <path d="M5.5 7l4.5 4.5L14.5 7z" />
              </svg>
            </div>
          </div>


        
  <button onClick={fetchData} className="border border-white text-white px-4 py-2 rounded">
            <BiRefresh size={20} />
          </button>
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
 <div className="flex justify-start gap-3 flex-wrap pb-3">
      
        </div>
       <div className="overflow-x-auto">
        <div className="h-[73vh] overflow-y-auto border-2 border-gray-800">
          <table className="w-full min-w-[1200px]">
            <thead className="bg-gray-800 sticky top-0 z-10">
              <tr>
                {[
                  "Id",
                  "Name", "Organization", "Designation", "Address", "Contact Number", "Email",
                  "Status", "Source", "Created At", "Actions"
                ].map((header, index) => (
                  <th
                    key={index}
                    className="px-3 py-3 text-left text-xs font-medium text-gray-200 uppercase whitespace-nowrap tracking-wider"
                  >
                    <div className="flex items-center">
                      {header}
                      {header === "Status" && (
                        <div className="relative ml-2" onClick={(e) => e.stopPropagation()}>
                          <button onClick={() => setDropdownOpen(!dropdownOpen)}>
                            <FaFilter />
                          </button>
                          {dropdownOpen && (
                            <div className="absolute z-20 mt-2 w-48 bg-gray-800 border border-gray-200 rounded shadow p-2">
                              {["new", "called", "initiated", "pending"].map((status) => (
                                <label key={status} className="block text-sm capitalize text-white">
                                  <input
                                    type="checkbox"
                                    value={status}
                                    className="mr-2"
                                    checked={selectedStatuses.includes(status)}
                                    onChange={(e) => {
                                       setCurrentPage(1)
                                      const checked = e.target.checked;
                                      setSelectedStatuses((prev) =>
                                        checked
                                          ? [...prev, status]
                                          : prev.filter((s) => s !== status)
                                      );
                                    }}
                                  />
                                  {status}
                                </label>
                              ))}
                              <div className="mt-2 text-right">
                                <button
                                  className="text-xs text-blue-500 hover:underline"
                                  onClick={() => setSelectedStatuses([])}
                                >
                                  Clear All
                                </button>
                              </div>
                            </div>
                          )}
                        </div>
                      )}
                    </div>
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {paginatedData.length > 0 ? (
                paginatedData
                  .filter((row) => row.contact_number && row.contact_number.length === 10)
                  .map((row, index) => (
                    <tr key={index} className="hover:bg-gray-900">
                      <td className="px-3 py-5 text-sm text-gray-200 whitespace-nowrap">{row.id || "N/A"}</td>
                      <td className="px-3 py-5 text-sm text-gray-200 whitespace-nowrap">{row.name || "N/A"}</td>
                      <td className="px-3 py-5 text-sm text-gray-200 whitespace-nowrap">{row.org_name || "N/A"}</td>
                      <td className="px-3 py-5 text-sm text-gray-200 whitespace-nowrap">{row.designation || "N/A"}</td>
                      <td className="px-3 py-5 text-sm text-gray-200 whitespace-nowrap">{row.Address || "N/A"}</td>
                      <td className="px-3 py-5 text-sm text-gray-200 whitespace-nowrap">{row.contact_number}</td>
                      <td className="px-3 py-5 text-sm text-gray-200 whitespace-nowrap">{row.mail_id || "N/A"}</td>
                      <td className="px-3 py-5 text-sm font-medium whitespace-nowrap">
                        <span className={`px-3 py-1 rounded-full capitalize text-white
                          ${row.status?.toLowerCase() === "called" ? "bg-green-600" :
                            row.status?.toLowerCase() === "initiated" ? "bg-blue-600" :
                            row.status?.toLowerCase() === "pending" ? "bg-orange-400" : "bg-red-600"
                          }`}>
                          {row.status || "N/A"}
                        </span>
                      </td>
                      <td className="px-3 py-5 text-sm text-gray-200 whitespace-nowrap">{row.source_come_from || "N/A"}</td>
                      <td className="px-3 py-5 text-sm text-gray-200 whitespace-nowrap">
                        {new Date(row.created_at).toLocaleString()}
                      </td>
                      <td className="px-3 py-5 text-sm text-gray-200 whitespace-nowrap">
                        <button
                          className="bg-red-700 hover:bg-red-800 text-white px-3 py-1 rounded"
                          onClick={() => deleteLead(row.contact_number)}
                        >
                          <RiDeleteBinLine size={20} />
                        </button>
                      </td>
                    </tr>
                  ))
              ) : (
                <tr>
                  <td colSpan={10} className="text-center p-4 text-sm text-gray-500">
                    No data available
                  </td>
                </tr>
              )}
            </tbody>
          </table>

          {/* Pagination Controls */}
         
        </div>
         <div className="flex justify-end items-center gap-2 mt-4 flex-wrap pb-5">
            <button
              onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
              disabled={currentPage === 1}
              className="px-3 py-1 rounded bg-gray-700 text-white disabled:opacity-50"
            >
              Prev
            </button>

            {(() => {
              const pageButtons = [];
              const maxVisiblePages = 7;
              let startPage = Math.max(1, currentPage - Math.floor(maxVisiblePages / 2));
              let endPage = Math.min(totalPages, startPage + maxVisiblePages - 1);

              if (endPage - startPage + 1 < maxVisiblePages) {
                startPage = Math.max(1, endPage - maxVisiblePages + 1);
              }

              if (startPage > 1) {
                pageButtons.push(
                  <button
                    key={1}
                    onClick={() => setCurrentPage(1)}
                    className="px-3 py-1 rounded bg-gray-700 text-white"
                  >
                    1
                  </button>
                );
                if (startPage > 2) {
                  pageButtons.push(<span key="start-ellipsis" className="px-2">...</span>);
                }
              }

              for (let i = startPage; i <= endPage; i++) {
                pageButtons.push(
                  <button
                    key={i}
                    onClick={() => setCurrentPage(i)}
                    className={`px-3 py-1 rounded ${
                      currentPage === i ? "bg-green-600 text-white" : "bg-gray-700 text-white"
                    }`}
                  >
                    {i}
                  </button>
                );
              }

              if (endPage < totalPages) {
                if (endPage < totalPages - 1) {
                  pageButtons.push(<span key="end-ellipsis" className="px-2">...</span>);
                }
                pageButtons.push(
                  <button
                    key={totalPages}
                    onClick={() => setCurrentPage(totalPages)}
                    className="px-3 py-1 rounded bg-gray-700 text-white"
                  >
                    {totalPages}
                  </button>
                );
              }

              return pageButtons;
            })()}

            <button
              onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))}
              disabled={currentPage === totalPages}
              className="px-3 py-1 rounded bg-gray-700 text-white disabled:opacity-50"
            >
              Next
            </button>
          </div>
      </div>
     </>
        
        }
      {/* Table */}
     
    </div>
  );
};
