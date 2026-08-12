package com.fitconnect.backend.service;

import com.fitconnect.backend.entity.Availability;
import com.fitconnect.backend.entity.Nutritionist;
import com.fitconnect.backend.exception.ResourceNotFoundException;
import com.fitconnect.backend.repository.AvailabilityRepository;
import com.fitconnect.backend.repository.NutritionistRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class NutritionistService {

    private final NutritionistRepository nutritionistRepository;
    private final AvailabilityRepository availabilityRepository;

    public List<Nutritionist> findAll() {
        return nutritionistRepository.findAll();
    }

    public Nutritionist findById(Long id) {
        return nutritionistRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Nutritionniste introuvable avec id " + id));
    }

    public Nutritionist findByUserId(Long userId) {
        return nutritionistRepository.findByUserId(userId)
                .orElseThrow(() -> new ResourceNotFoundException("Profil nutritionniste introuvable pour cet utilisateur"));
    }

    public Nutritionist updateProfile(Long id, Nutritionist updates) {
        Nutritionist n = findById(id);
        if (updates.getSpecialites() != null) n.setSpecialites(updates.getSpecialites());
        if (updates.getBio() != null) n.setBio(updates.getBio());
        if (updates.getDiplomes() != null) n.setDiplomes(updates.getDiplomes());
        if (updates.getTarifConsultation() != null) n.setTarifConsultation(updates.getTarifConsultation());
        return nutritionistRepository.save(n);
    }

    public Availability addAvailability(Long nutritionistId, Availability availability) {
        Nutritionist n = findById(nutritionistId);
        availability.setNutritionist(n);
        availability.setId(null);
        return availabilityRepository.save(availability);
    }

    public void deleteAvailability(Long availabilityId) {
        availabilityRepository.deleteById(availabilityId);
    }

    public List<Availability> getAvailableSlots(Long nutritionistId) {
        return availabilityRepository.findByNutritionistIdAndReserveFalse(nutritionistId);
    }
}
