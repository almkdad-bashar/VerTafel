package com.vertafel.backend.controllers;

import com.google.gson.Gson;
import com.google.gson.GsonBuilder;
import com.vertafel.backend.models.ExtendTafelContracts;
import com.vertafel.backend.models.User;
import com.vertafel.backend.payload.request.BasicRequest;
import com.vertafel.backend.payload.request.ChangePasswordRequest;
import com.vertafel.backend.payload.request.GetUserDetailRequest;
import com.vertafel.backend.payload.request.UpdateUserRequest;
import com.vertafel.backend.payload.response.JwtResponse;
import com.vertafel.backend.services.ProfileService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.mongodb.core.MongoTemplate;
import org.springframework.data.mongodb.core.query.Criteria;
import org.springframework.data.mongodb.core.query.Query;
import org.springframework.data.mongodb.core.query.Update;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

@CrossOrigin(origins = "*", maxAge = 3600)
@RestController
@RequestMapping("/api/v1/user")
public class ProfileController {
    @Autowired
    private MongoTemplate mongoTemplate;
    @Autowired
    private ProfileService profileService;
    @Autowired
    PasswordEncoder encoder;

    @PostMapping("/getUserByEmail")
    public ResponseEntity<Object> getUserDetailByEmail(@RequestBody GetUserDetailRequest request) {
        User user = profileService.getUserByEmail(request.getEmail());
        return new ResponseEntity<>(new GsonBuilder()
                .excludeFieldsWithoutExposeAnnotation()
                .create()
                .toJson(user), HttpStatus.OK);
    }

    @PostMapping("/getUserByUsername")
    public ResponseEntity<Object> getUserDetailByUsername(@RequestBody GetUserDetailRequest request) {
        User user = profileService.getUserByUsername(request.getUsername());
        return new ResponseEntity<>(new GsonBuilder()
                .excludeFieldsWithoutExposeAnnotation()
                .create()
                .toJson(user), HttpStatus.OK);
    }

    @PostMapping("/getUserListByBirthDate")
    public ResponseEntity<Object> getUserListByBirthDate(@RequestBody GetUserDetailRequest request) {
        List<User> userList = profileService.getUserByBirthDate(request.getBirthDate());
        return new ResponseEntity<>(new GsonBuilder()
                .excludeFieldsWithoutExposeAnnotation()
                .create()
                .toJson(userList), HttpStatus.OK);
    }

    @PutMapping("/username")
    public ResponseEntity<String> updateAttribute(@RequestBody UpdateUserRequest request) {
        String email = request.getJwtResponse().getEmail();
        Query query = new Query().addCriteria(Criteria.where("email").is(email));
        Update update = new Update();
        update.set("username", request.getNewValue());
        mongoTemplate.updateFirst(query, update, User.class);
        return new ResponseEntity<>("successful", HttpStatus.OK);
    }

    @PutMapping("/firstname")
    public ResponseEntity<String> updateFirstname(@RequestBody UpdateUserRequest request) {
        String email = request.getJwtResponse().getEmail();
        Query query = new Query().addCriteria(Criteria.where("email").is(email));
        Update update = new Update();
        update.set("firstname", request.getNewValue());
        mongoTemplate.updateFirst(query, update, User.class);
        return new ResponseEntity<>("successful", HttpStatus.OK);
    }

    @PutMapping("/lastname")
    public ResponseEntity<String> updateLastname(@RequestBody UpdateUserRequest request) {
        String email = request.getJwtResponse().getEmail();
        Query query = new Query().addCriteria(Criteria.where("email").is(email));
        Update update = new Update();
        update.set("lastname", request.getNewValue());
        mongoTemplate.updateFirst(query, update, User.class);
        return new ResponseEntity<>("successful", HttpStatus.OK);
    }

    @PutMapping("/password")
    public ResponseEntity<String> updatePassword(@RequestBody UpdateUserRequest request) {
        String email = request.getJwtResponse().getEmail();
        Query query = new Query().addCriteria(Criteria.where("email").is(email));
        Update update = new Update();
        update.set("password", request.getNewValue());
        mongoTemplate.updateFirst(query, update, User.class);
        return new ResponseEntity<>("successful", HttpStatus.OK);
    }

    @PutMapping("/email")
    public ResponseEntity<String> updateEmail(@RequestBody UpdateUserRequest request) {
        String email = request.getJwtResponse().getEmail();
        Query query = new Query().addCriteria(Criteria.where("email").is(email));
        Update update = new Update();
        update.set("email", request.getNewValue());
        mongoTemplate.updateFirst(query, update, User.class);
        return new ResponseEntity<>("successful", HttpStatus.OK);
    }

    @PutMapping("/adultNumber")
    public ResponseEntity<String> updateAdultNumber(@RequestBody UpdateUserRequest request) {
        String email = request.getJwtResponse().getEmail();
        Query query = new Query().addCriteria(Criteria.where("email").is(email));
        Update update = new Update();
        update.set("adultNumber", request.getNewValue());
        mongoTemplate.updateFirst(query, update, User.class);
        return new ResponseEntity<>("successful", HttpStatus.OK);
    }

    @PutMapping("/childrenNumber")
    public ResponseEntity<String> updateChildrenNumber(@RequestBody UpdateUserRequest request) {
        String email = request.getJwtResponse().getEmail();
        Query query = new Query().addCriteria(Criteria.where("email").is(email));
        Update update = new Update();
        update.set("childrenNumber", request.getNewValue());
        mongoTemplate.updateFirst(query, update, User.class);
        return new ResponseEntity<>("successful", HttpStatus.OK);
    }

    @PutMapping("/expiryDate")
    public ResponseEntity<String> updateExpiryDate(@RequestBody UpdateUserRequest request) {
        String email = request.getJwtResponse().getEmail();
        Query query = new Query().addCriteria(Criteria.where("email").is(email));
        Update update = new Update();
        update.set("expiryDate", request.getNewValue());
        mongoTemplate.updateFirst(query, update, User.class);
        return new ResponseEntity<>("successful", HttpStatus.OK);
//        todo: add the body of JWT, Image of proof for Tafel, username as arguements
    }

    @PostMapping("/changePassword")
    public ResponseEntity<Map<String, Object>> changePassword(@RequestBody ChangePasswordRequest request) {
        ResponseEntity<Map<String, Object>> result;
        String email = request.getJwtResponse().getEmail();
        String oldPassword = request.getOldPassword();
        String newPassword = request.getNewPassword();
        Query query = new Query().addCriteria(Criteria.where("email").is(email));
        User user = mongoTemplate.findOne(query, User.class);
        if (user == null) {
            return new ResponseEntity<>(new HashMap<>() {{
                put("message", "user is not found");
            }},
                    HttpStatus.BAD_REQUEST);
        }
        if (!encoder.matches(oldPassword, user.getPassword())) {
            return new ResponseEntity<>(new HashMap<>() {{
                put("message", "old password is not correct");
            }},
                    HttpStatus.BAD_REQUEST);
        }
        user.setPassword(encoder.encode(newPassword));
        Update update = new Update();
        update.set("password", encoder.encode(newPassword));
        mongoTemplate.upsert(query, update, User.class);
        return new ResponseEntity<>(new HashMap<>() {{
            put("message", "password is successfully changed!");
        }},
                HttpStatus.OK);
    }


    @PostMapping(value = "/extendTafelId")
    public ResponseEntity<Map<String, Object>> extendTafelId(
            @RequestParam(value = "file", required = false) MultipartFile file,
            @RequestParam("adultNumber") int adultNumber,
            @RequestParam("childrenNumber") int childrenNumber,
            @RequestParam("jwtResponse") String jwtResponseJson) {
        try {
            JwtResponse jwtResponse = new GsonBuilder().create().fromJson(jwtResponseJson, JwtResponse.class);
            ExtendTafelContracts contract = new ExtendTafelContracts();
            contract.setFileName(file.getOriginalFilename());
            contract.setFileType(file.getContentType());
            contract.setFile(file.getBytes());
            contract.setAdultNumber(adultNumber);
            contract.setChildrenNumber(childrenNumber);
            mongoTemplate.insert(contract);
            return new ResponseEntity<>(new HashMap<>() {{
                put("message", "The contract is successfully submitted");
            }},
                    HttpStatus.OK);
        } catch (Exception exp) {
            return new ResponseEntity<>(new HashMap<>() {{
                put("message", "bad request");
            }},
                    HttpStatus.BAD_REQUEST);
        }
    }
    @PostMapping("/getUserInfo")
    public ResponseEntity<String> getUserInfo(@RequestBody BasicRequest request) {
        String email = request.getJwtResponse().getEmail();
        Query query = new Query().addCriteria(Criteria.where("email").is(email));
        User user = mongoTemplate.findOne(query, User.class);
        return new ResponseEntity<>(new Gson().toJson(user).toString(), HttpStatus.OK);
    }
}
