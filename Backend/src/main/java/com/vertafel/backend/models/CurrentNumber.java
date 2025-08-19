package com.vertafel.backend.models;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.Setter;
import org.springframework.data.mongodb.core.mapping.Document;



@Getter
@Setter
@AllArgsConstructor
@Document(collection = "CurrentNumber")
public class CurrentNumber {

    @NotBlank
    private String date;
    @NotNull
    private Integer number;

}
