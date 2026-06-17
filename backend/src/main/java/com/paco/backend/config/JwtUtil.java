package com.paco.backend.config;

import io.jsonwebtoken.Claims;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.security.Keys;
import java.util.Date;
import javax.crypto.SecretKey;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Component;

/**
 * Utilidad para la emision y validacion de tokens JWT.
 * Firma los tokens con el algoritmo HS256 usando una clave secreta.
 */
@Component
public class JwtUtil {

    private final SecretKey signingKey;
    private final long expirationMs;

    public JwtUtil(
            @Value("${app.jwt.secret}") String secret,
            @Value("${app.jwt.expiration}") long expirationMs) {
        // Deriva la clave de firma a partir del secreto configurado
        this.signingKey = Keys.hmacShaKeyFor(secret.getBytes());
        this.expirationMs = expirationMs;
    }

    /**
     * Genera un token JWT cuyo subject es el nombre de usuario.
     */
    public String generateToken(String username) {
        Date now = new Date();
        Date expiration = new Date(now.getTime() + expirationMs);
        return Jwts.builder()
                .subject(username)
                .issuedAt(now)
                .expiration(expiration)
                .signWith(signingKey)
                .compact();
    }

    /**
     * Extrae el nombre de usuario (subject) contenido en el token.
     */
    public String getUsernameFromToken(String token) {
        return parseClaims(token).getSubject();
    }

    /**
     * Valida la firma y la vigencia del token. Devuelve false si es
     * invalido, esta expirado o esta manipulado.
     */
    public boolean validateToken(String token) {
        try {
            parseClaims(token);
            return true;
        } catch (Exception ex) {
            return false;
        }
    }

    /**
     * Devuelve el tiempo de expiracion configurado en milisegundos.
     */
    public long getExpirationMs() {
        return expirationMs;
    }

    // Verifica la firma y devuelve los claims del token
    private Claims parseClaims(String token) {
        return Jwts.parser()
                .verifyWith(signingKey)
                .build()
                .parseSignedClaims(token)
                .getPayload();
    }
}
