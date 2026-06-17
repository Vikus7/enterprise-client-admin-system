package com.paco.backend.config;

import io.swagger.v3.oas.models.Components;
import io.swagger.v3.oas.models.OpenAPI;
import io.swagger.v3.oas.models.info.Info;
import io.swagger.v3.oas.models.security.SecurityRequirement;
import io.swagger.v3.oas.models.security.SecurityScheme;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

/**
 * Configuracion de OpenAPI/Swagger. Define la informacion general de la
 * API y registra el esquema de seguridad JWT Bearer para poder probar
 * los endpoints protegidos desde Swagger UI.
 */
@Configuration
public class OpenAPIConfig {

    private static final String SECURITY_SCHEME_NAME = "bearerAuth";

    @Bean
    public OpenAPI customOpenAPI() {
        return new OpenAPI()
                .info(new Info()
                        .title("PA-CO API de Clientes Empresariales")
                        .description("API REST para administrar clientes B4B/JDE. "
                                + "Use /api/auth/login para obtener un token JWT y "
                                + "autorizar el resto de endpoints.")
                        .version("1.0.0"))
                // Aplica el requerimiento de seguridad de forma global
                .addSecurityItem(new SecurityRequirement().addList(SECURITY_SCHEME_NAME))
                .components(new Components()
                        .addSecuritySchemes(SECURITY_SCHEME_NAME, new SecurityScheme()
                                .name(SECURITY_SCHEME_NAME)
                                .type(SecurityScheme.Type.HTTP)
                                .scheme("bearer")
                                .bearerFormat("JWT")));
    }
}
