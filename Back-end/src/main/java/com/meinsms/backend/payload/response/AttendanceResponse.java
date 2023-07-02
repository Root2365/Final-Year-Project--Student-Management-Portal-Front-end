package com.meinsms.backend.payload.response;

import lombok.Data;

import java.time.LocalDate;

@Data
public class AttendanceResponse {
    private Long id;
    private Long studentId;
    private String studentName;
    private String className;
    private LocalDate attendanceDate;
    private boolean present;
    private boolean absent;

    public AttendanceResponse(LocalDate attendanceDate, boolean present, boolean absent) {
    }

    public AttendanceResponse() {
    }
}
