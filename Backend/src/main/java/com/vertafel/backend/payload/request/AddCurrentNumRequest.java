package com.vertafel.backend.payload.request;

import com.vertafel.backend.payload.response.JwtResponse;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.Setter;

@Getter@Setter@AllArgsConstructor
public class AddCurrentNumRequest {

    @NotBlank
    private String date;
    @NotBlank
    private Integer currentNumber;
    @NotNull
    private JwtResponse jwtResponse;

}
