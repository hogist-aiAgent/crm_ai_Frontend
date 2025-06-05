import { useState, useEffect } from "react";
import { FaArrowDown, FaArrowUp, FaFilter } from "react-icons/fa";
import * as XLSX from "xlsx";
import { saveAs } from "file-saver";
import SearchBar from "../components/common/searchBar";
import {
  FaEye,
  FaCheckCircle,
  FaExclamationCircle,
  FaLock,
  FaUserCircle,
  FaSpinner,
  FaInfoCircle,
} from "react-icons/fa";

export const B2B = () => {
  const [tableData, setTableData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [sortOrder, setSortOrder] = useState("asc");
  const [filter, setFilter] = useState("year");
  const [selectedStatuses, setSelectedStatuses] = useState([]);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [editingStatus, setEditingStatus] = useState(null);
  const [newStatusValue, setNewStatusValue] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const [fromDate, setFromDate] = useState("");
const [toDate, setToDate] = useState("");
const [editingRemark, setEditingRemark] = useState(null);
const [newRemarkValue, setNewRemarkValue] = useState("");

  const [currentPage, setCurrentPage] = useState(1);
  const [selectedTracking, setSelectedTracking] = useState(null);
  const itemsPerPage = 50;
useEffect(()=>{if(searchTerm){
  setCurrentPage(1)
}},[searchTerm])



  useEffect(() => {
    const handleClickOutside = () => {
      setDropdownOpen(false);
      if (editingStatus !== null) {
        setEditingStatus(null);
      }
    };
    document.addEventListener("click", handleClickOutside);
    return () => document.removeEventListener("click", handleClickOutside);
  }, [editingStatus]);

  const exportToExcel = (data, fileName = "ExportedData") => {
    const worksheet = XLSX.utils.json_to_sheet(data);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Sheet1");
    const excelBuffer = XLSX.write(workbook, {
      bookType: "xlsx",
      type: "array",
    });
    const dataBlob = new Blob([excelBuffer], {
      type: "application/octet-stream",
    });
    saveAs(dataBlob, `${fileName}.xlsx`);
  };
const handleRemarkUpdate = async (row) => {
  try {
    const requestPayload = {
      event_type: "b2b",
      contact_number: row.contact_number,
      remark: newRemarkValue,
    };

    const response = await fetch("https://hogist.com/food-api/update_remark/", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "ngrok-skip-browser-warning": "true",
      },
      body: JSON.stringify(requestPayload),
    });

    if (!response.ok) {
      let errorData;
      try {
        errorData = await response.json();
      } catch (e) {
        errorData = { message: await response.text() };
      }
      throw new Error(errorData.message || `HTTP error! status: ${response.status}`);
    }

    const updatedDataResponse = await fetch("https://hogist.com/food-api/get_b2b/");
    const updatedData = await updatedDataResponse.json();
    setTableData(updatedData);
    setEditingRemark(null);
    setNewRemarkValue("");
  } catch (err) {
    console.error("Remark update failed:", err);
    alert(`Remark update failed: ${err.message}`);
  }
};

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch("https://hogist.com/food-api/get_b2b/", {
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
    fetchData();
  }, []);

  const handleSort = () => {
    const sortedData = [...tableData].sort((a, b) => {
      const scoreA = a.lead_score || 0;
      const scoreB = b.lead_score || 0;
      return sortOrder === "asc" ? scoreA - scoreB : scoreB - scoreA;
    });
    setTableData(sortedData);
    setSortOrder(sortOrder === "asc" ? "desc" : "asc");
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
    statusMatch = selectedStatuses.includes(row.lead_status?.toLowerCase());
  }

  const searchMatch = Object.values(row).some((value) =>
    value?.toString().toLowerCase().includes(searchTerm.toLowerCase())
  );

  return dateMatch && statusMatch && searchMatch;
});


  const totalPages = Math.ceil(filteredData.length / itemsPerPage);
  const paginatedData = filteredData.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const getStatusBadge = (status) => {  
    let baseClass =
      "text-white px-4 py-1 rounded-full text-xs font-semibold capitalize";
    switch (status?.toLowerCase()) {
      case "cold":
        return <span className={`${baseClass} bg-red-700`}>Cold</span>;
      case "warm":
        return <span className={`${baseClass} bg-orange-400`}>Warm</span>;
      case "hot":
        return <span className={`${baseClass} bg-green-600`}>Hot</span>;
      case "not interested":
        return (
          <span className={`${baseClass} bg-gray-500`}>Not Interested</span>
        );
      default:
        return <span className={`${baseClass} bg-gray-600`}>N/A</span>;
    }
  };
  console.log(selectedTracking,"selectedTracking")

  const handleStatusUpdate = async (row) => {
    try {
      const requestPayload = {
        event_type: "b2b",
        contact_number: row.contact_number,
        status: newStatusValue,
      };

      const response = await fetch(
        "https://hogist.com/food-api/update-lead-status/",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            "ngrok-skip-browser-warning": "true",
          },
          body: JSON.stringify(requestPayload),
        }
      );

      if (!response.ok) {
        let errorData;
        try {
          errorData = await response.json();
        } catch (e) {
          errorData = { message: await response.text() };
        }
        throw new Error(
          errorData.message || `HTTP error! status: ${response.status}`
        );
      }

      const updatedDataResponse = await fetch(
        "https://hogist.com/food-api/get_b2b/"
      );
      const updatedData = await updatedDataResponse.json();
      setTableData(updatedData);
      setEditingStatus(null);
      setNewStatusValue("");
    } catch (err) {
      console.error("Update failed:", err);
      alert(`Status update failed: ${err.message}`);
    }
  };

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

  const displayedColumns = [
    "id",
    "name",
    "contact_number",
    "alternate_number",
    "email",
    "event_type",
    "company_name",
    "designation",
    "delivery_location",
    "count",
    "required_meal_service",
    "dietary_options",
    "service_type",
    "service_choice",
    "choice_of_menu",
    "existing_menu_budget",
    "prefered_menu_budget",
    "meeting_date_time",
    "lead_status",
    "status",
    "remark",
    "created_at",
    "lead_score",
    "call_id",
    "action",
  ];
  return (
    <div className="px-4 pt-5 ibm">
      <h1 className="font-bold text-4xl text-green-600 text-center py-5">
        B2B
      </h1>

      <div className="flex flex-wrap items-center gap-4 ">
        <button
          onClick={() => exportToExcel(filteredData, "B2B_Leads")}
          className="bg-green-600 text-white px-4 py-[5.5px]  rounded hover:bg-green-700"
        >
          Export file
        </button>

        <div className="relative inline-block w-40">
          <select
            value={filter}
            onChange={(e) => {
                 setFromDate("")
           setToDate("")
              setFilter(e.target.value)}}
            className="cursor-pointer appearance-none w-full rounded border border-white bg-black text-white py-[6px] px-4 pr-8"
          >
            <option value="year" className="bg-black">
              This Year
            </option>
            <option value="month" className="bg-black">
              This Month
            </option>
            <option value="today" className="bg-black">
              Today
            </option>
          </select>
          <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-white">
            <svg className="fill-current h-4 w-4" viewBox="0 0 20 20">
              <path d="M5.5 7l4.5 4.5L14.5 7z" />
            </svg>
          </div>
        </div>

   <SearchBar
  searchTerm={searchTerm}
  setSearchTerm={setSearchTerm}
  fromDate={fromDate}
  toDate={toDate}
  setFromDate={setFromDate}
  setToDate={setToDate}
/>


      </div>

      <div className="overflow-x-auto">
        <div className="h-[73vh] border-2 border-gray-800 overflow-y-auto">
          <table className="w-full min-w-[1200px]">
            <thead className="bg-gray-800 sticky top-0 z-10">
              <tr>
                {displayedColumns.map((key) => (
                  <th
                    key={key}
                    className="px-3 py-3 text-left text-xs font-medium text-gray-200 uppercase tracking-wider whitespace-nowrap"
                  >
                    <div className="flex items-center">
                      {key === "lead_score"
                        ? "Lead Score"
                        : key.replace(/_/g, " ")}
                      {key === "lead_score" && (
                        <button onClick={handleSort} className="ml-1 px-1">
                          {sortOrder === "asc" ? (
                            <FaArrowDown />
                          ) : (
                            <FaArrowUp />
                          )}
                        </button>
                      )}
                      {key === "lead_status" && (
                        <div
                          className="relative ml-2"
                          onClick={(e) => e.stopPropagation()}
                        >
                          <button
                            onClick={() => setDropdownOpen(!dropdownOpen)}
                          >
                            <FaFilter />
                          </button>
                          {dropdownOpen && (
                            <div className="absolute z-20 mt-2 w-48 bg-gray-800 border border-gray-300 rounded shadow p-2">
                              {["hot", "warm", "cold", "not interested"].map(
                                (status) => (
                                  <label
                                    key={status}
                                    className="block text-sm capitalize"
                                  >
                                    <input
                                      type="checkbox"
                                      value={status}
                                      className="mr-2"
                                      checked={selectedStatuses.includes(
                                        status
                                      )}
                                      onChange={(e) => {
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
                                )
                              )}
                              <div className="mt-2 text-right">
                                <button
                                  onClick={() => setSelectedStatuses([])}
                                  className="text-xs text-blue-600 hover:underline"
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
                paginatedData.map((row, i) => (
                  <tr key={i} className="hover:bg-gray-900">
                    {displayedColumns.map((key, idx) => {
                      const value = row[key];
                      if (key === "lead_status")
                        return (
                          <td
                            key={idx}
                            className="px-3 py-5 text-sm text-gray-200 whitespace-nowrap"
                          >
                            {getStatusBadge(value)}
                          </td>
                        );
                        if (key === "remark") {
  return (
    <td
      key={idx}
      className="px-3 py-5 text-sm text-gray-200 relative whitespace-nowrap"
    >
      <div className="flex items-center">
        <span className="mr-2">{value || "N/A"}</span>
        <button
          onClick={(e) => {
            e.stopPropagation();
            setEditingRemark(row.id);
            setNewRemarkValue(value || "");
              setEditingStatus(null);
                                  setNewStatusValue("");
          }}
          className="text-white px-2 py-1 rounded-full border border-white text-xs"
        >
          +
        </button>
      </div>
      {editingRemark === row.id && (
        <div
          className="absolute z-10 bg-gray-800 rounded shadow-lg mt-1 left-0 right-0"
          onClick={(e) => e.stopPropagation()}
        >
          <input
            type="text"
            value={newRemarkValue}
            onChange={(e) => setNewRemarkValue(e.target.value)}
            className="w-full py-2 pl-2 text-white outline-none"
            placeholder="Enter remark"
          />
          <button
            onClick={() => handleRemarkUpdate(row)}
            className="bg-green-600 text-white px-2 py-2 text-sm"
          >
            Apply
          </button>
        </div>
      )}
    </td>
  );
}

                      if (key === "status")
                        return (
                          <td
                            key={idx}
                            className="px-3 py-5 text-sm text-gray-200 relative whitespace-nowrap"
                          >
                            <div className="flex items-center">
                              <span className="mr-2">{value || "N/A"}</span>
                              <button
                                onClick={(e) => {
                                  
                                  e.stopPropagation();
                                    setEditingRemark(null);
            setNewRemarkValue("");
                                  setEditingStatus(row.id);
                                  setNewStatusValue(value || "");
                                }}
                                className="text-white px-2 py-1 rounded-full border border-white text-xs"
                              >
                                +
                              </button>
                            </div>
                            {editingStatus === row.id && (
                              <div
                                className="absolute z-10 bg-gray-800 rounded shadow-lg mt-1 left-0 right-0"
                                onClick={(e) => e.stopPropagation()}
                              >
                                <input
                                  type="text"
                                  value={newStatusValue}
                                  onChange={(e) =>
                                    setNewStatusValue(e.target.value)
                                  }
                                  className="w-full py-2 pl-2 text-white outline-none"
                                  placeholder="Enter status"
                                />
                                <button
                                  onClick={() => handleStatusUpdate(row)}
                                  className="bg-green-600 text-white px-2 py-2 text-sm"
                                >
                                  Apply
                                </button>
                              </div>
                            )}
                          </td>
                        );
                      if (key === "created_at" || key === "meeting_date_time") {
                        return (
                          <td
                            key={idx}
                            className="px-3 py-5 text-sm text-gray-200 whitespace-nowrap"
                          >
                            {value ? new Date(value).toLocaleString() : "N/A"}
                          </td>
                        );
                      }
                      if (key === "action") {
                        return (
                          <td
                            key={idx}
                            className="px-3 py-5 text-sm text-gray-200 whitespace-nowrap text-center"
                          >
                            <button
                              onClick={() =>
                                setSelectedTracking({
                                  history: row.tracking_history || [],
                                  id: row.id,
                                  ...row
                                })
                              }
                              className="text-blue-500 hover:text-blue-400"
                              title="View Timeline"
                            >
                              <FaEye size={24} />
                            </button>
                          </td>
                        );
                      }

                      return (
                        <td
                          key={idx}
                          className="px-3 py-5 text-sm text-gray-200 whitespace-nowrap"
                        >
                          {value || "N/A"}
                        </td>
                      );
                    })}
                  </tr>
                ))
              ) : (
                <tr>
                  <td
                    colSpan={displayedColumns.length}
                    className="text-center p-4"
                  >
                    No data available
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Pagination controls */}
      <div className="flex justify-end items-center gap-2 mt-4 flex-wrap pb-5">
        <button
          onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
          disabled={currentPage === 1}
          className="px-3 py-1 rounded bg-gray-700 text-white disabled:opacity-50"
        >
          Prev
        </button>
        {Array.from({ length: totalPages }, (_, i) => (
          <button
            key={i + 1}
            onClick={() => setCurrentPage(i + 1)}
            className={`px-3 py-1 rounded ${
              currentPage === i + 1
                ? "bg-green-600 text-white"
                : "bg-gray-700 text-white"
            }`}
          >
            {i + 1}
          </button>
        ))}
        <button
          onClick={() =>
            setCurrentPage((prev) => Math.min(prev + 1, totalPages))
          }
          disabled={currentPage === totalPages}
          className="px-3 py-1 rounded bg-gray-700 text-white disabled:opacity-50"
        >
          Next
        </button>
      </div>

      {selectedTracking && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-60">
          <div className="relative bg-gray-900 w-full max-w-3xl rounded-lg shadow-lg max-h-[90vh] overflow-y-auto">
            {/* Header */}
            <div className="flex items-center justify-between border-b border-gray-700 px-6 py-4 sticky top-0 bg-gray-900 z-10">
              <div className="w-6" /> {/* Spacer for symmetry */}
              <h2 className="text-xl text-green-400 font-semibold text-center flex-1">
             {`Lead Tracking ${selectedTracking.id||""}-${selectedTracking.name||"None"}`}
              </h2>
              <button
                onClick={() => setSelectedTracking(null)}
                className="text-white text-2xl hover:text-red-500"
                title="Close"
              >
                &times;
              </button>
            </div>

            {selectedTracking.history.length === 0 ? (
              <div className="px-6 py-10 text-center text-gray-400">
                <p>No tracking history available.</p>
              </div>
            ) : (
              <div className="relative before:absolute before:left-1/2 before:top-0 before:h-full before:w-0.5 before:bg-gray-600 px-6 py-6">
                {selectedTracking.history.map((entry, idx) => {
                  const status = entry.lead_status?.toLowerCase() || "default";
                  const isLeft = idx % 2 === 0;

                  const iconMap = {
                    resolved: (
                      <FaCheckCircle className="text-green-500 text-xl" />
                    ),
                    escalated: (
                      <FaExclamationCircle className="text-red-500 text-xl" />
                    ),
                    closed: <FaLock className="text-purple-500 text-xl" />,
                    open: <FaUserCircle className="text-blue-400 text-xl" />,
                    "in progress": (
                      <FaSpinner className="text-cyan-400 text-xl animate-spin" />
                    ),
                    default: <FaInfoCircle className="text-gray-400 text-xl" />,
                  };

                  return (
                    <div
                      key={idx}
                      className={`mb-12 flex w-full justify-${
                        isLeft ? "start" : "end"
                      } relative`}
                    >
                      <div
                        className={`w-1/2 flex items-center justify-center px-4 ${
                          isLeft ? "order-2 text-left" : "order-1 text-right"
                        }`}
                      >
                        <p className="text-xs text-gray-500 mb-2">
                          {new Date(entry.timestamp).toLocaleString()} —{" "}
                          <em>{entry.modified_by}</em>
                        </p>
                      </div>

                      <div
                        className={`w-1/2 px-4 ${
                          isLeft ? "order-1 text-left" : "order-2 text-right"
                        }`}
                      >
                        <div className="p-4 bg-gray-800 rounded shadow-md relative">
                          <div
                            className={`absolute top-1/2 -translate-y-1/2 ${
                              isLeft ? "-right-7" : "-left-7"
                            }`}
                          >
                            <div className="w-6 h-6 rounded-full flex items-center justify-center bg-gray-700">
                              {iconMap[status] || iconMap.default}
                            </div>
                          </div>

                          {/* <p className="text-sm font-semibold text-white capitalize mb-1">
                            {entry.status}
                          </p> */}
                          <div className=" border-gray-700 py-1">
        <p className="text-sm text-gray-400">
          <span className="font-medium text-white">Remarks:</span>{" "}
          {entry.remark || "N/A"}
        </p>
      </div>
                         <div className="border-t border-gray-700 py-1">
        <p className="text-sm text-gray-400">
          <span className="font-medium text-white">Status:</span>{" "}
          {entry.status || "N/A"}
        </p>
      </div>
      
       <div className="border-t border-gray-700 py-2">
        <p className="text-sm text-gray-400">
          <span className="font-medium text-white">Lead Status:</span>{" "}
          {getStatusBadge(entry.lead_status) || "N/A"}
        </p>
      </div>
      {/* <td
                            key={idx}
                            className="px-3 py-5 text-sm text-gray-200 whitespace-nowrap"
                          >
                            {getStatusBadge(value)}
                          </td> */}
                          {/* <p className="text-xs text-gray-400">
                            {entry.remark}
                          </p> */}
                          
                         
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};
