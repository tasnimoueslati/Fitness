package com.fitconnect.backend.repository;

import com.fitconnect.backend.entity.Availability;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface AvailabilityRepository extends JpaRepository<Availability, Long> {
    List<Availability> findByCoachIdAndReserveFalse(Long coachId);
    List<Availability> findByNutritionistIdAndReserveFalse(Long nutritionistId);
}
