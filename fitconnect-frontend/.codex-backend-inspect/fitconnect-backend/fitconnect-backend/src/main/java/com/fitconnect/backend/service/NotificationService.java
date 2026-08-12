package com.fitconnect.backend.service;

import com.fitconnect.backend.entity.Notification;
import com.fitconnect.backend.entity.NotificationType;
import com.fitconnect.backend.entity.User;
import com.fitconnect.backend.exception.ResourceNotFoundException;
import com.fitconnect.backend.repository.NotificationRepository;
import com.fitconnect.backend.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class NotificationService {

    private final NotificationRepository notificationRepository;
    private final UserRepository userRepository;

    public Notification notifyUser(User user, NotificationType type, String message) {
        Notification notification = Notification.builder()
                .user(user)
                .type(type)
                .message(message)
                .lu(false)
                .build();
        return notificationRepository.save(notification);
    }

    public List<Notification> getUserNotifications(Long userId) {
        return notificationRepository.findByUserIdOrderByCreatedAtDesc(userId);
    }

    public List<Notification> getUnread(Long userId) {
        return notificationRepository.findByUserIdAndLuFalse(userId);
    }

    public Notification markAsRead(Long notificationId) {
        Notification n = notificationRepository.findById(notificationId)
                .orElseThrow(() -> new ResourceNotFoundException("Notification introuvable"));
        n.setLu(true);
        return notificationRepository.save(n);
    }
}
