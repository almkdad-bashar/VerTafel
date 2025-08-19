package com.vertafel.backend.payload.request;

import com.vertafel.backend.payload.response.JwtResponse;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.Setter;

import java.util.List;

@Getter@Setter@AllArgsConstructor
public class ChangePasswordRequest {
    @NotBlank
    private String oldPassword;
    @NotBlank
    private String newPassword;
    @NotNull
    private JwtResponse jwtResponse;
}
