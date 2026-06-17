package com.paco.backend.model;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.EnumType;
import jakarta.persistence.Enumerated;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.PrePersist;
import jakarta.persistence.PreUpdate;
import jakarta.persistence.Table;
import java.math.BigDecimal;
import java.time.LocalDateTime;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

/**
 * Entidad principal del CRUD: cliente empresarial asociado a un codigo
 * externo tipo JDE. Se mapea contra la tabla b4b_customer.
 */
@Entity
@Table(name = "b4b_customer")
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class B4bCustomer {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "jde_code", nullable = false, unique = true, length = 20)
    private String jdeCode;

    @Column(name = "tax_id", nullable = false, unique = true, length = 13)
    private String taxId;

    @Column(name = "business_name", nullable = false, length = 150)
    private String businessName;

    @Column(name = "commercial_name", length = 150)
    private String commercialName;

    @Column(length = 120)
    private String email;

    @Column(length = 30)
    private String phone;

    // Estado del cliente persistido como texto (ACTIVE, INACTIVE, BLOCKED)
    @Enumerated(EnumType.STRING)
    @Column(nullable = false, length = 20)
    private CustomerStatus status;

    @Column(name = "credit_limit", precision = 12, scale = 2)
    private BigDecimal creditLimit;

    @Column(name = "created_at", nullable = false, updatable = false)
    private LocalDateTime createdAt;

    @Column(name = "updated_at", nullable = false)
    private LocalDateTime updatedAt;

    
    // Inicializa fechas y estado por defecto antes de insertar.
     * 
    @PrePersist
    public void prePersist() {
        LocalDateTime now = LocalDateTime.now();
        if (createdAt == null) {
            createdAt = now;
        }
        updatedAt = now;
        if (status == null) {
            status = CustomerStatus.ACTIVE;
        }
    }

    // Actualiza la fecha de modificacion automaticamente en cada cambio.
    
    @PreUpdate
    public void preUpdate() {
        updatedAt = LocalDateTime.now();
    }
}
