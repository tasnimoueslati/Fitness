package com.fitconnect.backend.dto.ai;

import lombok.Data;

@Data
public class TrainingProgramRequest {
    private Integer age;
    private Double poidsKg;
    private Double tailleCm;
    private String niveau;    // debutant, intermediaire, avance
    private String objectif;  // perte de poids, prise de masse, remise en forme...
}
