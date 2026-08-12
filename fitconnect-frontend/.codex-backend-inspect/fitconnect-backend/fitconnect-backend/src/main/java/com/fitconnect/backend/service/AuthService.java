package com.fitconnect.backend.service;

import com.fitconnect.backend.dto.auth.AuthResponse;
import com.fitconnect.backend.dto.auth.LoginRequest;
import com.fitconnect.backend.dto.auth.RegisterRequest;
import com.fitconnect.backend.entity.Coach;
import com.fitconnect.backend.entity.Nutritionist;
import com.fitconnect.backend.entity.User;
import com.fitconnect.backend.exception.BadRequestException;
import com.fitconnect.backend.repository.CoachRepository;
import com.fitconnect.backend.repository.NutritionistRepository;
import com.fitconnect.backend.repository.UserRepository;
import com.fitconnect.backend.security.JwtUtil;
import lombok.RequiredArgsConstructor;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@RequiredArgsConstructor
public class AuthService {

    private final UserRepository userRepository;
    private final CoachRepository coachRepository;
    private final NutritionistRepository nutritionistRepository;
    private final PasswordEncoder passwordEncoder;
    private final AuthenticationManager authenticationManager;
    private final JwtUtil jwtUtil;

    @Transactional
    public AuthResponse register(RegisterRequest request) {
        if (userRepository.existsByEmail(request.getEmail())) {
            throw new BadRequestException("Un compte existe deja avec cet email");
        }

        User user = User.builder()
                .firstName(request.getFirstName())
                .lastName(request.getLastName())
                .email(request.getEmail())
                .password(passwordEncoder.encode(request.getPassword()))
                .phone(request.getPhone())
                .role(request.getRole())
                .build();

        user = userRepository.save(user);

        // Creation automatique du profil metier associe
        switch (request.getRole()) {
            case COACH -> coachRepository.save(Coach.builder().user(user).build());
            case NUTRITIONNISTE -> nutritionistRepository.save(Nutritionist.builder().user(user).build());
            default -> { /* CLIENT / ADMIN : rien de plus a creer */ }
        }

        String token = jwtUtil.generateToken(user);
        return buildAuthResponse(user, token);
    }

    public AuthResponse login(LoginRequest request) {
        authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(request.getEmail(), request.getPassword()));

        User user = userRepository.findByEmail(request.getEmail())
                .orElseThrow(() -> new BadRequestException("Utilisateur introuvable"));

        String token = jwtUtil.generateToken(user);
        return buildAuthResponse(user, token);
    }

    private AuthResponse buildAuthResponse(User user, String token) {
        return AuthResponse.builder()
                .token(token)
                .userId(user.getId())
                .firstName(user.getFirstName())
                .lastName(user.getLastName())
                .email(user.getEmail())
                .role(user.getRole())
                .build();
    }
}
