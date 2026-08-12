package com.fitconnect.backend.service;

import com.fasterxml.jackson.databind.JsonNode;
import com.fitconnect.backend.dto.ai.NutritionPlanRequest;
import com.fitconnect.backend.dto.ai.TrainingProgramRequest;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.web.reactive.function.client.WebClient;

import java.util.List;
import java.util.Map;

/**
 * Service d'integration avec l'API Groq (compatible avec le format OpenAI Chat Completions).
 * Docs Groq : https://console.groq.com/docs/quickstart
 */
@Slf4j
@Service
public class GroqAiService {

    private final WebClient webClient;
    private final String model;

    public GroqAiService(
            @Value("${groq.api.url}") String apiUrl,
            @Value("${groq.api.key}") String apiKey,
            @Value("${groq.api.model}") String model) {

        this.model = model;
        this.webClient = WebClient.builder()
                .baseUrl(apiUrl)
                .defaultHeader("Authorization", "Bearer " + apiKey)
                .defaultHeader("Content-Type", "application/json")
                .build();
    }

    /**
     * Appel generique au chat completion de Groq.
     */
    public String chatCompletion(String systemPrompt, String userPrompt) {
        Map<String, Object> body = Map.of(
                "model", model,
                "temperature", 0.7,
                "messages", List.of(
                        Map.of("role", "system", "content", systemPrompt),
                        Map.of("role", "user", "content", userPrompt)
                )
        );

        try {
            JsonNode response = webClient.post()
                    .bodyValue(body)
                    .retrieve()
                    .bodyToMono(JsonNode.class)
                    .block();

            if (response == null || !response.has("choices")) {
                return "Desole, l'assistant IA n'a pas pu generer de reponse pour le moment.";
            }
            return response.get("choices").get(0).get("message").get("content").asText();

        } catch (Exception e) {
            log.error("Erreur lors de l'appel a l'API Groq", e);
            return "Une erreur est survenue lors de la generation de la reponse IA.";
        }
    }

    public String generateTrainingProgram(TrainingProgramRequest req) {
        String system = """
                Tu es un coach sportif expert. Tu generes des programmes d'entrainement
                personnalises, structures, clairs et realistes, adaptes au niveau et a
                l'objectif de l'utilisateur. Reponds en francais, sous forme de plan
                hebdomadaire avec des exercices, series, repetitions et temps de repos.
                """;

        String user = String.format("""
                Genere un programme d'entrainement personnalise pour :
                - Age : %s
                - Poids : %s kg
                - Taille : %s cm
                - Niveau : %s
                - Objectif : %s
                """,
                req.getAge(), req.getPoidsKg(), req.getTailleCm(), req.getNiveau(), req.getObjectif());

        return chatCompletion(system, user);
    }

    public String generateNutritionPlan(NutritionPlanRequest req) {
        String system = """
                Tu es un nutritionniste expert. Tu generes des plans alimentaires
                personnalises et equilibres (petit-dejeuner, dejeuner, diner, collations),
                en tenant compte des besoins caloriques, de l'objectif et des restrictions
                alimentaires de l'utilisateur. Reponds en francais, de maniere structuree,
                avec une estimation des calories et de la repartition des macronutriments.
                """;

        String user = String.format("""
                Genere un plan alimentaire personnalise pour :
                - Age : %s
                - Poids : %s kg
                - Taille : %s cm
                - Objectif : %s
                - Restrictions alimentaires : %s
                - Besoin calorique estime : %s
                """,
                req.getAge(), req.getPoidsKg(), req.getTailleCm(), req.getObjectif(),
                req.getRestrictionsAlimentaires(), req.getBesoinCaloriqueEstime());

        return chatCompletion(system, user);
    }

    public String chatAssistant(String userMessage) {
        String system = """
                Tu es l'assistant virtuel de FitConnect AI, une plateforme de gestion
                de salle de sport (coaching, nutrition, marketplace). Reponds de maniere
                courte, utile et bienveillante aux questions liees au sport, a la
                nutrition et a l'utilisation de la plateforme, en francais.
                """;
        return chatCompletion(system, userMessage);
    }

    public String analyzeProgress(String donneesSuivi) {
        String system = """
                Tu es un coach et nutritionniste expert. Analyse les donnees de suivi
                d'un utilisateur (poids, mensurations, performances, objectifs) et
                fournis des conseils concrets et personnalises pour ajuster son
                entrainement et/ou son alimentation. Reponds en francais, de maniere
                synthetique.
                """;
        return chatCompletion(system, "Voici les donnees de suivi de l'utilisateur :\n" + donneesSuivi);
    }
}
