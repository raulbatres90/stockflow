package com.stockflow.inventory_service.service;

import com.stockflow.inventory_service.entity.Product;
import com.stockflow.inventory_service.exception.ProductNotFoundException;
import com.stockflow.inventory_service.repository.ProductRepository;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageImpl;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;

import java.math.BigDecimal;
import java.util.List;
import java.util.Optional;

import static org.assertj.core.api.Assertions.assertThat;
import static org.assertj.core.api.Assertions.assertThatThrownBy;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.eq;
import static org.mockito.Mockito.never;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;

@ExtendWith(MockitoExtension.class)
class ProductServiceTest {

    @Mock
    private ProductRepository productRepository;

    @InjectMocks
    private ProductService productService;

    private Product buildProduct() {
        Product product = new Product();
        product.setId(1L);
        product.setSku("ELEC-001");
        product.setName("Mouse Inalámbrico");
        product.setCategory("Electrónica");
        product.setCurrentStock(50);
        product.setMinStock(10);
        product.setUnitPrice(new BigDecimal("15.99"));
        return product;
    }

    @Test
    void getProducts_sinCategoria_consultaFindAll() {
        Pageable pageable = PageRequest.of(0, 10);
        Page<Product> page = new PageImpl<>(List.of(buildProduct()));
        when(productRepository.findAll(pageable)).thenReturn(page);

        Page<Product> result = productService.getProducts(null, pageable);

        assertThat(result.getContent()).hasSize(1);
        verify(productRepository, never()).findByCategory(any(), any());
    }

    @Test
    void getProducts_conCategoria_consultaFindByCategory() {
        Pageable pageable = PageRequest.of(0, 10);
        Page<Product> page = new PageImpl<>(List.of(buildProduct()));
        when(productRepository.findByCategory(eq("Electrónica"), eq(pageable))).thenReturn(page);

        Page<Product> result = productService.getProducts("Electrónica", pageable);

        assertThat(result.getContent()).hasSize(1);
        verify(productRepository, never()).findAll(pageable);
    }

    @Test
    void getProductById_existente_retornaProducto() {
        when(productRepository.findById(1L)).thenReturn(Optional.of(buildProduct()));

        Product result = productService.getProductById(1L);

        assertThat(result.getSku()).isEqualTo("ELEC-001");
    }

    @Test
    void getProductById_inexistente_lanzaExcepcion() {
        when(productRepository.findById(99L)).thenReturn(Optional.empty());

        assertThatThrownBy(() -> productService.getProductById(99L))
                .isInstanceOf(ProductNotFoundException.class);
    }
}
