package com.wipro.csd.controller;

import com.wipro.csd.dto.ApiResponse;
import com.wipro.csd.dto.UserRequest;
import com.wipro.csd.model.User;
import com.wipro.csd.repository.UserRepository;
import com.wipro.csd.service.UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.server.ResponseStatusException;

import java.util.List;

@RestController
@RequestMapping("/api/users")
public class UserController {

    @Autowired private UserService userService;
    @Autowired private UserRepository userRepo;

    @GetMapping("/employees")
    @PreAuthorize("hasAnyRole('ADMIN', 'MANAGER')")
    public ResponseEntity<List<User>> getEmployees(Authentication auth) {
        User requester = getUser(auth);
        List<User> list = userService.getEmployees(requester);
        list.forEach(u -> u.setPassword(null));
        return ResponseEntity.ok(list);
    }

    @GetMapping("/customers")
    @PreAuthorize("hasAnyRole('ADMIN', 'REPRESENTATIVE', 'MANAGER')")
    public ResponseEntity<List<User>> getCustomers() {
        List<User> list = userService.getCustomers();
        list.forEach(u -> u.setPassword(null));
        return ResponseEntity.ok(list);
    }

    @GetMapping("/search")
    @PreAuthorize("hasAnyRole('ADMIN', 'REPRESENTATIVE', 'MANAGER')")
    public ResponseEntity<List<User>> searchCustomers(@RequestParam String q) {
        List<User> list = userService.searchCustomers(q);
        list.forEach(u -> u.setPassword(null));
        return ResponseEntity.ok(list);
    }

    @PostMapping
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<User> createEmployee(@RequestBody UserRequest req) {
        User saved = userService.createEmployee(req);
        saved.setPassword(null);
        return ResponseEntity.status(HttpStatus.CREATED).body(saved);
    }

    @PutMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<User> updateEmployee(@PathVariable Long id, @RequestBody UserRequest req) {
        User updated = userService.updateEmployee(id, req);
        updated.setPassword(null);
        return ResponseEntity.ok(updated);
    }

    @DeleteMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<ApiResponse> deleteEmployee(@PathVariable Long id) {
        return ResponseEntity.ok(userService.deleteEmployee(id));
    }

    private User getUser(Authentication auth) {
        return userRepo.findByEmail(auth.getName())
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "User not found"));
    }
}
