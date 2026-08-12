package com.fitconnect.backend.service;

import com.fitconnect.backend.dto.product.ProductRequest;
import com.fitconnect.backend.entity.Category;
import com.fitconnect.backend.entity.Product;
import com.fitconnect.backend.exception.ResourceNotFoundException;
import com.fitconnect.backend.repository.CategoryRepository;
import com.fitconnect.backend.repository.ProductRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;
import java.util.List;

@Service
@RequiredArgsConstructor
public class ProductService {

    private final ProductRepository productRepository;
    private final CategoryRepository categoryRepository;

    public List<Product> findAll() {
        return productRepository.findByActifTrue();
    }

    public Product findById(Long id) {
        return productRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Produit introuvable avec id " + id));
    }

    public List<Product> search(String nom) {
        return productRepository.findByNomContainingIgnoreCase(nom);
    }

    public List<Product> findByCategory(Long categoryId) {
        return productRepository.findByCategoryId(categoryId);
    }

    public List<Product> topSelling() {
        return productRepository.findTopSelling();
    }

    public Product create(ProductRequest request) {
        Product product = Product.builder()
                .nom(request.getNom())
                .description(request.getDescription())
                .prix(request.getPrix())
                .promotionPourcentage(request.getPromotionPourcentage() != null
                        ? request.getPromotionPourcentage() : BigDecimal.ZERO)
                .stock(request.getStock())
                .imageUrl(request.getImageUrl())
                .actif(true)
                .build();

        if (request.getCategoryId() != null) {
            Category category = categoryRepository.findById(request.getCategoryId())
                    .orElseThrow(() -> new ResourceNotFoundException("Categorie introuvable"));
            product.setCategory(category);
        }
        return productRepository.save(product);
    }

    public Product update(Long id, ProductRequest request) {
        Product product = findById(id);
        product.setNom(request.getNom());
        product.setDescription(request.getDescription());
        product.setPrix(request.getPrix());
        if (request.getPromotionPourcentage() != null) product.setPromotionPourcentage(request.getPromotionPourcentage());
        product.setStock(request.getStock());
        product.setImageUrl(request.getImageUrl());

        if (request.getCategoryId() != null) {
            Category category = categoryRepository.findById(request.getCategoryId())
                    .orElseThrow(() -> new ResourceNotFoundException("Categorie introuvable"));
            product.setCategory(category);
        }
        return productRepository.save(product);
    }

    public void delete(Long id) {
        Product product = findById(id);
        product.setActif(false); // soft delete
        productRepository.save(product);
    }

    public void decreaseStock(Long productId, int quantity) {
        Product product = findById(productId);
        if (product.getStock() < quantity) {
            throw new com.fitconnect.backend.exception.BadRequestException(
                    "Stock insuffisant pour le produit " + product.getNom());
        }
        product.setStock(product.getStock() - quantity);
        productRepository.save(product);
    }
}
