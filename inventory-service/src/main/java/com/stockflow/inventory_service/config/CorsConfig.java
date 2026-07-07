package com.stockflow.inventory_service.config;

import org.springframework.context.annotation.Configuration;
import org.springframework.web.servlet.config.annotation.CorsRegistry;
import org.springframework.web.servlet.config.annotation.WebMvcConfigurer;

// Permite que el frontend Angular consuma esta API tanto en desarrollo
// (ng serve en localhost:4200) como en producción (Vercel), ya que corren
// en origenes distintos al backend.
@Configuration
public class CorsConfig implements WebMvcConfigurer {

    @Override
    public void addCorsMappings(CorsRegistry registry) {
        registry.addMapping("/api/v1/**")
                .allowedOrigins("http://localhost:4200", "https://stockflow-liard.vercel.app")
                .allowedMethods("GET", "POST", "PUT", "DELETE", "OPTIONS")
                .allowedHeaders("*");
    }
}
