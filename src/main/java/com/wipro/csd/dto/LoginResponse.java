package com.wipro.csd.dto;

import lombok.Builder;
import lombok.Data;

@Data
@Builder
public class LoginResponse {
    private String token;
    private Long userId;
    private String name;
    private String email;
    private String role;
    private boolean firstLogin;
    private String location;
    private Long managerId;
}
