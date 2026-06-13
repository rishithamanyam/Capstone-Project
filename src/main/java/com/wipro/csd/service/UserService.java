package com.wipro.csd.service;

import com.wipro.csd.dto.ApiResponse;
import com.wipro.csd.dto.UserRequest;
import com.wipro.csd.model.User;
import com.wipro.csd.repository.TicketRepository;
import com.wipro.csd.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.web.server.ResponseStatusException;

import java.time.LocalDateTime;
import java.util.List;

@Service
public class UserService {

    @Autowired private UserRepository userRepo;
    @Autowired private TicketRepository ticketRepo;
    @Autowired private PasswordEncoder passwordEncoder;
    @Autowired private NotificationService notifService;

    public List<User> getEmployees(User requester) {
        if (requester.getRole() == User.Role.ADMIN) {
            return userRepo.findAll().stream()
                    .filter(u -> u.getRole() != User.Role.CUSTOMER)
                    .toList();
        }
        if (requester.getRole() == User.Role.MANAGER) {
            return userRepo.findByManagerId(requester.getId());
        }
        return List.of();
    }

    public List<User> getCustomers() {
        return userRepo.findByRole(User.Role.CUSTOMER);
    }

    public List<User> searchCustomers(String query) {
        return userRepo.searchCustomers(query);
    }

    public User createEmployee(UserRequest req) {
        if (userRepo.existsByEmail(req.getEmail())) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Email already exists");
        }

        User.Role role = User.Role.valueOf(req.getRole().toUpperCase());
        if (role == User.Role.CUSTOMER || role == User.Role.ADMIN) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Invalid role for employee creation");
        }

        if (role == User.Role.REPRESENTATIVE && req.getManagerId() == null) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Manager is required for representative");
        }

        User user = User.builder()
                .name(req.getName())
                .email(req.getEmail())
                .password(passwordEncoder.encode("Welcome@123"))
                .role(role)
                .phone(req.getPhone())
                .managerId(req.getManagerId())
                .firstLogin(true)
                .createdAt(LocalDateTime.now())
                .build();

        User saved = userRepo.save(user);

        notifService.create(saved.getId(),
                "Welcome to CSD! Your account is ready. Email: " + req.getEmail() + " | Temp password: Welcome@123. Please login and change your password.",
                "CREDENTIAL");

        return saved;
    }

    public User updateEmployee(Long id, UserRequest req) {
        User user = userRepo.findById(id)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Employee not found"));

        if (req.getName() != null) user.setName(req.getName());
        if (req.getPhone() != null) user.setPhone(req.getPhone());
        if (req.getManagerId() != null) user.setManagerId(req.getManagerId());

        if (req.getRole() != null) {
            User.Role newRole = User.Role.valueOf(req.getRole().toUpperCase());
            if (newRole == User.Role.MANAGER && user.getRole() == User.Role.REPRESENTATIVE) {
                user.setManagerId(null);
            }
            user.setRole(newRole);
        }

        return userRepo.save(user);
    }

    public ApiResponse deleteEmployee(Long id) {
        User user = userRepo.findById(id)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Employee not found"));

        if (user.getRole() == User.Role.MANAGER) {
            List<User> reps = userRepo.findByManagerId(id);
            if (!reps.isEmpty()) {
                throw new ResponseStatusException(HttpStatus.BAD_REQUEST,
                        "Cannot delete manager with assigned representatives. Reassign them first.");
            }
        }

        userRepo.deleteById(id);
        return new ApiResponse(true, "Employee removed successfully");
    }
}
