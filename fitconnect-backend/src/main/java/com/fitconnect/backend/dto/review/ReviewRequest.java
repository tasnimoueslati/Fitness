package com.fitconnect.backend.dto.review;

import com.fitconnect.backend.entity.ReviewTargetType;
import jakarta.validation.constraints.Max;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotNull;
import lombok.Data;

@Data
public class ReviewRequest {

    @NotNull
    private ReviewTargetType targetType;

    @NotNull
    private Long targetId;

    @Min(1)
    @Max(5)
    private Integer note;

    private String commentaire;
}
