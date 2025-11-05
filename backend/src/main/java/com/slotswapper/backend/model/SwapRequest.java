package com.slotswapper.backend.model;

import jakarta.persistence.*;

@Entity
@Table(name = "swap_requests")
public class SwapRequest {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    // The user who SENT the request
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "requester_id", nullable = false)
    private User requester;

    // The user who MUST RESPOND to the request
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "responder_id", nullable = false)
    private User responder;

    // The slot being offered
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "offered_slot_id", nullable = false)
    private Event offeredSlot;

    // The slot being requested
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "desired_slot_id", nullable = false)
    private Event desiredSlot;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private SwapStatus status;


    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }
    public User getRequester() { return requester; }
    public void setRequester(User requester) { this.requester = requester; }
    public User getResponder() { return responder; }
    public void setResponder(User responder) { this.responder = responder; }
    public Event getOfferedSlot() { return offeredSlot; }
    public void setOfferedSlot(Event offeredSlot) { this.offeredSlot = offeredSlot; }
    public Event getDesiredSlot() { return desiredSlot; }
    public void setDesiredSlot(Event desiredSlot) { this.desiredSlot = desiredSlot; }
    public SwapStatus getStatus() { return status; }
    public void setStatus(SwapStatus status) { this.status = status; }
}