package com.meinsms.backend.payload.request;

import lombok.Data;

@Data
public class RatingCreateRequest {
    private String positive;
    private String negative;
    private Long sid;
    private Long rcid;
    private Long cid;
}
