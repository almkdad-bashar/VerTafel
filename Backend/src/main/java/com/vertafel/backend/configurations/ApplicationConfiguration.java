package com.vertafel.backend.configurations;

import com.mongodb.client.MongoClients;
import com.vertafel.backend.services.MessageService;
import com.vertafel.backend.services.ReservationService;
import com.vertafel.backend.services.ProfileService;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.data.mongodb.core.MongoTemplate;
import org.springframework.web.multipart.MultipartResolver;
import org.springframework.web.multipart.support.StandardServletMultipartResolver;

@Configuration
class ApplicationConfiguration {
    @Bean
    public MongoTemplate mongoTemplate() {
        return new MongoTemplate(MongoClients.create("mongodb://localhost:27017/"), "VerTafelDB");
    }
    @Bean
    public ProfileService userService() {
        return new ProfileService();
    }
    @Bean
    public ReservationService reservationService() {
        return new ReservationService();
    }
    @Bean
    public MessageService messageService() {
        return new MessageService();
    }

    @Bean
    public MultipartResolver multipartResolver() {
        return new StandardServletMultipartResolver();
    }

}