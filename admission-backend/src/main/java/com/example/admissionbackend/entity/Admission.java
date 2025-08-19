package com.example.admissionbackend.entity;

import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDate;

@Entity
@Table(name = "ADMISSIONS")
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Admission {

    @Id
    @GeneratedValue(strategy = GenerationType.SEQUENCE, generator = "admission_seq")
    @SequenceGenerator(
        name = "admission_seq",
        sequenceName = "ADMISSION_SEQ",
        allocationSize = 1
    )
    private Long admissionId;

    @Column(nullable = false, length = 10)
    private String title;

    @Column(nullable = false, length = 50)
    private String firstName;

    @Column(length = 50)
    private String middleName;

    @Column(nullable = false, length = 50)
    private String lastName;

    @Column(nullable = false, length = 150)
    private String fullName;

    @Column(nullable = false, length = 100)
    private String motherName;

    @Column(nullable = false, length = 10)
    private String gender;

    @Column(nullable = false, length = 255)
    private String address;

    @Column(length = 100)
    private String taluka;

    @Column(length = 100)
    private String district;

    @Column(length = 10)
    private String pinCode;

    @Column(length = 100)
    private String state;

    @Column(nullable = false, unique = true, length = 15)
    private String mobileNumber;

    @Column(nullable = false, unique = true, length = 100)
    private String email;

    @Column(nullable = false, unique = true, length = 12)
    private String aadhaarNumber;

    private LocalDate dob;  // ✅ Updated to LocalDate

    private Integer age;

    @Column(length = 50)
    private String religion;

    @Column(length = 50)
    private String casteCategory;

    @Column(length = 50)
    private String caste;

    @Lob
    @Basic(fetch = FetchType.LAZY)
    private byte[] casteCertificate;

    @Lob
    @Basic(fetch = FetchType.LAZY)
    private byte[] marksheet;

    @Lob
    @Basic(fetch = FetchType.LAZY)
    private byte[] photo;

    @Lob
    @Basic(fetch = FetchType.LAZY)
    private byte[] signature;

    private Boolean physicallyHandicapped;  // ✅ Updated to Boolean
}
