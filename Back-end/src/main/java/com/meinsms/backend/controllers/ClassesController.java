package com.meinsms.backend.controllers;

import com.meinsms.backend.models.Category;
import com.meinsms.backend.models.Classes;
import com.meinsms.backend.models.Students;
import com.meinsms.backend.models.User;
import com.meinsms.backend.payload.request.ClassesCreateRequest;
import com.meinsms.backend.payload.response.CommonResponse;
import com.meinsms.backend.repository.CategoryRepository;
import com.meinsms.backend.repository.ClassesRepository;
import com.meinsms.backend.repository.StudentsRepository;
import com.meinsms.backend.repository.UserRepository;
import com.meinsms.backend.security.services.UserDetailsImpl;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;

import java.util.*;

@CrossOrigin(origins = "*", maxAge = 3600)
@RestController
@RequestMapping("/api/classes")
public class ClassesController {

    @Autowired
    UserRepository userRepository;

    @Autowired
    ClassesRepository classesRepository;

    @Autowired
    StudentsRepository studentsRepository;

    @Autowired
    CategoryRepository categoryRepository;

    Random rand = new Random();

    @PostMapping("/create")
    public ResponseEntity<?> create(@RequestBody ClassesCreateRequest classesCreateRequest) {
        try {
            int classCode = 0;
            for (; ; ) {
                classCode = rand.nextInt(100000);
                Optional<Classes> classExist = classesRepository.findAllByClassCode(String.valueOf(classCode));
                if (classExist.isPresent()) {
                    continue;
                }
                break;
            }
            Authentication auth = SecurityContextHolder.getContext().getAuthentication();
            UserDetailsImpl userDetails = (UserDetailsImpl) auth.getPrincipal();
            User user = userRepository.getById(userDetails.getId());

            Classes classes = new Classes();
            classes.setClassName(classesCreateRequest.getName());
            classes.setTeacher(user);
            classes.setClassCode(String.valueOf(classCode));
            classesRepository.save(classes);

            return ResponseEntity.ok(new CommonResponse(true, "class_create_successful", user.getClasses()));
        } catch (Exception e) {
            return ResponseEntity.ok(new CommonResponse(false, "class_create_failed", ""));
        }
    }

    @GetMapping("/get")
    public ResponseEntity<?> getByUser() {
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        UserDetailsImpl userDetails = (UserDetailsImpl) auth.getPrincipal();
        User user = userRepository.getById(userDetails.getId());
        return ResponseEntity.ok(new CommonResponse(true, "", user.getClasses()));
    }

    @GetMapping("/get/{id}")
    public ResponseEntity<?> getByClassId(@PathVariable Long id) {
        Optional<Classes> classes = classesRepository.findById(id);
        return classes.map(value -> ResponseEntity.ok(new CommonResponse(true, "", value))).orElseGet(() -> ResponseEntity.ok(new CommonResponse(false, "no_class_found", "")));
    }

    @GetMapping("/get/code/{classCode}")
    public ResponseEntity<?> getByClassCode(@PathVariable String classCode) {
        Optional<Classes> classes = classesRepository.findAllByClassCode(classCode);
        return classes.map(value -> ResponseEntity.ok(new CommonResponse(true, "", value))).orElseGet(() -> ResponseEntity.ok(new CommonResponse(false, "no_class_found", "")));
    }

    @GetMapping("/get/category/{catId}")
    public ResponseEntity<?> getByClassByCategory(@PathVariable Long catId) {
        Category category = categoryRepository.findById(catId).get();
        List<Classes> classes = classesRepository.findAllByCategories(category);
        return ResponseEntity.ok(classes);
    }

    @PutMapping("/update/{id}")
    public ResponseEntity<?> update(@PathVariable Long id, @RequestBody ClassesCreateRequest classesCreateRequest) {

        Optional<Classes> classesOptional = classesRepository.findById(id);
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        UserDetailsImpl userDetails = (UserDetailsImpl) auth.getPrincipal();
        User user = userRepository.getById(userDetails.getId());

        if (classesOptional.isPresent()) {
            Classes classes = classesOptional.get();
            classes.setClassName(classesCreateRequest.getName());
            classesRepository.save(classes);
            return ResponseEntity.ok(new CommonResponse(true, "class_updated_success", user.getClasses()));
        }
        return ResponseEntity.ok(new CommonResponse(false, "class_updated_failed", ""));
    }

    @DeleteMapping("/delete/{id}")
    public ResponseEntity<?> delete(@PathVariable Long id) {
        Optional<Classes> classesOptional = classesRepository.findById(id);
        if (classesOptional.isPresent()) {
            Classes classes = classesOptional.get();
            classesRepository.delete(classes);

            Authentication auth = SecurityContextHolder.getContext().getAuthentication();
            UserDetailsImpl userDetails = (UserDetailsImpl) auth.getPrincipal();
            User user = userRepository.getById(userDetails.getId());

            return ResponseEntity.ok(new CommonResponse(true, "class_deleted_success", user.getClasses()));
        }
        return ResponseEntity.ok(new CommonResponse(false, "class_deleted_failed", ""));
    }

    @GetMapping("/get/student/{studentId}")
    public ResponseEntity<?> getByStudent(@PathVariable Long studentId) {
        Optional<Students> studentsOptional = studentsRepository.findById(studentId);
        if (studentsOptional.isPresent()) {
            Students students = studentsOptional.get();
            Optional<List<Classes>> classOptional = classesRepository.findAllByStudents(students);
            if (classOptional.isPresent()) {
                List<Classes> classesList = classOptional.get();
                return ResponseEntity.ok(new CommonResponse(true, "", classesList));
            } else {
                return ResponseEntity.ok(new CommonResponse(false, "no_class_found_for_student", ""));
            }
        } else {
            return ResponseEntity.ok(new CommonResponse(false, "invalid_student_id", ""));
        }
    }

    @GetMapping("/get/teacher/{classId}")
    public ResponseEntity<?> getTeacherByStudent(@PathVariable Long classId) {
        Optional<Classes> classesOptional = classesRepository.findById(classId);
        if (classesOptional.isPresent()) {
            Classes classes = classesOptional.get();
            User user = userRepository.findAllByClasses(classes);
            if (user != null) {
                return ResponseEntity.ok(new CommonResponse(true, "", user));
            } else {
                return ResponseEntity.ok(new CommonResponse(false, "no_teacher_found_for_class", ""));
            }
        } else {
            return ResponseEntity.ok(new CommonResponse(false, "invalid_class_id", ""));
        }
    }

    @DeleteMapping("del/class/{classId}/student/{sid}")
    public ResponseEntity<?> deleteStudentFromClass(@PathVariable Long classId, @PathVariable Long sid) {
        Optional<Students> studentsOptional = studentsRepository.findById(sid);
        Optional<Classes> classesOptional = classesRepository.findById(classId);

        if (studentsOptional.isPresent()) {
            Students students = studentsOptional.get();
            students.removeClass(classesOptional.get());
            studentsRepository.save(students);
            return ResponseEntity.ok(new CommonResponse(false, "Deleted Successfully", ""));
        } else {
            return ResponseEntity.ok(new CommonResponse(false, "Deleted Failed", ""));
        }
    }
}

