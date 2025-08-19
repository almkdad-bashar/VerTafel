package com.vertafel.backend.payload.request;

import com.vertafel.backend.payload.response.JwtResponse;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.Getter;
import lombok.Setter;

@Getter@Setter
public class BasicRequest {

    @NotBlank
    private String date;
    @NotNull
    private JwtResponse jwtResponse;
}
