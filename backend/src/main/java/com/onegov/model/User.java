package com.onegov.model;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class User {
    private String userId;
    private String email;
    private String password; // Hashed
    private String name;
    private String phone;
    private String role; // citizen, officer, admin
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
}
