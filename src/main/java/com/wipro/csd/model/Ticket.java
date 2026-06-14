package com.wipro.csd.model;

import jakarta.persistence.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "tickets")
public class Ticket {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private Long customerId;
    private String customerName;
    private String customerPhone;
    private String customerLocation;

    @Column(nullable = false)
    private String domain;

    @Column(nullable = false)
    private String subject;

    @Column(length = 2000)
    private String description;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private TicketStatus status;

    private Long repId;
    private String repName;
    private Long managerId;

    private LocalDateTime createdAt;
    private LocalDateTime firstResponseAt;
    private LocalDateTime resolvedAt;

    private Double responseTimeHrs;
    private Double resolutionTimeHrs;
    private Integer rating;

    public enum TicketStatus {
        OPEN, IN_PROGRESS, CLOSED
    }

    public Ticket() {}

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public Long getCustomerId() { return customerId; }
    public void setCustomerId(Long customerId) { this.customerId = customerId; }

    public String getCustomerName() { return customerName; }
    public void setCustomerName(String customerName) { this.customerName = customerName; }

    public String getCustomerPhone() { return customerPhone; }
    public void setCustomerPhone(String customerPhone) { this.customerPhone = customerPhone; }

    public String getCustomerLocation() { return customerLocation; }
    public void setCustomerLocation(String customerLocation) { this.customerLocation = customerLocation; }

    public String getDomain() { return domain; }
    public void setDomain(String domain) { this.domain = domain; }

    public String getSubject() { return subject; }
    public void setSubject(String subject) { this.subject = subject; }

    public String getDescription() { return description; }
    public void setDescription(String description) { this.description = description; }

    public TicketStatus getStatus() { return status; }
    public void setStatus(TicketStatus status) { this.status = status; }

    public Long getRepId() { return repId; }
    public void setRepId(Long repId) { this.repId = repId; }

    public String getRepName() { return repName; }
    public void setRepName(String repName) { this.repName = repName; }

    public Long getManagerId() { return managerId; }
    public void setManagerId(Long managerId) { this.managerId = managerId; }

    public LocalDateTime getCreatedAt() { return createdAt; }
    public void setCreatedAt(LocalDateTime createdAt) { this.createdAt = createdAt; }

    public LocalDateTime getFirstResponseAt() { return firstResponseAt; }
    public void setFirstResponseAt(LocalDateTime firstResponseAt) { this.firstResponseAt = firstResponseAt; }

    public LocalDateTime getResolvedAt() { return resolvedAt; }
    public void setResolvedAt(LocalDateTime resolvedAt) { this.resolvedAt = resolvedAt; }

    public Double getResponseTimeHrs() { return responseTimeHrs; }
    public void setResponseTimeHrs(Double responseTimeHrs) { this.responseTimeHrs = responseTimeHrs; }

    public Double getResolutionTimeHrs() { return resolutionTimeHrs; }
    public void setResolutionTimeHrs(Double resolutionTimeHrs) { this.resolutionTimeHrs = resolutionTimeHrs; }

    public Integer getRating() { return rating; }
    public void setRating(Integer rating) { this.rating = rating; }

    public static Builder builder() { return new Builder(); }

    public static class Builder {
        private final Ticket t = new Ticket();
        public Builder id(Long v) { t.id = v; return this; }
        public Builder customerId(Long v) { t.customerId = v; return this; }
        public Builder customerName(String v) { t.customerName = v; return this; }
        public Builder customerPhone(String v) { t.customerPhone = v; return this; }
        public Builder customerLocation(String v) { t.customerLocation = v; return this; }
        public Builder domain(String v) { t.domain = v; return this; }
        public Builder subject(String v) { t.subject = v; return this; }
        public Builder description(String v) { t.description = v; return this; }
        public Builder status(TicketStatus v) { t.status = v; return this; }
        public Builder repId(Long v) { t.repId = v; return this; }
        public Builder repName(String v) { t.repName = v; return this; }
        public Builder managerId(Long v) { t.managerId = v; return this; }
        public Builder createdAt(LocalDateTime v) { t.createdAt = v; return this; }
        public Builder firstResponseAt(LocalDateTime v) { t.firstResponseAt = v; return this; }
        public Builder resolvedAt(LocalDateTime v) { t.resolvedAt = v; return this; }
        public Builder responseTimeHrs(Double v) { t.responseTimeHrs = v; return this; }
        public Builder resolutionTimeHrs(Double v) { t.resolutionTimeHrs = v; return this; }
        public Builder rating(Integer v) { t.rating = v; return this; }
        public Ticket build() { return t; }
    }
}
