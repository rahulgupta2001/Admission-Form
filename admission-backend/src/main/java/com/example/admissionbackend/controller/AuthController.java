package com.example.admissionbackend.controller;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import com.example.admissionbackend.entity.User;
import com.example.admissionbackend.service.UserService;

import lombok.RequiredArgsConstructor;

@RestController
@RequestMapping("/api/auth")
@RequiredArgsConstructor
@CrossOrigin(origins = "http://localhost:5174")
public class AuthController {

    private final UserService service;

    @PostMapping("/register")
    public ResponseEntity<?> register(
            @RequestParam String firstName,
            @RequestParam(required = false) String middleName,
            @RequestParam String lastName,
            @RequestParam String fullName,
            @RequestParam String mobile,
            @RequestParam String email,
            @RequestParam String password,
            @RequestParam(required = false) MultipartFile photo) {
        try {
            User savedUser = service.registerUser(firstName, middleName, lastName, fullName, mobile, email, password, photo);
            return ResponseEntity.status(HttpStatus.CREATED).body(savedUser); 
        } catch (RuntimeException e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                                 .body("Registration failed: " + e.getMessage());
        }
    }

    @PostMapping("/login")
    public ResponseEntity<?> login(@RequestBody User user) {
        try {
            Object response = service.loginUser(user.getEmail(), user.getPassword());
            return ResponseEntity.ok(response);
        } catch (RuntimeException e) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                                 .body("Login failed: " + e.getMessage());
        }
    }
}
