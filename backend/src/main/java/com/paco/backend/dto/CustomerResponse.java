package com.paco.backend.dto;

import com.paco.backend.model.CustomerStatus;
import java.math.BigDecimal;
import java.time.LocalDateTime;
import lombok.Data;

/**
 * Datos de salida de un cliente que se devuelven al consumidor de la API.
 */
@Data
public class CustomerResponse {

    private Long id;
    private String jdeCode;
    private String taxId;
    private String businessName;
    private String commercialName;
    private String email;
    private String phone;
    private CustomerStatus status;
    private BigDecimal creditLimit;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
}
