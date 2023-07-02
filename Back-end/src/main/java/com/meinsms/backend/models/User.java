package com.meinsms.backend.models;

import com.fasterxml.jackson.annotation.JsonIgnore;
import com.fasterxml.jackson.annotation.JsonInclude;
import lombok.Data;

import javax.persistence.*;
import javax.validation.constraints.NotBlank;
import javax.validation.constraints.Size;
import java.util.HashSet;
import java.util.List;
import java.util.Set;

@Data
@Entity
@Table(name = "users",
        uniqueConstraints = {
                @UniqueConstraint(columnNames = "username")
        })
public class User {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @NotBlank
    @Size(max = 20)
    private String username;

    @NotBlank
    @Size(max = 50)
    private String email;

    @NotBlank
    @Size(max = 60)
    private String name;

    @NotBlank
    @Size(max = 60)
    private String phone;

    @NotBlank
    @JsonIgnore
    @Size(max = 120)
    private String password;

    private int type;

    @Column(name = "password_token", length = 64)
    private String password_token;

    @ManyToMany(fetch = FetchType.LAZY)
    @JoinTable(name = "user_roles",
            joinColumns = @JoinColumn(name = "user_id"),
            inverseJoinColumns = @JoinColumn(name = "role_id"))
    private Set<Role> roles = new HashSet<>();

    @OneToMany(mappedBy = "teacher")
    @JsonInclude(JsonInclude.Include.NON_EMPTY)
    List<Classes> classes;

    @OneToMany(mappedBy = "teacher")
    @JsonInclude(JsonInclude.Include.NON_EMPTY)
    List<RatingCategory> ratingCategories;

    @OneToMany(mappedBy = "parent")
    @JsonInclude(JsonInclude.Include.NON_EMPTY)
    List<Students> students;

    @OneToMany(mappedBy = "parent")
    @JsonInclude(JsonInclude.Include.NON_EMPTY)
    List<Appointments> appointments;

    @OneToMany(mappedBy = "teacher")
    @JsonInclude(JsonInclude.Include.NON_EMPTY)
    List<Appointments> teacherAppointments;

    public User() {
    }
}
