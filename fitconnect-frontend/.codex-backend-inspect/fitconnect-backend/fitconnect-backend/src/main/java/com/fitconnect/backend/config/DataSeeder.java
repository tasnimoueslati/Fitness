package com.fitconnect.backend.config;

import com.fitconnect.backend.entity.Category;
import com.fitconnect.backend.repository.CategoryRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.boot.CommandLineRunner;
import org.springframework.stereotype.Component;

import java.util.List;

/**
 * Insere quelques categories de depart si la table est vide,
 * pour que le formulaire admin ne soit pas vide au premier lancement.
 */
@Component
@RequiredArgsConstructor
public class DataSeeder implements CommandLineRunner {

    private final CategoryRepository categoryRepository;

    @Override
    public void run(String... args) {
        if (categoryRepository.count() == 0) {
            List<String> defaultCategories = List.of(
                    "Compléments alimentaires",
                    "Équipements de musculation",
                    "Accessoires de fitness",
                    "Vêtements de sport",
                    "Nutrition sportive",
                    "Matériel de cardio"
            );
            defaultCategories.forEach(nom ->
                    categoryRepository.save(Category.builder().nom(nom).build())
            );
        }
    }
}
