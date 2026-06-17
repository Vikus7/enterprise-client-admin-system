package com.paco.backend.exception;


// Se lanza cuando se intenta crear o actualizar un recurso con un valor unico ya existente (por ejemplo jde_code o tax_id duplicados).
public class DuplicateResourceException extends RuntimeException {

    public DuplicateResourceException(String message) {
        super(message);
    }
}
