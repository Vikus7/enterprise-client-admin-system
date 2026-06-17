package com.paco.backend.dto;

import java.time.LocalDateTime;
import java.util.Map;
import lombok.AllArgsConstructor;
import lombok.Data;

/**
 * Estructura estandar de respuesta de error de la API.
 * El campo fieldErrors es opcional y se usa en errores de validacion.
 */
@Data
@AllArgsConstructor
public class ErrorResponse {

    private LocalDateTime timestamp;
    private int status;
    private String error;
    private String message;
    private String path;
    private Map<String, String> fieldErrors;
}
