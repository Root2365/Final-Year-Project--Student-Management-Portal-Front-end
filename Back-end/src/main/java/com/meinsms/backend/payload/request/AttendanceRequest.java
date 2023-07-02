package com.meinsms.backend.payload.request;

import lombok.Data;

@Data
public class AttendanceRequest {
    private Long studentId;

    private Long classesId;

    private String attendanceDate;

    private boolean present;

    private boolean absent;
}
