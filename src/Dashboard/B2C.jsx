import { useState, useEffect } from "react";
import * as XLSX from "xlsx";
import { saveAs } from "file-saver";
import { FaArrowDown, FaArrowUp, FaFilter } from "react-icons/fa";
import SearchBar from "../components/common/searchBar";

export const B2C = () => {
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
  const itemsPerPage = 50;

  const exportToExcel = (data, fileName = "ExportedData") => {
    const worksheet = XLSX.utils.json_to_sheet(data);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Sheet1");
    const excelBuffer = XLSX.write(workbook, { bookType: "xlsx", type: "array" });
    const dataBlob = new Blob([excelBuffer], { type: "application/octet-stream" });
    saveAs(dataBlob, `${fileName}.xlsx`);
  };
const handleRemarkUpdate = async (row) => {

  try {
    const requestPayload = {
      event_type: "b2c",
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

    const updatedDataResponse = await fetch("https://hogist.com/food-api/get_b2c/");
    const updatedData = await updatedDataResponse.json();
    setTableData(updatedData);
    setEditingRemark(null);
    setNewRemarkValue("");
  } catch (err) {
    alert(`Remark update failed: ${err.message}`);
  }
};

  useEffect(() => {
    const handleClickOutside = () => setDropdownOpen(false);
    document.addEventListener("click", handleClickOutside);
    return () => document.removeEventListener("click", handleClickOutside);
  }, []);
  useEffect(()=>{if(searchTerm){
  setCurrentPage(1)
}},[searchTerm])


  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch("https://hogist.com/food-api/get_b2c/", {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            "ngrok-skip-browser-warning": "true",
          },
        });
        const res = await response.json();
        setTableData(Array.isArray(res) ? res : []);
      } catch (err) {
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
  const paginatedData = filteredData.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);
  const totalPages = Math.ceil(filteredData.length / itemsPerPage);

  const getStatusBadge = (status) => {
    let baseClass = "text-white px-4 py-1 rounded-full text-xs font-semibold capitalize";
    switch (status?.toLowerCase()) {
      case "cold":
        return <span className={`${baseClass} bg-red-700`}>Cold</span>;
      case "warm":
        return <span className={`${baseClass} bg-orange-400`}>Warm</span>;
      case "hot":
        return <span className={`${baseClass} bg-green-600`}>Hot</span>;
      case "not interested":
        return <span className={`${baseClass} bg-gray-500`}>Not Interested</span>;
      default:
        return <span className={`${baseClass} bg-gray-600`}>N/A</span>;
    }
  };

  const handleStatusUpdate = async (row) => {
    try {
      const requestPayload = {
        event_type: "b2c",
        contact_number: row.contact_number,
        status: newStatusValue,
      };

      const response = await fetch("https://hogist.com/food-api/update-lead-status/", {
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

      const updatedDataResponse = await fetch("https://hogist.com/food-api/get_b2c/");
      const updatedData = await updatedDataResponse.json();
      setTableData(updatedData);
      setEditingStatus(null);
      setNewStatusValue("");
    } catch (err) {
      alert(`Status update failed: ${err.message}`);
    }
  };

  const headers = [
      "Id",
    "Full Name", "Phone Number", "Alternate Number", "Email", "Event Type", "Event Date", "Delivery Location",
    "Count", "Meal Service", "Dietary Options", "Service Choice", "Choice of Menu", "Existing Budget",
    "Preferred Budget", "Meeting Date", "Lead Status", "Status", "Remark", "Created At", "Lead Score", "Call ID"
  ];

  if (loading) return <div className="flex justify-center items-center h-screen w-full"><span className="loader"></span></div>;
  if (error) return <div className="flex justify-center items-center h-screen w-full"><p className="text-red-500">{error}</p></div>;

  return (
    <div className="px-4 pt-5 ibm">
      <h1 className="font-bold text-4xl text-green-600 text-center py-5">B2C</h1>
      
      <div className="flex flex-wrap items-center gap-4 ">
        <button
          onClick={() => exportToExcel(filteredData, "B2C_Leads")}
          className="bg-green-600 text-white px-4 py-[6px] rounded hover:bg-green-700"
        >
          Export file
        </button>

      <div className="relative inline-block w-40">
    <select
        value={filter}
        onChange={(e) => {setFilter(e.target.value)

          setFromDate("")
           setToDate("")
        }}
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
  <div className="h-[73vh] overflow-y-auto border-2 border-gray-800">
    <table className="w-full min-w-[1200px]">
      <thead className="bg-gray-800 sticky top-0 z-10">
        <tr>
          {headers.map((header, index) => (
            <th key={index} className="px-3 py-3 text-left text-xs font-normal text-gray-200 uppercase tracking-wider whitespace-nowrap">
              <div className="flex items-center">
                {header}
                {header === "Lead Score" && (
                  <button onClick={handleSort} className="ml-1 px-1">
                    {sortOrder === "asc" ? <FaArrowDown /> : <FaArrowUp />}
                  </button>
                )}
                
                {header === "Lead Status" && (
                  <div className="relative ml-2" onClick={(e) => e.stopPropagation()}>
                    <button onClick={() => setDropdownOpen(!dropdownOpen)}>
                      <FaFilter />
                    </button>
                    {dropdownOpen && (
                      <div className="absolute z-20 mt-2 w-48 bg-gray-800 border border-gray-200 rounded shadow p-2">
                        {["hot", "warm", "cold", "not interested"].map((status) => (
                          <label key={status} className="block text-sm capitalize">
                            <input
                              type="checkbox"
                              value={status}
                              className="mr-2"
                              checked={selectedStatuses.includes(status)}
                              onChange={(e) => {
                                const checked = e.target.checked;
                                setSelectedStatuses((prev) =>
                                  checked ? [...prev, status] : prev.filter((s) => s !== status)
                                );
                              }}
                            />
                            {status}
                          </label>
                        ))}
                        <div className="mt-2 text-right">
                          <button
                            className="text-xs text-blue-600 hover:underline"
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
          paginatedData.map((row, index) => (
            <tr key={index} className="hover:bg-gray-900">
              <td className="px-3 py-5 text-sm text-gray-200 whitespace-nowrap">{row.id || "N/A"}</td>
              <td className="px-3 py-5 text-sm text-gray-200 whitespace-nowrap">{row.customer_name || "N/A"}</td>
              <td className="px-3 py-5 text-sm text-gray-200 whitespace-nowrap">{row.contact_number}</td>
              <td className="px-3 py-5 text-sm text-gray-200 whitespace-nowrap">{row.alternate_number || "N/A"}</td>
              <td className="px-3 py-5 text-sm text-gray-200 whitespace-nowrap">{row.email || "N/A"}</td>
              <td className="px-3 py-5 text-sm text-gray-200 whitespace-nowrap">{row.event_type || "N/A"}</td>
              <td className="px-3 py-5 text-sm text-gray-200 whitespace-nowrap">
                {row.event_date_time ? new Date(row.event_date_time).toLocaleString() : "N/A"}
              </td>
              <td className="px-3 py-5 text-sm text-gray-200 whitespace-nowrap">{row.delivery_location || "N/A"}</td>
              <td className="px-3 py-5 text-sm text-gray-200 whitespace-nowrap">{row.count || "N/A"}</td>
              <td className="px-3 py-5 text-sm text-gray-200 whitespace-nowrap">{row.required_meal_service || "N/A"}</td>
              <td className="px-3 py-5 text-sm text-gray-200 whitespace-nowrap">{row.dietary_options || "N/A"}</td>
              <td className="px-3 py-5 text-sm text-gray-200 whitespace-nowrap">{row.service_choice || "N/A"}</td>
              <td className="px-3 py-5 text-sm text-gray-200 whitespace-nowrap">{row.choice_of_menu || "N/A"}</td>
              <td className="px-3 py-5 text-sm text-gray-200 whitespace-nowrap">{row.existing_menu_budget || "N/A"}</td>
              <td className="px-3 py-5 text-sm text-gray-200 whitespace-nowrap">{row.prefered_menu_budget || "N/A"}</td>
              <td className="px-3 py-5 text-sm text-gray-200 whitespace-nowrap">
                {row.meeting_date_time ? new Date(row.meeting_date_time).toLocaleString() : "N/A"}
              </td>
              <td className="px-3 py-5 text-sm text-gray-200 whitespace-nowrap">{getStatusBadge(row.lead_status)}</td>
              <td className="px-3 py-5 text-sm text-gray-200 whitespace-nowrap relative">
                <div className="flex items-center">
                  <span className="mr-2">{row.status || "N/A"}</span>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                         
                      setEditingStatus(row.id);
                      setNewStatusValue(row.status || "");
                      setEditingRemark(null);
        setNewRemarkValue( "");
                    }}
                    className="text-white px-2 py-1 rounded-full border border-white text-xs"
                  >
                    +
                  </button>
                </div>
                
                {editingStatus === row.id && (
                  <div
                    className="absolute z-10 bg-gray-800 shadow-lg mt-1 left-0 right-0 flex"
                    onClick={(e) => e.stopPropagation()}
                  >
                    <input
                      type="text"
                      value={newStatusValue}
                      onChange={(e) => setNewStatusValue(e.target.value)}
                      className="w-36 py-2 pl-2 text-white outline-none rounded-tl rounded-bl bg-gray-800"
                      placeholder="Enter status"
                    />
                    <button
                      onClick={() => handleStatusUpdate(row)}
                      className="bg-green-600 text-white px-2 py-2 rounded-tr rounded-br text-sm"
                    >
                      Apply
                    </button>
                  </div>
                )}
              </td>
         <td className="px-3 py-5 text-sm text-gray-200 whitespace-nowrap relative">
  <div className="flex items-center">
    <span className="mr-2">{row.remark || "N/A"}</span>
    <button
      onClick={(e) => {
        e.stopPropagation();
        setEditingRemark(row.id);
        setNewRemarkValue(row.remark || "");
          setEditingStatus(null)
  setNewStatusValue("")
      }}
      className="text-white px-2 py-1 rounded-full border border-white text-xs"
    >
      +
    </button>
  </div>

 {editingRemark === row.id && (
        <div
          className="absolute z-10 bg-gray-800 shadow-lg mt-1  left-0 right-0 flex"
          onClick={(e) => e.stopPropagation()}
        >
          <input
            type="text"
            value={newRemarkValue}
            onChange={(e) => setNewRemarkValue(e.target.value)}
            className="w-full py-2 pl-2  text-white outline-none rounded-tl rounded-bl bg-gray-800"
            placeholder="Enter remark"
          />
          <button
            onClick={() => handleRemarkUpdate(row)}
            className="bg-green-600 text-white px-1 py-2 rounded-tr rounded-br text-sm"
          >
            Apply
          </button>
        </div>
      )}
</td>

              <td className="px-3 py-5 text-sm text-gray-200 whitespace-nowrap">
                {new Date(row.created_at).toLocaleString()}
              </td>
              <td className="px-3 py-5 text-sm whitespace-nowrap">
                <span
                  className={`px-3 py-1 rounded-full text-white text-xs font-semibold ${
                    row.lead_status?.toLowerCase() === "hot"
                      ? "bg-green-600"
                      : row.lead_status?.toLowerCase() === "warm"
                      ? "bg-orange-400"
                      : row.lead_status?.toLowerCase() === "cold"
                      ? "bg-red-700"
                      : row.lead_status?.toLowerCase() === "not interested"
                      ? "bg-gray-500"
                      : "bg-gray-600"
                  }`}
                >
                  {row.lead_score !== undefined && row.lead_score !== null ? row.lead_score : "N/A"}
                </span>
              </td>
              <td className="px-3 py-5 text-sm text-gray-200 whitespace-nowrap">{row.call_id}</td>
            </tr>
          ))
        ) : (
          <tr>
            <td colSpan={21} className="text-center p-4">
              No data available
            </td>
          </tr>
        )}
      </tbody>
    </table>
  </div>
</div>

      {/* Pagination Controls */}
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
              <button key={1} onClick={() => setCurrentPage(1)} className="px-3 py-1 rounded bg-gray-700 text-white">1</button>
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
                className={`px-3 py-1 rounded ${currentPage === i ? "bg-green-600 text-white" : "bg-gray-700 text-white"}`}
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
  );
};
