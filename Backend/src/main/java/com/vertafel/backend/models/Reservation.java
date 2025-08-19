package com.vertafel.backend.models;

import jakarta.validation.constraints.*;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import org.bson.types.ObjectId;
import org.springframework.data.mongodb.core.mapping.Document;

import java.util.List;

@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
@Document(collection = "Reservations")
public class Reservation {
    @NotBlank
    private ObjectId userId;

    @NotNull
    @NotEmpty
    private List<ReservationDate> reservationDateList;

    }
