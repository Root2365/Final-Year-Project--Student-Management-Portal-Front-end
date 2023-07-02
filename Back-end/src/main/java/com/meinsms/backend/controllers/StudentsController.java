package com.meinsms.backend.controllers;

import com.meinsms.backend.models.*;
import com.meinsms.backend.payload.request.StudentAddToClassRequest;
import com.meinsms.backend.payload.request.StudentCreateRequest;
import com.meinsms.backend.payload.response.CommonResponse;
import com.meinsms.backend.repository.ClassesRepository;
import com.meinsms.backend.repository.StudentsRepository;
import com.meinsms.backend.repository.UserRepository;
import com.meinsms.backend.security.services.UserDetailsImpl;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.mail.javamail.MimeMessageHelper;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;

import javax.mail.MessagingException;
import javax.mail.internet.MimeMessage;
import java.io.UnsupportedEncodingException;
import java.util.*;
import java.util.stream.Collectors;

@CrossOrigin(origins = "*", maxAge = 3600)
@RestController
@RequestMapping("/api/students")
public class StudentsController {

    @Autowired
    UserRepository userRepository;

    @Autowired
    ClassesRepository classesRepository;

    @Autowired
    StudentsRepository studentsRepository;


    @PostMapping("/create")
    public ResponseEntity<?> create(@RequestBody StudentCreateRequest studentCreateRequest) {
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        UserDetailsImpl userDetails = (UserDetailsImpl) auth.getPrincipal();
        User user = userRepository.getById(userDetails.getId());

        List<String> roles = userDetails.getAuthorities().stream()
                .map(GrantedAuthority::getAuthority)
                .collect(Collectors.toList());

        if (roles.get(0).equals(ERole.ROLE_PARENT.name())) {
            Students students = new Students();
            students.setName(studentCreateRequest.getName());
            students.setGender(studentCreateRequest.getGender().toUpperCase());
            students.setAvatar(studentCreateRequest.getAvatar());
            students.setSick(false);
            students.setParent(user);
            studentsRepository.save(students);
            return ResponseEntity.ok(new CommonResponse(true, "child_create_successful", user.getStudents()));
        } else {
            return ResponseEntity.ok(new CommonResponse(false, "need_tobe_parent", null));
        }
    }

    @PutMapping("/update/{sid}")
    public ResponseEntity<?> update(@PathVariable long sid, @RequestBody StudentCreateRequest studentCreateRequest) {
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        UserDetailsImpl userDetails = (UserDetailsImpl) auth.getPrincipal();
        User user = userRepository.getById(userDetails.getId());

        Optional<Students> studentsOptional = studentsRepository.findById(sid);
        if (studentsOptional.isPresent()) {
            Students students = studentsOptional.get();
            students.setName(studentCreateRequest.getName());
            students.setGender(studentCreateRequest.getGender().toUpperCase());
            students.setAvatar(studentCreateRequest.getAvatar()
            );
            students.setParent(user);
            studentsRepository.save(students);
            return ResponseEntity.ok(new CommonResponse(true, "child_updated_successful", user.getStudents()));
        } else {
            return ResponseEntity.ok(new CommonResponse(false, "invalid_child_id", null));
        }
    }

    @PostMapping("/add-to-class")
    public ResponseEntity<?> addStudentToClass(@RequestBody StudentAddToClassRequest studentAddToClassRequest) {
        Optional<Students> studentsOptional = studentsRepository.findById(studentAddToClassRequest.getStudentId());
        Optional<Classes> classesOptional = classesRepository.findAllByClassCode(studentAddToClassRequest.getClassCode());

        if (studentsOptional.isPresent() && classesOptional.isPresent()) {
            Classes classesExist = classesRepository.findAllByClassCodeAndStudents(studentAddToClassRequest.getClassCode(), studentsOptional.get());
            if (classesExist != null) {
                return ResponseEntity.ok(new CommonResponse(false, "child_already_added", null));
            }
            Students students = studentsOptional.get();
            Classes classes = classesOptional.get();
            Set<Classes> classesSet = students.getClasses();
            classesSet.add(classes);
            students.setClasses(classesSet);
            studentsRepository.save(students);
            return ResponseEntity.ok(new CommonResponse(true, "child_added_class_successful", null));
        }

        return ResponseEntity.ok(new CommonResponse(false, "invalid_class_or_child_id", null));
    }

    @GetMapping("/get/classes/{classId}")
    public ResponseEntity<?> getByClass(@PathVariable Long classId) {
        Optional<Classes> classesOptional = classesRepository.findById(classId);
        if (classesOptional.isPresent()) {
            Classes classes = classesOptional.get();
            Optional<List<Students>> studentsOptional = studentsRepository.findAllByClasses(classes);
            if (studentsOptional.isPresent()) {
                List<Students> studentsList = studentsOptional.get();
                return ResponseEntity.ok(new CommonResponse(true, "", studentsList));
            } else {
                return ResponseEntity.ok(new CommonResponse(false, "no_student_for_class", null));
            }
        } else {
            return ResponseEntity.ok(new CommonResponse(false, "invalid_class_id", null));
        }
    }

    @GetMapping("/get/by/parent")
    public ResponseEntity<?> getByParent() {
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        UserDetailsImpl userDetails = (UserDetailsImpl) auth.getPrincipal();
        User user = userRepository.getById(userDetails.getId());

        Optional<List<Students>> studentsOptional = studentsRepository.findAllByParent(user);
        if (studentsOptional.isPresent()) {
            List<Students> studentsList = studentsOptional.get();
            return ResponseEntity.ok(new CommonResponse(true, "", studentsList));
        } else {
            return ResponseEntity.ok(new CommonResponse(false, "no_child_for_parent", null));
        }
    }

    @GetMapping("/get/sick/{classId}")
    public ResponseEntity<?> getSickStudents(@PathVariable Long classId) {
        Optional<Classes> classesOptional = classesRepository.findById(classId);
        if (classesOptional.isPresent()) {
            Classes classes = classesOptional.get();
            Optional<List<Students>> studentsOptional = studentsRepository.findAllByClassesAndSickEquals(classes, true);
            if (!studentsOptional.get().isEmpty()) {
                List<Students> studentsList = studentsOptional.get();
                return ResponseEntity.ok(new CommonResponse(true, "", studentsList));
            } else {
                return ResponseEntity.ok(new CommonResponse(false, "no_student_sick", null));
            }
        } else {
            return ResponseEntity.ok(new CommonResponse(false, "invalid_class_id", null));
        }
    }

    @PutMapping("/mark/sick/{sid}/{sick}")
    public ResponseEntity<?> markSick(@PathVariable long sid, @PathVariable boolean sick) throws UnsupportedEncodingException, MessagingException {
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        UserDetailsImpl userDetails = (UserDetailsImpl) auth.getPrincipal();
        User user = userRepository.getById(userDetails.getId());

        Optional<Students> studentsOptional = studentsRepository.findById(sid);
        if (studentsOptional.isPresent()) {
            Students students = studentsOptional.get();
            students.setSick(sick);
            studentsRepository.save(students);
            if (sick) {
                this.send(students.getName());
            }
            return ResponseEntity.ok(new CommonResponse(true, "child_updated_successful", user.getStudents()));
        } else {
            return ResponseEntity.ok(new CommonResponse(false, "invalid_child_id", null));
        }
    }

    public void send(String name) throws UnsupportedEncodingException, MessagingException {

    }
}


