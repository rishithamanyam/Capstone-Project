package com.wipro.csd.model;

import jakarta.persistence.*;
import lombok.*;
import java.time.LocalDateTime;

@Data
@Entity
@Table(name = "tickets")
@Builder
@NoArgsConstructor
@AllArgsConstructor
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
}
