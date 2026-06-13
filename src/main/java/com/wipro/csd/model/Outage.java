package com.wipro.csd.model;

import jakarta.persistence.*;
import lombok.*;
import java.time.LocalDateTime;

@Data
@Entity
@Table(name = "outages")
@Builder
@NoArgsConstructor
@AllArgsConstructor
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
}
