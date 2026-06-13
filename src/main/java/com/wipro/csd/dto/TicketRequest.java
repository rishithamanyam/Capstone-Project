package com.wipro.csd.dto;

import lombok.Data;

@Data
public class TicketRequest {
    private String domain;
    private String subject;
    private String description;
}
