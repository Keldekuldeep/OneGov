package com.onegov.service;

import com.google.cloud.firestore.DocumentSnapshot;
import com.google.cloud.firestore.Query;
import com.onegov.exception.ResourceNotFoundException;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.*;
import java.util.concurrent.ExecutionException;

@Service
public class OfficerService {

    @Autowired
    private FirebaseService firebaseService;

    private static final String HEALTH_SERVICES_COLLECTION = "healthServices";
    private static final String APPLICATIONS_COLLECTION = "applications";
    private static final String COMPLAINTS_COLLECTION = "complaints";
    private static final String DOCUMENTS_COLLECTION = "documents";

    // Get Officer Dashboard Statistics
    public Map<String, Object> getDashboardStats(String officerId) throws ExecutionException, InterruptedException {
        Map<String, Object> stats = new HashMap<>();

        // Get all health services
        List<DocumentSnapshot> allHealthServices = firebaseService.getAllDocuments(HEALTH_SERVICES_COLLECTION);
        
        // Get all applications
        List<DocumentSnapshot> allApplications = firebaseService.getAllDocuments(APPLICATIONS_COLLECTION);
        
        // Get all complaints
        List<DocumentSnapshot> allComplaints = firebaseService.getAllDocuments(COMPLAINTS_COLLECTION);

        // Count by status
        long pendingHealthServices = allHealthServices.stream()
                .filter(doc -> "submitted".equals(doc.getString("status")))
                .count();
        
        long pendingApplications = allApplications.stream()
                .filter(doc -> "submitted".equals(doc.getString("status")))
                .count();
        
        long pendingComplaints = allComplaints.stream()
                .filter(doc -> "pending".equals(doc.getString("status")))
                .count();

        long totalProcessed = allHealthServices.stream()
                .filter(doc -> {
                    String status = doc.getString("status");
                    return "issued".equals(status) || "verified".equals(status);
                })
                .count();

        stats.put("totalHealthServices", allHealthServices.size());
        stats.put("pendingHealthServices", pendingHealthServices);
        stats.put("totalApplications", allApplications.size());
        stats.put("pendingApplications", pendingApplications);
        stats.put("totalComplaints", allComplaints.size());
        stats.put("pendingComplaints", pendingComplaints);
        stats.put("totalProcessed", totalProcessed);

        return stats;
    }

    // Get all health services (for officer to review)
    public List<Map<String, Object>> getAllHealthServices() throws ExecutionException, InterruptedException {
        List<DocumentSnapshot> docs = firebaseService.getAllDocuments(HEALTH_SERVICES_COLLECTION);
        List<Map<String, Object>> services = new ArrayList<>();

        for (DocumentSnapshot doc : docs) {
            if (doc.exists()) {
                Map<String, Object> service = doc.getData();
                services.add(service);
            }
        }

        return services;
    }

    // Get all applications (for officer to review)
    public List<Map<String, Object>> getAllApplications() throws ExecutionException, InterruptedException {
        List<DocumentSnapshot> docs = firebaseService.getAllDocuments(APPLICATIONS_COLLECTION);
        List<Map<String, Object>> applications = new ArrayList<>();

        for (DocumentSnapshot doc : docs) {
            if (doc.exists()) {
                Map<String, Object> app = doc.getData();
                applications.add(app);
            }
        }

        return applications;
    }

    // Get all complaints (for officer to review)
    public List<Map<String, Object>> getAllComplaints() throws ExecutionException, InterruptedException {
        List<DocumentSnapshot> docs = firebaseService.getAllDocuments(COMPLAINTS_COLLECTION);
        List<Map<String, Object>> complaints = new ArrayList<>();

        for (DocumentSnapshot doc : docs) {
            if (doc.exists()) {
                Map<String, Object> complaint = doc.getData();
                complaints.add(complaint);
            }
        }

        return complaints;
    }

    // Get all documents for verification
    public List<Map<String, Object>> getAllDocuments() throws ExecutionException, InterruptedException {
        List<DocumentSnapshot> docs = firebaseService.getAllDocuments(DOCUMENTS_COLLECTION);
        List<Map<String, Object>> documents = new ArrayList<>();

        for (DocumentSnapshot doc : docs) {
            if (doc.exists()) {
                Map<String, Object> document = doc.getData();
                documents.add(document);
            }
        }

        return documents;
    }

    // Update health service status
    public Map<String, Object> updateHealthServiceStatus(String serviceId, String status, 
                                                         String certificateNumber, String remarks) 
            throws ExecutionException, InterruptedException {
        
        DocumentSnapshot doc = firebaseService.getDocument(HEALTH_SERVICES_COLLECTION, serviceId);
        
        if (!doc.exists()) {
            throw new ResourceNotFoundException("Health service not found");
        }

        Map<String, Object> updates = new HashMap<>();
        updates.put("status", status);
        updates.put("updatedAt", new Date().toString());
        
        if (certificateNumber != null && !certificateNumber.isEmpty()) {
            updates.put("certificateNumber", certificateNumber);
        }
        
        if (remarks != null && !remarks.isEmpty()) {
            updates.put("remarks", remarks);
        }

        firebaseService.updateDocument(HEALTH_SERVICES_COLLECTION, serviceId, updates);

        // Return updated document
        DocumentSnapshot updated = firebaseService.getDocument(HEALTH_SERVICES_COLLECTION, serviceId);
        return updated.getData();
    }

    // Update application status
    public Map<String, Object> updateApplicationStatus(String applicationId, String status, 
                                                       String officerName, String remarks) 
            throws ExecutionException, InterruptedException {
        
        DocumentSnapshot doc = firebaseService.getDocument(APPLICATIONS_COLLECTION, applicationId);
        
        if (!doc.exists()) {
            throw new ResourceNotFoundException("Application not found");
        }

        Map<String, Object> updates = new HashMap<>();
        updates.put("status", status);
        updates.put("updatedAt", new Date().toString());
        updates.put("assignedOfficer", officerName);
        
        if (remarks != null && !remarks.isEmpty()) {
            updates.put("remarks", remarks);
        }

        firebaseService.updateDocument(APPLICATIONS_COLLECTION, applicationId, updates);

        // Return updated document
        DocumentSnapshot updated = firebaseService.getDocument(APPLICATIONS_COLLECTION, applicationId);
        return updated.getData();
    }

    // Update complaint status
    public Map<String, Object> updateComplaintStatus(String complaintId, String status, 
                                                     String resolution, String officerName) 
            throws ExecutionException, InterruptedException {
        
        DocumentSnapshot doc = firebaseService.getDocument(COMPLAINTS_COLLECTION, complaintId);
        
        if (!doc.exists()) {
            throw new ResourceNotFoundException("Complaint not found");
        }

        Map<String, Object> updates = new HashMap<>();
        updates.put("status", status);
        updates.put("updatedAt", new Date().toString());
        updates.put("assignedOfficer", officerName);
        
        if (resolution != null && !resolution.isEmpty()) {
            updates.put("resolution", resolution);
        }

        firebaseService.updateDocument(COMPLAINTS_COLLECTION, complaintId, updates);

        // Return updated document
        DocumentSnapshot updated = firebaseService.getDocument(COMPLAINTS_COLLECTION, complaintId);
        return updated.getData();
    }

    // Verify document
    public Map<String, Object> verifyDocument(String documentId, String verifiedBy, 
                                             String status, String remarks) 
            throws ExecutionException, InterruptedException {
        
        DocumentSnapshot doc = firebaseService.getDocument(DOCUMENTS_COLLECTION, documentId);
        
        if (!doc.exists()) {
            throw new ResourceNotFoundException("Document not found");
        }

        Map<String, Object> updates = new HashMap<>();
        updates.put("verificationStatus", status);
        updates.put("verifiedBy", verifiedBy);
        updates.put("verifiedAt", new Date().toString());
        
        if (remarks != null && !remarks.isEmpty()) {
            updates.put("remarks", remarks);
        }

        firebaseService.updateDocument(DOCUMENTS_COLLECTION, documentId, updates);

        // Return updated document
        DocumentSnapshot updated = firebaseService.getDocument(DOCUMENTS_COLLECTION, documentId);
        return updated.getData();
    }
}
