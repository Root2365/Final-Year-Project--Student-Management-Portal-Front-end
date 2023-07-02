package com.meinsms.backend.models;

public class StudentAttendance {
    private final Students student;
    private int totalClasses;
    private int presentClasses;
    private int absentClasses;
    private double attendancePercentage;

    public StudentAttendance(Students student) {
        this.student = student;
    }

    public void incrementTotalClasses() {
        totalClasses++;
    }

    public void incrementPresentClasses() {
        presentClasses++;
    }

    public void incrementAbsentClasses() {
        absentClasses++;
    }

    public void calculateAttendancePercentage() {
        if (totalClasses > 0) {
            attendancePercentage = (double) presentClasses / totalClasses * 100;
        } else {
            attendancePercentage = 0;
        }
    }

    public Students getStudent() {
        return student;
    }

    public int getTotalClasses() {
        return totalClasses;
    }

    public int getPresentClasses() {
        return presentClasses;
    }

    public int getAbsentClasses() {
        return absentClasses;
    }

    public double getAttendancePercentage() {
        return attendancePercentage;
    }
}
