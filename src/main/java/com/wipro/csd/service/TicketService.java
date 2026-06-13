package com.wipro.csd.service;

import com.wipro.csd.dto.ApiResponse;
import com.wipro.csd.dto.StatusUpdateRequest;
import com.wipro.csd.dto.TicketRequest;
import com.wipro.csd.model.Ticket;
import com.wipro.csd.model.User;
import com.wipro.csd.repository.TicketRepository;
import com.wipro.csd.repository.UserRepository;
import io.github.resilience4j.circuitbreaker.annotation.CircuitBreaker;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.web.server.ResponseStatusException;

import java.time.LocalDateTime;
import java.time.temporal.ChronoUnit;
import java.util.List;

@Service
public class TicketService {

    @Autowired private TicketRepository ticketRepo;
    @Autowired private UserRepository userRepo;
    @Autowired private NotificationService notifService;

    @CircuitBreaker(name = "ticketService", fallbackMethod = "getTicketsFallback")
    public List<Ticket> getTicketsForUser(User user) {
        return switch (user.getRole()) {
            case CUSTOMER -> ticketRepo.findByCustomerIdOrderByCreatedAtDesc(user.getId());
            case REPRESENTATIVE -> ticketRepo.findByRepIdOrderByCreatedAtDesc(user.getId());
            case MANAGER -> ticketRepo.findByManagerIdOrderByCreatedAtDesc(user.getId());
            case ADMIN -> ticketRepo.findAll();
        };
    }

    public List<Ticket> getTicketsFallback(User user, Throwable t) {
        return List.of();
    }

    public Ticket createTicket(User customer, TicketRequest req) {
        Ticket ticket = Ticket.builder()
                .customerId(customer.getId())
                .customerName(customer.getName())
                .customerPhone(customer.getPhone())
                .customerLocation(customer.getLocation())
                .domain(req.getDomain())
                .subject(req.getSubject())
                .description(req.getDescription())
                .status(Ticket.TicketStatus.OPEN)
                .createdAt(LocalDateTime.now())
                .build();

        Ticket saved = ticketRepo.save(ticket);

        List<User> reps = userRepo.findByRole(User.Role.REPRESENTATIVE);
        for (User rep : reps) {
            notifService.create(rep.getId(),
                    "New support ticket #" + saved.getId() + " raised by " + customer.getName() + " — " + req.getDomain(),
                    "TICKET");
        }

        return saved;
    }

    public Ticket updateStatus(Long ticketId, User rep, StatusUpdateRequest req) {
        Ticket ticket = ticketRepo.findById(ticketId)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Ticket not found"));

        if (ticket.getRepId() != null && !ticket.getRepId().equals(rep.getId())
                && rep.getRole() != User.Role.ADMIN && rep.getRole() != User.Role.MANAGER) {
            throw new ResponseStatusException(HttpStatus.FORBIDDEN, "Not authorized to update this ticket");
        }

        Ticket.TicketStatus newStatus = Ticket.TicketStatus.valueOf(req.getStatus());

        if (newStatus == Ticket.TicketStatus.IN_PROGRESS && ticket.getFirstResponseAt() == null) {
            ticket.setRepId(rep.getId());
            ticket.setRepName(rep.getName());
            ticket.setManagerId(rep.getManagerId());
            LocalDateTime now = LocalDateTime.now();
            ticket.setFirstResponseAt(now);
            double hrs = ChronoUnit.MINUTES.between(ticket.getCreatedAt(), now) / 60.0;
            ticket.setResponseTimeHrs(Math.round(hrs * 10.0) / 10.0);
        }

        if (newStatus == Ticket.TicketStatus.CLOSED && ticket.getResolvedAt() == null) {
            LocalDateTime now = LocalDateTime.now();
            ticket.setResolvedAt(now);
            double hrs = ChronoUnit.MINUTES.between(ticket.getCreatedAt(), now) / 60.0;
            ticket.setResolutionTimeHrs(Math.round(hrs * 10.0) / 10.0);
        }

        ticket.setStatus(newStatus);
        Ticket saved = ticketRepo.save(ticket);

        notifService.create(ticket.getCustomerId(),
                "Your ticket #" + ticket.getId() + " status updated to " + newStatus.name().replace("_", " "),
                "STATUS");

        return saved;
    }

    public Ticket rateTicket(Long ticketId, Long customerId, int rating) {
        Ticket ticket = ticketRepo.findById(ticketId)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Ticket not found"));

        if (!ticket.getCustomerId().equals(customerId)) {
            throw new ResponseStatusException(HttpStatus.FORBIDDEN, "Cannot rate this ticket");
        }

        ticket.setRating(rating);
        return ticketRepo.save(ticket);
    }

    public List<Ticket> searchByCustomer(String query) {
        return ticketRepo.searchByCustomer(query);
    }
}
