package com.fitconnect.backend.repository;

import com.fitconnect.backend.entity.Nutritionist;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface NutritionistRepository extends JpaRepository<Nutritionist, Long> {
    Optional<Nutritionist> findByUserId(Long userId);
}
