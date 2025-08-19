package com.example.admissionbackend.service;

import com.example.admissionbackend.dto.AdmissionRequest;
import com.example.admissionbackend.entity.Admission;
import com.example.admissionbackend.repository.AdmissionRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.time.LocalDate;
import java.time.Period;
import java.util.List;
import java.util.Optional;

@Service
@RequiredArgsConstructor
public class AdmissionService {

    private final AdmissionRepository repository;

    /**
     * ✅ Save a new admission
     */
    public Admission saveAdmission(AdmissionRequest request) {
        Admission admission = mapRequestToEntity(new Admission(), request);
        return repository.save(admission);
    }

    /**
     * ✅ Update admission by ID
     */
    public Admission updateAdmission(Long id, AdmissionRequest request) {
        Admission admission = repository.findById(id)
                .orElseThrow(() -> new RuntimeException("Admission not found with ID: " + id));

        mapRequestToEntity(admission, request);
        return repository.save(admission);
    }

    /**
     * ✅ Fetch all admissions
     */
    public List<Admission> getAllAdmissions() {
        return repository.findAll();
    }

    /**
     * ✅ Fetch admission by ID
     */
    public Optional<Admission> getAdmissionById(Long id) {
        return repository.findById(id);
    }

    /**
     * ✅ Delete admission by ID
     */
    public void deleteAdmission(Long id) {
        if (!repository.existsById(id)) {
            throw new RuntimeException("Admission not found with ID: " + id);
        }
        repository.deleteById(id);
    }

    /**
     * 🔄 Map DTO → Entity including files and calculated fields
     */
    private Admission mapRequestToEntity(Admission admission, AdmissionRequest request) {
        admission.setTitle(request.getTitle());
        admission.setFirstName(request.getFirstName());
        admission.setMiddleName(request.getMiddleName());
        admission.setLastName(request.getLastName());
        admission.setFullName(
                (request.getFirstName() + " " +
                 (request.getMiddleName() != null ? request.getMiddleName() + " " : "") +
                 request.getLastName()).trim()
        );
        admission.setMotherName(request.getMotherName());
        admission.setGender(request.getGender());
        admission.setAddress(request.getAddress());
        admission.setTaluka(request.getTaluka());
        admission.setDistrict(request.getDistrict());
        admission.setPinCode(request.getPinCode());
        admission.setState(request.getState());
        admission.setMobileNumber(request.getMobileNumber());
        admission.setEmail(request.getEmail());
        admission.setAadhaarNumber(request.getAadhaarNumber());
        admission.setDob(request.getDob());

        // ✅ Auto calculate age from dob
        if (request.getDob() != null) {
            admission.setAge(Period.between(request.getDob(), LocalDate.now()).getYears());
        }

        admission.setReligion(request.getReligion());
        admission.setCasteCategory(request.getCasteCategory());
        admission.setCaste(request.getCaste());
        admission.setPhysicallyHandicapped(request.getPhysicallyHandicapped());

        // ✅ Convert files to byte arrays
        admission.setPhoto(getBytes(request.getPhoto()));
        admission.setMarksheet(getBytes(request.getMarksheet()));
        admission.setSignature(getBytes(request.getSignature()));
        admission.setCasteCertificate(getBytes(request.getCasteCertificate()));

        return admission;
    }

    /**
     * 🔄 Helper: Convert MultipartFile → byte[]
     */
    private byte[] getBytes(MultipartFile file) {
        if (file != null && !file.isEmpty()) {
            try {
                return file.getBytes();
            } catch (IOException e) {
                e.printStackTrace();
            }
        }
        return null;
    }
}
