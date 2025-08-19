package com.vertafel.backend.models;


import jakarta.validation.constraints.NotEmpty;
import jakarta.validation.constraints.NotNull;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import org.springframework.data.mongodb.core.mapping.Document;

import java.util.List;


@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
@Document(collection = "AvailableNumbers")
public class AvailableNumber {

    @NotEmpty @NotNull
    private Integer totalNumber;
    @NotEmpty @NotNull
    private String date;
    private List<Integer> numbers;

}

