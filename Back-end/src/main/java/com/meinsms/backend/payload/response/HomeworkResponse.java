package com.meinsms.backend.payload.response;

import com.meinsms.backend.models.Homework;
import com.meinsms.backend.models.StudentHomework;
import io.micrometer.core.lang.Nullable;
import lombok.Data;

import java.time.LocalDate;
import java.util.List;

@Data
public class HomeworkResponse {

    private Long id;

    private String name;

    private String details;

    private LocalDate deadline;

    private Long classId;

    private String className;

    private String classCode;

    @Nullable
    private List<StudentHomework> studentHomeworkList;

    @Nullable
    private Homework homework;

    public HomeworkResponse(Homework homework) {
        this.id = homework.getId();
        this.name = homework.getName();
        this.details = homework.getDetails();
        this.deadline = homework.getDeadline();
        this.classId = homework.getClasses().getId();
        this.className = homework.getClasses().getClassName();
        this.classCode = homework.getClasses().getClassCode();
    }

    public HomeworkResponse() {
    }
}
