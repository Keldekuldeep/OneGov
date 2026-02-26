package com.onegov.service;

import com.google.cloud.firestore.DocumentSnapshot;
import com.onegov.dto.request.ApplicationRequest;
import com.onegov.exception.ResourceNotFoundException;
import com.onegov.model.Application;
import com.onegov.model.OfficerInfo;
import com.onegov.model.TimelineEntry;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.*;
import java.util.concurrent.ExecutionException;
import java.util.stream.Collectors;

@Service
public class ApplicationService {

    @Autowired
    private FirebaseService firebaseService;

    private static final String APPLICATIONS_COLLECTION = "applications";

    public Application submitApplication(ApplicationRequest request) throws ExecutionException, InterruptedException {
        String applicationId = UUID.randomUUID().toString();
        String trackingId = "APP" + System.currentTimeMillis();

        Application application = new Application();
        application.setApplicationId(applicationId);
        application.setUserId(request.getUserId());
        application.setTrackingId(trackingId);
        application.setSchemeName(request.getSchemeName());
        application.setSchemeId(request.getSchemeId());
        application.setStatus("submitted");
        application.setSubmittedAt(LocalDateTime.now());
        application.setUpdatedAt(LocalDateTime.now());
        application.setDocuments(request.getDocuments() != null ? request.getDocuments() : new ArrayList<>());
        application.setFormData(request.getFormData() != null ? request.getFormData() : new HashMap<>());

        // Create initial timeline
        List<TimelineEntry> timeline = new ArrayList<>();
        TimelineEntry initialEntry = new TimelineEntry();
        initialEntry.setStage("Submitted");
        initialEntry.setStatus("completed");
        initialEntry.setTimestamp(LocalDateTime.now());
        initialEntry.setOfficer(new OfficerInfo("System", "system"));
        timeline.add(initialEntry);
        application.setTimeline(timeline);

        // Save to Firestore
        Map<String, Object> appData = convertToMap(application);
        firebaseService.createDocument(APPLICATIONS_COLLECTION, applicationId, appData);

        return application;
    }

    public Application getApplicationById(String applicationId) throws ExecutionException, InterruptedException {
        DocumentSnapshot doc = firebaseService.getDocument(APPLICATIONS_COLLECTION, applicationId);
        
        if (!doc.exists()) {
            throw new ResourceNotFoundException("Application not found");
        }

        return convertToApplication(doc);
    }

    public Application getApplicationByTrackingId(String trackingId) throws ExecutionException, InterruptedException {
        var docs = firebaseService.queryDocuments(APPLICATIONS_COLLECTION, "trackingId", trackingId);
        
        if (docs.isEmpty()) {
            throw new ResourceNotFoundException("Application not found");
        }

        return convertToApplication(docs.get(0));
    }

    public List<Application> getUserApplications(String userId) throws ExecutionException, InterruptedException {
        var docs = firebaseService.queryDocuments(APPLICATIONS_COLLECTION, "userId", userId);
        
        return docs.stream()
                .map(this::convertToApplication)
                .collect(Collectors.toList());
    }

    public Application updateApplicationStatus(String applicationId, String status, String officerName, String officerId) 
            throws ExecutionException, InterruptedException {
        Application application = getApplicationById(applicationId);
        
        application.setStatus(status);
        application.setUpdatedAt(LocalDateTime.now());

        // Add timeline entry
        TimelineEntry entry = new TimelineEntry();
        entry.setStage(getStageFromStatus(status));
        entry.setStatus("completed");
        entry.setTimestamp(LocalDateTime.now());
        entry.setOfficer(new OfficerInfo(officerName, officerId));
        
        List<TimelineEntry> timeline = application.getTimeline();
        if (timeline == null) {
            timeline = new ArrayList<>();
        }
        timeline.add(entry);
        application.setTimeline(timeline);

        // Update in Firestore
        Map<String, Object> updates = new HashMap<>();
        updates.put("status", status);
        updates.put("updatedAt", LocalDateTime.now().toString());
        updates.put("timeline", convertTimelineToMap(timeline));

        firebaseService.updateDocument(APPLICATIONS_COLLECTION, applicationId, updates);

        return application;
    }

    private String getStageFromStatus(String status) {
        switch (status.toLowerCase()) {
            case "submitted": return "Submitted";
            case "verified": return "Verified";
            case "under_review": return "Under Review";
            case "approved": return "Approved";
            case "rejected": return "Rejected";
            default: return "Processing";
        }
    }

    private Map<String, Object> convertToMap(Application app) {
        Map<String, Object> map = new HashMap<>();
        map.put("applicationId", app.getApplicationId());
        map.put("userId", app.getUserId());
        map.put("trackingId", app.getTrackingId());
        map.put("schemeName", app.getSchemeName());
        map.put("schemeId", app.getSchemeId());
        map.put("status", app.getStatus());
        map.put("submittedAt", app.getSubmittedAt().toString());
        map.put("updatedAt", app.getUpdatedAt().toString());
        map.put("documents", app.getDocuments());
        map.put("formData", app.getFormData());
        map.put("timeline", convertTimelineToMap(app.getTimeline()));
        return map;
    }

    private List<Map<String, Object>> convertTimelineToMap(List<TimelineEntry> timeline) {
        return timeline.stream().map(entry -> {
            Map<String, Object> map = new HashMap<>();
            map.put("stage", entry.getStage());
            map.put("status", entry.getStatus());
            map.put("timestamp", entry.getTimestamp().toString());
            if (entry.getOfficer() != null) {
                Map<String, String> officer = new HashMap<>();
                officer.put("name", entry.getOfficer().getName());
                officer.put("id", entry.getOfficer().getId());
                map.put("officer", officer);
            }
            return map;
        }).collect(Collectors.toList());
    }

    private Application convertToApplication(DocumentSnapshot doc) {
        Application app = new Application();
        app.setApplicationId(doc.getString("applicationId"));
        app.setUserId(doc.getString("userId"));
        app.setTrackingId(doc.getString("trackingId"));
        app.setSchemeName(doc.getString("schemeName"));
        app.setSchemeId(doc.getString("schemeId"));
        app.setStatus(doc.getString("status"));
        app.setSubmittedAt(LocalDateTime.parse(doc.getString("submittedAt")));
        app.setUpdatedAt(LocalDateTime.parse(doc.getString("updatedAt")));
        app.setDocuments((List<String>) doc.get("documents"));
        app.setFormData((Map<String, Object>) doc.get("formData"));
        // Timeline conversion would go here
        return app;
    }
}
