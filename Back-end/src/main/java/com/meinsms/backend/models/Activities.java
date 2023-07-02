package com.meinsms.backend.models;

import com.fasterxml.jackson.annotation.JsonIgnore;
import lombok.Getter;
import lombok.Setter;
import org.springframework.lang.Nullable;

import javax.persistence.*;
import java.util.List;
import java.util.Set;

@Setter
@Getter
@Entity
@Table
public class Activities {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String title;

    @Column(columnDefinition = "bytea")
    private byte[] filePath;

    private String type;

    private String description;

    private Long activityDate;

    @JsonIgnore
    @ManyToOne
    @JoinColumn(name = "c_id", nullable = false)
    Classes classes;
}
