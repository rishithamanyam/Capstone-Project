package com.wipro.csd.controller;

import com.wipro.csd.model.Outage;
import com.wipro.csd.service.OutageService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/outages")
public class OutageController {

    @Autowired private OutageService outageService;

    @GetMapping
    public ResponseEntity<List<Outage>> getAll() {
        return ResponseEntity.ok(outageService.getAll());
    }

    @GetMapping("/active")
    public ResponseEntity<List<Outage>> getActive() {
        return ResponseEntity.ok(outageService.getActive());
    }

    @PostMapping
    @PreAuthorize("hasAnyRole('ADMIN', 'MANAGER')")
    public ResponseEntity<Outage> create(@RequestBody Outage outage) {
        return ResponseEntity.ok(outageService.create(outage));
    }

    @PutMapping("/{id}")
    @PreAuthorize("hasAnyRole('ADMIN', 'MANAGER')")
    public ResponseEntity<Outage> update(@PathVariable Long id, @RequestBody Outage req) {
        return ResponseEntity.ok(outageService.update(id, req));
    }
}
