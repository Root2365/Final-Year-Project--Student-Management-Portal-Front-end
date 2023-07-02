package com.meinsms.backend.controllers;

import com.meinsms.backend.models.Attendance;
import com.meinsms.backend.models.Classes;
import com.meinsms.backend.models.Students;
import com.meinsms.backend.payload.request.AttendanceRequest;
import com.meinsms.backend.payload.response.AttendanceResponse;
import com.meinsms.backend.payload.response.MessageResponse;
import com.meinsms.backend.repository.AttendanceRepository;
import com.meinsms.backend.repository.ClassesRepository;
import com.meinsms.backend.repository.StudentsRepository;
import org.apache.poi.ss.usermodel.Row;
import org.apache.poi.ss.usermodel.Sheet;
import org.apache.poi.ss.usermodel.Workbook;
import org.apache.poi.xssf.usermodel.XSSFWorkbook;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.http.*;
import org.springframework.web.bind.annotation.*;

import java.io.ByteArrayOutputStream;
import java.io.IOException;
import java.time.LocalDate;
import java.util.*;

@CrossOrigin(origins = "*", maxAge = 3600)
@RestController
@RequestMapping("/api/attendance")
public class AttendanceController {
    @Autowired
    private AttendanceRepository attendanceRepository;

    @Autowired
    private StudentsRepository studentsRepository;

    @Autowired
    private ClassesRepository classesRepository;


    @GetMapping("/{id}")
    public Attendance getAttendance(@PathVariable Long id) {
        return attendanceRepository.findById(id).get();
    }

    @PostMapping
    public MessageResponse addAttendance(@RequestBody AttendanceRequest attendanceRequest) {
        Optional<Students> studentOptional = studentsRepository.findById(attendanceRequest.getStudentId());
        if (!studentOptional.isPresent()) {
            return new MessageResponse("Invalid Student ID", 400);
        }
        Optional<Classes> classesOptional = classesRepository.findById(attendanceRequest.getClassesId());
        if (!classesOptional.isPresent()) {
            return new MessageResponse("Invalid Class ID", 400);
        }

        Attendance attendance = new Attendance();
        attendance.setStudent(studentOptional.get());
        attendance.setClasses(classesOptional.get());
        attendance.setAttendanceDate(LocalDate.parse(attendanceRequest.getAttendanceDate()));
        attendance.setPresent(attendanceRequest.isPresent());
        attendance.setAbsent(attendanceRequest.isAbsent());

        attendanceRepository.save(attendance);

        return new MessageResponse("Attendance Saved", 200);
    }

    @PutMapping("/{id}")
    public ResponseEntity<?> updateAttendance(@PathVariable("id") long id, @RequestBody AttendanceRequest attendanceRequest) {
        // Find the attendance record by id
        Optional<Attendance> attendanceOptional = attendanceRepository.findById(id);

        if (!attendanceOptional.isPresent()) {
            return ResponseEntity.notFound().build();
        }

        Attendance attendance = attendanceOptional.get();

        // Update the attendance record with the new values
        attendance.setAttendanceDate(LocalDate.parse(attendanceRequest.getAttendanceDate()));
        attendance.setPresent(attendanceRequest.isPresent());
        attendance.setAbsent(attendanceRequest.isAbsent());

        // Save the updated attendance record
        attendanceRepository.save(attendance);

        return ResponseEntity.ok().body("Attendance record updated successfully.");
    }

    @DeleteMapping("/{id}")
    public void deleteAttendance(@PathVariable Long id) {
        Attendance attendance = attendanceRepository.findById(id).get();
        attendanceRepository.delete(attendance);
    }

    @GetMapping("/report")
    public Map<String, Double> getAttendanceReport(@RequestParam Long classId, @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate startDate, @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate endDate) {
        List<Attendance> attendanceList = attendanceRepository.findByClassesIdAndAttendanceDateBetween(classId, startDate, endDate);
        double total = attendanceList.size();
        double present = attendanceList.stream().filter(Attendance::isPresent).count();
        double absent = attendanceList.stream().filter(Attendance::isAbsent).count();
        double presentPercentage = (present / total) * 100;
        double absentPercentage = (absent / total) * 100;
        Map<String, Double> report = new HashMap<>();
        report.put("present", presentPercentage);
        report.put("absent", absentPercentage);
        return report;
    }

    @GetMapping("/report/student")
    public Map<String, Double> getAttendanceReportStudent(@RequestParam Long studentId, @RequestParam Long classId, @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate startDate, @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate endDate) {
        List<Attendance> attendanceList = attendanceRepository.findByStudentIdAndClassesIdAndAttendanceDateBetween(studentId, classId, startDate, endDate);

        double total = attendanceList.size();
        double present = attendanceList.stream().filter(Attendance::isPresent).count();
        double absent = attendanceList.stream().filter(Attendance::isAbsent).count();
        System.out.printf("total %.0f, present %.0f ab %.0f", total, present, absent);
        double presentPercentage = 0;
        double absentPercentage = 0;
        if(total > 0) {
            presentPercentage = (present / total) * 100;
            absentPercentage = (absent / total) * 100;
        }
        Map<String, Double> report = new HashMap<>();
        report.put("present", presentPercentage);
        report.put("presentDay", present);
        report.put("absent", absentPercentage);
        report.put("absentDay", absent);
        report.put("total", total);
        return report;
    }

    @GetMapping
    public List<AttendanceResponse> getClassAttendance(@RequestParam Long classId, @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate startDate, @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate endDate) {
        List<Attendance> attendanceList = attendanceRepository.findByClassesIdAndAttendanceDateBetween(classId, startDate, endDate);
        List<AttendanceResponse> attendanceResponseDTOList = new ArrayList<>();

        for (Attendance attendance : attendanceList) {
            AttendanceResponse attendanceResponse = new AttendanceResponse();
            attendanceResponse.setId(attendance.getId());
            attendanceResponse.setStudentId(attendance.getStudent().getId());
            attendanceResponse.setStudentName(attendance.getStudent().getName());
            attendanceResponse.setClassName(attendance.getClasses().getClassName());
            attendanceResponse.setAttendanceDate(attendance.getAttendanceDate());
            attendanceResponse.setPresent(attendance.isPresent());
            attendanceResponse.setAbsent(attendance.isAbsent());
            attendanceResponseDTOList.add(attendanceResponse);
        }

        return attendanceResponseDTOList;
    }

    @GetMapping("/student")
    public List<AttendanceResponse> getAttendanceByStudentAndClassAndDateRange(@RequestParam Long studentId, @RequestParam Long classId,
                                                                               @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate startDate,
                                                                               @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate endDate) {
        List<Attendance> attendanceList = attendanceRepository.findByStudentIdAndClassesIdAndAttendanceDateBetween(studentId, classId, startDate, endDate);
        List<AttendanceResponse> attendanceResponseDTOList = new ArrayList<>();

        for (Attendance attendance : attendanceList) {
            AttendanceResponse attendanceResponse = new AttendanceResponse();
            attendanceResponse.setId(attendance.getId());
            attendanceResponse.setStudentId(attendance.getStudent().getId());
            attendanceResponse.setStudentName(attendance.getStudent().getName());
            attendanceResponse.setClassName(attendance.getClasses().getClassName());
            attendanceResponse.setAttendanceDate(attendance.getAttendanceDate());
            attendanceResponse.setPresent(attendance.isPresent());
            attendanceResponse.setAbsent(attendance.isAbsent());
            attendanceResponseDTOList.add(attendanceResponse);
        }

        return attendanceResponseDTOList;
    }

//    @GetMapping("/download")
//    public ResponseEntity<Resource> downloadAttendanceExcel(@RequestParam Long classId,
//                                                            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate startDate,
//                                                            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate endDate) {
//        List<AttendanceResponse> attendanceList = getClassAttendance(classId, startDate, endDate);
//
//        // Create the Excel workbook and sheet
//        Workbook workbook = new XSSFWorkbook();
//        Sheet sheet = workbook.createSheet("Attendance");
//
//        // Create the header row
//        Row headerRow = sheet.createRow(0);
//        headerRow.createCell(0).setCellValue("ID");
//        headerRow.createCell(1).setCellValue("Student ID");
//        headerRow.createCell(2).setCellValue("Student Name");
//        headerRow.createCell(3).setCellValue("Class");
//        headerRow.createCell(4).setCellValue("Attendance Date");
//        headerRow.createCell(5).setCellValue("Status");
//
//        // Create the data rows
//        int rowNum = 1;
//        for (AttendanceResponse attendance : attendanceList) {
//            Row dataRow = sheet.createRow(rowNum++);
//            dataRow.createCell(0).setCellValue(attendance.getId());
//            dataRow.createCell(1).setCellValue(attendance.getStudentId());
//            dataRow.createCell(2).setCellValue(attendance.getStudentName());
//            dataRow.createCell(3).setCellValue(attendance.getClassName());
//            dataRow.createCell(4).setCellValue(attendance.getAttendanceDate().toString());
//            dataRow.createCell(5).setCellValue(attendance.isPresent() ? "Present" : "Absent");
//        }
//
//        // Set the response headers
//        HttpHeaders headers = new HttpHeaders();
//        headers.setContentType(MediaType.APPLICATION_OCTET_STREAM);
//        headers.setContentDispositionFormData("attachment", "attendance.xlsx");
//
//        // Convert the workbook to a byte array
//        ByteArrayOutputStream bos = new ByteArrayOutputStream();
//        try {
//            workbook.write(bos);
//        } catch (IOException e) {
//            // Handle the exception
//            e.printStackTrace();
//        }
//
//        // Return the Excel file as a resource
//        byte[] fileBytes = bos.toByteArray();
//        ByteArrayResource resource = new ByteArrayResource(fileBytes);
//        return new ResponseEntity<>(resource, headers, HttpStatus.OK);
//    }

    @GetMapping("/download")
    public ResponseEntity<byte[]> getClassAttendanceReport(@RequestParam Long classId, @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate startDate, @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate endDate) {
        List<Attendance> attendanceList = attendanceRepository.findByClassesIdAndAttendanceDateBetween(classId, startDate, endDate);

        // Calculate attendance statistics for each student
        Map<Long, Integer> studentTotalClassesMap = new HashMap<>();
        Map<Long, Integer> studentAbsenceCountMap = new HashMap<>();
        Map<Long, Integer> studentPresenceCountMap = new HashMap<>();

        for (Attendance attendance : attendanceList) {
            Long studentId = attendance.getStudent().getId();
            boolean isPresent = attendance.isPresent();

            // Increment total classes count for the student
            studentTotalClassesMap.put(studentId, studentTotalClassesMap.getOrDefault(studentId, 0) + 1);

            // Increment absence or presence count for the student
            if (isPresent) {
                studentPresenceCountMap.put(studentId, studentPresenceCountMap.getOrDefault(studentId, 0) + 1);
            } else {
                studentAbsenceCountMap.put(studentId, studentAbsenceCountMap.getOrDefault(studentId, 0) + 1);
            }
        }

        // Generate the Excel report
        try (Workbook workbook = new XSSFWorkbook()) {
            Sheet sheet = workbook.createSheet("Attendance Report");
            int rowNum = 0;

            // Create header row
            Row headerRow = sheet.createRow(rowNum++);
            headerRow.createCell(0).setCellValue("Student ID");
            headerRow.createCell(1).setCellValue("Student Name");
            headerRow.createCell(2).setCellValue("Total Classes");
            headerRow.createCell(3).setCellValue("Absence Count");
            headerRow.createCell(4).setCellValue("Presence Count");
            headerRow.createCell(5).setCellValue("Attendance Percentage");

            // Create data rows
            for (Long studentId : studentTotalClassesMap.keySet()) {
                Students students = studentsRepository.findById(studentId).get();
                Row dataRow = sheet.createRow(rowNum++);
                dataRow.createCell(0).setCellValue(studentId);
                dataRow.createCell(1).setCellValue(students.getName()); // Replace with actual student name
                dataRow.createCell(2).setCellValue(studentTotalClassesMap.get(studentId));
                dataRow.createCell(3).setCellValue(studentAbsenceCountMap.getOrDefault(studentId, 0));
                dataRow.createCell(4).setCellValue(studentPresenceCountMap.getOrDefault(studentId, 0));

                int totalClasses = studentTotalClassesMap.get(studentId);
                int absenceCount = studentAbsenceCountMap.getOrDefault(studentId, 0);
                double attendancePercentage = ((totalClasses - absenceCount) / (double) totalClasses) * 100;

                dataRow.createCell(5).setCellValue(attendancePercentage);
            }

            // Auto-size columns
            for (int i = 0; i < 6; i++) {
                sheet.autoSizeColumn(i);
            }

            // Convert workbook to byte array
            ByteArrayOutputStream outputStream = new ByteArrayOutputStream();
            workbook.write(outputStream);

            // Set response headers
            HttpHeaders headers = new HttpHeaders();
            headers.setContentType(MediaType.APPLICATION_OCTET_STREAM);
            headers.setContentDisposition(ContentDisposition.attachment().filename("attendance_report.xlsx").build());

            // Return the byte array as the response
            return new ResponseEntity<>(outputStream.toByteArray(), headers, HttpStatus.OK);
        } catch (IOException e) {
            e.printStackTrace();
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }

}

