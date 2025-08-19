package com.example.admissionbackend.dto;

import lombok.Data;
import org.springframework.web.multipart.MultipartFile;
import java.time.LocalDate;

@Data
public class AdmissionRequest {
    private String title;
    private String firstName;
    private String middleName;
    private String lastName;
    private String fullName; // Can be auto-generated in service
    private String motherName;
    private String gender;
    private String address;
    private String taluka;
    private String district;
    private String pinCode;
    private String state;
    private String mobileNumber;
    private String email;
    private String aadhaarNumber;

    private LocalDate dob;               // ✅ LocalDate
    private Integer age;                 // ✅ Calculated in service from dob

    private String religion;
    private String casteCategory;
    private String caste;
    private Boolean physicallyHandicapped; // ✅ Boolean instead of String

    // ✅ File uploads
    private MultipartFile photo;
    private MultipartFile marksheet;
    private MultipartFile signature;
    private MultipartFile casteCertificate;
}
