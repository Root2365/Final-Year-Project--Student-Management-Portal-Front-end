package com.meinsms.backend.repository;

import com.meinsms.backend.models.Category;
import com.meinsms.backend.models.Classes;
import com.meinsms.backend.models.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface CategoryRepository extends JpaRepository<Category, Long> {
    List<Category> findByTeacher(User teacher);
    List<Category> findByClasses(Classes classes);
}
