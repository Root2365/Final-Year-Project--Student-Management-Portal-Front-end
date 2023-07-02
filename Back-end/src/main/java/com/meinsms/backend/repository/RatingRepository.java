package com.meinsms.backend.repository;

import com.meinsms.backend.models.Classes;
import com.meinsms.backend.models.Rating;
import com.meinsms.backend.models.RatingCategory;
import com.meinsms.backend.models.Students;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface RatingRepository extends JpaRepository<Rating, Long> {
    List<Rating> findAllByStudentsAndClasses(Students students, Classes classes);

    Rating findAllByStudentsAndClassesAndRatingCategory(Students students, Classes classes, RatingCategory ratingCategory);
}
