package com.meinsms.backend.controllers;

import com.meinsms.backend.models.Category;
import com.meinsms.backend.models.Classes;
import com.meinsms.backend.models.User;
import com.meinsms.backend.payload.request.CategoryCreateRequest;
import com.meinsms.backend.repository.CategoryRepository;
import com.meinsms.backend.repository.ClassesRepository;
import com.meinsms.backend.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.HashSet;
import java.util.List;
import java.util.Optional;
import java.util.Set;

@CrossOrigin(origins = "*")
@RestController
@RequestMapping("/api/categories")
public class CategoryController {

    @Autowired
    private CategoryRepository categoryRepository;

    @Autowired
    private ClassesRepository classesRepository;

    @Autowired
    private UserRepository userRepository;

    // Get all categories
    @GetMapping
    public ResponseEntity<List<Category>> getAllCategories() {
        List<Category> categories = categoryRepository.findAll();
        return ResponseEntity.ok(categories);
    }

    // Get a single category by ID
    @GetMapping("/{id}")
    public ResponseEntity<Category> getCategoryById(@PathVariable Long id) {
        Optional<Category> category = categoryRepository.findById(id);
        return category.map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    @GetMapping("/get-by-teacherId/{teacherId}")
    public ResponseEntity<List<Category>> getCategoryByTeacherId(@PathVariable Long teacherId) {
        User teacher = userRepository.findById(teacherId).get();
        List<Category> category = categoryRepository.findByTeacher(teacher);
        return ResponseEntity.ok(category);
    }

    @GetMapping("/get-by-classId/{classId}")
    public ResponseEntity<List<Category>> getCategoryByClassId(@PathVariable Long classId) {
        Classes classes = classesRepository.findById(classId).get();
        System.out.println(classes.getClassCode());
        List<Category> category = categoryRepository.findByClasses(classes);
        return ResponseEntity.ok(category);
    }


    // Create a new category
    @PostMapping
    public ResponseEntity<Category> createCategory(@RequestBody CategoryCreateRequest request) {
        // Create a new Category object
        Category category = new Category();
        category.setName(request.getName());

        // Set the associated classes
        Set<Classes> classes = new HashSet<>();
        for (Integer classId : request.getClassIds()) {
            Optional<Classes> classOptional = classesRepository.findById(classId.longValue());
            classOptional.ifPresent(classes::add);
        }
        category.setClasses(classes);

        // Set the associated teacher
        Optional<User> teacherOptional = userRepository.findById(request.getTeacherId());
        teacherOptional.ifPresent(category::setTeacher);

        // Save the category
        Category savedCategory = categoryRepository.save(category);

        return ResponseEntity.ok(savedCategory);
    }

    // Update an existing category
    /*@PutMapping("/{id}")
    public ResponseEntity<Category> updateCategory(@PathVariable Long id, @RequestBody Category updatedCategory) {
        Optional<Category> category = categoryRepository.findById(id);
        if (category.isPresent()) {
            updatedCategory.setId(id);
            Category savedCategory = categoryRepository.save(updatedCategory);
            return ResponseEntity.ok(savedCategory);
        } else {
            return ResponseEntity.notFound().build();
        }
    }*/

    @PutMapping("/{categoryId}")
    public ResponseEntity<Category> updateCategory(@PathVariable Long categoryId, @RequestBody CategoryCreateRequest request) {
        Optional<Category> categoryOptional = categoryRepository.findById(categoryId);
        if (!categoryOptional.isPresent()) {
            return ResponseEntity.notFound().build();
        }

        Category category = categoryOptional.get();
        category.setName(request.getName());

        // Update the associated classes
        Set<Classes> classes = new HashSet<>();
        for (Integer classId : request.getClassIds()) {
            Optional<Classes> classOptional = classesRepository.findById(classId.longValue());
            classOptional.ifPresent(classes::add);
        }
        category.setClasses(classes);

        // Update the associated teacher
        Optional<User> teacherOptional = userRepository.findById(request.getTeacherId());
        teacherOptional.ifPresent(category::setTeacher);

        // Save the updated category
        Category savedCategory = categoryRepository.save(category);

        return ResponseEntity.ok(savedCategory);
    }

    // Delete a category by ID
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteCategory(@PathVariable Long id) {
        Optional<Category> category = categoryRepository.findById(id);
        if (category.isPresent()) {
            categoryRepository.deleteById(id);
            return ResponseEntity.noContent().build();
        } else {
            return ResponseEntity.notFound().build();
        }
    }
}
