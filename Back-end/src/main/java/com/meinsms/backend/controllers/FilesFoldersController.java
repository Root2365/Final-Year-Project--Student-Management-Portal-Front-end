package com.meinsms.backend.controllers;

import com.meinsms.backend.models.*;
import com.meinsms.backend.payload.response.FileFoldersResponse;
import com.meinsms.backend.payload.response.MessageResponse;
import com.meinsms.backend.repository.*;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.core.io.Resource;
import org.springframework.core.io.UrlResource;
import org.springframework.data.domain.Sort;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.util.StringUtils;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.io.InputStream;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.nio.file.StandardCopyOption;
import java.util.*;

@CrossOrigin(origins = "*")
@RestController
@RequestMapping("/api/filesfolders")
public class FilesFoldersController {

    @Autowired
    FilesFoldersRepository filesFoldersRepository;

    @Autowired
    CategoryRepository categoryRepository;

    @Autowired
    UserRepository userRepository;

    @Autowired
    StudentsRepository studentsRepository;

    @Autowired
    ClassesRepository classesRepository;

    @PostMapping("/create")
    public ResponseEntity<MessageResponse> createFilesFolders(@RequestParam(value = "file", required = false) MultipartFile file,
                                                              @RequestParam(value = "student_id", required = false) Long studentId,
                                                              @RequestParam(value = "teacher_id", required = false) Long teacherId,
                                                              @RequestParam(value = "class_id", required = false) List<Long> classIds,
                                                              @RequestParam("type") String type,
                                                              @RequestParam("name") String name,
                                                              @RequestParam("status") String status,
                                                              @RequestParam("important") boolean important,
                                                              @RequestParam(value = "parent_id", required = false) Long parentId,
                                                              @RequestParam("allowed") boolean allowed,
                                                              @RequestParam("is_parent") boolean isParent,
                                                              @RequestParam("is_root") boolean isRoot,
                                                              @RequestParam(value = "category_id", required = false) List<Long> categoryIds) throws IOException {
        MessageResponse messageResponse = new MessageResponse();
        // Create FilesFolders entity
        String filePath = null;
        if (Objects.equals(type, "FILE"))
            if (file != null)
                filePath = "src/main/resources/static/files/" + saveFile(file);

        User teacher = null;
        if (teacherId != null)
            teacher = userRepository.findById(teacherId).get();

        Students students = null;
        if (studentId != null)
            students = studentsRepository.findById(studentId).get();


        // Create a new FilesFolders object
        FilesFolders filesFolders = new FilesFolders();
        filesFolders.setStudents(students);
        filesFolders.setTeacher(teacher);
        filesFolders.setType(type);
        filesFolders.setName(name);
        filesFolders.setStatus(status);
        filesFolders.setImportant(important);
        filesFolders.setAllowed(allowed);
        filesFolders.setParent(isParent);
        filesFolders.setRoot(isRoot);
        filesFolders.setFile_path(filePath);

        // Set categories
        Set<Category> categories = new HashSet<>();
        if (categoryIds != null) {
            for (Long categoryId : categoryIds) {
                Optional<Category> categoryOptional = categoryRepository.findById(categoryId);
                if (categoryOptional.isPresent()) {
                    categories.add(categoryOptional.get());
                }
            }
        }
        filesFolders.setCategories(categories);

        // Set classes
        Set<Classes> classes = new HashSet<>();
        if (classIds != null) {
            for (Long classId : classIds) {
                Optional<Classes> classesOptional = classesRepository.findById(classId);
                if (classesOptional.isPresent()) {
                    classes.add(classesOptional.get());
                }
            }
        }
        filesFolders.setClasses(classes);

        if (parentId != null) {
            Optional<FilesFolders> parentOptional = filesFoldersRepository.findById(parentId);
            if (parentOptional.isPresent()) {
                FilesFolders parent = parentOptional.get();
                filesFolders.setParent(parent);
            }
        } else {
            filesFolders.setParent(null);
        }


        filesFoldersRepository.save(filesFolders);

        messageResponse.setMessage("Created Successfully");
        messageResponse.setCode(200);
        return ResponseEntity.ok(messageResponse);
    }

    // Helper method to save the file to a specific location
    private String saveFile(MultipartFile file) throws IOException {
        String fileName = StringUtils.cleanPath(file.getOriginalFilename());
        Path uploadPath = Paths.get("src/main/resources/static/files");

        if (!Files.exists(uploadPath)) {
            Files.createDirectories(uploadPath);
        }

        try (InputStream inputStream = file.getInputStream()) {
            Path filePath = uploadPath.resolve(fileName);
            Files.copy(inputStream, filePath, StandardCopyOption.REPLACE_EXISTING);
        }
        return fileName;
    }

//    @GetMapping("/get-by-category-class/{categoryId}/{classId}")
//    public ResponseEntity<List<FilesFolders>> getFilesFoldersByCategoryClass(@PathVariable Long categoryId, @PathVariable Long classId) {
//        Optional<Category> categoryOptional = categoryRepository.findById(categoryId);
//        if (!categoryOptional.isPresent()) {
//            return ResponseEntity.notFound().build();
//        }
//
//        Optional<Classes> classesOptional = classesRepository.findById(classId);
//        if (!classesOptional.isPresent()) {
//            return ResponseEntity.notFound().build();
//        }
//
//        Category category = categoryOptional.get();
//        Classes classes = classesOptional.get();
//        List<FilesFolders> filesFoldersList = filesFoldersRepository.findByCategoriesAndClasses(category, classes, sort);
//
//        return ResponseEntity.ok(filesFoldersList);
//    }

//    @GetMapping("/get-by-category/{categoryId}")
//    public ResponseEntity<List<FilesFolders>> getFilesFoldersByCategory(@PathVariable Long categoryId) {
//        Optional<Category> categoryOptional = categoryRepository.findById(categoryId);
//        if (!categoryOptional.isPresent()) {
//            return ResponseEntity.notFound().build();
//        }
//
//        Category category = categoryOptional.get();
//        List<FilesFolders> filesFoldersList = filesFoldersRepository.findByCategory(category);
//
//        return ResponseEntity.ok(filesFoldersList);
//    }

    @GetMapping("/get-by-id/{id}")
    public ResponseEntity<List<FileFoldersResponse>> getFilesFoldersById(@PathVariable Long id) {
        Sort sort = Sort.by(Sort.Order.desc("important"), Sort.Order.asc("name"));
        FilesFolders filesFolder = filesFoldersRepository.findById(id).get();
        List<FilesFolders> filesFoldersList = filesFoldersRepository.findByParent(filesFolder, sort);

        List<FileFoldersResponse> fileFoldersResponseList = new ArrayList<>();
        for (FilesFolders filesFolders : filesFoldersList) {
            FileFoldersResponse fileFoldersResponse = new FileFoldersResponse();
            fileFoldersResponse.setId(filesFolders.getId());
            fileFoldersResponse.setType(filesFolders.getType());
            fileFoldersResponse.setStatus(filesFolders.getStatus());
            fileFoldersResponse.setName(filesFolders.getName());
            fileFoldersResponse.setFile_path(filesFolders.getFile_path());
            fileFoldersResponse.setImportant(filesFolders.isImportant());
            fileFoldersResponse.setAllowed(filesFolders.isAllowed());
            if (filesFolders.getTeacher() != null)
                fileFoldersResponse.setTeacher(filesFolders.getTeacher().getName());
            if (filesFolders.getStudents() != null)
                fileFoldersResponse.setStudentName(filesFolders.getStudents().getName());
            fileFoldersResponse.setNumOfChild(filesFolders.getChildren().size());
            fileFoldersResponse.setChildren(filesFolders.getChildren());
            fileFoldersResponseList.add(fileFoldersResponse);
        }

        return ResponseEntity.ok(fileFoldersResponseList);
    }

//    @GetMapping("/get-root")
//    public ResponseEntity<List<FileFoldersResponse>> getRootFolder(
//            @RequestParam Long classId,
//            @RequestParam Long categoryId) {
//
//        boolean isRoot = true;
//        Category category = categoryRepository.findById(categoryId).get();
//        Classes classes = classesRepository.findById(classId).get();
//        Sort sort = Sort.by(Sort.Order.desc("important"), Sort.Order.asc("name"));
//        List<FilesFolders> filesFoldersList = filesFoldersRepository.findByIsRootAndClassesAndCategory(isRoot, classes, category, sort);
//
//        List<FileFoldersResponse> fileFoldersResponseList = new ArrayList<>();
//
//        for (FilesFolders filesFolders : filesFoldersList) {
//            FileFoldersResponse fileFoldersResponse = new FileFoldersResponse();
//            fileFoldersResponse.setId(filesFolders.getId());
//            fileFoldersResponse.setType(filesFolders.getType());
//            fileFoldersResponse.setStatus(filesFolders.getStatus());
//            fileFoldersResponse.setName(filesFolders.getName());
//            fileFoldersResponse.setFile_path(filesFolders.getFile_path());
//            fileFoldersResponse.setImportant(filesFolders.isImportant());
//            fileFoldersResponse.setAllowed(filesFolders.isAllowed());
//            fileFoldersResponse.setClassName(filesFolders.getClasses().getClassName());
//            fileFoldersResponse.setTeacher(filesFolders.getTeacher().getName());
//            fileFoldersResponse.setCategoryName(filesFolders.getCategory().getName());
//            fileFoldersResponse.setNumOfChild(filesFolders.getChildren().size());
//            fileFoldersResponse.setChildren(filesFolders.getChildren());
//            fileFoldersResponseList.add(fileFoldersResponse);
//        }
//
//        return ResponseEntity.ok(fileFoldersResponseList);
//    }

    @GetMapping("/get-root")
    public ResponseEntity<List<FileFoldersResponse>> getRootFolder(
            @RequestParam Long classId,
            @RequestParam Long categoryId) {

        boolean isRoot = true;
        Sort sort = Sort.by(Sort.Order.desc("important"), Sort.Order.asc("name"));

        Optional<Category> categoryOptional = categoryRepository.findById(categoryId);
        if (!categoryOptional.isPresent()) {
            return ResponseEntity.notFound().build();
        }

        Optional<Classes> classesOptional = classesRepository.findById(classId);
        if (!classesOptional.isPresent()) {
            return ResponseEntity.notFound().build();
        }

        Category category = categoryOptional.get();
        Classes classes = classesOptional.get();
        List<FilesFolders> filesFoldersList = filesFoldersRepository.findByCategoriesAndClasses(category, classes, sort);

        List<FileFoldersResponse> fileFoldersResponseList = new ArrayList<>();

        for (FilesFolders filesFolders : filesFoldersList) {
            FileFoldersResponse fileFoldersResponse = new FileFoldersResponse();
            fileFoldersResponse.setId(filesFolders.getId());
            fileFoldersResponse.setType(filesFolders.getType());
            fileFoldersResponse.setStatus(filesFolders.getStatus());
            fileFoldersResponse.setName(filesFolders.getName());
            fileFoldersResponse.setFile_path(filesFolders.getFile_path());
            fileFoldersResponse.setImportant(filesFolders.isImportant());
            fileFoldersResponse.setAllowed(filesFolders.isAllowed());
            fileFoldersResponse.setTeacher(filesFolders.getTeacher().getName());
            fileFoldersResponse.setNumOfChild(filesFolders.getChildren().size());
            fileFoldersResponse.setChildren(filesFolders.getChildren());
            fileFoldersResponseList.add(fileFoldersResponse);
        }

        return ResponseEntity.ok(fileFoldersResponseList);
    }

    @PutMapping("/update-permission/{id}")
    public ResponseEntity<MessageResponse> updatePermission(@PathVariable Long id, @RequestParam("allowed") boolean allowed) {
        MessageResponse messageResponse = new MessageResponse();
        Optional<FilesFolders> filesFoldersOptional = filesFoldersRepository.findById(id);
        if (filesFoldersOptional.isPresent()) {
            FilesFolders filesFolders = filesFoldersOptional.get();
            filesFolders.setAllowed(allowed);
            filesFoldersRepository.save(filesFolders);
            messageResponse.setMessage("Updated Successfully");
            messageResponse.setCode(200);
            return ResponseEntity.ok(messageResponse);
        } else {
            return ResponseEntity.notFound().build();
        }
    }

    @PutMapping("/update-important/{id}")
    public ResponseEntity<MessageResponse> updateImportant(@PathVariable Long id, @RequestParam("important") boolean important) {
        MessageResponse messageResponse = new MessageResponse();
        Optional<FilesFolders> filesFoldersOptional = filesFoldersRepository.findById(id);
        if (filesFoldersOptional.isPresent()) {
            FilesFolders filesFolders = filesFoldersOptional.get();
            filesFolders.setImportant(important);
            filesFoldersRepository.save(filesFolders);
            messageResponse.setMessage("Updated Successfully");
            messageResponse.setCode(200);
            return ResponseEntity.ok(messageResponse);
        } else {
            return ResponseEntity.notFound().build();
        }
    }

    @PutMapping("/update-name/{id}")
    public ResponseEntity<MessageResponse> updateName(@PathVariable Long id, @RequestParam("name") String name) {
        MessageResponse messageResponse = new MessageResponse();
        Optional<FilesFolders> filesFoldersOptional = filesFoldersRepository.findById(id);
        if (filesFoldersOptional.isPresent()) {
            FilesFolders filesFolders = filesFoldersOptional.get();
            filesFolders.setName(name);
            filesFoldersRepository.save(filesFolders);
            messageResponse.setMessage("Updated Successfully");
            messageResponse.setCode(200);
            return ResponseEntity.ok(messageResponse);
        } else {
            return ResponseEntity.notFound().build();
        }
    }
    @DeleteMapping("/{id}")
    public ResponseEntity<MessageResponse> delete(@PathVariable Long id) {
        MessageResponse messageResponse = new MessageResponse();
        Optional<FilesFolders> filesFoldersOptional = filesFoldersRepository.findById(id);
        if (filesFoldersOptional.isPresent()) {
            FilesFolders filesFolders = filesFoldersOptional.get();
            filesFoldersRepository.delete(filesFolders);
            messageResponse.setMessage("Deleted Successfully");
            messageResponse.setCode(200);
            return ResponseEntity.ok(messageResponse);
        } else {
            return ResponseEntity.notFound().build();
        }
    }


    @GetMapping("/{id}/file")
    public ResponseEntity<Resource> getHomeworkFile(@PathVariable Long id) throws IOException {
        Optional<FilesFolders> filesFoldersOptional = filesFoldersRepository.findById(id);
        if (filesFoldersOptional.isPresent()) {
            FilesFolders filesFolders = filesFoldersOptional.get();
            String filePath = filesFolders.getFile_path();
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

}
