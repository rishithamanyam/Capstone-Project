package com.wipro.csd.repository;

import com.wipro.csd.model.Ticket;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import java.util.List;

public interface TicketRepository extends JpaRepository<Ticket, Long> {

    List<Ticket> findByCustomerIdOrderByCreatedAtDesc(Long customerId);

    List<Ticket> findByRepIdOrderByCreatedAtDesc(Long repId);

    List<Ticket> findByManagerIdOrderByCreatedAtDesc(Long managerId);

    long countByStatus(Ticket.TicketStatus status);

    long countByRepIdAndStatus(Long repId, Ticket.TicketStatus status);

    long countByCustomerId(Long customerId);

    long countByCustomerIdAndStatus(Long customerId, Ticket.TicketStatus status);

    @Query("SELECT AVG(t.rating) FROM Ticket t WHERE t.rating IS NOT NULL")
    Double averageRating();

    @Query("SELECT AVG(t.responseTimeHrs) FROM Ticket t WHERE t.repId = :repId AND t.responseTimeHrs IS NOT NULL")
    Double avgResponseTime(@Param("repId") Long repId);

    @Query("SELECT AVG(t.resolutionTimeHrs) FROM Ticket t WHERE t.repId = :repId AND t.resolutionTimeHrs IS NOT NULL")
    Double avgResolutionTime(@Param("repId") Long repId);

    @Query("SELECT t.domain, COUNT(t) FROM Ticket t GROUP BY t.domain ORDER BY COUNT(t) DESC")
    List<Object[]> countByDomain();

    @Query("SELECT t.customerLocation, COUNT(t) FROM Ticket t WHERE t.customerLocation IS NOT NULL GROUP BY t.customerLocation ORDER BY COUNT(t) DESC")
    List<Object[]> countByLocation();

    @Query("SELECT t FROM Ticket t WHERE " +
           "LOWER(t.customerName) LIKE LOWER(CONCAT('%', :q, '%')) OR " +
           "t.customerPhone LIKE CONCAT('%', :q, '%') OR " +
           "CAST(t.customerId AS string) = :q")
    List<Ticket> searchByCustomer(@Param("q") String query);
}
