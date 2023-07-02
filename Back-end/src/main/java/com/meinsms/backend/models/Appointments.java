package com.meinsms.backend.models;

import com.fasterxml.jackson.annotation.JsonIncludeProperties;
import lombok.Getter;
import lombok.Setter;

import javax.persistence.*;

@Setter
@Getter
@Entity
@Table
public class Appointments {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String title;

    private Long startTime;

    private Long endTime;

    private String status;

    @ManyToOne
    @JsonIncludeProperties({"id", "name"})
    @JoinColumn(name = "t_id", nullable = false)
    User teacher;

    @ManyToOne
    @JsonIncludeProperties({"id", "name"})
    @JoinColumn(name = "p_id", nullable = false)
    User parent;

    @ManyToOne
    @JoinColumn(name = "s_id", nullable = false)
    @JsonIncludeProperties({"id", "name"})
    Students students;

    @ManyToOne
    @JoinColumn(name = "c_id", nullable = false)
    @JsonIncludeProperties({"id", "className"})
    Classes classes;
}
