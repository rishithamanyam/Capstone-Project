package com.wipro.csd.dto;

import lombok.Data;

@Data
public class UserRequest {
    private String name;
    private String email;
    private String phone;
    private String location;
    private String role;
    private Long managerId;
}
