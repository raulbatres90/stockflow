package com.stockflow.inventory_service.controller;

import com.stockflow.inventory_service.entity.Product;
import com.stockflow.inventory_service.service.ProductService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.Parameter;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.responses.ApiResponses;
import io.swagger.v3.oas.annotations.tags.Tag;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.web.PageableDefault;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/v1/products")
@Tag(name = "Productos", description = "Consultar catálogo de productos y niveles de stock")
public class ProductController {

    private final ProductService productService;

    public ProductController(ProductService productService) {
        this.productService = productService;
    }

    @GetMapping
    @Operation(summary = "Listar productos", description = "Retorna una lista paginada de productos, con filtro opcional por categoría")
    @ApiResponse(responseCode = "200", description = "Productos obtenidos correctamente")
    public Page<Product> getProducts(
            @Parameter(description = "Filtrar por nombre de categoría") @RequestParam(required = false) String category,
            @PageableDefault(size = 10) Pageable pageable) {
        return productService.getProducts(category, pageable);
    }

    @GetMapping("/{id}")
    @Operation(summary = "Detalle de un producto", description = "Retorna un producto por su id")
    @ApiResponses({
            @ApiResponse(responseCode = "200", description = "Producto encontrado"),
            @ApiResponse(responseCode = "404", description = "Producto no encontrado")
    })
    public Product getProductById(@Parameter(description = "Id del producto") @PathVariable Long id) {
        return productService.getProductById(id);
    }
}
