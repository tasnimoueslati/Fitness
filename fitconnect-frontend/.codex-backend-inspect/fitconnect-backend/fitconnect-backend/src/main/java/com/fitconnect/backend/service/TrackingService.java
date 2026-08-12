package com.fitconnect.backend.service;

import com.fitconnect.backend.dto.tracking.TrackingRequest;
import com.fitconnect.backend.entity.TrackingRecord;
import com.fitconnect.backend.entity.User;
import com.fitconnect.backend.exception.ResourceNotFoundException;
import com.fitconnect.backend.repository.TrackingRecordRepository;
import com.fitconnect.backend.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.util.List;

@Service
@RequiredArgsConstructor
public class TrackingService {

    private final TrackingRecordRepository trackingRecordRepository;
    private final UserRepository userRepository;

    public TrackingRecord addRecord(Long clientId, TrackingRequest request) {
        User client = userRepository.findById(clientId)
                .orElseThrow(() -> new ResourceNotFoundException("Client introuvable"));

        TrackingRecord record = TrackingRecord.builder()
                .client(client)
                .date(request.getDate() != null ? request.getDate() : LocalDate.now())
                .poidsKg(request.getPoidsKg())
                .tailleCm(request.getTailleCm())
                .tourTailleCm(request.getTourTailleCm())
                .tourHanchesCm(request.getTourHanchesCm())
                .pourcentageGraisse(request.getPourcentageGraisse())
                .objectif(request.getObjectif())
                .notes(request.getNotes())
                .build();

        return trackingRecordRepository.save(record);
    }

    public List<TrackingRecord> getHistory(Long clientId) {
        return trackingRecordRepository.findByClientIdOrderByDateAsc(clientId);
    }
}
