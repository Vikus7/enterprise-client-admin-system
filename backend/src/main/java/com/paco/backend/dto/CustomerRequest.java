package com.paco.backend.dto;

import com.paco.backend.model.CustomerStatus;
import jakarta.validation.constraints.DecimalMin;
import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;
import java.math.BigDecimal;
import lombok.Data;

/**
 * Datos de entrada para crear o actualizar un cliente.
 * Incluye las validaciones basicas de los campos.
 */
@Data
public class CustomerRequest {

    @NotBlank(message = "El codigo JDE es obligatorio")
    @Size(max = 20, message = "El codigo JDE no debe superar 20 caracteres")
    private String jdeCode;

    @NotBlank(message = "El identificador tributario es obligatorio")
    @Size(max = 13, message = "El identificador tributario no debe superar 13 caracteres")
    private String taxId;

    @NotBlank(message = "La razon social es obligatoria")
    @Size(max = 150, message = "La razon social no debe superar 150 caracteres")
    private String businessName;

    @Size(max = 150, message = "El nombre comercial no debe superar 150 caracteres")
    private String commercialName;

    @Email(message = "El correo no tiene un formato valido")
    @Size(max = 120, message = "El correo no debe superar 120 caracteres")
    private String email;

    @Size(max = 30, message = "El telefono no debe superar 30 caracteres")
    private String phone;

    // Estado opcional; si no se envia, el servicio asume ACTIVE
    private CustomerStatus status;

    @DecimalMin(value = "0.0", message = "El limite de credito no puede ser negativo")
    private BigDecimal creditLimit;
}
