package com.wipro.csd.controller;

import com.wipro.csd.model.User;
import com.wipro.csd.repository.UserRepository;
import com.wipro.csd.service.AnalyticsService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.server.ResponseStatusException;

import java.util.Map;

@RestController
@RequestMapping("/api/analytics")
public class AnalyticsController {

    @Autowired private AnalyticsService analyticsService;
    @Autowired private UserRepository userRepo;

    @GetMapping("/admin")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<Map<String, Object>> adminStats() {
        return ResponseEntity.ok(analyticsService.getAdminStats());
    }

    @GetMapping("/manager")
    @PreAuthorize("hasRole('MANAGER')")
    public ResponseEntity<Map<String, Object>> managerStats(Authentication auth) {
        User manager = getUser(auth);
        return ResponseEntity.ok(analyticsService.getManagerStats(manager));
    }

    @GetMapping("/rep")
    @PreAuthorize("hasRole('REPRESENTATIVE')")
    public ResponseEntity<Map<String, Object>> repStats(Authentication auth) {
        User rep = getUser(auth);
        return ResponseEntity.ok(analyticsService.getRepStats(rep));
    }

    @GetMapping("/customer")
    @PreAuthorize("hasRole('CUSTOMER')")
    public ResponseEntity<Map<String, Object>> customerStats(Authentication auth) {
        User customer = getUser(auth);
        return ResponseEntity.ok(analyticsService.getCustomerStats(customer));
    }

    private User getUser(Authentication auth) {
        return userRepo.findByEmail(auth.getName())
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "User not found"));
    }
}
