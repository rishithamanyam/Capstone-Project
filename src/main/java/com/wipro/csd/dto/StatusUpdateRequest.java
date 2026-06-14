package com.wipro.csd.dto;

public class StatusUpdateRequest {
    private String status;
    private Integer rating;

    public String getStatus() { return status; }
    public void setStatus(String status) { this.status = status; }

    public Integer getRating() { return rating; }
    public void setRating(Integer rating) { this.rating = rating; }
}
