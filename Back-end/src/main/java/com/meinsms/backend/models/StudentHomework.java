package com.meinsms.backend.models;

import com.fasterxml.jackson.annotation.JsonIgnore;
import lombok.Data;

import javax.persistence.*;
import java.time.LocalDate;

@Data
@Entity
@Table(name = "student_homework")
public class StudentHomework {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "student_id")
    private Students student;

    @JsonIgnore
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "homework_id")
    private Homework homework;

    @Column(name = "submission_date")
    private LocalDate submissionDate;

    @Column(name = "submitted_file_path")
    private String submittedFilePath;

    @Column(name = "marks_gained")
    private Double marksGained;

    @Override
    public String toString() {
        return "StudentHomework [id=" + id + ", studentId=" + student.getId() + ", homeworkId=" + homework.getId()
                + ", submissionDate=" + submissionDate + ", submittedFilePath=" + submittedFilePath
                + ", marksGained=" + marksGained + "]";
    }
}
