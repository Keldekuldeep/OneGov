package com.onegov.service;

import com.google.cloud.firestore.DocumentSnapshot;
import com.onegov.dto.request.ComplaintRequest;
import com.onegov.exception.ResourceNotFoundException;
import com.onegov.model.Complaint;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.UUID;
import java.util.concurrent.ExecutionException;
import java.util.stream.Collectors;

@Service
public class ComplaintService {

    @Autowired
    private FirebaseService firebaseService;

    private static final String COMPLAINTS_COLLECTION = "complaints";

    public Complaint fileComplaint(ComplaintRequest request) throws ExecutionException, InterruptedException {
        String complaintId = UUID.randomUUID().toString();
        String trackingId = "CMP" + System.currentTimeMillis();

        Complaint complaint = new Complaint();
        complaint.setComplaintId(complaintId);
        complaint.setUserId(request.getUserId());
        complaint.setTrackingId(trackingId);
        complaint.setType(request.getType());
        complaint.setCategory(request.getCategory());
        complaint.setDescription(request.getDescription());
        complaint.setStatus("submitted");
        complaint.setPriority(request.getPriority());
        complaint.setCreatedAt(LocalDateTime.now());
        complaint.setUpdatedAt(LocalDateTime.now());

        Map<String, Object> complaintData = convertToMap(complaint);
        firebaseService.createDocument(COMPLAINTS_COLLECTION, complaintId, complaintData);

        return complaint;
    }

    public Complaint getComplaintById(String complaintId) throws ExecutionException, InterruptedException {
        DocumentSnapshot doc = firebaseService.getDocument(COMPLAINTS_COLLECTION, complaintId);
        
        if (!doc.exists()) {
            throw new ResourceNotFoundException("Complaint not found");
        }

        return convertToComplaint(doc);
    }

    public Complaint getComplaintByTrackingId(String trackingId) throws ExecutionException, InterruptedException {
        var docs = firebaseService.queryDocuments(COMPLAINTS_COLLECTION, "trackingId", trackingId);
        
        if (docs.isEmpty()) {
            throw new ResourceNotFoundException("Complaint not found");
        }

        return convertToComplaint(docs.get(0));
    }

    public List<Complaint> getUserComplaints(String userId) throws ExecutionException, InterruptedException {
        var docs = firebaseService.queryDocuments(COMPLAINTS_COLLECTION, "userId", userId);
        
        return docs.stream()
                .map(this::convertToComplaint)
                .collect(Collectors.toList());
    }

    public Complaint updateComplaintStatus(String complaintId, String status, String resolution) 
            throws ExecutionException, InterruptedException {
        Complaint complaint = getComplaintById(complaintId);
        
        complaint.setStatus(status);
        complaint.setUpdatedAt(LocalDateTime.now());
        
        if (resolution != null) {
            complaint.setResolution(resolution);
            if (status.equals("resolved") || status.equals("closed")) {
                complaint.setResolvedAt(LocalDateTime.now());
            }
        }

        Map<String, Object> updates = new HashMap<>();
        updates.put("status", status);
        updates.put("updatedAt", LocalDateTime.now().toString());
        if (resolution != null) {
            updates.put("resolution", resolution);
            if (complaint.getResolvedAt() != null) {
                updates.put("resolvedAt", complaint.getResolvedAt().toString());
            }
        }

        firebaseService.updateDocument(COMPLAINTS_COLLECTION, complaintId, updates);

        return complaint;
    }

    public Complaint assignComplaint(String complaintId, String officerId) 
            throws ExecutionException, InterruptedException {
        Map<String, Object> updates = new HashMap<>();
        updates.put("assignedTo", officerId);
        updates.put("status", "assigned");
        updates.put("updatedAt", LocalDateTime.now().toString());

        firebaseService.updateDocument(COMPLAINTS_COLLECTION, complaintId, updates);

        return getComplaintById(complaintId);
    }

    private Map<String, Object> convertToMap(Complaint complaint) {
        Map<String, Object> map = new HashMap<>();
        map.put("complaintId", complaint.getComplaintId());
        map.put("userId", complaint.getUserId());
        map.put("trackingId", complaint.getTrackingId());
        map.put("type", complaint.getType());
        map.put("category", complaint.getCategory());
        map.put("description", complaint.getDescription());
        map.put("status", complaint.getStatus());
        map.put("priority", complaint.getPriority());
        map.put("createdAt", complaint.getCreatedAt().toString());
        map.put("updatedAt", complaint.getUpdatedAt().toString());
        if (complaint.getAssignedTo() != null) {
            map.put("assignedTo", complaint.getAssignedTo());
        }
        if (complaint.getResolution() != null) {
            map.put("resolution", complaint.getResolution());
        }
        if (complaint.getResolvedAt() != null) {
            map.put("resolvedAt", complaint.getResolvedAt().toString());
        }
        return map;
    }

    private Complaint convertToComplaint(DocumentSnapshot doc) {
        Complaint complaint = new Complaint();
        complaint.setComplaintId(doc.getString("complaintId"));
        complaint.setUserId(doc.getString("userId"));
        complaint.setTrackingId(doc.getString("trackingId"));
        complaint.setType(doc.getString("type"));
        complaint.setCategory(doc.getString("category"));
        complaint.setDescription(doc.getString("description"));
        complaint.setStatus(doc.getString("status"));
        complaint.setPriority(doc.getString("priority"));
        complaint.setCreatedAt(LocalDateTime.parse(doc.getString("createdAt")));
        complaint.setUpdatedAt(LocalDateTime.parse(doc.getString("updatedAt")));
        if (doc.getString("assignedTo") != null) {
            complaint.setAssignedTo(doc.getString("assignedTo"));
        }
        if (doc.getString("resolution") != null) {
            complaint.setResolution(doc.getString("resolution"));
        }
        if (doc.getString("resolvedAt") != null) {
            complaint.setResolvedAt(LocalDateTime.parse(doc.getString("resolvedAt")));
        }
        return complaint;
    }
}
