package com.wipro.csd.repository;

import com.wipro.csd.model.Outage;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;

public interface OutageRepository extends JpaRepository<Outage, Long> {

    List<Outage> findByStatusOrderByCreatedAtDesc(String status);

    List<Outage> findAllByOrderByCreatedAtDesc();
}
