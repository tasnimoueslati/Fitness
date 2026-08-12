package com.fitconnect.backend.entity;

import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDate;

@Entity
@Table(name = "tracking_records")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class TrackingRecord {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne
    @JoinColumn(name = "client_id", nullable = false)
    private User client;

    @Column(nullable = false)
    private LocalDate date;

    private Double poidsKg;
    private Double tailleCm;
    private Double imc;
    private Double tourTailleCm;
    private Double tourHanchesCm;
    private Double pourcentageGraisse;

    @Column(length = 500)
    private String objectif;

    @Column(length = 1000)
    private String notes;

    @PrePersist
    @PreUpdate
    void computeImc() {
        if (poidsKg != null && tailleCm != null && tailleCm > 0) {
            double tailleM = tailleCm / 100.0;
            this.imc = Math.round((poidsKg / (tailleM * tailleM)) * 100.0) / 100.0;
        }
    }
}
