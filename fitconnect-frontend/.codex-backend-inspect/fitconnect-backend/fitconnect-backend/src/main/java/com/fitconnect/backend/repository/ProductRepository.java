package com.fitconnect.backend.repository;

import com.fitconnect.backend.entity.Product;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import java.util.List;

public interface ProductRepository extends JpaRepository<Product, Long> {
    List<Product> findByCategoryId(Long categoryId);
    List<Product> findByNomContainingIgnoreCase(String nom);
    List<Product> findByActifTrue();

    @Query("SELECT p FROM Product p ORDER BY p.nombreAvis DESC")
    List<Product> findTopSelling();
}
