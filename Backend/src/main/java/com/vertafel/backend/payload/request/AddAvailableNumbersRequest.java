package com.vertafel.backend.payload.request;

import com.vertafel.backend.payload.response.JwtResponse;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.Setter;

@Getter@Setter
@AllArgsConstructor
public class AddAvailableNumbersRequest {


    @NotBlank
    private String date;
    @NotBlank
    private Integer totalNumber;
    @NotNull
    private JwtResponse jwtResponse;
}

