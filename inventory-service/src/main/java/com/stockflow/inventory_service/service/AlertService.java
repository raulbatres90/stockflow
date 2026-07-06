package com.stockflow.inventory_service.service;

import com.stockflow.inventory_service.dto.AlertSeverity;
import com.stockflow.inventory_service.dto.StockAlert;
import com.stockflow.inventory_service.entity.Product;
import com.stockflow.inventory_service.repository.ProductRepository;
import io.github.resilience4j.circuitbreaker.annotation.CircuitBreaker;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Service;

import java.util.Collections;
import java.util.List;

@Service
public class AlertService {

    private static final Logger log = LoggerFactory.getLogger(AlertService.class);

    private final ProductRepository productRepository;

    public AlertService(ProductRepository productRepository) {
        this.productRepository = productRepository;
    }

    @CircuitBreaker(name = "alertsService", fallbackMethod = "getAlertsFallback")
    public List<StockAlert> getAlerts() {
        return productRepository.findAll().stream()
                .filter(Product::isBelowMinStock)
                .map(this::toAlert)
                .toList();
    }

    // Invocado por Resilience4j cuando el circuito esta abierto, para que las alertas
    // queden indisponibles sin derribar el resto del dashboard.
    List<StockAlert> getAlertsFallback(Throwable throwable) {
        log.warn("Alerts circuit breaker is open, returning empty list. Reason: {}", throwable.getMessage());
        return Collections.emptyList();
    }

    // CRITICAL cuando el stock cayo a la mitad (o menos) del minimo, LOW en caso contrario
    private StockAlert toAlert(Product product) {
        AlertSeverity severity = product.getCurrentStock() * 2 <= product.getMinStock()
                ? AlertSeverity.CRITICAL
                : AlertSeverity.LOW;

        return new StockAlert(
                product.getId(),
                product.getName(),
                product.getCurrentStock(),
                product.getMinStock(),
                severity);
    }
}
