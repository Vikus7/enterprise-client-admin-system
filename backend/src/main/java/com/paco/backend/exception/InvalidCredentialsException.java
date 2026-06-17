package com.paco.backend.exception;

/**
 * Se lanza cuando las credenciales de login son invalidas o el usuario
 * no existe o esta deshabilitado. Se usa un mensaje generico por seguridad.
 */
public class InvalidCredentialsException extends RuntimeException {

    public InvalidCredentialsException(String message) {
        super(message);
    }
}
