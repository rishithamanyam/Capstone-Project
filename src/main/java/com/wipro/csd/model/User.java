package com.wipro.csd.model;

import jakarta.persistence.*;
import lombok.*;
import java.time.LocalDateTime;

@Data
@Entity
@Table(name = "users")
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class User {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private String name;

    @Column(unique = true, nullable = false)
    private String email;

    @Column(nullable = false)
    private String password;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private Role role;

    private String phone;
    private String location;
    private Long managerId;

    @Column(name = "first_login")
    private boolean firstLogin;

    private LocalDateTime createdAt;

    public enum Role {
        ADMIN, MANAGER, REPRESENTATIVE, CUSTOMER
    }
}
