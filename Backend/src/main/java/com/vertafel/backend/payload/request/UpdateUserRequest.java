package com.vertafel.backend.payload.request;

import com.vertafel.backend.payload.response.JwtResponse;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.Setter;

@Getter@Setter@AllArgsConstructor
public class UpdateUserRequest {
    @NotBlank
    private String newValue;
    @NotNull
    private JwtResponse jwtResponse;
}
