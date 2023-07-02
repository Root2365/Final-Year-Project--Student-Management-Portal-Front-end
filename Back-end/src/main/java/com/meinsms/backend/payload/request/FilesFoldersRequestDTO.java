package com.meinsms.backend.payload.request;

import lombok.Data;

@Data
public class FilesFoldersRequestDTO {
    private Long student_id;
    private Long teacher_id;
    private String type;
    private String status;
    private boolean important;
    private boolean allowed;
    private boolean isParent;
    private boolean isRoot;
    private Long parent_id;
    private Long category_id;
    private String name;
}
