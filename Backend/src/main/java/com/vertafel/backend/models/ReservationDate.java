package com.vertafel.backend.models;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotEmpty;
import jakarta.validation.constraints.NotNull;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter@Setter
@AllArgsConstructor
@NoArgsConstructor
public class ReservationDate {
    @NotNull@NotEmpty@NotBlank
    private String date;
    @NotNull@NotEmpty@NotBlank
    private Integer number;
    @NotNull@NotEmpty@NotBlank
    private String qrKey;
}
