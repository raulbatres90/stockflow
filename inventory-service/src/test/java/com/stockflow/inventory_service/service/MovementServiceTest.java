package com.stockflow.inventory_service.service;

import com.stockflow.inventory_service.dto.MovementRequest;
import com.stockflow.inventory_service.entity.Movement;
import com.stockflow.inventory_service.entity.MovementType;
import com.stockflow.inventory_service.entity.Product;
import com.stockflow.inventory_service.exception.InsufficientStockException;
import com.stockflow.inventory_service.exception.ProductNotFoundException;
import com.stockflow.inventory_service.repository.MovementRepository;
import com.stockflow.inventory_service.repository.ProductRepository;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.ArgumentCaptor;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.math.BigDecimal;
import java.util.List;
import java.util.Optional;

import static org.assertj.core.api.Assertions.assertThat;
import static org.assertj.core.api.Assertions.assertThatThrownBy;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.never;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;

@ExtendWith(MockitoExtension.class)
class MovementServiceTest {

    @Mock
    private MovementRepository movementRepository;

    @Mock
    private ProductRepository productRepository;

    @InjectMocks
    private MovementService movementService;

    private Product buildProduct(int currentStock, int minStock) {
        Product product = new Product();
        product.setId(1L);
        product.setSku("ELEC-002");
        product.setName("Cable USB-C");
        product.setCategory("Electrónica");
        product.setCurrentStock(currentStock);
        product.setMinStock(minStock);
        product.setUnitPrice(new BigDecimal("6.50"));
        return product;
    }

    private MovementRequest buildRequest(MovementType type, int quantity) {
        MovementRequest request = new MovementRequest();
        request.setProductId(1L);
        request.setType(type);
        request.setQuantity(quantity);
        request.setReason("test");
        return request;
    }

    @Test
    void registerMovement_entrada_sumaStock() {
        Product product = buildProduct(10, 5);
        when(productRepository.findById(1L)).thenReturn(Optional.of(product));
        when(movementRepository.save(any(Movement.class))).thenAnswer(invocation -> invocation.getArgument(0));

        movementService.registerMovement(buildRequest(MovementType.IN, 5));

        assertThat(product.getCurrentStock()).isEqualTo(15);
        verify(productRepository).save(product);
    }

    @Test
    void registerMovement_salidaConStockSuficiente_restaStock() {
        Product product = buildProduct(10, 5);
        when(productRepository.findById(1L)).thenReturn(Optional.of(product));
        when(movementRepository.save(any(Movement.class))).thenAnswer(invocation -> invocation.getArgument(0));

        movementService.registerMovement(buildRequest(MovementType.OUT, 4));

        assertThat(product.getCurrentStock()).isEqualTo(6);
    }

    @Test
    void registerMovement_salidaSinStockSuficiente_lanzaExcepcionYNoGuardaNada() {
        Product product = buildProduct(3, 5);
        when(productRepository.findById(1L)).thenReturn(Optional.of(product));

        assertThatThrownBy(() -> movementService.registerMovement(buildRequest(MovementType.OUT, 10)))
                .isInstanceOf(InsufficientStockException.class);

        verify(productRepository, never()).save(any());
        verify(movementRepository, never()).save(any());
    }

    @Test
    void registerMovement_productoInexistente_lanzaExcepcion() {
        when(productRepository.findById(1L)).thenReturn(Optional.empty());

        assertThatThrownBy(() -> movementService.registerMovement(buildRequest(MovementType.IN, 5)))
                .isInstanceOf(ProductNotFoundException.class);
    }

    @Test
    void registerMovement_guardaMovimientoConLosDatosCorrectos() {
        Product product = buildProduct(10, 5);
        when(productRepository.findById(1L)).thenReturn(Optional.of(product));
        ArgumentCaptor<Movement> captor = ArgumentCaptor.forClass(Movement.class);
        when(movementRepository.save(captor.capture())).thenAnswer(invocation -> invocation.getArgument(0));

        movementService.registerMovement(buildRequest(MovementType.OUT, 4));

        Movement saved = captor.getValue();
        assertThat(saved.getProductId()).isEqualTo(1L);
        assertThat(saved.getType()).isEqualTo(MovementType.OUT);
        assertThat(saved.getQuantity()).isEqualTo(4);
        assertThat(saved.getTimestamp()).isNotNull();
    }

    @Test
    void getHistory_delegaEnRepositorio() {
        Movement movement = new Movement();
        movement.setProductId(1L);
        when(movementRepository.findByProductIdOrderByTimestampDesc(1L)).thenReturn(List.of(movement));

        List<Movement> history = movementService.getHistory(1L);

        assertThat(history).hasSize(1);
    }
}
