package com.meinsms.backend.repository;

import com.meinsms.backend.models.Homework;
import com.meinsms.backend.models.StudentHomework;
import com.meinsms.backend.models.Students;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface StudentHomeworkRepository extends JpaRepository<StudentHomework, Long> {
    Optional<StudentHomework> findByStudentAndHomework(Students student, Homework homework);

    List<StudentHomework> findByStudent(Students students);
}

