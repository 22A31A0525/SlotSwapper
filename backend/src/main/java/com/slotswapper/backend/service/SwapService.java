package com.slotswapper.backend.service;

import com.slotswapper.backend.dto.SwapRequestResponseDTO;
import com.slotswapper.backend.model.*;
import com.slotswapper.backend.repository.EventRepository;
import com.slotswapper.backend.repository.SwapRequestRepository;
import com.slotswapper.backend.repository.UserAuthRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Service
public class SwapService {

    @Autowired
    private UserAuthRepository userRepository;
    @Autowired
    private EventRepository eventRepository;
    @Autowired
    private SwapRequestRepository swapRequestRepository;

    @Autowired
    private SimpMessagingTemplate messagingTemplate;


    // Business logic regarding swap request thereafter request is stored in swap request table in DB
    @Transactional
    public SwapRequestResponseDTO createSwapRequest(Long mySlotId, Long theirSlotId, String requesterEmail) {
        System.out.println("[DEBUG] Starting createSwapRequest for: " + requesterEmail); // LOG 1

        User requester = userRepository.findByEmail(requesterEmail)
                .orElseThrow(() -> new UsernameNotFoundException("User not found"));

        Event offeredSlot = eventRepository.findById(mySlotId)
                .orElseThrow(() -> new RuntimeException("Offered slot not found"));

        Event desiredSlot = eventRepository.findById(theirSlotId)
                .orElseThrow(() -> new RuntimeException("Desired slot not found"));

        if (!offeredSlot.getUser().getId().equals(requester.getId())) {
            throw new RuntimeException("Unauthorized: You do not own the slot you are offering.");
        }
        if (offeredSlot.getStatus() != EventStatus.SWAPPABLE) {
            throw new RuntimeException("Your offered slot is not in a swappable state.");
        }
        if (desiredSlot.getStatus() != EventStatus.SWAPPABLE) {
            throw new RuntimeException("The desired slot is no longer available.");
        }

        offeredSlot.setStatus(EventStatus.SWAP_PENDING);
        desiredSlot.setStatus(EventStatus.SWAP_PENDING);
        eventRepository.save(offeredSlot);
        eventRepository.save(desiredSlot);

        SwapRequest swapRequest = new SwapRequest();
        swapRequest.setRequester(requester);
        swapRequest.setResponder(desiredSlot.getUser());
        swapRequest.setOfferedSlot(offeredSlot);
        swapRequest.setDesiredSlot(desiredSlot);
        swapRequest.setStatus(SwapStatus.PENDING);
        SwapRequest savedRequest = swapRequestRepository.save(swapRequest);

        //  NOTIFICATION LOGIC
        String responderEmail = desiredSlot.getUser().getEmail();
        System.out.println("[DEBUG] Attempting to send WS notification to: " + responderEmail); // LOG 2
        try {
            messagingTemplate.convertAndSendToUser(
                    responderEmail,
                    "/queue/notifications",
                    "NEW_REQUEST"
            );
            System.out.println("[DEBUG] WS Notification successfully SENT to: " + responderEmail); // LOG 3
        } catch (Exception e) {
            System.err.println("[ERROR] Failed to send WS notification: " + e.getMessage());
            e.printStackTrace();
        }


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


    // Business Logic regarding swap(Acceptance,rejection) and update in Swap request table and change the slot
    //state to Busy by Default
    @Transactional
    public SwapRequestResponseDTO respondToSwapRequest(Long requestId, boolean accepted, String responderEmail) {

        SwapRequest request = swapRequestRepository.findById(requestId)
                .orElseThrow(() -> new RuntimeException("Swap request not found"));


        User responder = userRepository.findByEmail(responderEmail)
                .orElseThrow(() -> new UsernameNotFoundException("User not found"));

        if (!request.getResponder().getId().equals(responder.getId())) {
            throw new RuntimeException("Unauthorized: You are not the responder for this request.");
        }


        if (request.getStatus() != SwapStatus.PENDING) {
            throw new RuntimeException("This request has already been processed.");
        }

        Event offeredSlot = request.getOfferedSlot();
        Event desiredSlot = request.getDesiredSlot();

        // Prepare the notification message based on the action
        String notificationMessage;

        if (accepted) {
            // --- ACCEPTED ---
            request.setStatus(SwapStatus.ACCEPTED);
            // Swap owners
            offeredSlot.setUser(request.getResponder());
            desiredSlot.setUser(request.getRequester());
            // Lock them back to BUSY
            offeredSlot.setStatus(EventStatus.BUSY);
            desiredSlot.setStatus(EventStatus.BUSY);

            notificationMessage = "SWAP_ACCEPTED";
        } else {
            // --- REJECTED ---
            request.setStatus(SwapStatus.REJECTED);
            // Unlock them for others
            offeredSlot.setStatus(EventStatus.SWAPPABLE);
            desiredSlot.setStatus(EventStatus.SWAPPABLE);

            notificationMessage = "SWAP_REJECTED";
        }

        //  NOTIFICATION LOGIC
        // We send this to the ORIGINAL REQUESTER to let them know the outcome.
        String requesterEmail = request.getRequester().getEmail();
        System.out.println("[DEBUG] Sending " + notificationMessage + " notification to: " + requesterEmail);
        try {
            messagingTemplate.convertAndSendToUser(
                    requesterEmail,
                    "/queue/notifications",
                    notificationMessage
            );
        } catch (Exception e) {
            System.err.println("[ERROR] Failed to send response notification: " + e.getMessage());
        }


        eventRepository.save(offeredSlot);
        eventRepository.save(desiredSlot);
        SwapRequest savedRequest = swapRequestRepository.save(request);

        return new SwapRequestResponseDTO(savedRequest);
    }
}