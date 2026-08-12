package com.fitconnect.backend.dto.ai;

import lombok.Data;

@Data
public class NutritionPlanRequest {
    private Integer age;
    private Double poidsKg;
    private Double tailleCm;
    private String objectif;
    private String restrictionsAlimentaires; // vegetarien, sans lactose, allergies...
    private Double besoinCaloriqueEstime;
}
