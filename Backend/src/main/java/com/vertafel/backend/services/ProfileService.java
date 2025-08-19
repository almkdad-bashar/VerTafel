package com.vertafel.backend.services;
import com.vertafel.backend.models.User;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.mongodb.core.MongoTemplate;
import org.springframework.data.mongodb.core.query.Criteria;
import org.springframework.data.mongodb.core.query.Query;

import java.util.List;

public class ProfileService {


    @Autowired
    MongoTemplate mongoTemplate;
    public User getUserByEmail(String email){
       return mongoTemplate.findOne(new Query().addCriteria(Criteria.where("email").is(email)), User.class);
    }

    public List<User> getUserByBirthDate(String birthDate) {
        return mongoTemplate.find(new Query().addCriteria(Criteria.where("birthDate").is(birthDate)), User.class);
    }

    public User getUserByUsername(String username) {
        return mongoTemplate.findOne(new Query().addCriteria(Criteria.where("username").is(username)), User.class);
    }
}
