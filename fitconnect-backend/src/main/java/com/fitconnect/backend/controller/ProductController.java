package com.fitconnect.backend.controller;

import com.fitconnect.backend.dto.product.ProductRequest;
import com.fitconnect.backend.entity.Product;
import com.fitconnect.backend.service.ProductService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequiredArgsConstructor
public class ProductController {

    private final ProductService productService;

    @GetMapping("/api/public/products")
    public ResponseEntity<List<Product>> getAll(@RequestParam(required = false) String search,
                                                  @RequestParam(required = false) Long categoryId) {
        if (search != null) return ResponseEntity.ok(productService.search(search));
        if (categoryId != null) return ResponseEntity.ok(productService.findByCategory(categoryId));
        return ResponseEntity.ok(productService.findAll());
    }

    @GetMapping("/api/public/products/{id}")
    public ResponseEntity<Product> getOne(@PathVariable Long id) {
        return ResponseEntity.ok(productService.findById(id));
    }

    @GetMapping("/api/public/products/top-selling")
    public ResponseEntity<List<Product>> topSelling() {
        return ResponseEntity.ok(productService.topSelling());
    }

    @PostMapping("/api/admin/products")
    public ResponseEntity<Product> create(@Valid @RequestBody ProductRequest request) {
        return ResponseEntity.ok(productService.create(request));
    }

    @PutMapping("/api/admin/products/{id}")
    public ResponseEntity<Product> update(@PathVariable Long id, @Valid @RequestBody ProductRequest request) {
        return ResponseEntity.ok(productService.update(id, request));
    }

    @DeleteMapping("/api/admin/products/{id}")
    public ResponseEntity<Void> delete(@PathVariable Long id) {
        productService.delete(id);
        return ResponseEntity.noContent().build();
    }
}
