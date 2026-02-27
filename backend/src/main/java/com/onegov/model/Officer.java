package com.onegov.model;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class Officer {
    private String officerId;
    private String email;
    private String password; // Hashed
    private String name;
    private String phone;
    private String department; // health, education, revenue, transport, utility, general
    private String designation;
    private String role; // officer, senior-officer, head
    private String status; // active, inactive
    private String createdBy; // admin ID
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
    private Performance performance;

    @Data
    @NoArgsConstructor
    @AllArgsConstructor
    public static class Performance {
        private int totalProcessed;
        private double avgResponseTime;
        private double rating;
    }
}
