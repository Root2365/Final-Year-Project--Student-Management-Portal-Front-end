package com.meinsms.backend.models;

import com.fasterxml.jackson.annotation.JsonIgnore;
import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import com.fasterxml.jackson.annotation.JsonIncludeProperties;
import lombok.Data;

import javax.persistence.*;
import java.util.Set;

@Entity
@Data
public class Category {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String name;

//    @JsonIgnore
    @ManyToMany
    @JsonIncludeProperties({"className", "classCode", "id"})
    @JoinTable(name = "category_classes",
            joinColumns = @JoinColumn(name = "category_id"),
            inverseJoinColumns = @JoinColumn(name = "classes_id"))
    private Set<Classes> classes;

    @JsonIgnore
    @ManyToOne
    @JoinColumn(name = "teacher_id", nullable = false)
    User teacher;

    @ManyToMany(mappedBy = "categories",  cascade = CascadeType.ALL)
    @JsonIgnoreProperties("filesFolders")
    private Set<FilesFolders> filesFolders;
}
