package com.meinsms.backend.controllers;

import com.meinsms.backend.models.*;
import com.meinsms.backend.payload.request.HomeworkMarkingRequest;
import com.meinsms.backend.payload.request.HomeworkRequest;
import com.meinsms.backend.payload.response.HomeworkResponse;
import com.meinsms.backend.payload.response.MessageResponse;
import com.meinsms.backend.payload.response.StudentHomeworkResponse;
import com.meinsms.backend.repository.ClassesRepository;
import com.meinsms.backend.repository.HomeworkRepository;
import com.meinsms.backend.repository.StudentHomeworkRepository;
import com.meinsms.backend.repository.StudentsRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.core.io.Resource;
import org.springframework.core.io.UrlResource;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.util.StringUtils;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;
import org.springframework.web.server.ResponseStatusException;

import javax.validation.Valid;
import java.io.IOException;
import java.io.InputStream;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.nio.file.StandardCopyOption;
import java.time.LocalDate;
import java.util.ArrayList;
import java.util.List;
import java.util.Optional;


@CrossOrigin(origins = "*", maxAge = 3600)
@RestController
@RequestMapping("/api/homework")
public class HomeworkController {

    @Autowired
    private StudentsRepository studentsRepository;

    @Autowired
    private StudentHomeworkRepository studentHomeworkRepository;

    @Autowired
    private HomeworkRepository homeworkRepository;

    @Autowired
    private ClassesRepository classesRepository;

    @PostMapping("/create")
    public MessageResponse createHomework(@RequestBody HomeworkRequest homeworkRequest) {
        // Convert HomeworkRequest to Homework object
        Homework homework = new Homework();
        homework.setName(homeworkRequest.getName());
        homework.setDetails(homeworkRequest.getDetails());
        homework.setDeadline(homeworkRequest.getDeadline());

        // Find the class for the homework
        Optional<Classes> optionalClass = classesRepository.findById(homeworkRequest.getClassId());
        if (!optionalClass.isPresent()) {
            throw new ResponseStatusException(HttpStatus.NOT_FOUND, "Class not found");
        }
        Classes classes = optionalClass.get();

        // Set the class for the homework
        homework.setClasses(classes);

        // Save the homework to the database
        homeworkRepository.save(homework);

        List<Students> studentsList = studentsRepository.findAllByClasses(classes).get();
        for (Students students : studentsList) {
            StudentHomework studentHomework = new StudentHomework();
            studentHomework.setStudent(students);
            studentHomework.setHomework(homework);
            studentHomeworkRepository.save(studentHomework);
        }

        return new MessageResponse("Homework Created Successfully!", 201);
    }

    @PutMapping("/update/{id}")
    public MessageResponse updateHomework(@PathVariable(value = "id") Long homeworkId, @Valid @RequestBody HomeworkRequest homeworkRequest) {

        // Find the homework to be updated
        Optional<Homework> optionalHomework = homeworkRepository.findById(homeworkId);
        if (!optionalHomework.isPresent()) {
            throw new ResponseStatusException(HttpStatus.NOT_FOUND, "Homework not found");
        }
        Homework homework = optionalHomework.get();

        // Update homework details
        homework.setName(homeworkRequest.getName());
        homework.setDetails(homeworkRequest.getDetails());
        homework.setDeadline(homeworkRequest.getDeadline());

        // Find the class for the homework
        Optional<Classes> optionalClass = classesRepository.findById(homeworkRequest.getClassId());
        if (!optionalClass.isPresent()) {
            throw new ResponseStatusException(HttpStatus.NOT_FOUND, "Class not found");
        }
        Classes classes = optionalClass.get();

        // Set the class for the homework
        homework.setClasses(classes);

        // Save the updated homework to the database
        Homework updatedHomework = homeworkRepository.save(homework);

        return new MessageResponse("Homework Updated Successfully!", 201);
    }


    @GetMapping("/get-by-class")
    public List<HomeworkResponse> getHomeworkForClass(@RequestParam Long classId, @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate startDate, @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate endDate) {
        // Find the class
        Optional<Classes> optionalClass = classesRepository.findById(classId);
        if (!optionalClass.isPresent()) {
            throw new ResponseStatusException(HttpStatus.NOT_FOUND, "Class not found");
        }
        Classes classes = optionalClass.get();
        List<Homework> homeworkList = homeworkRepository.findByClassesAndDeadlineBetween(classes, startDate, endDate);
        List<HomeworkResponse> responseList = new ArrayList<>();
        for (Homework homework : homeworkList) {
            HomeworkResponse response = new HomeworkResponse();
            response.setId(homework.getId());
            response.setName(homework.getName());
            response.setDetails(homework.getDetails());
            response.setDeadline(homework.getDeadline());
            response.setClassId(classes.getId());
            response.setClassName(classes.getClassName());
            response.setClassCode(classes.getClassCode());
            //response.setStudentHomeworkList(homework.getStudentHomeworkList());
            responseList.add(response);
        }

        return responseList;
    }

    @GetMapping("/get-by-id")
    public HomeworkResponse getHomeworkById(@RequestParam Long id) {
        Optional<Homework> homeworkOptional = homeworkRepository.findById(id);
        Homework homework = homeworkOptional.get();

        List<StudentHomework> studentHomeworkList = new ArrayList<>();
        for (StudentHomework studentHomework : homework.getStudentHomeworkList()) {
            StudentHomework sh = new StudentHomework();
            Students students = new Students();

            students.setId(studentHomework.getStudent().getId());
            students.setName(studentHomework.getStudent().getName());
            students.setClasses(studentHomework.getStudent().getClasses());

            sh.setStudent(students);
            sh.setId(studentHomework.getId());
            sh.setSubmittedFilePath(studentHomework.getSubmittedFilePath());
            sh.setMarksGained(studentHomework.getMarksGained());
            sh.setSubmissionDate(studentHomework.getSubmissionDate());
            studentHomeworkList.add(sh);
        }

        HomeworkResponse response = new HomeworkResponse();
        response.setId(homework.getId());
        response.setName(homework.getName());
        response.setDetails(homework.getDetails());
        response.setDeadline(homework.getDeadline());
        response.setClassId(homework.getClasses().getId());
        response.setClassName(homework.getClasses().getClassName());
        response.setClassCode(homework.getClasses().getClassCode());
        response.setStudentHomeworkList(studentHomeworkList);
        return response;
    }

    @GetMapping("/get-by-student-id")
    public List<StudentHomeworkResponse> getHomeworkByStudentId(@RequestParam Long id) {
        Optional<Students> studentsOptional = studentsRepository.findById(id);
        Students students = studentsOptional.get();

        /*List<StudentHomework> studentHomeworkList = studentHomeworkRepository.findByStudent(students);
        return studentHomeworkList.stream()
                .map(studentHomework -> new HomeworkResponse(studentHomework.getHomework()))
                .collect(Collectors.toList());*/

        /*List<StudentHomework> studentHomeworkList = studentHomeworkRepository.findByStudent(id);
        return studentHomeworkList.stream()
                .map(StudentHomework::getHomework)
                .collect(Collectors.toList());*/
        List<StudentHomeworkResponse> studentHomeworkList = new ArrayList<>();
        List<StudentHomework> studentHomeworkListTmp = studentHomeworkRepository.findByStudent(students);
        for (StudentHomework studentHomework : studentHomeworkListTmp) {
            StudentHomeworkResponse sh = new StudentHomeworkResponse();

            sh.setId(studentHomework.getId());
            sh.setHomeworkId(studentHomework.getHomework().getId());
            sh.setHomeworkName(studentHomework.getHomework().getName());
            sh.setHomeworkDetails(studentHomework.getHomework().getDetails());
            sh.setHomeworkDeadLine(studentHomework.getHomework().getDeadline());
            sh.setStudentsId(studentHomework.getStudent().getId());
            sh.setClassId(studentHomework.getHomework().getClasses().getId());
            sh.setClassName(studentHomework.getHomework().getClasses().getClassName());
            sh.setId(studentHomework.getId());
            sh.setSubmittedFilePath(studentHomework.getSubmittedFilePath());
            sh.setMarksGained(studentHomework.getMarksGained());
            sh.setSubmissionDate(studentHomework.getSubmissionDate());
            studentHomeworkList.add(sh);
        }

        return studentHomeworkList;
    }


    @PostMapping("/submit-homework")
    public MessageResponse submitHomework(@RequestParam("file") MultipartFile file, @RequestParam Long studentId, @RequestParam Long homeworkId) throws IOException {
        // Find the student
        Optional<Students> optionalStudent = studentsRepository.findById(studentId);
        if (!optionalStudent.isPresent()) {
            return new MessageResponse("Student not found", 404);
        }
        Students student = optionalStudent.get();

        // Find the homework
        Optional<Homework> optionalHomework = homeworkRepository.findById(homeworkId);
        if (!optionalHomework.isPresent()) {
            return new MessageResponse("Homework not found", 404);
        }
        Homework homework = optionalHomework.get();

        // Check if the student has already submitted this homework
        Optional<StudentHomework> optionalStudentHomework = studentHomeworkRepository.findByStudentAndHomework(student, homework);
        if (optionalStudentHomework.get().getSubmittedFilePath() != null) {
            return new MessageResponse("You have already submitted this", 400);
        }

        // Save the submitted file to the server
        String fileName = StringUtils.cleanPath(file.getOriginalFilename());
        Path uploadPath = Paths.get("src/main/resources/static/files/homework");

        if (!Files.exists(uploadPath)) {
            Files.createDirectories(uploadPath);
        }

        try (InputStream inputStream = file.getInputStream()) {
            Path filePath = uploadPath.resolve(fileName);
            Files.copy(inputStream, filePath, StandardCopyOption.REPLACE_EXISTING);
        }

        // Save the student homework to the database
        StudentHomework studentHomework = studentHomeworkRepository.findByStudentAndHomework(student, homework).get();
        studentHomework.setStudent(student);
        studentHomework.setHomework(homework);
        studentHomework.setSubmissionDate(LocalDate.now());
        studentHomework.setSubmittedFilePath("src/main/resources/static/files/homework" + "/" + fileName);
        studentHomeworkRepository.save(studentHomework);

        return new MessageResponse("Homework Submitted Successfully!", 201);
    }


    @PutMapping("/mark-homework")
    public MessageResponse updateStudentHomework(@RequestBody HomeworkMarkingRequest homeworkMarkingRequest) {
        // Find the student
        Optional<Students> optionalStudent = studentsRepository.findById(homeworkMarkingRequest.getStudentId());
        if (!optionalStudent.isPresent()) {
            return new MessageResponse("Student not found", 404);
        }
        Students student = optionalStudent.get();

        // Find the homework
        Optional<Homework> optionalHomework = homeworkRepository.findById(homeworkMarkingRequest.getHomeworkId());
        if (!optionalHomework.isPresent()) {
            return new MessageResponse("Homework not found", 404);
        }
        Homework homework = optionalHomework.get();

        Optional<StudentHomework> optionalStudentHomework = studentHomeworkRepository.findByStudentAndHomework(student, homework);
        if (!optionalStudentHomework.isPresent()) {
            return new MessageResponse("Homework not submitted for this student", 404);
        }

        StudentHomework studentHomework = optionalStudentHomework.get();

        if (homeworkMarkingRequest.getMarks() != null) {
            studentHomework.setMarksGained(homeworkMarkingRequest.getMarks());
        }

        studentHomeworkRepository.save(studentHomework);
        return new MessageResponse("Marks Submitted Successfully!", 201);
    }

    @GetMapping("/{id}/file")
    public ResponseEntity<Resource> getHomeworkFile(@PathVariable Long id) throws IOException {
        Optional<StudentHomework> studentHomeworkOptional = studentHomeworkRepository.findById(id);
        if (studentHomeworkOptional.isPresent()) {
            StudentHomework studentHomework = studentHomeworkOptional.get();
            String filePath = studentHomework.getSubmittedFilePath();
            Path imagePath = Paths.get(filePath);
            System.out.println(imagePath);
            Resource resource = new UrlResource(imagePath.toUri());
            if (resource.exists() && resource.isReadable()) {
                return ResponseEntity.ok()
                        .contentType(MediaType.APPLICATION_OCTET_STREAM)
                        .header(HttpHeaders.CONTENT_DISPOSITION, "attachment; filename=\"" + imagePath.getFileName().toString() + "\"")
                        .header(HttpHeaders.ACCESS_CONTROL_EXPOSE_HEADERS, HttpHeaders.CONTENT_DISPOSITION)
                        .body(resource);
            } else {
                return ResponseEntity.notFound().build();
            }
        } else {
            return ResponseEntity.notFound().build();
        }
    }


    @DeleteMapping("/{id}")
    public ResponseEntity<MessageResponse> delete(@PathVariable Long id) {
        MessageResponse messageResponse = new MessageResponse();
        Optional<Homework> homeworkOptional = homeworkRepository.findById(id);
        if (homeworkOptional.isPresent()) {
            Homework homework = homeworkOptional.get();
            homeworkRepository.delete(homework);
            messageResponse.setMessage("Deleted Successfully");
            messageResponse.setCode(200);
            return ResponseEntity.ok(messageResponse);
        } else {
            return ResponseEntity.notFound().build();
        }
    }

}

