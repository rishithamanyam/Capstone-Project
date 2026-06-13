package com.wipro.csd.repository;

import com.wipro.csd.model.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import java.util.List;
import java.util.Optional;

public interface UserRepository extends JpaRepository<User, Long> {

    Optional<User> findByEmail(String email);

    List<User> findByRole(User.Role role);

    List<User> findByManagerId(Long managerId);

    long countByRole(User.Role role);

    boolean existsByEmail(String email);

    @Query("SELECT u FROM User u WHERE u.role = 'CUSTOMER' AND " +
           "(LOWER(u.name) LIKE LOWER(CONCAT('%', :q, '%')) OR " +
           "u.phone LIKE CONCAT('%', :q, '%') OR " +
           "CAST(u.id AS string) = :q)")
    List<User> searchCustomers(@Param("q") String query);
}
