package com.meinsms.backend.payload.request;

import lombok.Data;

@Data
public class ActivityCreateRequest {
    private String title;
    private byte[] filePath;
    private String type;
    private String description;
    private Long activityDate;
    private Long cid;
}
