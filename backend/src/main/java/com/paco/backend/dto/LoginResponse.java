package com.paco.backend.dto;

import lombok.AllArgsConstructor;
import lombok.Data;

/**
 * Respuesta del login: token JWT y metadatos para el cliente.
 */
@Data
@AllArgsConstructor
public class LoginResponse {

    private String token;
    private String type;
    private Long expiresIn;
}
