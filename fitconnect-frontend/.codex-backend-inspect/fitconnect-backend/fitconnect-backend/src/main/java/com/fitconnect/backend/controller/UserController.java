package com.fitconnect.backend.controller;

import com.fitconnect.backend.entity.User;
import com.fitconnect.backend.repository.UserRepository;
import com.fitconnect.backend.exception.ResourceNotFoundException;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/users")
@RequiredArgsConstructor
public class UserController {

    private final UserRepository userRepository;

    @GetMapping("/me")
    public ResponseEntity<User> me() {
        return ResponseEntity.ok(CurrentUserUtil.getCurrentUser());
    }

    @PutMapping("/me")
    public ResponseEntity<User> updateMe(@RequestBody User updates) {
        User current = CurrentUserUtil.getCurrentUser();
        if (updates.getFirstName() != null) current.setFirstName(updates.getFirstName());
        if (updates.getLastName() != null) current.setLastName(updates.getLastName());
        if (updates.getPhone() != null) current.setPhone(updates.getPhone());
        if (updates.getPhotoUrl() != null) current.setPhotoUrl(updates.getPhotoUrl());
        return ResponseEntity.ok(userRepository.save(current));
    }

    @GetMapping("/admin/all")
    public ResponseEntity<List<User>> getAll() {
        return ResponseEntity.ok(userRepository.findAll());
    }

    @GetMapping("/admin/{id}")
    public ResponseEntity<User> getOne(@PathVariable Long id) {
        return ResponseEntity.ok(userRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Utilisateur introuvable")));
    }

    @DeleteMapping("/admin/{id}")
    public ResponseEntity<Void> delete(@PathVariable Long id) {
        userRepository.deleteById(id);
        return ResponseEntity.noContent().build();
    }
}
