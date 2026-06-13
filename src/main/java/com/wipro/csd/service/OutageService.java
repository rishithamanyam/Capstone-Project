package com.wipro.csd.service;

import com.wipro.csd.model.Outage;
import com.wipro.csd.model.User;
import com.wipro.csd.repository.NotificationRepository;
import com.wipro.csd.repository.OutageRepository;
import com.wipro.csd.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.web.server.ResponseStatusException;

import java.time.LocalDateTime;
import java.util.List;

@Service
public class OutageService {

    @Autowired private OutageRepository outageRepo;
    @Autowired private UserRepository userRepo;
    @Autowired private NotificationService notifService;

    public List<Outage> getAll() {
        return outageRepo.findAllByOrderByCreatedAtDesc();
    }

    public List<Outage> getActive() {
        return outageRepo.findByStatusOrderByCreatedAtDesc("ACTIVE");
    }

    public Outage create(Outage outage) {
        outage.setCreatedAt(LocalDateTime.now());
        Outage saved = outageRepo.save(outage);

        List<User> managers = userRepo.findByRole(User.Role.MANAGER);
        for (User mgr : managers) {
            notifService.create(mgr.getId(),
                    "Outage reported in " + outage.getLocation() + " — " + outage.getDomain() + ". Severity: " + outage.getSeverity(),
                    "OUTAGE");
        }

        List<User> customers = userRepo.findByRole(User.Role.CUSTOMER);
        for (User cust : customers) {
            if (outage.getLocation().equalsIgnoreCase(cust.getLocation())) {
                notifService.create(cust.getId(),
                        "Service outage in your area (" + outage.getLocation() + ") affecting " + outage.getDomain() + ". Our team is working on it.",
                        "OUTAGE");
            }
        }

        return saved;
    }

    public Outage update(Long id, Outage req) {
        Outage outage = outageRepo.findById(id)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Outage not found"));

        if (req.getStatus() != null) {
            outage.setStatus(req.getStatus());
            if ("RESOLVED".equals(req.getStatus())) {
                outage.setResolvedAt(LocalDateTime.now());
            }
        }
        if (req.getDescription() != null) outage.setDescription(req.getDescription());
        if (req.getSeverity() != null) outage.setSeverity(req.getSeverity());

        return outageRepo.save(outage);
    }
}
