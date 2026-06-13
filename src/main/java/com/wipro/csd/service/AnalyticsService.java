package com.wipro.csd.service;

import com.wipro.csd.model.Ticket;
import com.wipro.csd.model.User;
import com.wipro.csd.repository.TicketRepository;
import com.wipro.csd.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.*;

@Service
public class AnalyticsService {

    @Autowired private TicketRepository ticketRepo;
    @Autowired private UserRepository userRepo;

    public Map<String, Object> getAdminStats() {
        Map<String, Object> stats = new LinkedHashMap<>();

        stats.put("totalCustomers", userRepo.countByRole(User.Role.CUSTOMER));
        stats.put("totalManagers", userRepo.countByRole(User.Role.MANAGER));
        stats.put("totalReps", userRepo.countByRole(User.Role.REPRESENTATIVE));
        stats.put("totalTickets", ticketRepo.count());
        stats.put("openTickets", ticketRepo.countByStatus(Ticket.TicketStatus.OPEN));
        stats.put("inProgressTickets", ticketRepo.countByStatus(Ticket.TicketStatus.IN_PROGRESS));
        stats.put("closedTickets", ticketRepo.countByStatus(Ticket.TicketStatus.CLOSED));

        Double avgRating = ticketRepo.averageRating();
        stats.put("avgSatisfaction", avgRating != null ? Math.round(avgRating * 10.0) / 10.0 : 0.0);

        Map<String, Long> domainMap = new LinkedHashMap<>();
        for (Object[] row : ticketRepo.countByDomain()) {
            domainMap.put((String) row[0], (Long) row[1]);
        }
        stats.put("domainTickets", domainMap);

        Map<String, Long> locationMap = new LinkedHashMap<>();
        for (Object[] row : ticketRepo.countByLocation()) {
            locationMap.put((String) row[0], (Long) row[1]);
        }
        stats.put("locationTickets", locationMap);

        return stats;
    }

    public Map<String, Object> getManagerStats(User manager) {
        Map<String, Object> stats = new LinkedHashMap<>();

        List<User> reps = userRepo.findByManagerId(manager.getId());
        stats.put("teamSize", reps.size());

        List<Ticket> teamTickets = ticketRepo.findByManagerIdOrderByCreatedAtDesc(manager.getId());
        long open = teamTickets.stream().filter(t -> t.getStatus() == Ticket.TicketStatus.OPEN).count();
        long inProg = teamTickets.stream().filter(t -> t.getStatus() == Ticket.TicketStatus.IN_PROGRESS).count();
        long closed = teamTickets.stream().filter(t -> t.getStatus() == Ticket.TicketStatus.CLOSED).count();

        stats.put("totalTickets", teamTickets.size());
        stats.put("openTickets", open);
        stats.put("inProgressTickets", inProg);
        stats.put("closedTickets", closed);

        List<Map<String, Object>> repMetrics = new ArrayList<>();
        for (User rep : reps) {
            Map<String, Object> m = new LinkedHashMap<>();
            m.put("id", rep.getId());
            m.put("name", rep.getName());
            m.put("email", rep.getEmail());
            m.put("openTickets", ticketRepo.countByRepIdAndStatus(rep.getId(), Ticket.TicketStatus.OPEN));
            m.put("inProgressTickets", ticketRepo.countByRepIdAndStatus(rep.getId(), Ticket.TicketStatus.IN_PROGRESS));
            m.put("closedTickets", ticketRepo.countByRepIdAndStatus(rep.getId(), Ticket.TicketStatus.CLOSED));

            Double avgResp = ticketRepo.avgResponseTime(rep.getId());
            Double avgResol = ticketRepo.avgResolutionTime(rep.getId());
            m.put("avgResponseTime", avgResp != null ? Math.round(avgResp * 10.0) / 10.0 : null);
            m.put("avgResolutionTime", avgResol != null ? Math.round(avgResol * 10.0) / 10.0 : null);
            repMetrics.add(m);
        }
        stats.put("repMetrics", repMetrics);

        return stats;
    }

    public Map<String, Object> getRepStats(User rep) {
        Map<String, Object> stats = new LinkedHashMap<>();

        stats.put("openTickets", ticketRepo.countByRepIdAndStatus(rep.getId(), Ticket.TicketStatus.OPEN));
        stats.put("inProgressTickets", ticketRepo.countByRepIdAndStatus(rep.getId(), Ticket.TicketStatus.IN_PROGRESS));
        stats.put("closedTickets", ticketRepo.countByRepIdAndStatus(rep.getId(), Ticket.TicketStatus.CLOSED));

        Double avgResp = ticketRepo.avgResponseTime(rep.getId());
        Double avgResol = ticketRepo.avgResolutionTime(rep.getId());
        stats.put("avgResponseTime", avgResp != null ? Math.round(avgResp * 10.0) / 10.0 : null);
        stats.put("avgResolutionTime", avgResol != null ? Math.round(avgResol * 10.0) / 10.0 : null);

        return stats;
    }

    public Map<String, Object> getCustomerStats(User customer) {
        Map<String, Object> stats = new LinkedHashMap<>();
        stats.put("openTickets", ticketRepo.countByCustomerIdAndStatus(customer.getId(), Ticket.TicketStatus.OPEN));
        stats.put("inProgressTickets", ticketRepo.countByCustomerIdAndStatus(customer.getId(), Ticket.TicketStatus.IN_PROGRESS));
        stats.put("closedTickets", ticketRepo.countByCustomerIdAndStatus(customer.getId(), Ticket.TicketStatus.CLOSED));
        stats.put("totalTickets", ticketRepo.countByCustomerId(customer.getId()));
        return stats;
    }
}
