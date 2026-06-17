package com.paco.backend.controller;

import com.paco.backend.dto.LoginRequest;
import com.paco.backend.dto.LoginResponse;
import com.paco.backend.service.AuthService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.security.SecurityRequirements;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

/**
 * Controlador de autenticacion. Expone el unico endpoint publico de la API.
 */
@RestController
@RequestMapping("/api/auth")
@Tag(name = "Autenticacion", description = "Inicio de sesion y emision de tokens JWT")
public class AuthController {

    private final AuthService authService;

    public AuthController(AuthService authService) {
        this.authService = authService;
    }

    /**
     * Autentica al usuario y devuelve un token JWT.
     * Endpoint publico: se excluye del requerimiento de seguridad global.
     */
    @PostMapping("/login")
    @SecurityRequirements
    @Operation(summary = "Autenticar usuario",
            description = "Valida las credenciales y devuelve un token JWT Bearer.")
    public ResponseEntity<LoginResponse> login(@Valid @RequestBody LoginRequest request) {
        return ResponseEntity.ok(authService.authenticate(request));
    }
}
