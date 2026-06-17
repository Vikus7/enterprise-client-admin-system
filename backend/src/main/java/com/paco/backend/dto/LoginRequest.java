package com.paco.backend.dto;

import jakarta.validation.constraints.NotBlank;
import lombok.Data;

/**
 * Datos de entrada para el inicio de sesion.
 */
@Data
public class LoginRequest {

    @NotBlank(message = "El usuario es obligatorio")
    private String username;

    @NotBlank(message = "La contrasena es obligatoria")
    private String password;
}
