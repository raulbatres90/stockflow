package com.stockflow.inventory_service.dto;

import com.stockflow.inventory_service.entity.MovementType;
import io.swagger.v3.oas.annotations.media.Schema;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotNull;

@Schema(description = "Cuerpo de la solicitud para registrar un movimiento de inventario")
public class MovementRequest {

    @Schema(description = "Id del producto sobre el que aplica el movimiento", example = "1")
    @NotNull(message = "El id del producto es obligatorio")
    private Long productId;

    @Schema(description = "IN suma stock, OUT resta stock", example = "OUT")
    @NotNull(message = "El tipo de movimiento es obligatorio")
    private MovementType type;

    @Schema(description = "Cantidad movida, debe ser al menos 1", example = "5")
    @Min(value = 1, message = "La cantidad debe ser al menos 1")
    private int quantity;

    @Schema(description = "Motivo del movimiento (opcional)", example = "Venta a cliente")
    private String reason;

    public Long getProductId() {
        return productId;
    }

    public void setProductId(Long productId) {
        this.productId = productId;
    }

    public MovementType getType() {
        return type;
    }

    public void setType(MovementType type) {
        this.type = type;
    }

    public int getQuantity() {
        return quantity;
    }

    public void setQuantity(int quantity) {
        this.quantity = quantity;
    }

    public String getReason() {
        return reason;
    }

    public void setReason(String reason) {
        this.reason = reason;
    }
}
