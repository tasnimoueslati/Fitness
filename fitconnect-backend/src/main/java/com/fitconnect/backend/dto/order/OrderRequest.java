package com.fitconnect.backend.dto.order;

import jakarta.validation.constraints.NotEmpty;
import lombok.Data;

import java.util.List;

@Data
public class OrderRequest {

    @NotEmpty
    private List<OrderItemRequest> items;

    private String adresseLivraison;

    @Data
    public static class OrderItemRequest {
        private Long productId;
        private Integer quantite;
    }
}
