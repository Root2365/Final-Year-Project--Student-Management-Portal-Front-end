package com.meinsms.backend.models;

import com.fasterxml.jackson.annotation.JsonIgnore;
import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import com.fasterxml.jackson.annotation.JsonIncludeProperties;
import lombok.Getter;
import lombok.Setter;

import javax.persistence.*;
import java.util.List;
import java.util.Set;

@Setter
@Getter
@Entity
@Table
public class Classes {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String className;

    private String classCode;

    @JsonIgnore
    @ManyToOne
    @JoinColumn(name = "t_id", nullable = false)
    User teacher;

    @OneToMany(mappedBy = "classes")
    @JsonIgnoreProperties("filePath")
    List<Activities> activities;

    @ManyToMany(mappedBy = "classes")
    @JsonIgnoreProperties("avatar")
    private Set<Students> students;

    @JsonIgnore
    @ManyToMany(mappedBy = "classes")
    @JsonIncludeProperties({"className", "classCode", "id"})
    private Set<Category> categories;

    @ManyToMany(mappedBy = "classes",  cascade = CascadeType.PERSIST)
    @JsonIgnoreProperties("filesFolders")
    private Set<FilesFolders> filesFolders;
}
