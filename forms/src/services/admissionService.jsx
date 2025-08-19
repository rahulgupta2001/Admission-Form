import axios from "axios";

const API_URL = "http://localhost:8080/api/admissions";

// ✅ Get all admissions
export const getAllAdmissions = async () => {
  const response = await axios.get(`${API_URL}/all`);
  return response.data;
};

// ✅ Delete admission by ID
export const deleteAdmission = async (id) => {
  const response = await axios.delete(`${API_URL}/delete/${id}`);
  return response.data;
};

// ✅ Submit new admission
export const submitAdmission = async (formData) => {
  const response = await axios.post(`${API_URL}/submit`, formData, {
    headers: { "Accept": "application/json" }, // Let browser handle multipart
  });
  return response.data;
};

// ✅ Update existing admission
export const updateAdmission = async (id, formData) => {
  const response = await axios.put(`${API_URL}/update/${id}`, formData, {
    headers: { "Accept": "application/json" }, // Let browser set boundary
  });
  return response.data;
};

// ✅ Get single admission by ID (optional, useful for edit form)
export const getAdmissionById = async (id) => {
  const response = await axios.get(`${API_URL}/${id}`);
  return response.data;
};
