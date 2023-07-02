package com.meinsms.backend.repository;

import com.meinsms.backend.models.Attendance;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.time.LocalDate;
import java.util.List;

@Repository
public interface AttendanceRepository extends JpaRepository<Attendance, Long> {
    List<Attendance> findByClassesIdAndAttendanceDateBetween(Long clazzId, LocalDate startDate, LocalDate endDate);
    List<Attendance> findByStudentIdAndClassesIdAndAttendanceDateBetween(Long studentId, Long clazzId, LocalDate startDate, LocalDate endDate);
}