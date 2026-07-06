package com.stockflow.inventory_service.service;

import com.stockflow.inventory_service.dto.MovementRequest;
import com.stockflow.inventory_service.entity.Movement;
import com.stockflow.inventory_service.entity.MovementType;
import com.stockflow.inventory_service.entity.Product;
import com.stockflow.inventory_service.exception.InsufficientStockException;
import com.stockflow.inventory_service.exception.ProductNotFoundException;
import com.stockflow.inventory_service.repository.MovementRepository;
import com.stockflow.inventory_service.repository.ProductRepository;
import io.github.resilience4j.retry.annotation.Retry;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.List;

@Service
public class MovementService {

    private final MovementRepository movementRepository;
    private final ProductRepository productRepository;

    public MovementService(MovementRepository movementRepository, ProductRepository productRepository) {
        this.movementRepository = movementRepository;
        this.productRepository = productRepository;
    }

    // Reintenta solo fallos transitorios (ej. una conexion a la BD caida). ProductNotFoundException
    // e InsufficientStockException estan excluidas en application.yaml porque reintentarlas solo
    // repite el mismo error.
    @Retry(name = "movementService")
    @Transactional
    public Movement registerMovement(MovementRequest request) {
        Product product = productRepository.findById(request.getProductId())
                .orElseThrow(() -> new ProductNotFoundException(
                        "Producto no encontrado con id " + request.getProductId()));

        if (request.getType() == MovementType.OUT && request.getQuantity() > product.getCurrentStock()) {
            throw new InsufficientStockException(
                    "Stock insuficiente para el producto " + product.getName());
        }

        if (request.getType() == MovementType.IN) {
            product.setCurrentStock(product.getCurrentStock() + request.getQuantity());
        } else {
            product.setCurrentStock(product.getCurrentStock() - request.getQuantity());
        }
        productRepository.save(product);

        Movement movement = new Movement();
        movement.setProductId(product.getId());
        movement.setType(request.getType());
        movement.setQuantity(request.getQuantity());
        movement.setReason(request.getReason());
        movement.setTimestamp(LocalDateTime.now());

        return movementRepository.save(movement);
    }

    public List<Movement> getHistory(Long productId) {
        return movementRepository.findByProductIdOrderByTimestampDesc(productId);
    }
}
