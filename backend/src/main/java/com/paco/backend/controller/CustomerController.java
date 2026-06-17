package com.paco.backend.controller;

import com.paco.backend.dto.CustomerRequest;
import com.paco.backend.dto.CustomerResponse;
import com.paco.backend.service.CustomerService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import java.util.List;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

/**
 * Controlador del CRUD de clientes empresariales. Todos los endpoints
 * requieren un token JWT valido (configurado en SecurityConfig).
 */
@RestController
@RequestMapping("/api/clients")
@Tag(name = "Clientes", description = "Gestion de clientes empresariales B4B/JDE")
public class CustomerController {

    private final CustomerService customerService;

    public CustomerController(CustomerService customerService) {
        this.customerService = customerService;
    }

    /**
     * Lista todos los clientes registrados.
     */
    @GetMapping
    @Operation(summary = "Listar clientes")
    public ResponseEntity<List<CustomerResponse>> getAll() {
        return ResponseEntity.ok(customerService.getAllCustomers());
    }

    /**
     * Obtiene un cliente por su id.
     */
    @GetMapping("/{id}")
    @Operation(summary = "Obtener cliente por id")
    public ResponseEntity<CustomerResponse> getById(@PathVariable Long id) {
        return ResponseEntity.ok(customerService.getCustomerById(id));
    }

    /**
     * Crea un nuevo cliente y devuelve 201 CREATED.
     */
    @PostMapping
    @Operation(summary = "Crear cliente")
    public ResponseEntity<CustomerResponse> create(
            @Valid @RequestBody CustomerRequest request) {
        CustomerResponse created = customerService.createCustomer(request);
        return ResponseEntity.status(HttpStatus.CREATED).body(created);
    }

    /**
     * Actualiza un cliente existente.
     */
    @PutMapping("/{id}")
    @Operation(summary = "Actualizar cliente")
    public ResponseEntity<CustomerResponse> update(
            @PathVariable Long id,
            @Valid @RequestBody CustomerRequest request) {
        return ResponseEntity.ok(customerService.updateCustomer(id, request));
    }

    /**
     * Desactiva un cliente (borrado logico): cambia su estado a INACTIVE
     * y devuelve el cliente actualizado.
     */
    @DeleteMapping("/{id}")
    @Operation(summary = "Desactivar cliente (soft delete)",
            description = "Cambia el estado del cliente a INACTIVE sin eliminarlo fisicamente.")
    public ResponseEntity<CustomerResponse> delete(@PathVariable Long id) {
        return ResponseEntity.ok(customerService.deleteCustomer(id));
    }
}
