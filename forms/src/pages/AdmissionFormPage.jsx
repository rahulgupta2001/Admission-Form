import React, { useEffect, useState } from "react";
import { useForm, Controller } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { admissionSchema } from "../utils/validationSchema";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { useNavigate } from "react-router-dom";
import { submitAdmission, updateAdmission } from "../services/admissionService";
import "./AdmissionFormPage.css";

const AdmissionFormPage = ({ currentUser, editData }) => {
  const navigate = useNavigate();
  const [fullName, setFullName] = useState("");
  const isEditMode = !!editData?.admissionId;

  const {
    register,
    handleSubmit,
    watch,
    control,
    setValue,
    reset,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(admissionSchema),
    defaultValues: editData || {},
  });

  const watchFname = watch("firstName");
  const watchMname = watch("middleName");
  const watchLname = watch("lastName");

  // Prevent browser back
  useEffect(() => {
    window.history.pushState(null, "", window.location.href);
    const handleBackButton = (event) => {
      window.history.pushState(null, "", window.location.href);
      alert("You cannot go back from this page!");
      event.preventDefault();
    };
    window.addEventListener("popstate", handleBackButton);
    return () => {
      window.removeEventListener("popstate", handleBackButton);
    };
  }, []);

  // Auto-generate full name
  useEffect(() => {
    const name = `${watchFname || ""} ${watchMname || ""} ${watchLname || ""}`.trim();
    setFullName(name);
    setValue("fullName", name);
  }, [watchFname, watchMname, watchLname, setValue]);

  // Pre-fill form on edit
  useEffect(() => {
    if (editData) {
      reset(editData);
    }
  }, [editData, reset]);

  // Calculate age
  const calculateAge = (dob) => {
    if (!dob) return "";
    const birthDate = new Date(dob);
    const today = new Date();
    let age = today.getFullYear() - birthDate.getFullYear();
    const m = today.getMonth() - birthDate.getMonth();
    if (m < 0 || (m === 0 && today.getDate() < birthDate.getDate())) {
      age--;
    }
    return age;
  };

  // Submit or Update
  const handleFormSubmit = async (data) => {
    try {
      const formData = new FormData();
      Object.keys(data).forEach((key) => {
        if (data[key] instanceof FileList) {
          if (data[key].length > 0) formData.append(key, data[key][0]);
        } else if (key === "dob" && data[key]) {
          formData.append("dob", new Date(data[key]).toISOString().split("T")[0]);
        } else if (data[key] !== undefined && data[key] !== null) {
          formData.append(key, data[key]);
        }
      });

      formData.append("userEmail", currentUser?.email || "");

      if (isEditMode) {
        await updateAdmission(editData.admissionId, formData);
        alert("Admission updated successfully!");
      } else {
        await submitAdmission(formData);
        alert("Admission submitted successfully!");
      }

      // Navigate to report page and prevent back
      navigate("/report", { replace: true });
    } catch (err) {
      console.error("Error submitting admission:", err);
      alert("Error submitting admission form. Please check server logs.");
    }
  };

  return (
    <div className="admission-form-container">
      <h2>{isEditMode ? "Edit Admission" : "New Admission"}</h2>
      <form onSubmit={handleSubmit(handleFormSubmit)}>
        <div className="form-grid">
          {/* Title */}
          <div>
            <label>Title *</label>
            <select {...register("title")}>
              <option value="">Select</option>
              <option value="Mr.">Mr.</option>
              <option value="Mrs.">Mrs.</option>
            </select>
            <p>{errors.title?.message}</p>
          </div>

          {/* Name Fields */}
          <div>
            <label>First Name *</label>
            <input {...register("firstName")} />
            <p>{errors.firstName?.message}</p>
          </div>
          <div>
            <label>Middle Name</label>
            <input {...register("middleName")} />
          </div>
          <div>
            <label>Last Name *</label>
            <input {...register("lastName")} />
            <p>{errors.lastName?.message}</p>
          </div>
          <div>
            <label>Full Name *</label>
            <input value={fullName} readOnly {...register("fullName")} />
          </div>

          {/* Mother Name */}
          <div>
            <label>Mother Name *</label>
            <input {...register("motherName")} />
            <p>{errors.motherName?.message}</p>
          </div>

          {/* Gender */}
          <div>
            <label>Gender *</label>
            <select {...register("gender")}>
              <option value="">Select Gender</option>
              <option value="Male">Male</option>
              <option value="Female">Female</option>
              <option value="Other">Other</option>
            </select>
            <p>{errors.gender?.message}</p>
          </div>

          {/* Address */}
          <div>
            <label>Address *</label>
            <input {...register("address")} />
            <p>{errors.address?.message}</p>
          </div>

          {/* Taluka */}
          <div>
            <label>Taluka *</label>
            <input {...register("taluka")} />
            <p>{errors.taluka?.message}</p>
          </div>

          {/* District */}
          <div>
            <label>District *</label>
            <input {...register("district")} />
            <p>{errors.district?.message}</p>
          </div>

          {/* Pin Code */}
          <div>
            <label>Pin Code *</label>
            <input {...register("pinCode")} />
            <p>{errors.pinCode?.message}</p>
          </div>

          {/* State */}
          <div>
            <label>State *</label>
            <input {...register("state")} />
            <p>{errors.state?.message}</p>
          </div>

          {/* Mobile */}
          <div>
            <label>Mobile Number *</label>
            <input {...register("mobileNumber")} />
            <p>{errors.mobileNumber?.message}</p>
          </div>

          {/* Email */}
          <div>
            <label>Email ID *</label>
            <input type="email" {...register("email")} />
            <p>{errors.email?.message}</p>
          </div>

          {/* Aadhaar */}
          <div>
            <label>Aadhaar Number *</label>
            <input {...register("aadhaarNumber")} />
            <p>{errors.aadhaarNumber?.message}</p>
          </div>

          {/* DOB */}
          <div>
            <label>Date of Birth *</label>
            <Controller
              control={control}
              name="dob"
              render={({ field }) => (
                <DatePicker
                  placeholderText="Select DOB"
                  selected={field.value ? new Date(field.value) : null}
                  onChange={field.onChange}
                  dateFormat="dd/MM/yyyy"
                />
              )}
            />
            <p>{errors.dob?.message}</p>
          </div>

          {/* Age */}
          <div>
            <label>Age *</label>
            <input type="number" readOnly value={calculateAge(watch("dob"))} />
          </div>

          {/* Religion */}
          <div>
            <label>Religion *</label>
            <select {...register("religion")}>
              <option value="">Select Religion</option>
              <option value="Hindu">Hindu</option>
              <option value="Muslim">Muslim</option>
              <option value="Christian">Christian</option>
              <option value="Other">Other</option>
            </select>
            <p>{errors.religion?.message}</p>
          </div>

          {/* Caste Category & Caste */}
          <div>
            <label>Caste Category *</label>
            <input {...register("casteCategory")} />
            <p>{errors.casteCategory?.message}</p>
          </div>
          <div>
            <label>Caste *</label>
            <input {...register("caste")} />
            <p>{errors.caste?.message}</p>
          </div>

          {/* File Uploads */}
          <div>
            <label>Photo * (JPEG, JPG, PNG | Max 1MB)</label>
            <input
              type="file"
              accept=".jpg,.jpeg,.png"
              {...register("photo")}
              onChange={(e) => {
                const file = e.target.files[0];
                if (file) {
                  const validTypes = ["image/jpeg", "image/jpg", "image/png"];
                  if (!validTypes.includes(file.type)) {
                    alert("Invalid file type! Only JPEG, JPG, PNG allowed.");
                    e.target.value = null;
                  } else if (file.size > 1024 * 1024) {
                    alert("File size exceeds 1MB!");
                    e.target.value = null;
                  }
                }
              }}
            />
            <p>{errors.photo?.message}</p>
          </div>

          <div>
            <label>Signature * (JPEG, JPG, PNG | Max 1MB)</label>
            <input
              type="file"
              accept=".jpg,.jpeg,.png"
              {...register("signature")}
              onChange={(e) => {
                const file = e.target.files[0];
                if (file) {
                  const validTypes = ["image/jpeg", "image/jpg", "image/png"];
                  if (!validTypes.includes(file.type)) {
                    alert("Invalid file type! Only JPEG, JPG, PNG allowed.");
                    e.target.value = null;
                  } else if (file.size > 1024 * 1024) {
                    alert("File size exceeds 1MB!");
                    e.target.value = null;
                  }
                }
              }}
            />
            <p>{errors.signature?.message}</p>
          </div>

          <div>
            <label>Marksheet *</label>
            <input type="file" {...register("marksheet")} accept=".pdf,.jpg,.png" />
          </div>
          <div>
            <label>Caste Certificate</label>
            <input type="file" {...register("casteCertificate")} accept=".pdf,.jpg,.png" />
          </div>

          {/* Physically Handicapped */}
          <div className="radio-group">
            <label>Physically Handicapped *</label>
            <input type="radio" value="Yes" {...register("physicallyHandicapped")} /> Yes
            <input type="radio" value="No" {...register("physicallyHandicapped")} /> No
            <p>{errors.physicallyHandicapped?.message}</p>
          </div>
        </div>

        <button type="submit">{isEditMode ? "Update Admission" : "Submit Admission"}</button>
      </form>
    </div>
  );
};

export default AdmissionFormPage;
