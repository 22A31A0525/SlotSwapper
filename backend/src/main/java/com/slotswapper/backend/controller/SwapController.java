package com.slotswapper.backend.controller;

import com.slotswapper.backend.dto.CreateSwapRequestDTO;
import com.slotswapper.backend.dto.EventResponseDTO;
import com.slotswapper.backend.dto.SwapRequestResponseDTO;
import com.slotswapper.backend.dto.SwapResponseDTO;
import com.slotswapper.backend.model.SwapRequest;
import com.slotswapper.backend.service.EventService;
import com.slotswapper.backend.service.SwapService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api")
public class SwapController {

    @Autowired
    private EventService eventService;

    @Autowired
    private SwapService swapService;

    private String getCurrentUserEmail() {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        return authentication.getName();
    }


    @GetMapping("/swappable-slots")
    public ResponseEntity<List<EventResponseDTO>> getSwappableSlots() {
        return ResponseEntity.ok(eventService.getSwappableEvents(getCurrentUserEmail()));
    }

    @GetMapping("/swap-requests/incoming")
    public ResponseEntity<List<SwapRequestResponseDTO>> getIncomingRequests() {
        return ResponseEntity.ok(swapService.getIncomingRequests(getCurrentUserEmail()));
    }


    @GetMapping("/swap-requests/outgoing")
    public ResponseEntity<List<SwapRequestResponseDTO>> getOutgoingRequests() {
        return ResponseEntity.ok(swapService.getOutgoingRequests(getCurrentUserEmail()));
    }


    @PostMapping("/swap-response/{requestId}")
    public ResponseEntity<SwapRequestResponseDTO> respondToSwap(
            @PathVariable Long requestId,
            @RequestBody SwapResponseDTO responseDTO) {

        String email = getCurrentUserEmail();

        SwapRequestResponseDTO updatedRequest = swapService.respondToSwapRequest(
                requestId,
                responseDTO.isAccepted(),
                email
        );

        return ResponseEntity.ok(updatedRequest);
    }

    @PostMapping("/swap-request")
    public ResponseEntity<SwapRequestResponseDTO> createSwapRequest(@RequestBody CreateSwapRequestDTO requestDTO) {

        String email = getCurrentUserEmail();

        SwapRequestResponseDTO newRequest = swapService.createSwapRequest(
                requestDTO.getMySlotId(),
                requestDTO.getTheirSlotId(),
                email
        );


        return ResponseEntity.status(HttpStatus.CREATED).body(newRequest);
    }
}