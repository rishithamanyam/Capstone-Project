package com.wipro.csd.dto;

public class LoginResponse {
    private String token;
    private Long userId;
    private String name;
    private String email;
    private String role;
    private boolean firstLogin;
    private String location;
    private Long managerId;

    public LoginResponse() {}

    public String getToken() { return token; }
    public void setToken(String token) { this.token = token; }

    public Long getUserId() { return userId; }
    public void setUserId(Long userId) { this.userId = userId; }

    public String getName() { return name; }
    public void setName(String name) { this.name = name; }

    public String getEmail() { return email; }
    public void setEmail(String email) { this.email = email; }

    public String getRole() { return role; }
    public void setRole(String role) { this.role = role; }

    public boolean isFirstLogin() { return firstLogin; }
    public void setFirstLogin(boolean firstLogin) { this.firstLogin = firstLogin; }

    public String getLocation() { return location; }
    public void setLocation(String location) { this.location = location; }

    public Long getManagerId() { return managerId; }
    public void setManagerId(Long managerId) { this.managerId = managerId; }

    public static Builder builder() { return new Builder(); }

    public static class Builder {
        private final LoginResponse r = new LoginResponse();
        public Builder token(String v) { r.token = v; return this; }
        public Builder userId(Long v) { r.userId = v; return this; }
        public Builder name(String v) { r.name = v; return this; }
        public Builder email(String v) { r.email = v; return this; }
        public Builder role(String v) { r.role = v; return this; }
        public Builder firstLogin(boolean v) { r.firstLogin = v; return this; }
        public Builder location(String v) { r.location = v; return this; }
        public Builder managerId(Long v) { r.managerId = v; return this; }
        public LoginResponse build() { return r; }
    }
}
