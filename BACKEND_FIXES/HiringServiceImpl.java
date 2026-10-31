package com.vehicleinspection.service.impl;

import com.vehicleinspection.dto.request.HiringRequestDto;
import com.vehicleinspection.exception.ResourceNotFoundException;
import com.vehicleinspection.model.HiringRequest;
import com.vehicleinspection.model.InspectorProfile;
import com.vehicleinspection.model.RequestStatus;
import com.vehicleinspection.model.User;
import com.vehicleinspection.repository.HiringRequestRepository;
import com.vehicleinspection.repository.InspectorProfileRepository;
import com.vehicleinspection.repository.UserRepository;
import com.vehicleinspection.service.HiringService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class HiringServiceImpl implements HiringService {

    private final HiringRequestRepository hiringRequestRepository;
    private final InspectorProfileRepository inspectorProfileRepository;
    private final UserRepository userRepository;

    @Override
    public void createRequest(HiringRequestDto dto, String customerEmail) {
        User customer = userRepository.findByEmail(customerEmail)
            .orElseThrow(() -> new ResourceNotFoundException("Customer not found"));

        InspectorProfile inspector = inspectorProfileRepository.findById(dto.getInspectorId())
            .orElseThrow(() -> new ResourceNotFoundException("Inspector not found"));

        HiringRequest request = HiringRequest.builder()
            .customer(customer)
            .inspector(inspector)
            .vehicleDetails(dto.getVehicleDetails())
            .message(dto.getMessage())
            .status(RequestStatus.PENDING)
            .build();

        hiringRequestRepository.save(request);
    }

    @Override
    public void updateStatus(Long id, RequestStatus status) {
        HiringRequest request = hiringRequestRepository.findById(id)
            .orElseThrow(() -> new ResourceNotFoundException("Hiring request not found with ID: " + id));
        request.setStatus(status);
        hiringRequestRepository.save(request);
    }

    @Override
    public List<HiringRequest> getRequestsByCustomer(String customerEmail) {
        User customer = userRepository.findByEmail(customerEmail)
            .orElseThrow(() -> new ResourceNotFoundException("Customer not found"));
        return hiringRequestRepository.findByCustomerOrderByRequestedAtDesc(customer);
    }

    @Override
    public List<HiringRequest> getRequestsByInspector(String inspectorEmail) {
        User inspectorUser = userRepository.findByEmail(inspectorEmail)
            .orElseThrow(() -> new ResourceNotFoundException("Inspector not found"));
        InspectorProfile profile = inspectorUser.getInspectorProfile();
        if (profile == null) throw new ResourceNotFoundException("Inspector profile not found");
        return hiringRequestRepository.findByInspectorOrderByRequestedAtDesc(profile);
    }
}
