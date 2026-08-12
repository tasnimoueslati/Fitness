package com.fitconnect.backend.controller;

import com.fitconnect.backend.dto.ai.*;
import com.fitconnect.backend.service.GroqAiService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping("/api/ai")
@RequiredArgsConstructor
public class AiController {

    private final GroqAiService groqAiService;

    @PostMapping("/programme-sportif")
    public ResponseEntity<AiResponse> generateTrainingProgram(@RequestBody TrainingProgramRequest request) {
        String content = groqAiService.generateTrainingProgram(request);
        return ResponseEntity.ok(new AiResponse(content));
    }

    @PostMapping("/plan-alimentaire")
    public ResponseEntity<AiResponse> generateNutritionPlan(@RequestBody NutritionPlanRequest request) {
        String content = groqAiService.generateNutritionPlan(request);
        return ResponseEntity.ok(new AiResponse(content));
    }

    @PostMapping("/chat")
    public ResponseEntity<AiResponse> chat(@RequestBody ChatRequest request) {
        String content = groqAiService.chatAssistant(request.getMessage());
        return ResponseEntity.ok(new AiResponse(content));
    }

    @PostMapping("/analyse-progression")
    public ResponseEntity<AiResponse> analyzeProgress(@RequestBody Map<String, Object> donnees) {
        String content = groqAiService.analyzeProgress(donnees.toString());
        return ResponseEntity.ok(new AiResponse(content));
    }
}
