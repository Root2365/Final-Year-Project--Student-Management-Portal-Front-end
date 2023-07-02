package com.meinsms.backend.controllers;

import com.meinsms.backend.models.Classes;
import com.meinsms.backend.models.Rating;
import com.meinsms.backend.models.RatingCategory;
import com.meinsms.backend.models.Students;
import com.meinsms.backend.payload.request.RatingCategoryCreateRequest;
import com.meinsms.backend.payload.request.RatingCreateRequest;
import com.meinsms.backend.payload.response.CommonResponse;
import com.meinsms.backend.repository.*;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.mail.javamail.MimeMessageHelper;
import org.springframework.web.bind.annotation.*;

import javax.mail.MessagingException;
import javax.mail.internet.MimeMessage;
import java.io.UnsupportedEncodingException;
import java.util.List;
import java.util.Optional;

@CrossOrigin(origins = "*", maxAge = 3600)
@RestController
@RequestMapping("/api/rating")
public class RatingController {

    @Autowired
    UserRepository userRepository;

    @Autowired
    RatingCategoryRepository ratingCategoryRepository;

    @Autowired
    StudentsRepository studentsRepository;

    @Autowired
    ClassesRepository classesRepository;

    @Autowired
    RatingRepository ratingRepository;


    @PostMapping("/create")
    public ResponseEntity<?> rateStudents(@RequestBody RatingCreateRequest ratingCreateRequest) {
        Optional<Students> studentsOptional = studentsRepository.findById(ratingCreateRequest.getSid());
        Optional<Classes> classesOptional = classesRepository.findById(ratingCreateRequest.getCid());
        Optional<RatingCategory> ratingCategoryOptional = ratingCategoryRepository.findById(ratingCreateRequest.getRcid());

        if (studentsOptional.isPresent() && classesOptional.isPresent() && ratingCategoryOptional.isPresent()) {
            Rating duplicateRating = ratingRepository.findAllByStudentsAndClassesAndRatingCategory(studentsOptional.get(), classesOptional.get(), ratingCategoryOptional.get());
            if (duplicateRating != null) {
                ratingRepository.delete(duplicateRating);
            }
            Rating rating = new Rating();
            rating.setNegative(ratingCreateRequest.getNegative());
            rating.setPositive(ratingCreateRequest.getPositive());
            rating.setStudents(studentsOptional.get());
            rating.setRatingCategory(ratingCategoryOptional.get());
            rating.setClasses(classesOptional.get());
            ratingRepository.save(rating);
            List<Rating> ratingList = ratingRepository.findAllByStudentsAndClasses(studentsOptional.get(), classesOptional.get());
            return ResponseEntity.ok(new CommonResponse(true, "rating_submitted_successful", ratingList));
        }
        return ResponseEntity.ok(new CommonResponse(false, "rating_submitted_failed", null));
    }

    @GetMapping("/get/student/{studentId}/classes/{classesId}")
    public ResponseEntity<?> getByStudent(@PathVariable Long studentId, @PathVariable Long classesId) {
        Optional<Students> studentsOptional = studentsRepository.findById(studentId);
        Optional<Classes> classesOptional = classesRepository.findById(classesId);
        if (studentsOptional.isPresent() && classesOptional.isPresent()) {
            Students students = studentsOptional.get();
            Classes classes = classesOptional.get();
            List<Rating> ratingList = ratingRepository.findAllByStudentsAndClasses(students, classes);
            if (!ratingList.isEmpty()) {
                return ResponseEntity.ok(new CommonResponse(true, "", ratingList));
            } else {
                return ResponseEntity.ok(new CommonResponse(false, "no_rating_found_for_student", null));
            }
        } else {
            return ResponseEntity.ok(new CommonResponse(false, "invalid_student_id", null));
        }
    }

    @PutMapping("/update/{id}")
    public ResponseEntity<?> update(@PathVariable Long id, @RequestBody RatingCategoryCreateRequest ratingCategoryCreateRequest) {
        Optional<RatingCategory> ratingCategoryOptional = ratingCategoryRepository.findById(id);
        if (ratingCategoryOptional.isPresent()) {
            RatingCategory ratingCategory = ratingCategoryOptional.get();
            ratingCategory.setName(ratingCategoryCreateRequest.getName());
            ratingCategoryRepository.save(ratingCategory);
            return ResponseEntity.ok(new CommonResponse(true, "rating_updated_successful", ""));
        }
        return ResponseEntity.ok(new CommonResponse(false, "invalid_rating_id", ""));
    }

    @DeleteMapping("/delete/{id}")
    public ResponseEntity<?> delete(@PathVariable Long id) {
        Optional<RatingCategory> ratingCategoryOptional = ratingCategoryRepository.findById(id);
        if (ratingCategoryOptional.isPresent()) {
            RatingCategory ratingCategory = ratingCategoryOptional.get();
            ratingCategoryRepository.delete(ratingCategory);
            return ResponseEntity.ok(new CommonResponse(true, "rating_deleted_successful", ""));
        }
        return ResponseEntity.ok(new CommonResponse(false, "invalid_rating_id", ""));
    }

    @GetMapping("/sendmail")
    public void send(String name, String className) throws UnsupportedEncodingException, MessagingException {

    }
}

