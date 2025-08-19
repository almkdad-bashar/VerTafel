package com.vertafel.backend.models;

import jakarta.validation.constraints.Max;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotBlank;
import lombok.*;

import java.io.Serializable;

@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
public class Configuration implements Serializable {
    @NotBlank
    private long waitingUnit;
    @Min(1)
    @Max(5)
    @NotBlank
    private int repeatsAWeek;
    @NotBlank
    private String startSellingTime;
    @NotBlank
    private String deleteReservationDeadline;
}
