package com.fitconnect.backend.controller;

import com.fitconnect.backend.dto.tracking.TrackingRequest;
import com.fitconnect.backend.entity.TrackingRecord;
import com.fitconnect.backend.service.TrackingService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/tracking")
@RequiredArgsConstructor
public class TrackingController {

    private final TrackingService trackingService;

    @PostMapping
    public ResponseEntity<TrackingRecord> addRecord(@RequestBody TrackingRequest request) {
        return ResponseEntity.ok(trackingService.addRecord(CurrentUserUtil.getCurrentUserId(), request));
    }

    @GetMapping("/me")
    public ResponseEntity<List<TrackingRecord>> myHistory() {
        return ResponseEntity.ok(trackingService.getHistory(CurrentUserUtil.getCurrentUserId()));
    }

    @GetMapping("/client/{clientId}")
    public ResponseEntity<List<TrackingRecord>> clientHistory(@PathVariable Long clientId) {
        return ResponseEntity.ok(trackingService.getHistory(clientId));
    }
}
