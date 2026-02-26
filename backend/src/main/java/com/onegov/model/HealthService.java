package com.onegov.model;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;
import java.util.Map;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class HealthService {
    private String serviceId;
    private String userId;
    private String trackingId;
    private String serviceType; // birth-certificate, death-certificate, health-card, vaccination-certificate
    private String status; // submitted, verified, approved, rejected, issued
    private Map<String, Object> formData;
    private String certificateNumber;
    private LocalDateTime submittedAt;
    private LocalDateTime updatedAt;
    private LocalDateTime issuedAt;
}
