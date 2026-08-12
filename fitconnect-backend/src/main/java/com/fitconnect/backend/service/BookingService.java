package com.fitconnect.backend.service;

import com.fitconnect.backend.dto.booking.BookingRequest;
import com.fitconnect.backend.entity.*;
import com.fitconnect.backend.exception.BadRequestException;
import com.fitconnect.backend.exception.ResourceNotFoundException;
import com.fitconnect.backend.repository.BookingRepository;
import com.fitconnect.backend.repository.CoachRepository;
import com.fitconnect.backend.repository.NutritionistRepository;
import com.fitconnect.backend.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
@RequiredArgsConstructor
public class BookingService {

    private final BookingRepository bookingRepository;
    private final UserRepository userRepository;
    private final CoachRepository coachRepository;
    private final NutritionistRepository nutritionistRepository;
    private final NotificationService notificationService;

    @Transactional
    public Booking createBooking(Long clientId, BookingRequest request) {
        if (request.getCoachId() == null && request.getNutritionistId() == null) {
            throw new BadRequestException("Vous devez preciser un coach ou un nutritionniste");
        }

        User client = userRepository.findById(clientId)
                .orElseThrow(() -> new ResourceNotFoundException("Client introuvable"));

        Booking.BookingBuilder builder = Booking.builder()
                .client(client)
                .date(request.getDate())
                .heureDebut(request.getHeureDebut())
                .heureFin(request.getHeureFin())
                .notes(request.getNotes())
                .statut(BookingStatus.EN_ATTENTE);

        if (request.getCoachId() != null) {
            Coach coach = coachRepository.findById(request.getCoachId())
                    .orElseThrow(() -> new ResourceNotFoundException("Coach introuvable"));
            builder.coach(coach);
        }
        if (request.getNutritionistId() != null) {
            Nutritionist n = nutritionistRepository.findById(request.getNutritionistId())
                    .orElseThrow(() -> new ResourceNotFoundException("Nutritionniste introuvable"));
            builder.nutritionist(n);
        }

        Booking booking = bookingRepository.save(builder.build());

        notificationService.notifyUser(client, NotificationType.RESERVATION_CONFIRMEE,
                "Votre reservation du " + request.getDate() + " a bien ete enregistree.");

        return booking;
    }

    public List<Booking> getClientBookings(Long clientId) {
        return bookingRepository.findByClientId(clientId);
    }

    public List<Booking> getCoachBookings(Long coachId) {
        return bookingRepository.findByCoachId(coachId);
    }

    public List<Booking> getNutritionistBookings(Long nutritionistId) {
        return bookingRepository.findByNutritionistId(nutritionistId);
    }

    @Transactional
    public Booking updateStatus(Long bookingId, BookingStatus status) {
        Booking booking = bookingRepository.findById(bookingId)
                .orElseThrow(() -> new ResourceNotFoundException("Reservation introuvable"));
        booking.setStatut(status);
        Booking saved = bookingRepository.save(booking);

        if (status == BookingStatus.ANNULEE) {
            notificationService.notifyUser(booking.getClient(), NotificationType.RESERVATION_ANNULEE,
                    "Votre reservation du " + booking.getDate() + " a ete annulee.");
        }
        return saved;
    }

    @Transactional
    public Booking updateNotes(Long bookingId, String notes) {
        Booking booking = bookingRepository.findById(bookingId)
                .orElseThrow(() -> new ResourceNotFoundException("Reservation introuvable"));
        booking.setNotes(notes);
        return bookingRepository.save(booking);
    }

    @Transactional
    public void cancelBooking(Long bookingId) {
        updateStatus(bookingId, BookingStatus.ANNULEE);
    }
}
