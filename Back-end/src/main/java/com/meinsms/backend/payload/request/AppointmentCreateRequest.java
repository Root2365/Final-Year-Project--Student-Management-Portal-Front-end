package com.meinsms.backend.payload.request;

import lombok.Data;

@Data
public class AppointmentCreateRequest {
    private String title;
    private Long start;
    private Long end;
    private String status;
    private Long tid;
    private Long sid;
    private Long cid;
}
