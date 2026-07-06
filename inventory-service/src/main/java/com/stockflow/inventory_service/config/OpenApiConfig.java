package com.stockflow.inventory_service.config;

import io.swagger.v3.oas.models.OpenAPI;
import io.swagger.v3.oas.models.info.Contact;
import io.swagger.v3.oas.models.info.Info;
import io.swagger.v3.oas.models.info.License;
import io.swagger.v3.oas.models.servers.Server;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

import java.util.List;

@Configuration
public class OpenApiConfig {

    @Bean
    public OpenAPI inventoryServiceOpenApi() {
        return new OpenAPI()
                .info(new Info()
                        .title("API del Servicio de Inventario StockFlow")
                        .version("1.0.0")
                        .description("API REST para monitoreo de inventario en tiempo real, movimientos de stock y alertas.")
                        .contact(new Contact()
                                .name("StockFlow Inc.")
                                .email("support@stockflow.com"))
                        .license(new License()
                                .name("Apache 2.0")
                                .url("https://www.apache.org/licenses/LICENSE-2.0")))
                .servers(List.of(
                        new Server().url("http://localhost:8080").description("Servidor local")));
    }
}
