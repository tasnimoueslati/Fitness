package com.fitconnect.backend.controller;

import com.fitconnect.backend.entity.Availability;
import com.fitconnect.backend.entity.Coach;
import com.fitconnect.backend.service.CoachService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api")
@RequiredArgsConstructor
public class CoachController {

    private final CoachService coachService;

    // ---- Public : consultation des coachs ----
    @GetMapping("/public/coaches")
    public ResponseEntity<List<Coach>> getAllCoaches() {
        return ResponseEntity.ok(coachService.findAll());
    }

    @GetMapping("/public/coaches/{id}")
    public ResponseEntity<Coach> getCoach(@PathVariable Long id) {
        return ResponseEntity.ok(coachService.findById(id));
    }

    @GetMapping("/public/coaches/{id}/disponibilites")
    public ResponseEntity<List<Availability>> getSlots(@PathVariable Long id) {
        return ResponseEntity.ok(coachService.getAvailableSlots(id));
    }

    // ---- Espace coach (role COACH) ----
    @GetMapping("/coach/me")
    public ResponseEntity<Coach> getMyProfile() {
        return ResponseEntity.ok(coachService.findByUserId(CurrentUserUtil.getCurrentUserId()));
    }

    @PutMapping("/coach/{id}")
    public ResponseEntity<Coach> updateProfile(@PathVariable Long id, @RequestBody Coach updates) {
        return ResponseEntity.ok(coachService.updateProfile(id, updates));
    }

    @PostMapping("/coach/{id}/disponibilites")
    public ResponseEntity<Availability> addAvailability(@PathVariable Long id, @RequestBody Availability availability) {
        return ResponseEntity.ok(coachService.addAvailability(id, availability));
    }

    @DeleteMapping("/coach/disponibilites/{availabilityId}")
    public ResponseEntity<Void> deleteAvailability(@PathVariable Long availabilityId) {
        coachService.deleteAvailability(availabilityId);
        return ResponseEntity.noContent().build();
    }
}
