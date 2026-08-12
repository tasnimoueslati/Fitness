package com.fitconnect.backend.dto.tracking;

import lombok.Data;

import java.time.LocalDate;

@Data
public class TrackingRequest {
    private LocalDate date;
    private Double poidsKg;
    private Double tailleCm;
    private Double tourTailleCm;
    private Double tourHanchesCm;
    private Double pourcentageGraisse;
    private String objectif;
    private String notes;
}
