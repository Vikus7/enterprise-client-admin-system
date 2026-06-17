package com.paco.backend.service;

import com.paco.backend.dto.CustomerRequest;
import com.paco.backend.dto.CustomerResponse;
import com.paco.backend.exception.CustomerNotFoundException;
import com.paco.backend.exception.DuplicateResourceException;
import com.paco.backend.model.B4bCustomer;
import com.paco.backend.model.CustomerStatus;
import com.paco.backend.model.EventStatus;
import com.paco.backend.model.EventType;
import com.paco.backend.model.SourceSystem;
import com.paco.backend.repository.B4bCustomerRepository;
import java.util.List;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

/**
 * Servicio que concentra la logica de negocio del CRUD de clientes.
 * Valida la unicidad de jde_code y tax_id, registra la auditoria de cada
 * operacion y aplica borrado logico (soft delete) en la eliminacion.
 */
@Service
public class CustomerService {

    private final B4bCustomerRepository customerRepository;
    private final IntegrationEventLogService eventLogService;

    public CustomerService(B4bCustomerRepository customerRepository,
                           IntegrationEventLogService eventLogService) {
        this.customerRepository = customerRepository;
        this.eventLogService = eventLogService;
    }

    
    // Devuelve todos los clientes registrados.
     * 
    @Transactional(readOnly = true)
    public List<CustomerResponse> getAllCustomers() {
        return customerRepository.findAll().stream()
                .map(this::toResponse)
                .toList();
    }

    
    // Obtiene un cliente por su id o lanza una excepcion si no existe
    
    @Transactional(readOnly = true)
    public CustomerResponse getCustomerById(Long id) {
        B4bCustomer customer = findCustomerOrThrow(id);
        return toResponse(customer);
    }

    /**
     * Crea un nuevo cliente. Valida que jde_code y tax_id no esten
     * duplicados y registra el evento de auditoria CREATE.
     */
    @Transactional
    public CustomerResponse createCustomer(CustomerRequest request) {
        validateUniqueJdeCode(request.getJdeCode(), null);
        validateUniqueTaxId(request.getTaxId(), null);

        B4bCustomer customer = new B4bCustomer();
        applyRequest(customer, request);
        // Estado por defecto ACTIVE si no se especifica en la peticion
        customer.setStatus(request.getStatus() != null
                ? request.getStatus() : CustomerStatus.ACTIVE);

        B4bCustomer saved = customerRepository.save(customer);

        eventLogService.logEvent(saved.getId(), SourceSystem.MANUAL,
                EventType.CREATE, EventStatus.SUCCESS,
                "Cliente creado con codigo JDE " + saved.getJdeCode());

        return toResponse(saved);
    }

    /**
     * Actualiza un cliente existente. Valida unicidad excluyendo el propio
     * registro y registra el evento de auditoria UPDATE.
     */
    @Transactional
    public CustomerResponse updateCustomer(Long id, CustomerRequest request) {
        B4bCustomer customer = findCustomerOrThrow(id);

        validateUniqueJdeCode(request.getJdeCode(), id);
        validateUniqueTaxId(request.getTaxId(), id);

        applyRequest(customer, request);
        // El estado solo se cambia si la peticion lo indica explicitamente
        if (request.getStatus() != null) {
            customer.setStatus(request.getStatus());
        }

        B4bCustomer saved = customerRepository.save(customer);

        eventLogService.logEvent(saved.getId(), SourceSystem.MANUAL,
                EventType.UPDATE, EventStatus.SUCCESS,
                "Cliente actualizado con id " + saved.getId());

        return toResponse(saved);
    }

    /**
     * Realiza un borrado logico: cambia el estado del cliente a INACTIVE
     * en lugar de eliminarlo fisicamente, y registra un evento
     * STATUS_CHANGE. Devuelve el cliente con su nuevo estado.
     */
    @Transactional
    public CustomerResponse deleteCustomer(Long id) {
        B4bCustomer customer = findCustomerOrThrow(id);

        customer.setStatus(CustomerStatus.INACTIVE);
        B4bCustomer saved = customerRepository.save(customer);

        eventLogService.logEvent(saved.getId(), SourceSystem.MANUAL,
                EventType.STATUS_CHANGE, EventStatus.SUCCESS,
                "Cliente desactivado (status INACTIVE)");

        return toResponse(saved);
    }


    // METODOS AUXILIARES

    private B4bCustomer findCustomerOrThrow(Long id) {
        return customerRepository.findById(id)
                .orElseThrow(() -> new CustomerNotFoundException(
                        "No se encontro el cliente con id " + id));
    }

    // Valida que el jde_code no pertenezca a otro cliente distinto
    private void validateUniqueJdeCode(String jdeCode, Long currentId) {
        customerRepository.findByJdeCode(jdeCode)
                .filter(existing -> !existing.getId().equals(currentId))
                .ifPresent(existing -> {
                    throw new DuplicateResourceException(
                            "Ya existe un cliente con el codigo JDE " + jdeCode);
                });
    }

    // Valida que el tax_id no pertenezca a otro cliente distinto
    private void validateUniqueTaxId(String taxId, Long currentId) {
        customerRepository.findByTaxId(taxId)
                .filter(existing -> !existing.getId().equals(currentId))
                .ifPresent(existing -> {
                    throw new DuplicateResourceException(
                            "Ya existe un cliente con el identificador tributario " + taxId);
                });
    }

    // Copia los datos del DTO de entrada hacia la entidad
    private void applyRequest(B4bCustomer customer, CustomerRequest request) {
        customer.setJdeCode(request.getJdeCode());
        customer.setTaxId(request.getTaxId());
        customer.setBusinessName(request.getBusinessName());
        customer.setCommercialName(request.getCommercialName());
        customer.setEmail(request.getEmail());
        customer.setPhone(request.getPhone());
        customer.setCreditLimit(request.getCreditLimit());
    }

    // Convierte la entidad en el DTO de salida.
    private CustomerResponse toResponse(B4bCustomer customer) {
        CustomerResponse response = new CustomerResponse();
        response.setId(customer.getId());
        response.setJdeCode(customer.getJdeCode());
        response.setTaxId(customer.getTaxId());
        response.setBusinessName(customer.getBusinessName());
        response.setCommercialName(customer.getCommercialName());
        response.setEmail(customer.getEmail());
        response.setPhone(customer.getPhone());
        response.setStatus(customer.getStatus());
        response.setCreditLimit(customer.getCreditLimit());
        response.setCreatedAt(customer.getCreatedAt());
        response.setUpdatedAt(customer.getUpdatedAt());
        return response;
    }
}
