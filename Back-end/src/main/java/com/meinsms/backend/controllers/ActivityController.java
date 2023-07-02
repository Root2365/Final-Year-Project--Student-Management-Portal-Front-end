package com.meinsms.backend.controllers;

import com.meinsms.backend.models.*;
import com.meinsms.backend.payload.request.ActivityCreateRequest;
import com.meinsms.backend.payload.request.AppointmentCreateRequest;
import com.meinsms.backend.payload.response.CommonResponse;
import com.meinsms.backend.repository.*;
import com.meinsms.backend.security.services.UserDetailsImpl;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Optional;

@CrossOrigin(origins = "*", maxAge = 3600)
@RestController
@RequestMapping("/api/activity")
public class ActivityController {

    @Autowired
    ClassesRepository classesRepository;

    @Autowired
    ActivityRepository activityRepository;


    @PostMapping("/create")
    public ResponseEntity<?> create(@RequestBody ActivityCreateRequest activityCreateRequest) {
        try {
            Optional<Classes> classes = classesRepository.findById(activityCreateRequest.getCid());
            if (classes.isPresent()) {
                Activities activities = new Activities();
                activities.setTitle(activityCreateRequest.getTitle());
                activities.setFilePath(activityCreateRequest.getFilePath());
                activities.setType(activityCreateRequest.getType());
                activities.setActivityDate(activityCreateRequest.getActivityDate());
                activities.setDescription(activityCreateRequest.getDescription());
                activities.setClasses(classes.get());

                activityRepository.save(activities);
            } else {
                return ResponseEntity.ok(new CommonResponse(false, "invalid_class_id", null));
            }
            return ResponseEntity.ok(new CommonResponse(true, "activity_create_successful", null));
        } catch (Exception e) {
            return ResponseEntity.ok(new CommonResponse(false, "activity_create_failed", null));
        }
    }

    @GetMapping("/get-by/class/{id}")
    public ResponseEntity<?> getByClass(@RequestParam(value = "from", required = false) String from,
                                          @RequestParam(value = "to", required = false) String to,
                                          @PathVariable Long id) {
        List<Activities> activitiesList = activityRepository.findAllByClassesAndActivityDateGreaterThanEqualAndActivityDateLessThanEqual(classesRepository.findById(id).get(), Long.parseLong(from), Long.parseLong(to));
        return ResponseEntity.ok(new CommonResponse(true, "", activitiesList));
    }
}

