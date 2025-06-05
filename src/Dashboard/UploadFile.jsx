import { useState } from "react";
import { useDropzone } from "react-dropzone";
import { toast } from "react-toastify";
import Snackbar from "../components/common/SnackBar";
import DuplicateDialog from "../components/common/DuplicateDialog"; 

const UploadFile = () => {
  const [file, setFile] = useState(null);
  const [snackbar, setSnackbar] = useState({
    isOpen: false,
    message: '',
    variant: 'error',
  });

  const [duplicates, setDuplicates] = useState([]);
  const [isDialogOpen, setDialogOpen] = useState(false);

  const showSnackbar = (message, variant = "error") => {
    if (snackbar.isOpen) return;
    setSnackbar({ isOpen: true, message, variant });
  };

  const closeSnackbar = () => setSnackbar({ ...snackbar, isOpen: false });

  const onDrop = (acceptedFiles) => {
    setFile(acceptedFiles[0]);
  };

  function getCookie(name) {
    let cookieValue = null;
    if (document.cookie && document.cookie !== "") {
      const cookies = document.cookie.split(";");
      for (let i = 0; i < cookies.length; i++) {
        const cookie = cookies[i].trim();
        if (cookie.substring(0, name.length + 1) === name + "=") {
          cookieValue = decodeURIComponent(cookie.substring(name.length + 1));
          break;
        }
      }
    }
    return cookieValue;
  }

  const handleUpload = async () => {
    if (!file) return toast.warning("Please select a file first.");

    const formData = new FormData();
    formData.append("file", file);

    try {
      const response = await fetch("https://hogist.com/food-api/upload_excel/", {
        method: "POST",
        body: formData,
        credentials: "include",
        headers: {
          "X-CSRFToken": getCookie("csrftoken"),
        },
      });

      if (response.ok) {
        const result = await response.json();
        toast.success(`${result.message}`);

        if (result.duplicates && result.duplicates.length > 0) {
          setDuplicates(result.duplicates);
          setDialogOpen(true);
        }

        setFile(null);
      } else {
        await response.text(); // read it for completeness
        showSnackbar(" Upload failed. Please check the file format.");
      }
    } catch (error) {
      showSnackbar(" Network error during file upload.");
    }
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
      <h1 className="font-bold text-4xl text-green-600 text-center my-10">Upload file</h1>
      <div
        {...getRootProps()}
        className="w-60 md:w-80 lg:w-96 h-48 border-2 border-dashed border-gray-500 flex items-center justify-center cursor-pointer"
      >
        <input {...getInputProps()} />
        {file ? <p>{file.name}</p> : <p>Click or Drag & Drop Excel File Here</p>}
      </div>
      {
       file?.name&&<button
        onClick={handleUpload}
        className="mt-4 px-4 py-2 bg-green-600 text-white rounded cursor-pointer"
      >
        Upload File
      </button>
      }
      

      <Snackbar
        message={snackbar.message}
        isOpen={snackbar.isOpen}
        onClose={closeSnackbar}
        variant={snackbar.variant}
      />

      <DuplicateDialog
        duplicates={duplicates}
        isOpen={isDialogOpen}
        onClose={() => setDialogOpen(false)}
      />
    </div>
  );
};

export default UploadFile;
