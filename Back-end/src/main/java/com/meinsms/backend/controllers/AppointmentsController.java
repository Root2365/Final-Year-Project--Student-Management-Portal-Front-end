package com.meinsms.backend.controllers;

import com.meinsms.backend.models.*;
import com.meinsms.backend.payload.request.AppointmentCreateRequest;
import com.meinsms.backend.payload.request.RatingCategoryCreateRequest;
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
@RequestMapping("/api/appointments")
public class AppointmentsController {

    @Autowired
    UserRepository userRepository;

    @Autowired
    ClassesRepository classesRepository;

    @Autowired
    StudentsRepository studentsRepository;

    @Autowired
    AppointmentRepository appointmentRepository;

    @PostMapping("/create")
    public ResponseEntity<?> create(@RequestBody AppointmentCreateRequest appointmentCreateRequest) {
        try {
            Optional<User> teacherOptional = userRepository.findById(appointmentCreateRequest.getTid());
            Optional<Students> studentsOptional = studentsRepository.findById(appointmentCreateRequest.getSid());
            Optional<Classes> classesOptional = classesRepository.findById(appointmentCreateRequest.getCid());
            // Todo: check isPresent();

            Authentication auth = SecurityContextHolder.getContext().getAuthentication();
            UserDetailsImpl userDetails = (UserDetailsImpl) auth.getPrincipal();
            User user = userRepository.getById(userDetails.getId());

            Appointments appointments = new Appointments();
            appointments.setTitle(appointmentCreateRequest.getTitle());
            appointments.setClasses(classesOptional.get());
            appointments.setParent(user);
            appointments.setTeacher(teacherOptional.get());
            appointments.setStudents(studentsOptional.get());
            appointments.setStartTime(appointmentCreateRequest.getStart());
            appointments.setEndTime(appointmentCreateRequest.getEnd());
            appointments.setStatus("PENDING");

            appointmentRepository.save(appointments);

            return ResponseEntity.ok(new CommonResponse(true, "appoint_create_successful", user.getAppointments()));
        } catch (Exception e) {
            return ResponseEntity.ok(new CommonResponse(false, "appoint_create_failed", ""));
        }

    }

    @GetMapping("/get-by/user")
    public ResponseEntity<?> getByStudent(@RequestParam(value = "from", required = false) String from,
                                          @RequestParam(value = "to", required = false) String to) {

        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        UserDetailsImpl userDetails = (UserDetailsImpl) auth.getPrincipal();
        User user = userRepository.getById(userDetails.getId());
        List<Appointments> appointmentsList = null;
        Role role = user.getRoles().stream()
                .filter(r -> ERole.ROLE_TEACHER.equals(r.getName()))
                .findAny()
                .orElse(null);
        if (role != null) {
            appointmentsList = appointmentRepository.findAllByTeacherAndStartTimeGreaterThanEqualAndEndTimeLessThanEqual(user, Long.parseLong(from), Long.parseLong(to));
        } else {
            appointmentsList = appointmentRepository.
                    findAllByParentAndStartTimeGreaterThanEqualAndEndTimeLessThanEqual(user, Long.parseLong(from), Long.parseLong(to));
        }
        return ResponseEntity.ok(new CommonResponse(true, "", appointmentsList));
    }

    @PutMapping("/update/{appt_id}")
    public ResponseEntity<?> update(@PathVariable Long appt_id, @RequestBody AppointmentCreateRequest appointmentCreateRequest) {
        try {
            Authentication auth = SecurityContextHolder.getContext().getAuthentication();
            UserDetailsImpl userDetails = (UserDetailsImpl) auth.getPrincipal();
            User user = userRepository.getById(userDetails.getId());

            Optional<Appointments> appointments = appointmentRepository.findById(appt_id);
            appointments.get().setStatus(appointmentCreateRequest.getStatus());
            appointmentRepository.save(appointments.get());

            return ResponseEntity.ok(new CommonResponse(true, "appoint_update_successful", user.getTeacherAppointments()));
        } catch (Exception e) {
            return ResponseEntity.ok(new CommonResponse(false, "appoint_update_failed", ""));
        }
    }
}

