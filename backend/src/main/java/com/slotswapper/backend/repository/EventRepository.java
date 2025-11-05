package com.slotswapper.backend.repository;

import com.slotswapper.backend.model.Event;
import com.slotswapper.backend.model.EventStatus;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;

public interface EventRepository extends JpaRepository<Event, Long> {

    List<Event> findByUserId(Long userId);

    List<Event> findByStatusAndUserIdNot(EventStatus status, Long userId);
}