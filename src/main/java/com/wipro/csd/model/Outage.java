package com.wipro.csd.model;

import jakarta.persistence.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "outages")
public class Outage {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private String location;

    private String affectedAreas;

    @Column(nullable = false)
    private String domain;

    @Column(length = 1000)
    private String description;

    private String severity;

    @Column(nullable = false)
    private String status;

    private LocalDateTime createdAt;
    private LocalDateTime resolvedAt;

    public Outage() {}

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public String getLocation() { return location; }
    public void setLocation(String location) { this.location = location; }

    public String getAffectedAreas() { return affectedAreas; }
    public void setAffectedAreas(String affectedAreas) { this.affectedAreas = affectedAreas; }

    public String getDomain() { return domain; }
    public void setDomain(String domain) { this.domain = domain; }

    public String getDescription() { return description; }
    public void setDescription(String description) { this.description = description; }

    public String getSeverity() { return severity; }
    public void setSeverity(String severity) { this.severity = severity; }

    public String getStatus() { return status; }
    public void setStatus(String status) { this.status = status; }

    public LocalDateTime getCreatedAt() { return createdAt; }
    public void setCreatedAt(LocalDateTime createdAt) { this.createdAt = createdAt; }

    public LocalDateTime getResolvedAt() { return resolvedAt; }
    public void setResolvedAt(LocalDateTime resolvedAt) { this.resolvedAt = resolvedAt; }

    public static Builder builder() { return new Builder(); }

    public static class Builder {
        private final Outage o = new Outage();
        public Builder id(Long v) { o.id = v; return this; }
        public Builder location(String v) { o.location = v; return this; }
        public Builder affectedAreas(String v) { o.affectedAreas = v; return this; }
        public Builder domain(String v) { o.domain = v; return this; }
        public Builder description(String v) { o.description = v; return this; }
        public Builder severity(String v) { o.severity = v; return this; }
        public Builder status(String v) { o.status = v; return this; }
        public Builder createdAt(LocalDateTime v) { o.createdAt = v; return this; }
        public Builder resolvedAt(LocalDateTime v) { o.resolvedAt = v; return this; }
        public Outage build() { return o; }
    }
}
