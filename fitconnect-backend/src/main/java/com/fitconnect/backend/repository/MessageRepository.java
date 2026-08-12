package com.fitconnect.backend.repository;

import com.fitconnect.backend.entity.Message;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface MessageRepository extends JpaRepository<Message, Long> {
    List<Message> findBySenderIdAndReceiverIdOrReceiverIdAndSenderIdOrderByCreatedAtAsc(
            Long senderId1, Long receiverId1, Long senderId2, Long receiverId2);
}
