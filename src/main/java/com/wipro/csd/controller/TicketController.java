package com.wipro.csd.controller;

import com.wipro.csd.dto.ApiResponse;
import com.wipro.csd.dto.StatusUpdateRequest;
import com.wipro.csd.dto.TicketRequest;
import com.wipro.csd.model.Ticket;
import com.wipro.csd.model.User;
import com.wipro.csd.repository.UserRepository;
import com.wipro.csd.service.TicketService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.server.ResponseStatusException;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/tickets")
public class TicketController {

    @Autowired private TicketService ticketService;
    @Autowired private UserRepository userRepo;

    @GetMapping
    public ResponseEntity<List<Ticket>> getTickets(Authentication auth) {
        User user = getUser(auth);
        return ResponseEntity.ok(ticketService.getTicketsForUser(user));
    }

    @PostMapping
    @PreAuthorize("hasRole('CUSTOMER')")
    public ResponseEntity<Ticket> createTicket(@RequestBody TicketRequest req, Authentication auth) {
        User customer = getUser(auth);
        return ResponseEntity.status(HttpStatus.CREATED).body(ticketService.createTicket(customer, req));
    }

    @PutMapping("/{id}/status")
    @PreAuthorize("hasAnyRole('REPRESENTATIVE', 'MANAGER', 'ADMIN')")
    public ResponseEntity<Ticket> updateStatus(@PathVariable Long id, @RequestBody StatusUpdateRequest req, Authentication auth) {
        User rep = getUser(auth);
        return ResponseEntity.ok(ticketService.updateStatus(id, rep, req));
    }

    @PutMapping("/{id}/rate")
    @PreAuthorize("hasRole('CUSTOMER')")
    public ResponseEntity<Ticket> rateTicket(@PathVariable Long id, @RequestBody Map<String, Integer> body, Authentication auth) {
        User customer = getUser(auth);
        int rating = body.getOrDefault("rating", 5);
        return ResponseEntity.ok(ticketService.rateTicket(id, customer.getId(), rating));
    }

    @GetMapping("/search")
    @PreAuthorize("hasAnyRole('REPRESENTATIVE', 'MANAGER', 'ADMIN')")
    public ResponseEntity<List<Ticket>> search(@RequestParam String q) {
        return ResponseEntity.ok(ticketService.searchByCustomer(q));
    }

    private User getUser(Authentication auth) {
        return userRepo.findByEmail(auth.getName())
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "User not found"));
    }
}
