package com.stockflow.inventory_service.controller;

import com.stockflow.inventory_service.dto.AlertSeverity;
import com.stockflow.inventory_service.dto.StockAlert;
import com.stockflow.inventory_service.service.AlertService;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.WebMvcTest;
import org.springframework.test.context.bean.override.mockito.MockitoBean;
import org.springframework.test.web.servlet.MockMvc;

import java.util.List;

import static org.mockito.Mockito.when;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

@WebMvcTest(AlertController.class)
class AlertControllerTest {

    @Autowired
    private MockMvc mockMvc;

    @MockitoBean
    private AlertService alertService;

    @Test
    void getAlerts_retorna200ConListaDeAlertas() throws Exception {
        StockAlert alert = new StockAlert(1L, "Aceite de Oliva 1L", 2, 10, AlertSeverity.CRITICAL);
        when(alertService.getAlerts()).thenReturn(List.of(alert));

        mockMvc.perform(get("/api/v1/alerts"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$[0].severity").value("CRITICAL"));
    }

    @Test
    void getAlerts_sinAlertas_retorna200ConListaVacia() throws Exception {
        when(alertService.getAlerts()).thenReturn(List.of());

        mockMvc.perform(get("/api/v1/alerts"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$").isArray())
                .andExpect(jsonPath("$").isEmpty());
    }
}
