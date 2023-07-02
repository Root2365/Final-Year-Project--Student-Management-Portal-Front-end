package com.meinsms.backend.repository;

import com.meinsms.backend.models.Classes;
import com.meinsms.backend.models.Students;
import com.meinsms.backend.models.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface StudentsRepository extends JpaRepository<Students, Long> {
    Optional<List<Students>> findAllByClasses(Classes classes);

    Optional<List<Students>> findAllByParent(User user);

    Optional<List<Students>> findAllByClassesAndSickEquals(Classes classes, boolean sick);
}
