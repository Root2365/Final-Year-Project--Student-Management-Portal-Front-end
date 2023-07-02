package com.meinsms.backend.models;

import com.fasterxml.jackson.annotation.JsonIgnore;
import lombok.Getter;
import lombok.Setter;
import org.hibernate.annotations.CreationTimestamp;

import javax.persistence.*;
import java.util.Date;

@Setter
@Getter
@Entity
@Table
public class Rating {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String positive;

    private String negative;

    @JsonIgnore
    @ManyToOne
    @JoinColumn(name = "sid", nullable = false)
    Students students;

    @ManyToOne
    @JoinColumn(name = "rcid", nullable = false)
    RatingCategory ratingCategory;

    @JsonIgnore
    @ManyToOne
    @JoinColumn(name = "cid", nullable = false)
    Classes classes;

    @CreationTimestamp
    private Date ratingDate;
}
