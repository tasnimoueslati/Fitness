package com.fitconnect.backend.service;

import com.fitconnect.backend.entity.Message;
import com.fitconnect.backend.entity.NotificationType;
import com.fitconnect.backend.entity.User;
import com.fitconnect.backend.exception.ResourceNotFoundException;
import com.fitconnect.backend.repository.MessageRepository;
import com.fitconnect.backend.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class MessageService {

    private final MessageRepository messageRepository;
    private final UserRepository userRepository;
    private final NotificationService notificationService;

    public Message sendMessage(Long senderId, Long receiverId, String contenu) {
        User sender = userRepository.findById(senderId)
                .orElseThrow(() -> new ResourceNotFoundException("Expediteur introuvable"));
        User receiver = userRepository.findById(receiverId)
                .orElseThrow(() -> new ResourceNotFoundException("Destinataire introuvable"));

        Message message = Message.builder()
                .sender(sender)
                .receiver(receiver)
                .contenu(contenu)
                .lu(false)
                .build();

        Message saved = messageRepository.save(message);

        notificationService.notifyUser(receiver, NotificationType.NOUVEAU_MESSAGE,
                sender.getFirstName() + " vous a envoye un nouveau message.");

        return saved;
    }

    public List<Message> getConversation(Long userId1, Long userId2) {
        return messageRepository.findBySenderIdAndReceiverIdOrReceiverIdAndSenderIdOrderByCreatedAtAsc(
                userId1, userId2, userId1, userId2);
    }
}
