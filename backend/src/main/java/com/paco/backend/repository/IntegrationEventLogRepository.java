package com.paco.backend.repository;

import com.paco.backend.model.IntegrationEventLog;
import java.util.List;
import org.springframework.data.jpa.repository.JpaRepository;

/**
 * Repositorio para el acceso a datos de la auditoria de eventos.
 */
public interface IntegrationEventLogRepository extends JpaRepository<IntegrationEventLog, Long> {

    // Recupera los eventos asociados a un cliente especifico 
    List<IntegrationEventLog> findByCustomerId(Long customerId);
}
