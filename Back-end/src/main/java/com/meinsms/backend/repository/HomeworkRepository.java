package com.meinsms.backend.repository;

import com.meinsms.backend.models.Classes;
import com.meinsms.backend.models.Homework;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.time.LocalDate;
import java.util.List;
import java.util.Optional;

@Repository
public interface HomeworkRepository extends JpaRepository<Homework, Long> {
    List<Homework> findByClasses(Classes classes);

    Optional<Homework> findById(Long Id);

    List<Homework> findByClassesAndDeadlineBetween(Classes classes, LocalDate startDate, LocalDate endDate);
}
