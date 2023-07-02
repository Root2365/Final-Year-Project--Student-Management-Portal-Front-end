package com.meinsms.backend.repository;

import com.meinsms.backend.models.Appointments;
import com.meinsms.backend.models.Classes;
import com.meinsms.backend.models.Students;
import com.meinsms.backend.models.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface AppointmentRepository extends JpaRepository<Appointments, Long> {
    List<Appointments> findAllByParentAndStartTimeGreaterThanEqualAndEndTimeLessThanEqual(User parent, Long startTime, Long endTime);

    List<Appointments> findAllByTeacherAndStartTimeGreaterThanEqualAndEndTimeLessThanEqual(User teacher, Long startTime, Long endTime);
}
