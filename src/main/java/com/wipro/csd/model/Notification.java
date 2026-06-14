package com.wipro.csd.model;

import jakarta.persistence.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "notifications")
public class Notification {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private Long userId;

    @Column(length = 1000)
    private String message;

    private String type;

    @Column(name = "is_read")
    private boolean read;

    private LocalDateTime createdAt;

    public Notification() {}

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public Long getUserId() { return userId; }
    public void setUserId(Long userId) { this.userId = userId; }

    public String getMessage() { return message; }
    public void setMessage(String message) { this.message = message; }

    public String getType() { return type; }
    public void setType(String type) { this.type = type; }

    public boolean isRead() { return read; }
    public void setRead(boolean read) { this.read = read; }

    public LocalDateTime getCreatedAt() { return createdAt; }
    public void setCreatedAt(LocalDateTime createdAt) { this.createdAt = createdAt; }

    public static Builder builder() { return new Builder(); }

    public static class Builder {
        private final Notification n = new Notification();
        public Builder id(Long v) { n.id = v; return this; }
        public Builder userId(Long v) { n.userId = v; return this; }
        public Builder message(String v) { n.message = v; return this; }
        public Builder type(String v) { n.type = v; return this; }
        public Builder read(boolean v) { n.read = v; return this; }
        public Builder createdAt(LocalDateTime v) { n.createdAt = v; return this; }
        public Notification build() { return n; }
    }
}
