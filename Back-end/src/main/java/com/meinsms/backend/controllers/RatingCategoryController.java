package com.meinsms.backend.controllers;

import com.meinsms.backend.models.RatingCategory;
import com.meinsms.backend.models.User;
import com.meinsms.backend.payload.request.RatingCategoryCreateRequest;
import com.meinsms.backend.payload.response.CommonResponse;
import com.meinsms.backend.repository.RatingCategoryRepository;
import com.meinsms.backend.repository.UserRepository;
import com.meinsms.backend.security.services.UserDetailsImpl;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;

import java.util.Optional;

@CrossOrigin(origins = "*", maxAge = 3600)
@RestController
@RequestMapping("/api/rating-category")
public class RatingCategoryController {

    @Autowired
    UserRepository userRepository;

    @Autowired
    RatingCategoryRepository ratingCategoryRepository;

    @PostMapping("/create")
    public ResponseEntity<?> create(@RequestBody RatingCategoryCreateRequest ratingCategoryCreateRequest) {
        try {
            RatingCategory ratingCategory = new RatingCategory();
            ratingCategory.setName(ratingCategoryCreateRequest.getName());

            Authentication auth = SecurityContextHolder.getContext().getAuthentication();
            UserDetailsImpl userDetails = (UserDetailsImpl) auth.getPrincipal();
            User user = userRepository.getById(userDetails.getId());

            ratingCategory.setTeacher(user);
            ratingCategoryRepository.save(ratingCategory);
            return ResponseEntity.ok(new CommonResponse(true, "rc_create_successful", user.getRatingCategories()));
        } catch (Exception e) {
            return ResponseEntity.ok(new CommonResponse(false, "rc_create_failed", ""));
        }
    }

    @GetMapping("/get")
    public ResponseEntity<?> getByUser() {
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        UserDetailsImpl userDetails = (UserDetailsImpl) auth.getPrincipal();
        User user = userRepository.getById(userDetails.getId());
        return ResponseEntity.ok(new CommonResponse(true, "", user.getRatingCategories()));
    }

    @GetMapping("/get/{id}")
    public ResponseEntity<?> getByClassId(@PathVariable Long id) {
        Optional<RatingCategory> ratingCategoryOptional = ratingCategoryRepository.findById(id);
        return ratingCategoryOptional.map(ratingCategory -> ResponseEntity.ok(new CommonResponse(true, "", ratingCategory))).orElseGet(() -> ResponseEntity.ok(new CommonResponse(false, "rating_cat_id_invalid", "")));
    }


    @PutMapping("/update/{id}")
    public ResponseEntity<?> update(@PathVariable Long id, @RequestBody RatingCategoryCreateRequest ratingCategoryCreateRequest) {
        Optional<RatingCategory> ratingCategoryOptional = ratingCategoryRepository.findById(id);

        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        UserDetailsImpl userDetails = (UserDetailsImpl) auth.getPrincipal();
        User user = userRepository.getById(userDetails.getId());

        if (ratingCategoryOptional.isPresent()) {
            RatingCategory ratingCategory = ratingCategoryOptional.get();
            ratingCategory.setName(ratingCategoryCreateRequest.getName());
            ratingCategoryRepository.save(ratingCategory);
            return ResponseEntity.ok(new CommonResponse(true, "rc_updated_success", user.getRatingCategories()));
        }
        return ResponseEntity.ok(new CommonResponse(false, "rc_updated_failed", ""));
    }

    @DeleteMapping("/delete/{id}")
    public ResponseEntity<?> delete(@PathVariable Long id) {
        Optional<RatingCategory> ratingCategoryOptional = ratingCategoryRepository.findById(id);
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        UserDetailsImpl userDetails = (UserDetailsImpl) auth.getPrincipal();
        User user = userRepository.getById(userDetails.getId());

        if (ratingCategoryOptional.isPresent()) {
            RatingCategory ratingCategory = ratingCategoryOptional.get();
            ratingCategoryRepository.delete(ratingCategory);
            return ResponseEntity.ok(new CommonResponse(true, "rc_deleted_success", user.getRatingCategories()));
        }
        return ResponseEntity.ok(new CommonResponse(false, "rc_deleted_failed", ""));
    }
}

