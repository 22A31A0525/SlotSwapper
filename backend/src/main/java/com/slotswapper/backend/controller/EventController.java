package com.slotswapper.backend.controller;

import com.slotswapper.backend.dto.CreateEventDTO;
import com.slotswapper.backend.dto.EventResponseDTO;
import com.slotswapper.backend.model.EventStatus;
import com.slotswapper.backend.service.EventService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/events")
public class EventController {

    @Autowired
    private EventService eventService;


    private String getCurrentUserEmail() {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        return authentication.getName();
    }


    // Fetch all events belonging to the logged-in user
    @GetMapping
    public ResponseEntity<List<EventResponseDTO>> getMyEvents() {
        return ResponseEntity.ok(eventService.getMyEvents(getCurrentUserEmail()));
    }


    // Create a new event (defaults to BUSY status)
    @PostMapping
    public ResponseEntity<EventResponseDTO> createEvent(@RequestBody CreateEventDTO createEventDTO) {
        EventResponseDTO newEvent = eventService.createEvent(createEventDTO, getCurrentUserEmail());
        return ResponseEntity.status(HttpStatus.CREATED).body(newEvent);
    }


    // Update an event's status (e.g., to make it SWAPPABLE)
    @PutMapping("/{id}/status")
    public ResponseEntity<EventResponseDTO> updateEventStatus(
            @PathVariable Long id,
            @RequestBody Map<String, String> statusUpdate) {

        // Convert the string from JSON into our Java Enum
        EventStatus newStatus = EventStatus.valueOf(statusUpdate.get("status"));

        EventResponseDTO updatedEvent = eventService.updateEventStatus(id, newStatus, getCurrentUserEmail());
        return ResponseEntity.ok(updatedEvent);
    }
}