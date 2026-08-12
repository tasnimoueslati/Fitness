package com.fitconnect.backend.entity;

import jakarta.persistence.*;
import lombok.*;

import java.math.BigDecimal;
import java.time.LocalDateTime;

@Entity
@Table(name = "products")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Product {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private String nom;

    @Column(length = 3000)
    private String description;

    @Column(nullable = false)
    private BigDecimal prix;

    @Builder.Default
    private BigDecimal promotionPourcentage = BigDecimal.ZERO;

    @Column(nullable = false)
    private Integer stock;

    private String imageUrl;

    @ManyToOne
    @JoinColumn(name = "category_id")
    private Category category;

    @Builder.Default
    private Double noteMoyenne = 0.0;

    @Builder.Default
    private Integer nombreAvis = 0;

    @Builder.Default
    private boolean actif = true;

    @Column(updatable = false)
    private LocalDateTime createdAt;

    @PrePersist
    void onCreate() {
        this.createdAt = LocalDateTime.now();
    }
}
