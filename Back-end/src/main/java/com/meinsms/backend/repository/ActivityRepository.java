package com.meinsms.backend.repository;

import com.meinsms.backend.models.Activities;
import com.meinsms.backend.models.Appointments;
import com.meinsms.backend.models.Classes;
import com.meinsms.backend.models.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface ActivityRepository extends JpaRepository<Activities, Long> {
    List<Activities> findAllByClassesAndActivityDateGreaterThanEqualAndActivityDateLessThanEqual(Classes classes, Long startDate, Long endDate);
}
