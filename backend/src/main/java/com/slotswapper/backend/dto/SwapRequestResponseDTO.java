package com.slotswapper.backend.dto;

import com.slotswapper.backend.model.SwapRequest;
import java.time.LocalDateTime;

public class SwapRequestResponseDTO {
    private Long id;
    private String status;
    // Incoming/Outgoing simplified views
    private Long requesterId;
    private String requesterName;
    private String desiredSlotTitle;
    private String offeredSlotTitle;
    private LocalDateTime offeredSlotStartTime;

    // Empty constructor for frameworks
    public SwapRequestResponseDTO() { }

    // --- THE IMPORTANT CONSTRUCTOR ---
    public SwapRequestResponseDTO(SwapRequest request) {
        this.id = request.getId();
        this.status = request.getStatus().toString();
        this.requesterId = request.getRequester().getId();
        this.requesterName = request.getRequester().getName();
        // We only need simple data suitable for display, avoiding deep proxies
        this.desiredSlotTitle = request.getDesiredSlot().getTitle();
        this.offeredSlotTitle = request.getOfferedSlot().getTitle();
        this.offeredSlotStartTime = request.getOfferedSlot().getStartTime();
    }


    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }
    public String getStatus() { return status; }
    public void setStatus(String status) { this.status = status; }
    public Long getRequesterId() { return requesterId; }
    public void setRequesterId(Long requesterId) { this.requesterId = requesterId; }
    public String getRequesterName() { return requesterName; }
    public void setRequesterName(String requesterName) { this.requesterName = requesterName; }
    public String getDesiredSlotTitle() { return desiredSlotTitle; }
    public void setDesiredSlotTitle(String desiredSlotTitle) { this.desiredSlotTitle = desiredSlotTitle; }
    public String getOfferedSlotTitle() { return offeredSlotTitle; }
    public void setOfferedSlotTitle(String offeredSlotTitle) { this.offeredSlotTitle = offeredSlotTitle; }
    public LocalDateTime getOfferedSlotStartTime() { return offeredSlotStartTime; }
    public void setOfferedSlotStartTime(LocalDateTime offeredSlotStartTime) { this.offeredSlotStartTime = offeredSlotStartTime; }
}