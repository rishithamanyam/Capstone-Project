package com.wipro.csd.controller;

import com.wipro.csd.dto.*;
import com.wipro.csd.model.User;
import com.wipro.csd.repository.UserRepository;
import com.wipro.csd.service.AuthService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/auth")
public class AuthController {

    @Autowired private AuthService authService;
    @Autowired private UserRepository userRepo;

    @PostMapping("/login")
    public ResponseEntity<LoginResponse> login(@RequestBody LoginRequest req) {
        return ResponseEntity.ok(authService.login(req));
    }

    @PostMapping("/register")
    public ResponseEntity<ApiResponse> register(@RequestBody RegisterRequest req) {
        return ResponseEntity.ok(authService.register(req));
    }

    @GetMapping("/me")
    public ResponseEntity<User> me(Authentication auth) {
        User user = authService.getProfile(auth.getName());
        user.setPassword(null);
        return ResponseEntity.ok(user);
    }

    @PutMapping("/change-password")
    public ResponseEntity<ApiResponse> changePassword(@RequestBody ChangePasswordRequest req, Authentication auth) {
        return ResponseEntity.ok(authService.changePassword(auth.getName(), req));
    }

    @PutMapping("/profile")
    public ResponseEntity<ApiResponse> updateProfile(@RequestBody UserRequest req, Authentication auth) {
        return ResponseEntity.ok(authService.updateProfile(auth.getName(), req));
    }
}
