package com.vehicleinspection.controller;

import com.vehicleinspection.dto.request.HiringRequestDto;
import com.vehicleinspection.dto.response.ApiResponse;
import com.vehicleinspection.model.HiringRequest;
import com.vehicleinspection.model.RequestStatus;
import com.vehicleinspection.service.HiringService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/hiring")
@RequiredArgsConstructor
public class HiringController {

    private final HiringService hiringService;

    // Customer: hire an inspector (uses JWT to identify customer)
    @PostMapping("/request")
    public ResponseEntity<?> createRequest(
            @Valid @RequestBody HiringRequestDto dto,
            @AuthenticationPrincipal UserDetails userDetails) {
        try {
            hiringService.createRequest(dto, userDetails.getUsername());
            return ResponseEntity.ok(new ApiResponse(true, "Hiring request sent successfully!"));
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body(new ApiResponse(false, e.getMessage()));
        }
    }

    // Customer: view my requests
    @GetMapping("/my-requests")
    public ResponseEntity<List<HiringRequest>> getMyRequests(
            @AuthenticationPrincipal UserDetails userDetails) {
        return ResponseEntity.ok(hiringService.getRequestsByCustomer(userDetails.getUsername()));
    }

    // Inspector: view incoming requests
    @GetMapping("/inspector-requests")
    public ResponseEntity<List<HiringRequest>> getInspectorRequests(
            @AuthenticationPrincipal UserDetails userDetails) {
        return ResponseEntity.ok(hiringService.getRequestsByInspector(userDetails.getUsername()));
    }

    // Inspector / Admin: update request status
    @PatchMapping("/{id}/status")
    public ResponseEntity<?> updateStatus(
            @PathVariable Long id,
            @RequestParam String status) {
        try {
            RequestStatus requestStatus = RequestStatus.valueOf(status.toUpperCase());
            hiringService.updateStatus(id, requestStatus);
            return ResponseEntity.ok(new ApiResponse(true, "Status updated to " + status));
        } catch (IllegalArgumentException e) {
            return ResponseEntity.badRequest()
                .body(new ApiResponse(false, "Invalid status. Use: PENDING, ACCEPTED, REJECTED, COMPLETED"));
        } catch (RuntimeException e) {
            return ResponseEntity.status(404).body(new ApiResponse(false, e.getMessage()));
        }
    }
}
