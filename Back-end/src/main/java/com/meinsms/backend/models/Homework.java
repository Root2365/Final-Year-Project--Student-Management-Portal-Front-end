package com.meinsms.backend.models;

import lombok.Data;

import javax.persistence.*;
import java.time.LocalDate;
import java.util.ArrayList;
import java.util.List;

@Data
@Entity
@Table(name = "homework")
public class Homework {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "name", nullable = false)
    private String name;

    @Column(name = "details", nullable = false)
    private String details;

    @Column(name = "deadline", nullable = false)
    private LocalDate deadline;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "class_id")
    private Classes classes;

    @OneToMany(mappedBy = "homework", fetch = FetchType.LAZY, cascade = CascadeType.ALL)
    private List<StudentHomework> studentHomeworkList = new ArrayList<>();

    @Override
    public String toString() {
        return "Homework [id=" + id + ", name=" + name + ", details=" + details + ", deadline=" + deadline
                + ", classId=" + classes.getId() + ", className=" + classes.getClassName()
                + ", classCode=" + classes.getClassCode() + "]";
    }
}
