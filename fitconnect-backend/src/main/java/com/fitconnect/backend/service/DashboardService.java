package com.fitconnect.backend.service;

import com.fitconnect.backend.entity.Role;
import com.fitconnect.backend.repository.*;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

@Service
@RequiredArgsConstructor
public class DashboardService {

    private final UserRepository userRepository;
    private final CoachRepository coachRepository;
    private final OrderRepository orderRepository;
    private final BookingRepository bookingRepository;
    private final ProductRepository productRepository;
    private final OrderService orderService;

    public Map<String, Object> getStats() {
        Map<String, Object> stats = new HashMap<>();

        stats.put("nombreUtilisateurs", userRepository.count());
        stats.put("nombreClients", userRepository.findByRole(Role.CLIENT).size());
        stats.put("nombreCoachs", coachRepository.count());
        stats.put("nombreCommandes", orderRepository.count());
        stats.put("chiffreAffaires", orderService.totalRevenue());

        List<com.fitconnect.backend.entity.Product> topProduits = productRepository.findTopSelling();
        stats.put("produitsPlusVendus", topProduits.stream().limit(5).toList());

        long reservationsAujourdhui = bookingRepository.findAll().stream()
                .filter(b -> b.getDate() != null && b.getDate().isEqual(LocalDate.now()))
                .count();
        stats.put("reservationsDuJour", reservationsAujourdhui);

        return stats;
    }
}
