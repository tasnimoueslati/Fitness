package com.fitconnect.backend.repository;

import com.fitconnect.backend.entity.Review;
import com.fitconnect.backend.entity.ReviewTargetType;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface ReviewRepository extends JpaRepository<Review, Long> {
    List<Review> findByTargetTypeAndTargetId(ReviewTargetType targetType, Long targetId);
}
