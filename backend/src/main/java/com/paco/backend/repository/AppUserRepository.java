package com.paco.backend.repository;

import com.paco.backend.model.AppUser;
import java.util.Optional;
import org.springframework.data.jpa.repository.JpaRepository;

/**
 * Repositorio para el acceso a datos de los usuarios de autenticacion.
 */
public interface AppUserRepository extends JpaRepository<AppUser, Long> {

    // Busca un usuario por su nombre de login (campo unico) 
    Optional<AppUser> findByUsername(String username);
}
