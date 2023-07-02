package com.meinsms.backend.models;

public class AttendanceReport {
    private final Students student;
    private final double attendancePercentage;

    public AttendanceReport(StudentAttendance studentAttendance) {
        this.student = studentAttendance.getStudent();
        this.attendancePercentage = studentAttendance.getAttendancePercentage();
    }

    public Students getStudent() {
        return student;
    }

    public double getAttendancePercentage() {
        return attendancePercentage;
    }
}
