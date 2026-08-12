package com.fitconnect.backend.controller;

import com.fitconnect.backend.dto.order.OrderRequest;
import com.fitconnect.backend.entity.Order;
import com.fitconnect.backend.entity.OrderStatus;
import com.fitconnect.backend.service.OrderService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/orders")
@RequiredArgsConstructor
public class OrderController {

    private final OrderService orderService;

    @PostMapping
    public ResponseEntity<Order> create(@Valid @RequestBody OrderRequest request) {
        return ResponseEntity.ok(orderService.createOrder(CurrentUserUtil.getCurrentUserId(), request));
    }

    @GetMapping("/me")
    public ResponseEntity<List<Order>> myOrders() {
        return ResponseEntity.ok(orderService.getClientOrders(CurrentUserUtil.getCurrentUserId()));
    }

    @GetMapping("/{id}")
    public ResponseEntity<Order> getOne(@PathVariable Long id) {
        return ResponseEntity.ok(orderService.findById(id));
    }

    @GetMapping("/admin/all")
    public ResponseEntity<List<Order>> getAll() {
        return ResponseEntity.ok(orderService.findAll());
    }

    @PatchMapping("/{id}/statut")
    public ResponseEntity<Order> updateStatus(@PathVariable Long id, @RequestParam OrderStatus statut) {
        return ResponseEntity.ok(orderService.updateStatus(id, statut));
    }
}
