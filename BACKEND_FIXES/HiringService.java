package com.vehicleinspection.service;

import com.vehicleinspection.dto.request.HiringRequestDto;
import com.vehicleinspection.model.HiringRequest;
import com.vehicleinspection.model.RequestStatus;

import java.util.List;

public interface HiringService {
    void createRequest(HiringRequestDto dto, String customerEmail);
    void updateStatus(Long id, RequestStatus status);
    List<HiringRequest> getRequestsByCustomer(String customerEmail);
    List<HiringRequest> getRequestsByInspector(String inspectorEmail);
}
