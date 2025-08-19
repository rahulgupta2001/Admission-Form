package com.example.admissionbackend.entity;

import jakarta.persistence.*;
import lombok.*;

@Entity
@Table(name = "users")
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class User {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String firstName;
    private String middleName;
    private String lastName;

    private String fullName;

    private String mobile;

    // If you want to keep photo optional
    @Column(nullable = true)
    private String photo; // store photo filename or URL

    @Column(unique = true, nullable = false)
    private String email;

    @Column(nullable = false)
    private String password;
}
