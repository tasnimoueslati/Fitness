package com.fitconnect.backend.controller;

import com.fitconnect.backend.dto.review.ReviewRequest;
import com.fitconnect.backend.entity.Review;
import com.fitconnect.backend.entity.ReviewTargetType;
import com.fitconnect.backend.service.ReviewService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/reviews")
@RequiredArgsConstructor
public class ReviewController {

    private final ReviewService reviewService;

    @PostMapping
    public ResponseEntity<Review> add(@Valid @RequestBody ReviewRequest request) {
        return ResponseEntity.ok(reviewService.addReview(CurrentUserUtil.getCurrentUserId(), request));
    }

    @GetMapping
    public ResponseEntity<List<Review>> getFor(@RequestParam ReviewTargetType targetType,
                                                @RequestParam Long targetId) {
        return ResponseEntity.ok(reviewService.getReviewsFor(targetType, targetId));
    }
}
