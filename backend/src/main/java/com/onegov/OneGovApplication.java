package com.onegov;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;

@SpringBootApplication
public class OneGovApplication {
    public static void main(String[] args) {
        SpringApplication.run(OneGovApplication.class, args);
        System.out.println("🚀 OneGov Backend is running on http://localhost:8080");
    }
}
