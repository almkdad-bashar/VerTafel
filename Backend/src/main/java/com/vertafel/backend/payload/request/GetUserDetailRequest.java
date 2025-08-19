package com.vertafel.backend.payload.request;

import com.vertafel.backend.payload.response.JwtResponse;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotEmpty;
import jakarta.validation.constraints.NotNull;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
public class GetUserDetailRequest {
    @NotBlank
    private String email;
    @NotBlank
    private String username;
    @NotBlank
    private String birthDate;
    @NotNull
    private JwtResponse jwtResponse;

}
