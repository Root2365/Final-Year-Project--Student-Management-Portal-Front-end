package com.meinsms.backend.payload.request;

import lombok.Data;

@Data
public class StudentAddToClassRequest {
    private long studentId;
    private String  classCode;
}
