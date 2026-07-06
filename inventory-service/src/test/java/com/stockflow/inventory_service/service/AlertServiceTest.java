package com.stockflow.inventory_service.service;

import com.stockflow.inventory_service.dto.AlertSeverity;
import com.stockflow.inventory_service.dto.StockAlert;
import com.stockflow.inventory_service.entity.Product;
import com.stockflow.inventory_service.repository.ProductRepository;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.math.BigDecimal;
import java.util.List;

import static org.assertj.core.api.Assertions.assertThat;
import static org.mockito.Mockito.when;

@ExtendWith(MockitoExtension.class)
class AlertServiceTest {

    @Mock
    private ProductRepository productRepository;

    @InjectMocks
    private AlertService alertService;

    private Product buildProduct(int currentStock, int minStock) {
        Product product = new Product();
        product.setId(1L);
        product.setName("Aceite de Oliva 1L");
        product.setCategory("Abarrotes");
        product.setCurrentStock(currentStock);
        product.setMinStock(minStock);
        product.setUnitPrice(new BigDecimal("9.20"));
        return product;
    }

    @Test
    void getAlerts_soloIncluyeProductosBajoElMinimo() {
        Product ok = buildProduct(50, 10);
        Product bajo = buildProduct(8, 10);
        when(productRepository.findAll()).thenReturn(List.of(ok, bajo));

        List<StockAlert> alerts = alertService.getAlerts();

        assertThat(alerts).hasSize(1);
        assertThat(alerts.get(0).getCurrentStock()).isEqualTo(8);
    }

    @Test
    void getAlerts_stockALaMitadOMenos_esCritico() {
        Product critico = buildProduct(2, 10);
        when(productRepository.findAll()).thenReturn(List.of(critico));

        List<StockAlert> alerts = alertService.getAlerts();

        assertThat(alerts.get(0).getSeverity()).isEqualTo(AlertSeverity.CRITICAL);
    }

    @Test
    void getAlerts_stockApenasBajoElMinimo_esLow() {
        Product bajo = buildProduct(9, 10);
        when(productRepository.findAll()).thenReturn(List.of(bajo));

        List<StockAlert> alerts = alertService.getAlerts();

        assertThat(alerts.get(0).getSeverity()).isEqualTo(AlertSeverity.LOW);
    }

    @Test
    void getAlertsFallback_retornaListaVacia() {
        List<StockAlert> result = alertService.getAlertsFallback(new RuntimeException("circuito abierto"));

        assertThat(result).isEmpty();
    }
}
