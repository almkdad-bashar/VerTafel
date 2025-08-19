package com.vertafel.backend.payload.request;

import com.vertafel.backend.payload.response.JwtResponse;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.Getter;
import lombok.Setter;

import java.util.List;

@Getter@Setter
public class SendMessageRequest {
    @NotBlank
    private String content;
    @NotBlank
    private String subject;
    @NotBlank
    private List<String> recipients;
    @NotNull
    private JwtResponse jwtResponse;

}
