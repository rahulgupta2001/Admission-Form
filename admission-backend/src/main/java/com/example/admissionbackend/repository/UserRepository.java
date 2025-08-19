package com.example.admissionbackend.repository;

import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.example.admissionbackend.entity.User;

@Repository
public interface UserRepository extends JpaRepository<User, Long> {

    // Check if a user exists with this email
    boolean existsByEmail(String email);

    // Find a user by email
    Optional<User> findByEmail(String email);
}
