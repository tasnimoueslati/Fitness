package com.fitconnect.backend.repository;

import com.fitconnect.backend.entity.Booking;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface BookingRepository extends JpaRepository<Booking, Long> {
    List<Booking> findByClientId(Long clientId);
    List<Booking> findByCoachId(Long coachId);
    List<Booking> findByNutritionistId(Long nutritionistId);
}
