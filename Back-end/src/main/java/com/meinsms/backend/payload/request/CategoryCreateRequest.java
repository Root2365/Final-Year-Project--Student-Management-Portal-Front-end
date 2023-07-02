package com.meinsms.backend.payload.request;

import lombok.Data;

import java.util.List;

@Data
public class CategoryCreateRequest {
    private String name;
    private List<Integer> classIds;
    private Long teacherId;
}
