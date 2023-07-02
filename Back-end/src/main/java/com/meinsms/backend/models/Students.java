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
public class Students {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String name;

    private String gender;

    @Nullable
    private boolean sick;

    @Column(columnDefinition="bytea")
    private byte[] avatar;

    @JsonIgnore
    @ManyToMany
    @JoinTable(name = "student_classes",
            joinColumns = @JoinColumn(name = "student_id"),
            inverseJoinColumns = @JoinColumn(name = "classes_id"))
    private Set<Classes> classes;

    @JsonIgnore
    @ManyToOne
    @JoinColumn(name = "parent_id", nullable = false)
    User parent;

    @JsonIgnore
    @OneToMany(mappedBy = "students")
    List<Rating> ratingList;

    public void removeClass(Classes c) {
        classes.remove(c);
        c.getStudents().remove(this);
    }
}
