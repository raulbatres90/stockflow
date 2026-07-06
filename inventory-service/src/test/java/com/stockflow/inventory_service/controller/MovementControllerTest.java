package com.stockflow.inventory_service.controller;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.stockflow.inventory_service.dto.MovementRequest;
import com.stockflow.inventory_service.entity.Movement;
import com.stockflow.inventory_service.entity.MovementType;
import com.stockflow.inventory_service.exception.InsufficientStockException;
import com.stockflow.inventory_service.exception.ProductNotFoundException;
import com.stockflow.inventory_service.service.MovementService;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.WebMvcTest;
import org.springframework.http.MediaType;
import org.springframework.test.context.bean.override.mockito.MockitoBean;
import org.springframework.test.web.servlet.MockMvc;

import java.time.LocalDateTime;
import java.util.List;

import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.when;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

@WebMvcTest(MovementController.class)
class MovementControllerTest {

    @Autowired
    private MockMvc mockMvc;

    @Autowired
    private ObjectMapper objectMapper;

    @MockitoBean
    private MovementService movementService;

    private Movement buildMovement() {
        Movement movement = new Movement();
        movement.setId(1L);
        movement.setProductId(1L);
        movement.setType(MovementType.OUT);
        movement.setQuantity(4);
        movement.setReason("venta");
        movement.setTimestamp(LocalDateTime.now());
        return movement;
    }

    @Test
    void registerMovement_valido_retorna201() throws Exception {
        MovementRequest request = new MovementRequest();
        request.setProductId(1L);
        request.setType(MovementType.OUT);
        request.setQuantity(4);
        request.setReason("venta");
        when(movementService.registerMovement(any())).thenReturn(buildMovement());

        mockMvc.perform(post("/api/v1/movements")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(request)))
                .andExpect(status().isCreated())
                .andExpect(jsonPath("$.quantity").value(4));
    }

    @Test
    void registerMovement_sinProductId_retorna400() throws Exception {
        String invalidJson = "{\"type\":\"IN\",\"quantity\":5}";

        mockMvc.perform(post("/api/v1/movements")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(invalidJson))
                .andExpect(status().isBadRequest())
                .andExpect(jsonPath("$.error").value("Solicitud inválida"));
    }

    @Test
    void registerMovement_stockInsuficiente_retorna422() throws Exception {
        MovementRequest request = new MovementRequest();
        request.setProductId(1L);
        request.setType(MovementType.OUT);
        request.setQuantity(9999);
        when(movementService.registerMovement(any()))
                .thenThrow(new InsufficientStockException("Stock insuficiente para el producto Cable USB-C"));

        mockMvc.perform(post("/api/v1/movements")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(request)))
                .andExpect(status().isUnprocessableEntity());
    }

    @Test
    void registerMovement_productoInexistente_retorna404() throws Exception {
        MovementRequest request = new MovementRequest();
        request.setProductId(99L);
        request.setType(MovementType.IN);
        request.setQuantity(1);
        when(movementService.registerMovement(any()))
                .thenThrow(new ProductNotFoundException("Producto no encontrado con id 99"));

        mockMvc.perform(post("/api/v1/movements")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(request)))
                .andExpect(status().isNotFound());
    }

    @Test
    void getHistory_retorna200ConLista() throws Exception {
        when(movementService.getHistory(1L)).thenReturn(List.of(buildMovement()));

        mockMvc.perform(get("/api/v1/movements/1/history"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$[0].productId").value(1));
    }
}
