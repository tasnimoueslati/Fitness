package com.fitconnect.backend.controller;

import com.fitconnect.backend.entity.Notification;
import com.fitconnect.backend.service.NotificationService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/notifications")
@RequiredArgsConstructor
public class NotificationController {

    private final NotificationService notificationService;

    @GetMapping("/me")
    public ResponseEntity<List<Notification>> myNotifications() {
        return ResponseEntity.ok(notificationService.getUserNotifications(CurrentUserUtil.getCurrentUserId()));
    }

    @GetMapping("/me/non-lues")
    public ResponseEntity<List<Notification>> unread() {
        return ResponseEntity.ok(notificationService.getUnread(CurrentUserUtil.getCurrentUserId()));
    }

    @PatchMapping("/{id}/lue")
    public ResponseEntity<Notification> markRead(@PathVariable Long id) {
        return ResponseEntity.ok(notificationService.markAsRead(id));
    }
}
