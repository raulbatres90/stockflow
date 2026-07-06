package com.stockflow.inventory_service.controller;

import com.stockflow.inventory_service.entity.Product;
import com.stockflow.inventory_service.exception.ProductNotFoundException;
import com.stockflow.inventory_service.service.ProductService;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.WebMvcTest;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageImpl;
import org.springframework.test.context.bean.override.mockito.MockitoBean;
import org.springframework.test.web.servlet.MockMvc;

import java.math.BigDecimal;
import java.util.List;

import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.eq;
import static org.mockito.Mockito.when;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

@WebMvcTest(ProductController.class)
class ProductControllerTest {

    @Autowired
    private MockMvc mockMvc;

    @MockitoBean
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
    void getProducts_retorna200ConListaPaginada() throws Exception {
        when(productService.getProducts(eq(null), any())).thenReturn(new PageImpl<>(List.of(buildProduct())));

        mockMvc.perform(get("/api/v1/products"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.content[0].sku").value("ELEC-001"));
    }

    @Test
    void getProductById_existente_retorna200() throws Exception {
        when(productService.getProductById(1L)).thenReturn(buildProduct());

        mockMvc.perform(get("/api/v1/products/1"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.name").value("Mouse Inalámbrico"));
    }

    @Test
    void getProductById_inexistente_retorna404ConErrorResponse() throws Exception {
        when(productService.getProductById(99L))
                .thenThrow(new ProductNotFoundException("Producto no encontrado con id 99"));

        mockMvc.perform(get("/api/v1/products/99"))
                .andExpect(status().isNotFound())
                .andExpect(jsonPath("$.status").value(404))
                .andExpect(jsonPath("$.error").value("Recurso no encontrado"))
                .andExpect(jsonPath("$.message").value("Producto no encontrado con id 99"));
    }
}
