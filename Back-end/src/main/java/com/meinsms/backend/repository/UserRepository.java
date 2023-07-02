package com.meinsms.backend.repository;

import com.meinsms.backend.models.Classes;
import com.meinsms.backend.models.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface UserRepository extends JpaRepository<User, Long> {
    Optional<User> findByUsername(String username);

    Optional<User> findById(Long id);

    Boolean existsByUsername(String username);

    User findAllByClasses(Classes classes);

    Optional<User> findByEmail(String email);

    @Query("SELECT u FROM User u WHERE u.password_token = ?1")
    public User findByPassResetToken(String code);
}
