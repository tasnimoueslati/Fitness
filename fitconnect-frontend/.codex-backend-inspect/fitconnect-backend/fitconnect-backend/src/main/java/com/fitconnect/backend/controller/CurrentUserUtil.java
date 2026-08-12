package com.fitconnect.backend.controller;

import com.fitconnect.backend.entity.User;
import org.springframework.security.core.context.SecurityContextHolder;

/**
 * Utilitaire pour recuperer l'utilisateur actuellement authentifie
 * a partir du SecurityContext (rempli par le JwtAuthFilter).
 */
public final class CurrentUserUtil {

    private CurrentUserUtil() {}

    public static User getCurrentUser() {
        return (User) SecurityContextHolder.getContext().getAuthentication().getPrincipal();
    }

    public static Long getCurrentUserId() {
        return getCurrentUser().getId();
    }
}
