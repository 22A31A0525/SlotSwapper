package com.slotswapper.backend.service;

import com.slotswapper.backend.dto.SwapRequestResponseDTO;
import com.slotswapper.backend.model.*;
import com.slotswapper.backend.repository.EventRepository;
import com.slotswapper.backend.repository.SwapRequestRepository;
import com.slotswapper.backend.repository.UserAuthRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Service
public class SwapService {

    @Autowired private UserAuthRepository userRepository;
    @Autowired private EventRepository eventRepository;
    @Autowired private SwapRequestRepository swapRequestRepository;


    // It makes sure that if *any* part of this method fails,
    @Transactional
    public SwapRequestResponseDTO createSwapRequest(Long mySlotId, Long theirSlotId, String requesterEmail) {

        // --- GET ALL THE PIECES ---
        User requester = userRepository.findByEmail(requesterEmail)
                .orElseThrow(() -> new UsernameNotFoundException("User not found"));

        Event offeredSlot = eventRepository.findById(mySlotId)
                .orElseThrow(() -> new RuntimeException("Offered slot not found"));

        Event desiredSlot = eventRepository.findById(theirSlotId)
                .orElseThrow(() -> new RuntimeException("Desired slot not found"));

        // --- THE "GATEKEEPER" LOGIC (VALIDATION) ---

        //  Do I actually own the slot I am offering?
        if (!offeredSlot.getUser().getId().equals(requester.getId())) {
            throw new RuntimeException("Unauthorized: You do not own the slot you are offering.");
        }

        //  Is the slot I'm offering *actually* swappable?
        if (offeredSlot.getStatus() != EventStatus.SWAPPABLE) {
            throw new RuntimeException("Your offered slot is not in a swappable state.");
        }

        // Is the slot I *want* still available?

        if (desiredSlot.getStatus() != EventStatus.SWAPPABLE) {
            throw new RuntimeException("The desired slot is no longer available.");
        }

        // --- GATEKEEPER PASSED. LOCK THE EVENTS. ---
        offeredSlot.setStatus(EventStatus.SWAP_PENDING);
        desiredSlot.setStatus(EventStatus.SWAP_PENDING);

        eventRepository.save(offeredSlot);
        eventRepository.save(desiredSlot);

        // --- CREATE THE SWAP REQUEST RECORD ---
        SwapRequest swapRequest = new SwapRequest();
        swapRequest.setRequester(requester);
        swapRequest.setResponder(desiredSlot.getUser()); // The owner of the desired slot
        swapRequest.setOfferedSlot(offeredSlot);
        swapRequest.setDesiredSlot(desiredSlot);
        swapRequest.setStatus(SwapStatus.PENDING);
        SwapRequest savedRequest = swapRequestRepository.save(swapRequest);

        // Step 2: Return the DTO, passing in the saved entity
        return new SwapRequestResponseDTO(savedRequest);
    }


    public List<SwapRequestResponseDTO> getIncomingRequests(String userEmail) {
        return swapRequestRepository.findByResponder_Email(userEmail)
                .stream()
                .map(SwapRequestResponseDTO::new) // Convert each entity to a DTO
                .collect(Collectors.toList());
    }

    public List<SwapRequestResponseDTO> getOutgoingRequests(String userEmail) {
        return swapRequestRepository.findByRequester_Email(userEmail)
                .stream()
                .map(SwapRequestResponseDTO::new) // Convert each entity to a DTO
                .collect(Collectors.toList());
    }


    // Change the return type here from 'SwapRequest' to 'SwapRequestResponseDTO'
    @Transactional
    public SwapRequestResponseDTO respondToSwapRequest(Long requestId, boolean accepted, String responderEmail) {
        // 1. GET THE REQUEST
        SwapRequest request = swapRequestRepository.findById(requestId)
                .orElseThrow(() -> new RuntimeException("Swap request not found"));

        // 2. SECURITY CHECK
        User responder = userRepository.findByEmail(responderEmail)
                .orElseThrow(() -> new UsernameNotFoundException("User not found"));

        if (!request.getResponder().getId().equals(responder.getId())) {
            throw new RuntimeException("Unauthorized: You are not the responder for this request.");
        }

        // 3. CHECK STATUS
        if (request.getStatus() != SwapStatus.PENDING) {
            throw new RuntimeException("This request has already been processed.");
        }

        Event offeredSlot = request.getOfferedSlot();
        Event desiredSlot = request.getDesiredSlot();

        if (accepted) {
            // --- ACCEPTED ---
            request.setStatus(SwapStatus.ACCEPTED);

            User originalRequester = request.getRequester();
            User originalResponder = request.getResponder();

            // Swap owners
            offeredSlot.setUser(originalResponder);
            desiredSlot.setUser(originalRequester);

            // Lock them back to BUSY
            offeredSlot.setStatus(EventStatus.BUSY);
            desiredSlot.setStatus(EventStatus.BUSY);
        } else {
            // --- REJECTED ---
            request.setStatus(SwapStatus.REJECTED);
            // Unlock them for others
            offeredSlot.setStatus(EventStatus.SWAPPABLE);
            desiredSlot.setStatus(EventStatus.SWAPPABLE);
        }

        eventRepository.save(offeredSlot);
        eventRepository.save(desiredSlot);
        SwapRequest savedRequest = swapRequestRepository.save(request);

        // Return the DTO
        return new SwapRequestResponseDTO(savedRequest);
    }


}