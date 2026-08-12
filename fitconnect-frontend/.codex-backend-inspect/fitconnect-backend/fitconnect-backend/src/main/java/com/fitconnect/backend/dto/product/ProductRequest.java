package com.fitconnect.backend.dto.product;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Positive;
import lombok.Data;

import java.math.BigDecimal;

@Data
public class ProductRequest {

    @NotBlank
    private String nom;

    private String description;

    @NotNull
    @Positive
    private BigDecimal prix;

    private BigDecimal promotionPourcentage;

    @NotNull
    private Integer stock;

    private String imageUrl;

    private Long categoryId;
}
