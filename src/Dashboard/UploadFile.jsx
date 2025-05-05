import { useState } from "react";
import { useDropzone } from "react-dropzone";
import { toast } from "react-toastify";

const UploadFile = () => {
  const [file, setFile] = useState(null);

  const onDrop = (acceptedFiles) => {
    setFile(acceptedFiles[0]);
  };
  function getCookie(name) {
    let cookieValue = null;
    if (document.cookie && document.cookie !== "") {
      const cookies = document.cookie.split(";");
      for (let i = 0; i < cookies.length; i++) {
        const cookie = cookies[i].trim();
        // Does this cookie string begin with the name we want?
        if (cookie.substring(0, name.length + 1) === name + "=") {
          cookieValue = decodeURIComponent(cookie.substring(name.length + 1));
          break;
        }
      }
    }
    return cookieValue;
  }
  const handleUpload = async() => {
    if (!file) return alert("Please select a file first.");


    const formData = new FormData();
    formData.append("file", file);

    try {
      const response = await fetch("https://hogist.com/food-api/upload_excel/", {
        method: "POST",
        body: formData,
        credentials: "include", 
        headers: {
          "X-CSRFToken": getCookie("csrftoken"),
          }
      })

      const text = await response.text();
      console.error("Upload failed. Raw response:", text);
      if(response.ok){
        toast.success("file Uploaded Successfully");
        setFile(null); 
      }
 
    } catch (error) {
      console.error("Upload error:", error);
      toast.error("Error while Uploading file")

    }
   
    console.log("Uploading file:", file);
    
  };

  const { getRootProps, getInputProps } = useDropzone({
    onDrop,
    accept: {
      "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet": [".xlsx"],
      "application/vnd.ms-excel": [".xls"]
    },
    multiple: false,
  });


  return (
    <div className="flex flex-col items-center justify-center my-10 md:my-0 md:h-screen px-4 ibm">
      {/* <button onClick={() => setActiveSection("dashboard")} className="mb-4 px-4 py-2 bg-gray-600 text-white rounded">
        Back to Dashboard
      </button> */}
           <h1 className="font-bold text-4xl text-green-600 text-center  my-10">Upload file</h1>
      <div
        {...getRootProps()}
        className="w-60 md:w-80 lg:w-96 h-48 border-2 border-dashed border-gray-500 flex items-center justify-center cursor-pointer"
      >
        
        <input {...getInputProps()} />
        {file ? <p>{file.name}</p> : <p>Drag & Drop Excel File Here</p>}
      </div>
      <button
        onClick={handleUpload}
        className="mt-4 px-4 py-2 bg-green-600 text-white rounded cursor-pointer"
      >
        Upload File
      </button>
    </div>
  );
};

export default UploadFile;