package com.vertafel.backend.models;

import java.text.ParseException;
import java.text.SimpleDateFormat;
import java.util.Date;
import java.util.HashSet;
import java.util.Set;

import com.google.gson.annotations.Expose;
import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import org.bson.types.ObjectId;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.DBRef;
import org.springframework.data.mongodb.core.mapping.Document;


@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
@Document(collection = "Users")
public class User {
  @Id
  private ObjectId id;

  @NotBlank@Expose
  @Size(max = 20)
  private String username;

  @NotBlank
  @Size(max = 50)
  @Email@Expose
  private String email;

  @NotBlank
  @Size(max = 120)
  private String password;
  @NotBlank@Expose
  private String firstname;
  @NotBlank@Expose
  private String lastname;
  @NotBlank@Expose
  private String birthDate;
  @NotBlank@Expose
  private Integer adultNumber;
  @NotBlank@Expose
  private Integer childrenNumber;
  @NotBlank@Expose
  private String expiryDate;

  @DBRef
  private Set<Role> roles = new HashSet<>();

  public User(String username, String email, String password){
    this.username = username;
    this.password = password;
    this.email = email;
  }

}
