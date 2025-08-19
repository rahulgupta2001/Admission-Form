import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../api/axios"; // updated import
import "./Register.css";

const Register = () => {
  const [form, setForm] = useState({
    firstName: "",
    middleName: "",
    lastName: "",
    mobile: "",
    photo: null,
    email: "",
    password: "",
    confirmPassword: "",
  });

  const navigate = useNavigate();

  const fullName = [form.firstName, form.middleName, form.lastName]
    .filter(Boolean)
    .join(" ");

  const handleChange = (e) => {
    const { name, value, files } = e.target;
    if (name === "photo") {
      const file = files[0];
      if (file && !["image/jpeg", "image/jpg", "image/png"].includes(file.type)) {
        alert("Only JPEG, JPG, PNG allowed!");
        return;
      }
      if (file && file.size > 1024 * 1024) {
        alert("File size must be under 1MB!");
        return;
      }
      setForm({ ...form, photo: file });
    } else {
      setForm({ ...form, [name]: value });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!/^\d{10}$/.test(form.mobile)) {
      alert("Mobile number must be 10 digits!");
      return;
    }
    if (form.password !== form.confirmPassword) {
      alert("Passwords do not match!");
      return;
    }

    try {
      const formData = new FormData();
      formData.append("firstName", form.firstName);
      formData.append("middleName", form.middleName);
      formData.append("lastName", form.lastName);
      formData.append("fullName", fullName);
      formData.append("mobile", form.mobile);
      formData.append("email", form.email);
      formData.append("password", form.password);
      if (form.photo) formData.append("photo", form.photo);

      // Send FormData
      await api.post("/auth/register", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      alert("Registration successful!");
      navigate("/login");
    } catch (error) {
      console.error(error);
      alert(error.response?.data || "Registration failed!");
    }
  };

  return (
    <div className="auth-page">
      <div className="auth-box">
        <h1>Registration Form</h1>
        <form onSubmit={handleSubmit}>
          <input type="text" name="firstName" placeholder="First Name" required onChange={handleChange} />
          <input type="text" name="middleName" placeholder="Middle Name" onChange={handleChange} />
          <input type="text" name="lastName" placeholder="Last Name" required onChange={handleChange} />
          <input type="text" name="fullName" value={fullName} readOnly />
          <input type="text" name="mobile" placeholder="Mobile Number" required onChange={handleChange} />
          <input type="file" name="photo" accept="image/*" onChange={handleChange} />
          <input type="email" name="email" placeholder="Email" required onChange={handleChange} />
          <input type="password" name="password" placeholder="Password" required onChange={handleChange} />
          <input type="password" name="confirmPassword" placeholder="Confirm Password" required onChange={handleChange} />
          <button type="submit">Register</button>
        </form>
      </div>
    </div>
  );
};

export default Register;
