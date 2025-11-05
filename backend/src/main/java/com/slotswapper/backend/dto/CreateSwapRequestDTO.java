package com.slotswapper.backend.dto;


public class CreateSwapRequestDTO {

    private Long mySlotId;
    private Long theirSlotId;


    public Long getMySlotId() { return mySlotId; }
    public void setMySlotId(Long mySlotId) { this.mySlotId = mySlotId; }
    public Long getTheirSlotId() { return theirSlotId; }
    public void setTheirSlotId(Long theirSlotId) { this.theirSlotId = theirSlotId; }
}