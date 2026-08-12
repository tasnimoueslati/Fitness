package com.fitconnect.backend.controller;

import com.fitconnect.backend.entity.Message;
import com.fitconnect.backend.service.MessageService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/messages")
@RequiredArgsConstructor
public class MessageController {

    private final MessageService messageService;

    @PostMapping
    public ResponseEntity<Message> send(@RequestBody Map<String, Object> payload) {
        Long receiverId = Long.valueOf(payload.get("receiverId").toString());
        String contenu = payload.get("contenu").toString();
        return ResponseEntity.ok(messageService.sendMessage(CurrentUserUtil.getCurrentUserId(), receiverId, contenu));
    }

    @GetMapping("/conversation/{otherUserId}")
    public ResponseEntity<List<Message>> getConversation(@PathVariable Long otherUserId) {
        return ResponseEntity.ok(messageService.getConversation(CurrentUserUtil.getCurrentUserId(), otherUserId));
    }
}
