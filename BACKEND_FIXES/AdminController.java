package com.vehicleinspection.controller;

import com.vehicleinspection.dto.response.ApiResponse;
import com.vehicleinspection.model.InspectorProfile;
import com.vehicleinspection.model.RepairInfo;
import com.vehicleinspection.model.User;
import com.vehicleinspection.repository.InspectorProfileRepository;
import com.vehicleinspection.repository.RepairInfoRepository;
import com.vehicleinspection.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/admin")
@RequiredArgsConstructor
public class AdminController {

    private final UserRepository userRepository;
    private final InspectorProfileRepository inspectorProfileRepository;
    private final RepairInfoRepository repairInfoRepository;

    // GET all users
    @GetMapping("/users")
    public ResponseEntity<List<User>> getAllUsers() {
        return ResponseEntity.ok(userRepository.findAllByOrderByCreatedAtDesc());
    }

    // GET all inspectors
    @GetMapping("/inspectors")
    public ResponseEntity<List<InspectorProfile>> getAllInspectors() {
        return ResponseEntity.ok(inspectorProfileRepository.findAll());
    }

    // PATCH verify inspector
    @PatchMapping("/inspectors/{id}/verify")
    public ResponseEntity<?> verifyInspector(@PathVariable Long id) {
        InspectorProfile profile = inspectorProfileRepository.findById(id)
            .orElse(null);
        if (profile == null) {
            return ResponseEntity.notFound().build();
        }
        profile.setIsVerified(true);
        inspectorProfileRepository.save(profile);
        return ResponseEntity.ok(new ApiResponse(true, "Inspector verified successfully!"));
    }

    // POST add repair info
    @PostMapping("/repairs")
    public ResponseEntity<?> addRepairInfo(@RequestBody RepairInfo repairInfo) {
        repairInfoRepository.save(repairInfo);
        return ResponseEntity.ok(new ApiResponse(true, "Repair info added successfully!"));
    }

    // DELETE repair info
    @DeleteMapping("/repairs/{id}")
    public ResponseEntity<?> deleteRepairInfo(@PathVariable Long id) {
        repairInfoRepository.deleteById(id);
        return ResponseEntity.ok(new ApiResponse(true, "Repair info deleted!"));
    }
}
