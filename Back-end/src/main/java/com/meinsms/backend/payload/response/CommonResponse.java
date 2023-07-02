package com.meinsms.backend.payload.response;

import com.fasterxml.jackson.annotation.JsonInclude;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.Setter;

import java.util.List;

@Setter
@Getter
@AllArgsConstructor
public class CommonResponse {
    private boolean status;
    private String message;
    private Object data;
    @JsonInclude(JsonInclude.Include.NON_NULL)
    private Object error;

    public CommonResponse(boolean status, String message, Object data) {
        this.status = status;
        this.message = message;
        this.data = data;
    }
}

