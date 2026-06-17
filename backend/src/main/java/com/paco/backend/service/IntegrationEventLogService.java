package com.paco.backend.service;

import com.paco.backend.model.EventStatus;
import com.paco.backend.model.EventType;
import com.paco.backend.model.IntegrationEventLog;
import com.paco.backend.model.SourceSystem;
import com.paco.backend.repository.IntegrationEventLogRepository;
import org.springframework.stereotype.Service;

/**
 * Servicio de auditoria. Registra en integration_event_log cada operacion
 * relevante realizada sobre los clientes (CREATE, UPDATE, DELETE,
 * STATUS_CHANGE), para dar trazabilidad a las integraciones.
 */
@Service
public class IntegrationEventLogService {

    private final IntegrationEventLogRepository eventLogRepository;

    public IntegrationEventLogService(IntegrationEventLogRepository eventLogRepository) {
        this.eventLogRepository = eventLogRepository;
    }

    /**
     * Crea y persiste un registro de evento de auditoria.
     *
     * @param customerId   id del cliente afectado
     * @param sourceSystem sistema de origen simulado (B4B, JDE, MANUAL)
     * @param eventType    tipo de operacion
     * @param eventStatus  resultado de la operacion (SUCCESS o ERROR)
     * @param message      detalle breve del evento
     */
    public void logEvent(Long customerId, SourceSystem sourceSystem,
                         EventType eventType, EventStatus eventStatus, String message) {
        IntegrationEventLog event = IntegrationEventLog.builder()
                .customerId(customerId)
                .sourceSystem(sourceSystem)
                .eventType(eventType)
                .eventStatus(eventStatus)
                .message(message)
                .build();
        eventLogRepository.save(event);
    }
}
