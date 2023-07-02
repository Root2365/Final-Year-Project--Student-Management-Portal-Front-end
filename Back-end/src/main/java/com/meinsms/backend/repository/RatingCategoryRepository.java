package com.meinsms.backend.repository;

import com.meinsms.backend.models.RatingCategory;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface RatingCategoryRepository extends JpaRepository<RatingCategory, Long> {

}
