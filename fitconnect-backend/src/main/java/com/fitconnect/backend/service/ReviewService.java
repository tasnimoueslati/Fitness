package com.fitconnect.backend.service;

import com.fitconnect.backend.dto.review.ReviewRequest;
import com.fitconnect.backend.entity.*;
import com.fitconnect.backend.exception.ResourceNotFoundException;
import com.fitconnect.backend.repository.*;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
@RequiredArgsConstructor
public class ReviewService {

    private final ReviewRepository reviewRepository;
    private final UserRepository userRepository;
    private final CoachRepository coachRepository;
    private final NutritionistRepository nutritionistRepository;
    private final ProductRepository productRepository;

    @Transactional
    public Review addReview(Long authorId, ReviewRequest request) {
        User author = userRepository.findById(authorId)
                .orElseThrow(() -> new ResourceNotFoundException("Utilisateur introuvable"));

        Review review = Review.builder()
                .author(author)
                .targetType(request.getTargetType())
                .targetId(request.getTargetId())
                .note(request.getNote())
                .commentaire(request.getCommentaire())
                .build();

        Review saved = reviewRepository.save(review);
        recomputeAverage(request.getTargetType(), request.getTargetId());
        return saved;
    }

    public List<Review> getReviewsFor(ReviewTargetType type, Long targetId) {
        return reviewRepository.findByTargetTypeAndTargetId(type, targetId);
    }

    private void recomputeAverage(ReviewTargetType type, Long targetId) {
        List<Review> reviews = reviewRepository.findByTargetTypeAndTargetId(type, targetId);
        double avg = reviews.stream().mapToInt(Review::getNote).average().orElse(0.0);
        int count = reviews.size();

        switch (type) {
            case COACH -> coachRepository.findById(targetId).ifPresent(c -> {
                c.setNoteMoyenne(Math.round(avg * 10.0) / 10.0);
                c.setNombreAvis(count);
                coachRepository.save(c);
            });
            case NUTRITIONNISTE -> nutritionistRepository.findById(targetId).ifPresent(n -> {
                n.setNoteMoyenne(Math.round(avg * 10.0) / 10.0);
                n.setNombreAvis(count);
                nutritionistRepository.save(n);
            });
            case PRODUIT -> productRepository.findById(targetId).ifPresent(p -> {
                p.setNoteMoyenne(Math.round(avg * 10.0) / 10.0);
                p.setNombreAvis(count);
                productRepository.save(p);
            });
        }
    }
}
