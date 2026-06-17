package com.paco.backend.model;

/**
 * Estados posibles de un cliente empresarial.
 * Se persiste como texto (VARCHAR) en la columna status.
 */
public enum CustomerStatus {
    ACTIVE,
    INACTIVE,
    BLOCKED
}
