package com.example.admissionbackend.service;

import java.io.File;
import java.io.IOException;

import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import com.example.admissionbackend.entity.User;
import com.example.admissionbackend.repository.UserRepository;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class UserService {

    private final UserRepository userRepository;

    public User registerUser(String firstName, String middleName, String lastName, String fullName,
                             String mobile, String email, String password, MultipartFile photo) {

        // Check if email already exists
        if (userRepository.existsByEmail(email)) {
            throw new RuntimeException("Email already registered");
        }

        User user = new User();
        user.setFirstName(firstName);
        user.setMiddleName(middleName);
        user.setLastName(lastName);
        user.setFullName(fullName);
        user.setMobile(mobile);
        user.setEmail(email);
        user.setPassword(password); // TODO: hash password in real app

        // Save photo file if provided
        if (photo != null && !photo.isEmpty()) {
            try {
                // Use absolute path for uploads folder inside project directory
                String folder = System.getProperty("user.dir") + File.separator + "uploads" + File.separator;
                File dir = new File(folder);
                if (!dir.exists()) dir.mkdirs();

                // Save file with timestamp prefix to avoid name conflicts
                String filename = System.currentTimeMillis() + "_" + photo.getOriginalFilename();
                String filePath = folder + filename;
                photo.transferTo(new File(filePath));

                // Store only the filename in DB (recommended)
                user.setPhoto(filename);

            } catch (IOException e) {
                throw new RuntimeException("Failed to save photo: " + e.getMessage());
            }
        }

        return userRepository.save(user);
    }

    public Object loginUser(String email, String password) {
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("Email not registered"));

        if (!user.getPassword().equals(password)) {
            throw new RuntimeException("Incorrect password");
        }

        return user;
    }
}
