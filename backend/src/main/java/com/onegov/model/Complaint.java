package com.onegov.model;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class Complaint {
    private String complaintId;
    private String userId;
    private String trackingId;
    private String type;
    private String category;
    private String description;
    private String status; // submitted, assigned, in_progress, resolved, closed
    private String priority; // low, medium, high
    private String assignedTo;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
    private String resolution;
    private LocalDateTime resolvedAt;
}
