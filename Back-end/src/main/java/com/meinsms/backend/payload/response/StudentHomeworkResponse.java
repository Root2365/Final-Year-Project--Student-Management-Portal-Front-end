package com.meinsms.backend.payload.response;

import lombok.Data;
import org.springframework.lang.Nullable;

import java.time.LocalDate;

@Data
public class StudentHomeworkResponse {
    @Nullable
    private Long id;

    @Nullable
    private Long studentId;

    @Nullable
    private LocalDate submissionDate;

    @Nullable
    private String submittedFilePath;

    @Nullable
    private Double marksGained;

    @Nullable
    private Long studentsId;

    @Nullable
    private Long homeworkId;

    @Nullable
    private String homeworkName;

    @Nullable
    private String homeworkDetails;

    @Nullable
    private LocalDate homeworkDeadLine;

    @Nullable
    private String className;

    @Nullable
    private Long classId;

}
