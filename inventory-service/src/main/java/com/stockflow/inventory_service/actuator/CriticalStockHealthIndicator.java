package com.stockflow.inventory_service.actuator;

import com.stockflow.inventory_service.dto.AlertSeverity;
import com.stockflow.inventory_service.dto.StockAlert;
import com.stockflow.inventory_service.repository.ProductRepository;
import com.stockflow.inventory_service.service.AlertService;
import org.springframework.boot.actuate.health.Health;
import org.springframework.boot.actuate.health.HealthIndicator;
import org.springframework.stereotype.Component;

import java.util.List;

// Reporta DOWN cuando mas del 20% de los productos estan en estado de alerta CRITICAL.
@Component
public class CriticalStockHealthIndicator implements HealthIndicator {

    private static final double CRITICAL_THRESHOLD_PERCENTAGE = 20.0;

    private final ProductRepository productRepository;
    private final AlertService alertService;

    public CriticalStockHealthIndicator(ProductRepository productRepository, AlertService alertService) {
        this.productRepository = productRepository;
        this.alertService = alertService;
    }

    @Override
    public Health health() {
        long totalProducts = productRepository.count();
        if (totalProducts == 0) {
            return Health.up().withDetail("criticalPercentage", 0.0).build();
        }

        List<StockAlert> alerts = alertService.getAlerts();
        long criticalCount = alerts.stream()
                .filter(alert -> alert.getSeverity() == AlertSeverity.CRITICAL)
                .count();

        double criticalPercentage = (criticalCount * 100.0) / totalProducts;

        Health.Builder status = criticalPercentage > CRITICAL_THRESHOLD_PERCENTAGE
                ? Health.down()
                : Health.up();

        return status
                .withDetail("criticalPercentage", criticalPercentage)
                .withDetail("criticalCount", criticalCount)
                .withDetail("totalProducts", totalProducts)
                .build();
    }
}
