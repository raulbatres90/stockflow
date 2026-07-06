package com.stockflow.inventory_service.controller;

import com.stockflow.inventory_service.dto.MovementRequest;
import com.stockflow.inventory_service.entity.Movement;
import com.stockflow.inventory_service.service.MovementService;
import io.github.resilience4j.ratelimiter.annotation.RateLimiter;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.Parameter;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.responses.ApiResponses;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.ResponseStatus;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping("/api/v1")
@Tag(name = "Movimientos", description = "Registrar movimientos de inventario y consultar su historial")
public class MovementController {

    private final MovementService movementService;

    public MovementController(MovementService movementService) {
        this.movementService = movementService;
    }

    @PostMapping("/movements")
    @ResponseStatus(HttpStatus.CREATED)
    @Operation(summary = "Registrar un movimiento", description = "Registra un movimiento IN/OUT y actualiza el stock del producto automáticamente")
    @ApiResponses({
            @ApiResponse(responseCode = "201", description = "Movimiento registrado"),
            @ApiResponse(responseCode = "400", description = "Cuerpo de la solicitud inválido"),
            @ApiResponse(responseCode = "404", description = "Producto no encontrado"),
            @ApiResponse(responseCode = "422", description = "Stock insuficiente para un movimiento OUT")
    })
    public Movement registerMovement(@Valid @RequestBody MovementRequest request) {
        return movementService.registerMovement(request);
    }

    @GetMapping("/movements/{productId}/history")
    @RateLimiter(name = "historyService")
    @Operation(summary = "Historial de movimientos", description = "Retorna todos los movimientos de un producto, del más reciente al más antiguo")
    @ApiResponses({
            @ApiResponse(responseCode = "200", description = "Historial obtenido correctamente"),
            @ApiResponse(responseCode = "429", description = "Demasiadas solicitudes, límite de peticiones excedido")
    })
    public List<Movement> getHistory(@Parameter(description = "Id del producto") @PathVariable Long productId) {
        return movementService.getHistory(productId);
    }
}
