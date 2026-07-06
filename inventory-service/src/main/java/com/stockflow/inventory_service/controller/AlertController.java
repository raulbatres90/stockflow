package com.stockflow.inventory_service.controller;

import com.stockflow.inventory_service.dto.StockAlert;
import com.stockflow.inventory_service.service.AlertService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.tags.Tag;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping("/api/v1/alerts")
@Tag(name = "Alertas", description = "Productos cuyo stock actual está en el mínimo o por debajo de él")
public class AlertController {

    private final AlertService alertService;

    public AlertController(AlertService alertService) {
        this.alertService = alertService;
    }

    @GetMapping
    @Operation(summary = "Listar alertas activas", description = "Retorna productos cuyo stock actual está en el mínimo o por debajo. Retorna lista vacía si el circuit breaker de alertas está abierto.")
    @ApiResponse(responseCode = "200", description = "Alertas obtenidas correctamente")
    public List<StockAlert> getAlerts() {
        return alertService.getAlerts();
    }
}
