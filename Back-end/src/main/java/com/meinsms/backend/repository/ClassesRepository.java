package com.meinsms.backend.repository;

import com.meinsms.backend.models.Category;
import com.meinsms.backend.models.Classes;
import com.meinsms.backend.models.Students;
import com.meinsms.backend.models.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface ClassesRepository extends JpaRepository<Classes, Long> {
    List<Classes> findAllByTeacher(User teacher);

    Optional<Classes> findAllByClassCode(String classCode);

    List<Classes> findAllByCategories(Category category);

    Optional<List<Classes>> findAllByStudents(Students students);

    Classes findAllByClassCodeAndStudents(String classCode, Students students);
}
