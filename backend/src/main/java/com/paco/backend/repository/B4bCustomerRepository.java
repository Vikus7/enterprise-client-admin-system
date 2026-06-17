package com.paco.backend.repository;

import com.paco.backend.model.B4bCustomer;
import java.util.Optional;
import org.springframework.data.jpa.repository.JpaRepository;

/**
 * Repositorio para el acceso a datos de los clientes empresariales.
 */
public interface B4bCustomerRepository extends JpaRepository<B4bCustomer, Long> {

    // Permiten validar la unicidad de jde_code y tax_id antes de guardar
    Optional<B4bCustomer> findByJdeCode(String jdeCode);

    Optional<B4bCustomer> findByTaxId(String taxId);
}
