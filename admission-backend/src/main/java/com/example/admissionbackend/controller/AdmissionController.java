package com.example.admissionbackend.controller;

import com.example.admissionbackend.dto.AdmissionRequest;
import com.example.admissionbackend.entity.Admission;
import com.example.admissionbackend.service.AdmissionService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Optional;

@RestController
@RequestMapping("/api/admissions")
@RequiredArgsConstructor
@CrossOrigin(origins = {"http://localhost:5173", "http://localhost:5174"})
public class AdmissionController {

    private final AdmissionService service;

    /**
     * ✅ Submit a new admission
     */
    @PostMapping("/submit")
    public ResponseEntity<?> submitAdmission(@ModelAttribute AdmissionRequest request) {
        try {
            if (request.getFirstName() == null || request.getFirstName().trim().isEmpty()) {
                return ResponseEntity
                        .badRequest()
                        .body("❌ First Name is required");
            }

            if (request.getDob() == null) {
                return ResponseEntity
                        .badRequest()
                        .body("❌ Date of Birth is required");
            }

            Admission saved = service.saveAdmission(request);
            return ResponseEntity
                    .status(HttpStatus.CREATED)
                    .body(saved);

        } catch (Exception e) {
            return ResponseEntity
                    .status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body("❌ Failed to save admission. Reason: " + e.getMessage());
        }
    }

    /**
     * ✅ Get all admissions
     */
    @GetMapping("/all")
    public ResponseEntity<?> getAllAdmissions() {
        List<Admission> admissions = service.getAllAdmissions();
        if (admissions.isEmpty()) {
            return ResponseEntity
                    .status(HttpStatus.NO_CONTENT)
                    .body("⚠️ No admissions found");
        }
        return ResponseEntity.ok(admissions);
    }

    /**
     * ✅ Get admission by ID
     */
    @GetMapping("/{id}")
    public ResponseEntity<?> getAdmissionById(@PathVariable Long id) {
        Optional<Admission> admissionOpt = service.getAdmissionById(id);

        if (admissionOpt.isPresent()) {
            return ResponseEntity.ok(admissionOpt.get());
        } else {
            return ResponseEntity
                    .status(HttpStatus.NOT_FOUND)
                    .body("❌ Admission not found with ID: " + id);
        }
    }

    /**
     * ✅ Delete admission by ID
     */
    @DeleteMapping("/delete/{id}")
    public ResponseEntity<?> deleteAdmission(@PathVariable Long id) {
        try {
            service.deleteAdmission(id);
            return ResponseEntity.ok("✅ Admission deleted successfully with ID: " + id);
        } catch (Exception e) {
            return ResponseEntity
                    .status(HttpStatus.NOT_FOUND)
                    .body("❌ Admission not found with ID: " + id);
        }
    }

    /**
     * ✅ Update admission by ID
     */
    @PutMapping("/update/{id}")
    public ResponseEntity<?> updateAdmission(
            @PathVariable Long id,
            @ModelAttribute AdmissionRequest request) {
        try {
            Admission updated = service.updateAdmission(id, request);
            return ResponseEntity.ok(updated);
        } catch (Exception e) {
            return ResponseEntity
                    .status(HttpStatus.NOT_FOUND)
                    .body("❌ Failed to update admission. Reason: " + e.getMessage());
        }
    }

}
