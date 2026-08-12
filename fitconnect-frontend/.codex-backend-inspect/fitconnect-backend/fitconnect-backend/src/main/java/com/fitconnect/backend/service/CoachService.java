package com.fitconnect.backend.service;

import com.fitconnect.backend.entity.Availability;
import com.fitconnect.backend.entity.Coach;
import com.fitconnect.backend.exception.ResourceNotFoundException;
import com.fitconnect.backend.repository.AvailabilityRepository;
import com.fitconnect.backend.repository.CoachRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class CoachService {

    private final CoachRepository coachRepository;
    private final AvailabilityRepository availabilityRepository;

    public List<Coach> findAll() {
        return coachRepository.findAll();
    }

    public Coach findById(Long id) {
        return coachRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Coach introuvable avec id " + id));
    }

    public Coach findByUserId(Long userId) {
        return coachRepository.findByUserId(userId)
                .orElseThrow(() -> new ResourceNotFoundException("Profil coach introuvable pour cet utilisateur"));
    }

    public Coach updateProfile(Long coachId, Coach updates) {
        Coach coach = findById(coachId);
        if (updates.getSpecialites() != null) coach.setSpecialites(updates.getSpecialites());
        if (updates.getBio() != null) coach.setBio(updates.getBio());
        if (updates.getDiplomes() != null) coach.setDiplomes(updates.getDiplomes());
        if (updates.getTarifSeance() != null) coach.setTarifSeance(updates.getTarifSeance());
        return coachRepository.save(coach);
    }

    public Availability addAvailability(Long coachId, Availability availability) {
        Coach coach = findById(coachId);
        availability.setCoach(coach);
        availability.setId(null);
        return availabilityRepository.save(availability);
    }

    public void deleteAvailability(Long availabilityId) {
        availabilityRepository.deleteById(availabilityId);
    }

    public List<Availability> getAvailableSlots(Long coachId) {
        return availabilityRepository.findByCoachIdAndReserveFalse(coachId);
    }
}
