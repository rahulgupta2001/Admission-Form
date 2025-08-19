import { Routes, Route, Navigate } from "react-router-dom";
import { useState } from "react";

import Register from "./pages/Register";
import Login from "./pages/Login";
import AdmissionFormPage from "./pages/AdmissionFormPage";
import ReportPage from "./pages/ReportPage";

function App() {
  const [currentUser, setCurrentUser] = useState(null); // Logged-in user
  const [admissions, setAdmissions] = useState([]);      // Admission data
  const [editData, setEditData] = useState(null);        // Edit mode

  // Handle admission submit (Add/Edit)
  const handleSubmitAdmission = (data) => {
    if (editData) {
      setAdmissions(
        admissions.map((a) => (a.admissionId === data.admissionId ? data : a))
      );
      setEditData(null);
    } else {
      setAdmissions([...admissions, data]);
    }
  };

  // Handle edit from report
  const handleEditAdmission = (data) => {
    setEditData(data);
  };

  // Handle delete from report
  const handleDeleteAdmission = (admissionId) => {
    setAdmissions(admissions.filter((a) => a.admissionId !== admissionId));
  };

  return (
    <Routes>
      {/* Default route */}
      <Route path="/" element={<Navigate to="/login" />} />

      {/* Registration */}
      <Route
        path="/register"
        element={<Register />}
      />

      {/* Login */}
      <Route
        path="/login"
        element={<Login setCurrentUser={setCurrentUser} />}
      />

      {/* Admission Form - Protected */}
      <Route
        path="/admission"
        element={
          currentUser ? (
            <AdmissionFormPage
              currentUser={currentUser}
              onSubmitAdmission={handleSubmitAdmission}
              editData={editData}
            />
          ) : (
            <Navigate to="/login" />
          )
        }
      />

      {/* Report Page - Protected */}
      <Route
        path="/report"
        element={
          currentUser ? (
            <ReportPage
              admissions={admissions}
              onEditAdmission={handleEditAdmission}
              onDeleteAdmission={handleDeleteAdmission}
            />
          ) : (
            <Navigate to="/login" />
          )
        }
      />

      {/* Fallback */}
      <Route path="*" element={<Navigate to="/login" />} />
    </Routes>
  );
}

export default App;
