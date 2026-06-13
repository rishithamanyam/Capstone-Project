package com.wipro.csd.controller;

import com.wipro.csd.dto.ApiResponse;
import com.wipro.csd.model.Notification;
import com.wipro.csd.model.User;
import com.wipro.csd.repository.UserRepository;
import com.wipro.csd.service.NotificationService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.server.ResponseStatusException;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/notifications")
public class NotificationController {

    @Autowired private NotificationService notifService;
    @Autowired private UserRepository userRepo;

    @GetMapping
    public ResponseEntity<List<Notification>> getNotifications(Authentication auth) {
        User user = getUser(auth);
        return ResponseEntity.ok(notifService.getForUser(user.getId()));
    }

    @GetMapping("/count")
    public ResponseEntity<Map<String, Long>> getUnreadCount(Authentication auth) {
        User user = getUser(auth);
        return ResponseEntity.ok(Map.of("count", notifService.getUnreadCount(user.getId())));
    }

    @PutMapping("/{id}/read")
    public ResponseEntity<ApiResponse> markRead(@PathVariable Long id) {
        return ResponseEntity.ok(notifService.markRead(id));
    }

    @DeleteMapping("/clear")
    public ResponseEntity<ApiResponse> clearRead(Authentication auth) {
        User user = getUser(auth);
        return ResponseEntity.ok(notifService.clearRead(user.getId()));
    }

    private User getUser(Authentication auth) {
        return userRepo.findByEmail(auth.getName())
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "User not found"));
    }
}
