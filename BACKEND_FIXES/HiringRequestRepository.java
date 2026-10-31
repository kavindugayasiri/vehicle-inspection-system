package com.vehicleinspection.repository;

import com.vehicleinspection.model.HiringRequest;
import com.vehicleinspection.model.InspectorProfile;
import com.vehicleinspection.model.User;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface HiringRequestRepository extends JpaRepository<HiringRequest, Long> {
    List<HiringRequest> findByCustomerOrderByRequestedAtDesc(User customer);
    List<HiringRequest> findByInspectorOrderByRequestedAtDesc(InspectorProfile inspector);
}
