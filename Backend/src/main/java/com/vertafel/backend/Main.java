package com.vertafel.backend;

import org.springframework.boot.CommandLineRunner;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.context.annotation.Bean;
import org.springframework.scheduling.annotation.EnableScheduling;

@EnableScheduling
@SpringBootApplication
public class Main {

	public static void main(String[] args) {

		SpringApplication.run(Main.class, args);

	}

	@Bean
	CommandLineRunner commandLineRunner(){
		return args -> {
//			something to be running after initializing of the beans
			System.out.println("Hello, welcome to VerTafel Backend");

		};

	}

}
