package com.slotswapper.backend.service;

import com.slotswapper.backend.dto.CreateEventDTO;
import com.slotswapper.backend.dto.EventResponseDTO;
import com.slotswapper.backend.model.Event;
import com.slotswapper.backend.model.EventStatus;
import com.slotswapper.backend.model.User;
import com.slotswapper.backend.repository.EventRepository;
import com.slotswapper.backend.repository.UserAuthRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;
import java.util.List;
import java.util.stream.Collectors;

@Service
public class EventService {

    @Autowired private EventRepository eventRepository;
    @Autowired private UserAuthRepository userRepository;


    public List<EventResponseDTO> getMyEvents(String userEmail) {
        User user = getUserByEmail(userEmail);
        List<Event> events = eventRepository.findByUserId(user.getId());

        // Convert the list of Event entities to EventResponseDTOs
        return events.stream()
                .map(this::convertToDTO)
                .collect(Collectors.toList());
    }


    public EventResponseDTO createEvent(CreateEventDTO dto, String userEmail) {
        User user = getUserByEmail(userEmail);

        Event event = new Event();
        event.setTitle(dto.getTitle());
        event.setStartTime(dto.getStartTime());
        event.setEndTime(dto.getEndTime());
        event.setStatus(EventStatus.BUSY); // New events are ALWAYS 'BUSY' first
        event.setUser(user); // Link the event to the logged-in user

        Event savedEvent = eventRepository.save(event);
        return convertToDTO(savedEvent);
    }


    public EventResponseDTO updateEventStatus(Long eventId, EventStatus newStatus, String userEmail) {
        User user = getUserByEmail(userEmail);
        Event event = eventRepository.findById(eventId)
                .orElseThrow(() -> new RuntimeException("Event not found"));

        if (!event.getUser().getId().equals(user.getId())) {
            throw new RuntimeException("Unauthorized: You do not own this event");
        }

        event.setStatus(newStatus);
        Event updatedEvent = eventRepository.save(event);
        return convertToDTO(updatedEvent);
    }


    public List<EventResponseDTO> getSwappableEvents(String currentUserEmail) {
        User currentUser = getUserByEmail(currentUserEmail);

        // Fetch all SWAPPABLE events that are NOT owned by the current user
        List<Event> events = eventRepository.findByStatusAndUserIdNot(EventStatus.SWAPPABLE, currentUser.getId());

        return events.stream()
                .map(this::convertToDTO)
                .collect(Collectors.toList());
    }

    private User getUserByEmail(String email) {
        return userRepository.findByEmail(email)
                .orElseThrow(() -> new UsernameNotFoundException("User not found"));
    }

    private EventResponseDTO convertToDTO(Event event) {
        return new EventResponseDTO(
                event.getId(),
                event.getTitle(),
                event.getStartTime(),
                event.getEndTime(),
                event.getStatus(),
                event.getUser().getId()
        );
    }
}