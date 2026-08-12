package com.fitconnect.backend.dto.auth;

import com.fitconnect.backend.entity.Role;
import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;
import lombok.Data;

@Data
public class RegisterRequest {

    @NotBlank(message = "Le prenom est obligatoire")
    private String firstName;

    @NotBlank(message = "Le nom est obligatoire")
    private String lastName;

    @NotBlank
    @Email(message = "Email invalide")
    private String email;

    @NotBlank
    @Size(min = 6, message = "Le mot de passe doit contenir au moins 6 caracteres")
    private String password;

    private String phone;

    @NotNull
    private Role role; // ADMIN, CLIENT, COACH, NUTRITIONNISTE
}
