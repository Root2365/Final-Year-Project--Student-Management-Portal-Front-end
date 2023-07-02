package com.meinsms.backend.models;

import com.fasterxml.jackson.annotation.JsonIgnore;
import io.micrometer.core.lang.Nullable;
import lombok.ToString;

import javax.persistence.*;
import java.util.List;
import java.util.Set;

@ToString
@Entity
public class FilesFolders {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String type;

    private String status;

    private String name;

    private String file_path;

    private boolean important;

    private boolean allowed;

    private boolean isParent;

    private boolean isRoot;

    @Nullable
    @ManyToOne(fetch = FetchType.LAZY)
    @JsonIgnore
    @JoinColumn(name = "teacher_id")
    private User teacher;

    @Nullable
    @ManyToOne(fetch = FetchType.LAZY)
    @JsonIgnore
    @JoinColumn(name = "student_id")
    private Students students;

//    @Nullable
//    @ManyToOne(fetch = FetchType.LAZY)
//    @JsonIgnore
//    @JoinColumn(name = "class_id")
//    private Classes classes;
//
//    @Nullable
//    @JsonIgnore
//    @ManyToOne(fetch = FetchType.LAZY)
//    @JoinColumn(name = "category_id")
//    private Category category;


    @JsonIgnore
    @ManyToMany
    @JoinTable(name = "category_files",
            joinColumns = @JoinColumn(name = "files_folders_id"),
            inverseJoinColumns = @JoinColumn(name = "category_id"))
    private Set<Category> categories;

    @JsonIgnore
    @ManyToMany
    @JoinTable(name = "classes_files",
            joinColumns = @JoinColumn(name = "files_folders_id"),
            inverseJoinColumns = @JoinColumn(name = "classes_id"))
    private Set<Classes> classes;

    @Nullable
    @JsonIgnore
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "parent_id")
    private FilesFolders parent;

    @OneToMany(mappedBy = "parent", cascade = CascadeType.ALL)
    private List<FilesFolders> children;

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    @Nullable
    public Students getStudents() {
        return students;
    }

    public void setStudents(@Nullable Students students) {
        this.students = students;
    }

//    @Nullable
//    public Classes getClasses() {
//        return classes;
//    }
//
//    public void setClasses(@Nullable Classes classes) {
//        this.classes = classes;
//    }

    @Nullable
    public User getTeacher() {
        return teacher;
    }

    public void setTeacher(@Nullable User teacher) {
        this.teacher = teacher;
    }

    public String getType() {
        return type;
    }

    public void setType(String type) {
        this.type = type;
    }

    public String getStatus() {
        return status;
    }

    public void setStatus(String status) {
        this.status = status;
    }

    public boolean isImportant() {
        return important;
    }

    public void setImportant(boolean important) {
        this.important = important;
    }

    public boolean isAllowed() {
        return allowed;
    }

    public void setAllowed(boolean allowed) {
        this.allowed = allowed;
    }

    public boolean isParent() {
        return this.isParent;
    }

    public void setParent(boolean parent) {
        isParent = parent;
    }

    public boolean isRoot() {
        return this.isRoot;
    }

    public void setRoot(boolean root) {
        isRoot = root;
    }

    @Nullable
    public FilesFolders getParent() {
        return parent;
    }

    public void setParent(@Nullable FilesFolders parent) {
        this.parent = parent;
    }

    public List<FilesFolders> getChildren() {
        return children;
    }

    public void setChildren(List<FilesFolders> children) {
        this.children = children;
    }

//    @Nullable
//    public Category getCategory() {
//        return category;
//    }
//
//    public void setCategory(@Nullable Category category) {
//        this.category = category;
//    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public String getFile_path() {
        return file_path;
    }

    public void setFile_path(String file_path) {
        this.file_path = file_path;
    }


    public Set<Category> getCategories() {
        return categories;
    }

    public void setCategories(Set<Category> categories) {
        this.categories = categories;
    }

    public Set<Classes> getClasses() {
        return classes;
    }

    public void setClasses(Set<Classes> classes) {
        this.classes = classes;
    }
}

