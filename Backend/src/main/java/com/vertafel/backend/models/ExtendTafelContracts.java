package com.vertafel.backend.models;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import org.springframework.data.mongodb.core.mapping.Document;

@Document(collection = "ExtendTafelContracts")

@Getter@Setter@AllArgsConstructor
@NoArgsConstructor
public class ExtendTafelContracts {

    @NotBlank@NotNull
    private String fileName;
    @NotBlank@NotNull
    private String fileType;
    @NotBlank@NotNull
    private byte[] file;
    @NotBlank@NotNull
    private int adultNumber;
    @NotBlank@NotNull
    private int childrenNumber;
}
