package com.wipro.csd.dto;

import lombok.Data;

@Data
public class StatusUpdateRequest {
    private String status;
    private Integer rating;
}
