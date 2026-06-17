package com.paco.backend.service;

import com.paco.backend.config.JwtUtil;
import com.paco.backend.dto.LoginRequest;
import com.paco.backend.dto.LoginResponse;
import com.paco.backend.exception.InvalidCredentialsException;
import com.paco.backend.model.AppUser;
import com.paco.backend.repository.AppUserRepository;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

/**
 * Servicio de autenticacion. Valida las credenciales del usuario y emite
 * el token JWT correspondiente.
 */
@Service
public class AuthService {

    private final AppUserRepository appUserRepository;
    private final PasswordEncoder passwordEncoder;
    private final JwtUtil jwtUtil;

    public AuthService(AppUserRepository appUserRepository,
                       PasswordEncoder passwordEncoder,
                       JwtUtil jwtUtil) {
        this.appUserRepository = appUserRepository;
        this.passwordEncoder = passwordEncoder;
        this.jwtUtil = jwtUtil;
    }

    /**
     * Autentica al usuario y devuelve un token JWT si las credenciales
     * son validas. Se usa un mensaje de error generico para no revelar
     * si el usuario existe o esta deshabilitado.
     */
    public LoginResponse authenticate(LoginRequest request) {
        AppUser user = appUserRepository.findByUsername(request.getUsername())
                .orElseThrow(() ->
                        new InvalidCredentialsException("Usuario o contrasena incorrectos"));

        // Verifica que el usuario este habilitado
        if (!Boolean.TRUE.equals(user.getEnabled())) {
            throw new InvalidCredentialsException("Usuario o contrasena incorrectos");
        }

        // Compara la contrasena enviada contra el hash BCrypt almacenado.
        if (!passwordEncoder.matches(request.getPassword(), user.getPasswordHash())) {
            throw new InvalidCredentialsException("Usuario o contrasena incorrectos");
        }

        String token = jwtUtil.generateToken(user.getUsername());
        return new LoginResponse(token, "Bearer", jwtUtil.getExpirationMs());
    }
}
