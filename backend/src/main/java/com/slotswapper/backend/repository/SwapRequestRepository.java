package com.slotswapper.backend.repository;

import com.slotswapper.backend.model.SwapRequest;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface SwapRequestRepository extends JpaRepository<SwapRequest, Long> {
    // Find requests sent TO me (where I am the responder)
    List<SwapRequest> findByResponder_Email(String email);

    // Find requests sent BY me (where I am the requester)
    List<SwapRequest> findByRequester_Email(String email);
}