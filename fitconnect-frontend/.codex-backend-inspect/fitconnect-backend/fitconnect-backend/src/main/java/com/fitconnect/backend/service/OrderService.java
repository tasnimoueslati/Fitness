package com.fitconnect.backend.service;

import com.fitconnect.backend.dto.order.OrderRequest;
import com.fitconnect.backend.entity.*;
import com.fitconnect.backend.exception.ResourceNotFoundException;
import com.fitconnect.backend.repository.OrderRepository;
import com.fitconnect.backend.repository.ProductRepository;
import com.fitconnect.backend.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.util.ArrayList;
import java.util.List;

@Service
@RequiredArgsConstructor
public class OrderService {

    private final OrderRepository orderRepository;
    private final UserRepository userRepository;
    private final ProductRepository productRepository;
    private final ProductService productService;
    private final NotificationService notificationService;

    @Transactional
    public Order createOrder(Long clientId, OrderRequest request) {
        User client = userRepository.findById(clientId)
                .orElseThrow(() -> new ResourceNotFoundException("Client introuvable"));

        Order order = Order.builder()
                .client(client)
                .adresseLivraison(request.getAdresseLivraison())
                .statut(OrderStatus.EN_ATTENTE)
                .items(new ArrayList<>())
                .total(BigDecimal.ZERO)
                .build();

        BigDecimal total = BigDecimal.ZERO;
        List<OrderItem> items = new ArrayList<>();

        for (OrderRequest.OrderItemRequest itemReq : request.getItems()) {
            Product product = productRepository.findById(itemReq.getProductId())
                    .orElseThrow(() -> new ResourceNotFoundException("Produit introuvable : " + itemReq.getProductId()));

            productService.decreaseStock(product.getId(), itemReq.getQuantite());

            BigDecimal prixUnitaire = product.getPrix();
            if (product.getPromotionPourcentage() != null && product.getPromotionPourcentage().compareTo(BigDecimal.ZERO) > 0) {
                BigDecimal remise = prixUnitaire.multiply(product.getPromotionPourcentage())
                        .divide(BigDecimal.valueOf(100));
                prixUnitaire = prixUnitaire.subtract(remise);
            }

            OrderItem item = OrderItem.builder()
                    .order(order)
                    .product(product)
                    .quantite(itemReq.getQuantite())
                    .prixUnitaire(prixUnitaire)
                    .build();

            items.add(item);
            total = total.add(prixUnitaire.multiply(BigDecimal.valueOf(itemReq.getQuantite())));
        }

        order.setItems(items);
        order.setTotal(total);

        Order saved = orderRepository.save(order);

        notificationService.notifyUser(client, NotificationType.COMMANDE_CONFIRMEE,
                "Votre commande #" + saved.getId() + " a ete confirmee. Total : " + total + " TND.");

        return saved;
    }

    public List<Order> getClientOrders(Long clientId) {
        return orderRepository.findByClientId(clientId);
    }

    public List<Order> findAll() {
        return orderRepository.findAll();
    }

    public Order findById(Long id) {
        return orderRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Commande introuvable"));
    }

    public Order updateStatus(Long orderId, OrderStatus status) {
        Order order = findById(orderId);
        order.setStatut(status);
        return orderRepository.save(order);
    }

    public BigDecimal totalRevenue() {
        return orderRepository.findAll().stream()
                .filter(o -> o.getStatut() != OrderStatus.ANNULEE)
                .map(Order::getTotal)
                .reduce(BigDecimal.ZERO, BigDecimal::add);
    }
}
