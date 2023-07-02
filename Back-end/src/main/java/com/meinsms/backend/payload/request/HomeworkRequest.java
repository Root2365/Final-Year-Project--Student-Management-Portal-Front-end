package com.meinsms.backend.payload.request;

import lombok.Data;

import java.time.LocalDate;

@Data
public class HomeworkRequest {
    private String name;
    private String details;
    private LocalDate deadline;
    private Long classId;

    public HomeworkRequest() {
    }

    public HomeworkRequest(String name, String details, LocalDate deadline, Long classId) {
        this.name = name;
        this.details = details;
        this.deadline = deadline;
        this.classId = classId;
    }

}
