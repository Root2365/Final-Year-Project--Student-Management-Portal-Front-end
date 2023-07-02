package com.meinsms.backend.payload.request;

import lombok.Data;

import java.util.Set;

import javax.validation.constraints.*;

@Data
public class SignupRequest {
    @NotBlank
    @Size(min = 3, max = 20)
    private String username;

    @NotBlank
    @Size(max = 50)
    private String name;

    @NotBlank
    @Size(max = 50)
    private String email;

    @NotBlank
    @Size(max = 20)
    private String phone;

    private int type;

    private Set<String> role;

    @NotBlank
    @Size(min = 6, max = 40)
    private String password;
}
