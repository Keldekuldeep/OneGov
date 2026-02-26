package com.onegov.model;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Map;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class Application {
    private String applicationId;
    private String userId;
    private String trackingId;
    private String schemeName;
    private String schemeId;
    private String status; // submitted, verified, under_review, approved, rejected
    private LocalDateTime submittedAt;
    private LocalDateTime updatedAt;
    private List<String> documents;
    private List<TimelineEntry> timeline;
    private Map<String, Object> formData;
}
