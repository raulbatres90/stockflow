package com.stockflow.inventory_service.dto;

import io.swagger.v3.oas.annotations.media.Schema;

@Schema(description = "Un producto cuyo stock actual está en su mínimo o por debajo")
public class StockAlert {

    @Schema(description = "Id del producto afectado", example = "1")
    private Long productId;

    @Schema(description = "Nombre del producto afectado", example = "Cable USB-C")
    private String productName;

    @Schema(description = "Nivel de stock actual", example = "8")
    private int currentStock;

    @Schema(description = "Umbral mínimo de stock configurado para el producto", example = "20")
    private int minStock;

    @Schema(description = "LOW si está apenas bajo el mínimo, CRITICAL si el stock cayó a la mitad del mínimo o menos")
    private AlertSeverity severity;

    public StockAlert() {
    }

    public StockAlert(Long productId, String productName, int currentStock, int minStock, AlertSeverity severity) {
        this.productId = productId;
        this.productName = productName;
        this.currentStock = currentStock;
        this.minStock = minStock;
        this.severity = severity;
    }

    public Long getProductId() {
        return productId;
    }

    public void setProductId(Long productId) {
        this.productId = productId;
    }

    public String getProductName() {
        return productName;
    }

    public void setProductName(String productName) {
        this.productName = productName;
    }

    public int getCurrentStock() {
        return currentStock;
    }

    public void setCurrentStock(int currentStock) {
        this.currentStock = currentStock;
    }

    public int getMinStock() {
        return minStock;
    }

    public void setMinStock(int minStock) {
        this.minStock = minStock;
    }

    public AlertSeverity getSeverity() {
        return severity;
    }

    public void setSeverity(AlertSeverity severity) {
        this.severity = severity;
    }
}
