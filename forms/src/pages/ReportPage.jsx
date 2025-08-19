import React, { useEffect, useState } from "react";
import { saveAs } from "file-saver";
import * as XLSX from "xlsx";
import { useNavigate } from "react-router-dom";
import { getAllAdmissions, deleteAdmission } from "../services/admissionService";
import "./ReportPage.css";

const ReportPage = ({ onEditAdmission }) => {
  const [admissions, setAdmissions] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    fetchAdmissions();
  }, []);

  const fetchAdmissions = async () => {
    try {
      const data = await getAllAdmissions();
      setAdmissions(data);
    } catch (err) {
      console.error("Failed to fetch admissions:", err);
      alert("Failed to fetch admissions from backend");
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm("Are you sure you want to delete this admission?")) {
      try {
        await deleteAdmission(id);
        setAdmissions(admissions.filter((a) => a.admissionId !== id));
        alert("Admission deleted successfully");
      } catch (err) {
        console.error("Delete failed:", err);
        alert("Failed to delete admission");
      }
    }
  };

  const handleEdit = (admission) => {
    if (onEditAdmission) onEditAdmission(admission);
    navigate("/admission");
  };

  const calculateAge = (dob) => {
    if (!dob) return "";
    const birthDate = new Date(dob);
    const diff = Date.now() - birthDate.getTime();
    return Math.floor(diff / (1000 * 60 * 60 * 24 * 365));
  };

  const exportToExcel = () => {
    if (admissions.length === 0) {
      alert("No admissions to export");
      return;
    }

    const dataForExcel = admissions.map((a) => ({
      "Admission ID": a.admissionId,
      Title: a.title,
      "First Name": a.firstName,
      "Middle Name": a.middleName || "",
      "Last Name": a.lastName,
      "Full Name": a.fullName,
      "Mother Name": a.motherName,
      Gender: a.gender,
      Address: a.address,
      Taluka: a.taluka || "",
      District: a.district || "",
      "Pin Code": a.pinCode || "",
      State: a.state || "",
      Mobile: a.mobileNumber,
      Email: a.email,
      "Aadhaar Number": a.aadhaarNumber,
      DOB: a.dob ? new Date(a.dob).toLocaleDateString() : "",
      Age: calculateAge(a.dob),
      Religion: a.religion || "",
      "Caste Category": a.casteCategory || "",
      Caste: a.caste || "",
      "Physically Handicapped": a.physicallyHandicapped ? "Yes" : "No",
      Photo: a.photoUrl || "Uploaded",
      Marksheet: a.marksheetUrl || "Uploaded",
      Signature: a.signatureUrl || "Uploaded",
      "Caste Certificate": a.casteCertificateUrl || "Uploaded",
    }));

    const ws = XLSX.utils.json_to_sheet(dataForExcel);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "Admissions");
    const excelBuffer = XLSX.write(wb, { bookType: "xlsx", type: "array" });
    const blob = new Blob([excelBuffer], { type: "application/octet-stream" });
    saveAs(blob, "admissions.xlsx");
  };

  const handleSubmitAll = () => {
    if (window.confirm("Are you sure you want to submit admissions?")) {
      alert("Admissions submitted successfully!");
      navigate("/login", { replace: true }); // Prevent back navigation
    }
  };

  return (
    <div className="report-container">
      <h2>Admissions Report</h2>

      <div className="report-actions">
        <button className="export-btn" onClick={exportToExcel}>
          Export Excel
        </button>
      </div>

      {admissions.length === 0 ? (
        <p className="no-data">No admissions found.</p>
      ) : (
        <div className="table-wrapper">
          <table>
            <thead>
              <tr>
                <th>Admission ID</th>
                <th>Full Name</th>
                <th>DOB</th>
                <th>Age</th>
                <th>Mobile</th>
                <th>Physically Handicapped</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {admissions.map((a) => (
                <tr key={a.admissionId}>
                  <td>{a.admissionId}</td>
                  <td>{a.fullName}</td>
                  <td>{a.dob ? new Date(a.dob).toLocaleDateString() : ""}</td>
                  <td>{calculateAge(a.dob)}</td>
                  <td>{a.mobileNumber}</td>
                  <td>{a.physicallyHandicapped ? "Yes" : "No"}</td>
                  <td>
                    <button className="edit-btn" onClick={() => handleEdit(a)}>
                      Edit
                    </button>
                    <button
                      className="delete-btn"
                      onClick={() => handleDelete(a.admissionId)}
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Submit All button at the bottom */}
      <div className="submit-all-wrapper">
        <button className="submit-all-btn" onClick={handleSubmitAll}>
          Submit 
        </button>
      </div>
    </div>
  );
};

export default ReportPage;
