package com.stockflow.inventory_service;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.stockflow.inventory_service.dto.MovementRequest;
import com.stockflow.inventory_service.entity.MovementType;
import com.stockflow.inventory_service.entity.Product;
import com.stockflow.inventory_service.repository.ProductRepository;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.http.MediaType;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.transaction.annotation.Transactional;

import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

// Prueba el flujo obligatorio del documento: registrar salida -> actualizar stock -> disparar alerta.
// @Transactional revierte los cambios al final de cada test para no afectar a los demas (misma H2 compartida).
@SpringBootTest
@AutoConfigureMockMvc
@Transactional
class InventoryFlowIntegrationTest {

    @Autowired
    private MockMvc mockMvc;

    @Autowired
    private ObjectMapper objectMapper;

    @Autowired
    private ProductRepository productRepository;

    @Test
    void registrarSalida_actualizaStock_yDisparaAlerta() throws Exception {
        Product product = productRepository.findAll().stream()
                .filter(p -> p.getCurrentStock() > p.getMinStock())
                .findFirst()
                .orElseThrow();

        int cantidadASacar = product.getCurrentStock() - product.getMinStock() + 1;

        MovementRequest request = new MovementRequest();
        request.setProductId(product.getId());
        request.setType(MovementType.OUT);
        request.setQuantity(cantidadASacar);
        request.setReason("prueba de integracion");

        mockMvc.perform(post("/api/v1/movements")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(request)))
                .andExpect(status().isCreated());

        int stockEsperado = product.getMinStock() - 1;
        mockMvc.perform(get("/api/v1/products/" + product.getId()))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.currentStock").value(stockEsperado));

        mockMvc.perform(get("/api/v1/alerts"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$[?(@.productId == " + product.getId() + ")]").exists());

        mockMvc.perform(get("/api/v1/movements/" + product.getId() + "/history"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$[0].quantity").value(cantidadASacar));
    }

    @Test
    void registrarSalida_conStockInsuficiente_retorna422YNoAlteraElStock() throws Exception {
        Product product = productRepository.findAll().get(0);
        int stockOriginal = product.getCurrentStock();

        MovementRequest request = new MovementRequest();
        request.setProductId(product.getId());
        request.setType(MovementType.OUT);
        request.setQuantity(stockOriginal + 1000);

        mockMvc.perform(post("/api/v1/movements")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(request)))
                .andExpect(status().isUnprocessableEntity());

        mockMvc.perform(get("/api/v1/products/" + product.getId()))
                .andExpect(jsonPath("$.currentStock").value(stockOriginal));
    }

    @Test
    void registrarEntrada_sumaStockCorrectamente() throws Exception {
        Product product = productRepository.findAll().get(0);
        int stockOriginal = product.getCurrentStock();

        MovementRequest request = new MovementRequest();
        request.setProductId(product.getId());
        request.setType(MovementType.IN);
        request.setQuantity(10);

        mockMvc.perform(post("/api/v1/movements")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(request)))
                .andExpect(status().isCreated());

        mockMvc.perform(get("/api/v1/products/" + product.getId()))
                .andExpect(jsonPath("$.currentStock").value(stockOriginal + 10));
    }
}
