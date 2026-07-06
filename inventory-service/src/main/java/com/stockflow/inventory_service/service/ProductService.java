package com.stockflow.inventory_service.service;

import com.stockflow.inventory_service.entity.Product;
import com.stockflow.inventory_service.exception.ProductNotFoundException;
import com.stockflow.inventory_service.repository.ProductRepository;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;

@Service
public class ProductService {

    private final ProductRepository productRepository;

    public ProductService(ProductRepository productRepository) {
        this.productRepository = productRepository;
    }

    public Page<Product> getProducts(String category, Pageable pageable) {
        if (category != null && !category.isBlank()) {
            return productRepository.findByCategory(category, pageable);
        }
        return productRepository.findAll(pageable);
    }

    public Product getProductById(Long id) {
        return productRepository.findById(id)
                .orElseThrow(() -> new ProductNotFoundException("Producto no encontrado con id " + id));
    }
}
