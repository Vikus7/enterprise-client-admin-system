package com.paco.backend.config;

import com.paco.backend.repository.AppUserRepository;
import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import java.io.IOException;
import java.util.Collections;
import org.springframework.lang.NonNull;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Component;
import org.springframework.web.filter.OncePerRequestFilter;

/**
 * Filtro que se ejecuta una vez por peticion. Extrae el token JWT del
 * encabezado Authorization, lo valida y, si es correcto, establece la
 * autenticacion en el contexto de seguridad de Spring.
 */
@Component
public class JwtAuthenticationFilter extends OncePerRequestFilter {

    private static final String HEADER = "Authorization";
    private static final String PREFIX = "Bearer ";

    private final JwtUtil jwtUtil;
    private final AppUserRepository appUserRepository;

    public JwtAuthenticationFilter(JwtUtil jwtUtil, AppUserRepository appUserRepository) {
        this.jwtUtil = jwtUtil;
        this.appUserRepository = appUserRepository;
    }

    @Override
    protected void doFilterInternal(
            @NonNull HttpServletRequest request,
            @NonNull HttpServletResponse response,
            @NonNull FilterChain filterChain) throws ServletException, IOException {

        String token = extractToken(request);

        // Solo procesa si hay token y aun no existe autenticacion en el contexto
        if (token != null && SecurityContextHolder.getContext().getAuthentication() == null) {
            if (jwtUtil.validateToken(token)) {
                String username = jwtUtil.getUsernameFromToken(token);

                // Verifica que el usuario siga existiendo y este habilitado
                appUserRepository.findByUsername(username)
                        .filter(user -> Boolean.TRUE.equals(user.getEnabled()))
                        .ifPresent(user -> {
                            UsernamePasswordAuthenticationToken authentication =
                                    new UsernamePasswordAuthenticationToken(
                                            username, null, Collections.emptyList());
                            SecurityContextHolder.getContext().setAuthentication(authentication);
                        });
            }
        }

        filterChain.doFilter(request, response);
    }

    /**
     * Obtiene el token del encabezado Authorization quitando el prefijo Bearer.
     */
    private String extractToken(HttpServletRequest request) {
        String header = request.getHeader(HEADER);
        if (header != null && header.startsWith(PREFIX)) {
            return header.substring(PREFIX.length());
        }
        return null;
    }
}
