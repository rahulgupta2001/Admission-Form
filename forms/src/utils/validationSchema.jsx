import * as yup from "yup";

export const admissionSchema = yup.object().shape({
  title: yup.string().required("Title is required"),
  firstName: yup.string().required("First Name is required"),
  middleName: yup.string(), // optional
  lastName: yup.string().required("Last Name is required"),
  fullName: yup.string().required("Full Name is required"),
  dob: yup.date().required("Date of Birth is required"),
  mobileNumber: yup
    .string()
    .required("Mobile Number is required")
    .matches(/^\d{10}$/, "Mobile Number must be 10 digits"),
  photo: yup
    .mixed()
    .required("Photo is required")
    .test(
      "fileSize",
      "Photo must be less than 1MB",
      (value) => !value || (value && value[0]?.size <= 1024 * 1024)
    )
    .test(
      "fileType",
      "Only JPEG, JPG, PNG formats are allowed",
      (value) =>
        !value ||
        (value &&
          ["image/jpeg", "image/jpg", "image/png"].includes(value[0]?.type))
    ),
  signature: yup
    .mixed()
    .required("Signature is required")
    .test(
      "fileSize",
      "Signature must be less than 1MB",
      (value) => !value || (value && value[0]?.size <= 1024 * 1024)
    )
    .test(
      "fileType",
      "Only JPEG, JPG, PNG formats are allowed",
      (value) =>
        !value ||
        (value &&
          ["image/jpeg", "image/jpg", "image/png"].includes(value[0]?.type))
    ),
  physicallyHandicapped: yup.string().required("Select an option"),
});
