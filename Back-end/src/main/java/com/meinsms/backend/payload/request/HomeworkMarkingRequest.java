package com.meinsms.backend.payload.request;

import lombok.Data;

@Data
public class HomeworkMarkingRequest {
    private Long homeworkId;
    private Long studentId;
    private Double marks;

    public HomeworkMarkingRequest(Long homeworkId, Long studentId, Double marks) {
        this.homeworkId = homeworkId;
        this.studentId = studentId;
        this.marks = marks;
    }

    public HomeworkMarkingRequest() {
    }
}
