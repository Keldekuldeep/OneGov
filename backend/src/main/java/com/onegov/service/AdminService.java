package com.onegov.service;

import com.google.cloud.firestore.DocumentSnapshot;
import com.onegov.exception.ResourceNotFoundException;
import com.onegov.model.Officer;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.*;
import java.util.concurrent.ExecutionException;

@Service
public class AdminService {

    @Autowired
    private FirebaseService firebaseService;

    @Autowired
    private PasswordEncoder passwordEncoder;

    private static final String OFFICERS_COLLECTION = "officers";
    private static final String ADMINS_COLLECTION = "admins";
    private static final String USERS_COLLECTION = "users";
    private static final String HEALTH_SERVICES_COLLECTION = "healthServices";
    private static final String APPLICATIONS_COLLECTION = "applications";
    private static final String COMPLAINTS_COLLECTION = "complaints";
    private static final String DOCUMENTS_COLLECTION = "documents";

    // Get System Dashboard Statistics
    public Map<String, Object> getSystemStats() throws ExecutionException, InterruptedException {
        Map<String, Object> stats = new HashMap<>();

        // Count collections
        List<DocumentSnapshot> officers = firebaseService.getAllDocuments(OFFICERS_COLLECTION);
        List<DocumentSnapshot> citizens = firebaseService.getAllDocuments(USERS_COLLECTION);
        List<DocumentSnapshot> applications = firebaseService.getAllDocuments(APPLICATIONS_COLLECTION);
        List<DocumentSnapshot> complaints = firebaseService.getAllDocuments(COMPLAINTS_COLLECTION);
        List<DocumentSnapshot> healthServices = firebaseService.getAllDocuments(HEALTH_SERVICES_COLLECTION);

        // Count by status
        long pendingApplications = applications.stream()
                .filter(doc -> "submitted".equals(doc.getString("status")))
                .count();
        
        long pendingComplaints = complaints.stream()
                .filter(doc -> "pending".equals(doc.getString("status")))
                .count();

        long resolvedComplaints = complaints.stream()
                .filter(doc -> "resolved".equals(doc.getString("status")))
                .count();

        stats.put("totalOfficers", officers.size());
        stats.put("totalCitizens", citizens.size());
        stats.put("totalApplications", applications.size());
        stats.put("pendingApplications", pendingApplications);
        stats.put("totalComplaints", complaints.size());
        stats.put("pendingComplaints", pendingComplaints);
        stats.put("resolvedComplaints", resolvedComplaints);
        stats.put("totalHealthServices", healthServices.size());

        return stats;
    }

    // Get All Officers
    public List<Map<String, Object>> getAllOfficers() throws ExecutionException, InterruptedException {
        List<DocumentSnapshot> docs = firebaseService.getAllDocuments(OFFICERS_COLLECTION);
        List<Map<String, Object>> officers = new ArrayList<>();

        for (DocumentSnapshot doc : docs) {
            if (doc.exists()) {
                Map<String, Object> officer = doc.getData();
                officer.remove("password"); // Don't send password
                officers.add(officer);
            }
        }

        return officers;
    }

    // Get Officer by ID
    public Map<String, Object> getOfficerById(String officerId) throws ExecutionException, InterruptedException {
        DocumentSnapshot doc = firebaseService.getDocument(OFFICERS_COLLECTION, officerId);
        
        if (!doc.exists()) {
            throw new ResourceNotFoundException("Officer not found");
        }

        Map<String, Object> officer = doc.getData();
        officer.remove("password"); // Don't send password
        return officer;
    }

    // Create Officer
    public Map<String, Object> createOfficer(Map<String, Object> officerData) 
            throws ExecutionException, InterruptedException {
        
        String email = (String) officerData.get("email");
        
        // Check if officer already exists
        var existingOfficers = firebaseService.queryDocuments(OFFICERS_COLLECTION, "email", email);
        if (!existingOfficers.isEmpty()) {
            throw new RuntimeException("Officer with this email already exists");
        }

        // Generate officer ID
        String officerId = "officer-" + UUID.randomUUID().toString().substring(0, 8);
        
        // Hash password
        String password = (String) officerData.get("password");
        String hashedPassword = passwordEncoder.encode(password);

        // Prepare officer data
        Map<String, Object> officer = new HashMap<>();
        officer.put("officerId", officerId);
        officer.put("name", officerData.get("name"));
        officer.put("email", email);
        officer.put("password", hashedPassword);
        officer.put("phone", officerData.get("phone"));
        officer.put("department", officerData.get("department"));
        officer.put("designation", officerData.get("designation"));
        officer.put("role", officerData.getOrDefault("role", "officer"));
        officer.put("status", "active");
        officer.put("createdBy", officerData.get("createdBy"));
        officer.put("createdAt", LocalDateTime.now().toString());
        officer.put("updatedAt", LocalDateTime.now().toString());

        // Performance data
        Map<String, Object> performance = new HashMap<>();
        performance.put("totalProcessed", 0);
        performance.put("avgResponseTime", 0.0);
        performance.put("rating", 0.0);
        officer.put("performance", performance);

        // Save to Firestore
        firebaseService.createDocument(OFFICERS_COLLECTION, officerId, officer);

        // Return without password
        officer.remove("password");
        return officer;
    }

    // Update Officer
    public Map<String, Object> updateOfficer(String officerId, Map<String, Object> updates) 
            throws ExecutionException, InterruptedException {
        
        DocumentSnapshot doc = firebaseService.getDocument(OFFICERS_COLLECTION, officerId);
        
        if (!doc.exists()) {
            throw new ResourceNotFoundException("Officer not found");
        }

        // Remove fields that shouldn't be updated directly
        updates.remove("officerId");
        updates.remove("password");
        updates.remove("createdAt");
        updates.remove("createdBy");
        
        updates.put("updatedAt", LocalDateTime.now().toString());

        firebaseService.updateDocument(OFFICERS_COLLECTION, officerId, updates);

        // Return updated officer
        DocumentSnapshot updated = firebaseService.getDocument(OFFICERS_COLLECTION, officerId);
        Map<String, Object> officer = updated.getData();
        officer.remove("password");
        return officer;
    }

    // Delete Officer
    public void deleteOfficer(String officerId) throws ExecutionException, InterruptedException {
        DocumentSnapshot doc = firebaseService.getDocument(OFFICERS_COLLECTION, officerId);
        
        if (!doc.exists()) {
            throw new ResourceNotFoundException("Officer not found");
        }

        firebaseService.deleteDocument(OFFICERS_COLLECTION, officerId);
    }

    // Get All Citizens
    public List<Map<String, Object>> getAllCitizens() throws ExecutionException, InterruptedException {
        List<DocumentSnapshot> docs = firebaseService.getAllDocuments(USERS_COLLECTION);
        List<Map<String, Object>> citizens = new ArrayList<>();

        for (DocumentSnapshot doc : docs) {
            if (doc.exists()) {
                Map<String, Object> citizen = doc.getData();
                citizen.remove("password"); // Don't send password
                citizens.add(citizen);
            }
        }

        return citizens;
    }

    // Block/Unblock Citizen
    public Map<String, Object> updateCitizenStatus(String userId, String status) 
            throws ExecutionException, InterruptedException {
        
        DocumentSnapshot doc = firebaseService.getDocument(USERS_COLLECTION, userId);
        
        if (!doc.exists()) {
            throw new ResourceNotFoundException("Citizen not found");
        }

        Map<String, Object> updates = new HashMap<>();
        updates.put("status", status);
        updates.put("updatedAt", LocalDateTime.now().toString());

        firebaseService.updateDocument(USERS_COLLECTION, userId, updates);

        // Return updated citizen
        DocumentSnapshot updated = firebaseService.getDocument(USERS_COLLECTION, userId);
        Map<String, Object> citizen = updated.getData();
        citizen.remove("password");
        return citizen;
    }

    // Get All Applications (Admin view)
    public List<Map<String, Object>> getAllApplications() throws ExecutionException, InterruptedException {
        List<DocumentSnapshot> docs = firebaseService.getAllDocuments(APPLICATIONS_COLLECTION);
        List<Map<String, Object>> applications = new ArrayList<>();

        for (DocumentSnapshot doc : docs) {
            if (doc.exists()) {
                applications.add(doc.getData());
            }
        }

        return applications;
    }

    // Get All Complaints (Admin view)
    public List<Map<String, Object>> getAllComplaints() throws ExecutionException, InterruptedException {
        List<DocumentSnapshot> docs = firebaseService.getAllDocuments(COMPLAINTS_COLLECTION);
        List<Map<String, Object>> complaints = new ArrayList<>();

        for (DocumentSnapshot doc : docs) {
            if (doc.exists()) {
                complaints.add(doc.getData());
            }
        }

        return complaints;
    }
}
