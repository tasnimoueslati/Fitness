package com.fitconnect.backend.controller;

import com.fitconnect.backend.dto.booking.BookingRequest;
import com.fitconnect.backend.entity.Booking;
import com.fitconnect.backend.entity.BookingStatus;
import com.fitconnect.backend.service.BookingService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/bookings")
@RequiredArgsConstructor
public class BookingController {

    private final BookingService bookingService;

    @PostMapping
    public ResponseEntity<Booking> create(@Valid @RequestBody BookingRequest request) {
        Long clientId = CurrentUserUtil.getCurrentUserId();
        return ResponseEntity.ok(bookingService.createBooking(clientId, request));
    }

    @GetMapping("/me")
    public ResponseEntity<List<Booking>> myBookings() {
        return ResponseEntity.ok(bookingService.getClientBookings(CurrentUserUtil.getCurrentUserId()));
    }

    @GetMapping("/coach/{coachId}")
    public ResponseEntity<List<Booking>> coachBookings(@PathVariable Long coachId) {
        return ResponseEntity.ok(bookingService.getCoachBookings(coachId));
    }

    @GetMapping("/nutritionniste/{nutritionistId}")
    public ResponseEntity<List<Booking>> nutritionistBookings(@PathVariable Long nutritionistId) {
        return ResponseEntity.ok(bookingService.getNutritionistBookings(nutritionistId));
    }

    @PatchMapping("/{id}/statut")
    public ResponseEntity<Booking> updateStatus(@PathVariable Long id, @RequestParam BookingStatus statut) {
        return ResponseEntity.ok(bookingService.updateStatus(id, statut));
    }

    @PatchMapping("/{id}/notes")
    public ResponseEntity<Booking> updateNotes(@PathVariable Long id, @RequestBody Map<String, String> payload) {
        return ResponseEntity.ok(bookingService.updateNotes(id, payload.get("notes")));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> cancel(@PathVariable Long id) {
        bookingService.cancelBooking(id);
        return ResponseEntity.noContent().build();
    }
}
