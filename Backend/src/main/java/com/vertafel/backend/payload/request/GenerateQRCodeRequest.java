package com.vertafel.backend.payload.request;

import com.vertafel.backend.payload.response.JwtResponse;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotEmpty;
import jakarta.validation.constraints.NotNull;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.Setter;

@Setter@Getter@AllArgsConstructor
public class GenerateQRCodeRequest {

    @NotBlank@NotNull@NotEmpty
    private String qrkey;
        @NotNull
    private JwtResponse jwtResponse;

}
