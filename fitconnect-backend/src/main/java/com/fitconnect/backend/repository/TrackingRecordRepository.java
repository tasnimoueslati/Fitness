package com.fitconnect.backend.repository;

import com.fitconnect.backend.entity.TrackingRecord;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface TrackingRecordRepository extends JpaRepository<TrackingRecord, Long> {
    List<TrackingRecord> findByClientIdOrderByDateAsc(Long clientId);
}
