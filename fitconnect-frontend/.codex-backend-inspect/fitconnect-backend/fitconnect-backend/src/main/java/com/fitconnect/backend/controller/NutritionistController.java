package com.fitconnect.backend.controller;

import com.fitconnect.backend.entity.Availability;
import com.fitconnect.backend.entity.Nutritionist;
import com.fitconnect.backend.service.NutritionistService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api")
@RequiredArgsConstructor
public class NutritionistController {

    private final NutritionistService nutritionistService;

    @GetMapping("/public/nutritionnistes")
    public ResponseEntity<List<Nutritionist>> getAll() {
        return ResponseEntity.ok(nutritionistService.findAll());
    }

    @GetMapping("/public/nutritionnistes/{id}")
    public ResponseEntity<Nutritionist> getOne(@PathVariable Long id) {
        return ResponseEntity.ok(nutritionistService.findById(id));
    }

    @GetMapping("/public/nutritionnistes/{id}/disponibilites")
    public ResponseEntity<List<Availability>> getSlots(@PathVariable Long id) {
        return ResponseEntity.ok(nutritionistService.getAvailableSlots(id));
    }

    @GetMapping("/nutritionniste/me")
    public ResponseEntity<Nutritionist> getMyProfile() {
        return ResponseEntity.ok(nutritionistService.findByUserId(CurrentUserUtil.getCurrentUserId()));
    }

    @PutMapping("/nutritionniste/{id}")
    public ResponseEntity<Nutritionist> updateProfile(@PathVariable Long id, @RequestBody Nutritionist updates) {
        return ResponseEntity.ok(nutritionistService.updateProfile(id, updates));
    }

    @PostMapping("/nutritionniste/{id}/disponibilites")
    public ResponseEntity<Availability> addAvailability(@PathVariable Long id, @RequestBody Availability availability) {
        return ResponseEntity.ok(nutritionistService.addAvailability(id, availability));
    }

    @DeleteMapping("/nutritionniste/disponibilites/{availabilityId}")
    public ResponseEntity<Void> deleteAvailability(@PathVariable Long availabilityId) {
        nutritionistService.deleteAvailability(availabilityId);
        return ResponseEntity.noContent().build();
    }
}
