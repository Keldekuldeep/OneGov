package com.onegov.service;

import com.google.cloud.firestore.DocumentSnapshot;
import com.onegov.dto.request.HealthServiceRequest;
import com.onegov.exception.ResourceNotFoundException;
import com.onegov.model.HealthService;
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
public class HealthServiceService {

    @Autowired
    private FirebaseService firebaseService;

    private static final String COLLECTION = "healthServices";

    public HealthService submitHealthService(HealthServiceRequest request) throws ExecutionException, InterruptedException {
        String serviceId = UUID.randomUUID().toString();
        String trackingId = getTrackingPrefix(request.getServiceType()) + System.currentTimeMillis();

        HealthService healthService = new HealthService();
        healthService.setServiceId(serviceId);
        healthService.setUserId(request.getUserId());
        healthService.setTrackingId(trackingId);
        healthService.setServiceType(request.getServiceType());
        healthService.setStatus("submitted");
        healthService.setFormData(request.getFormData());
        healthService.setSubmittedAt(LocalDateTime.now());
        healthService.setUpdatedAt(LocalDateTime.now());

        Map<String, Object> data = convertToMap(healthService);
        firebaseService.createDocument(COLLECTION, serviceId, data);

        return healthService;
    }

    public HealthService getServiceById(String serviceId) throws ExecutionException, InterruptedException {
        DocumentSnapshot doc = firebaseService.getDocument(COLLECTION, serviceId);
        
        if (!doc.exists()) {
            throw new ResourceNotFoundException("Health service not found");
        }

        return convertToHealthService(doc);
    }

    public HealthService getServiceByTrackingId(String trackingId) throws ExecutionException, InterruptedException {
        var docs = firebaseService.queryDocuments(COLLECTION, "trackingId", trackingId);
        
        if (docs.isEmpty()) {
            throw new ResourceNotFoundException("Health service not found");
        }

        return convertToHealthService(docs.get(0));
    }

    public List<HealthService> getUserServices(String userId) throws ExecutionException, InterruptedException {
        var docs = firebaseService.queryDocuments(COLLECTION, "userId", userId);
        
        return docs.stream()
                .map(this::convertToHealthService)
                .collect(Collectors.toList());
    }

    public HealthService updateServiceStatus(String serviceId, String status, String certificateNumber) 
            throws ExecutionException, InterruptedException {
        HealthService service = getServiceById(serviceId);
        
        service.setStatus(status);
        service.setUpdatedAt(LocalDateTime.now());
        
        if (certificateNumber != null) {
            service.setCertificateNumber(certificateNumber);
        }
        
        if (status.equals("issued")) {
            service.setIssuedAt(LocalDateTime.now());
        }

        Map<String, Object> updates = new HashMap<>();
        updates.put("status", status);
        updates.put("updatedAt", LocalDateTime.now().toString());
        if (certificateNumber != null) {
            updates.put("certificateNumber", certificateNumber);
        }
        if (service.getIssuedAt() != null) {
            updates.put("issuedAt", service.getIssuedAt().toString());
        }

        firebaseService.updateDocument(COLLECTION, serviceId, updates);

        return service;
    }

    private String getTrackingPrefix(String serviceType) {
        switch (serviceType) {
            case "birth-certificate": return "BIRTH";
            case "death-certificate": return "DEATH";
            case "health-card": return "HEALTH";
            case "vaccination-certificate": return "VAC";
            default: return "HLTH";
        }
    }

    private Map<String, Object> convertToMap(HealthService service) {
        Map<String, Object> map = new HashMap<>();
        map.put("serviceId", service.getServiceId());
        map.put("userId", service.getUserId());
        map.put("trackingId", service.getTrackingId());
        map.put("serviceType", service.getServiceType());
        map.put("status", service.getStatus());
        map.put("formData", service.getFormData());
        map.put("submittedAt", service.getSubmittedAt().toString());
        map.put("updatedAt", service.getUpdatedAt().toString());
        if (service.getCertificateNumber() != null) {
            map.put("certificateNumber", service.getCertificateNumber());
        }
        if (service.getIssuedAt() != null) {
            map.put("issuedAt", service.getIssuedAt().toString());
        }
        return map;
    }

    private HealthService convertToHealthService(DocumentSnapshot doc) {
        HealthService service = new HealthService();
        service.setServiceId(doc.getString("serviceId"));
        service.setUserId(doc.getString("userId"));
        service.setTrackingId(doc.getString("trackingId"));
        service.setServiceType(doc.getString("serviceType"));
        service.setStatus(doc.getString("status"));
        service.setFormData((Map<String, Object>) doc.get("formData"));
        service.setSubmittedAt(LocalDateTime.parse(doc.getString("submittedAt")));
        service.setUpdatedAt(LocalDateTime.parse(doc.getString("updatedAt")));
        if (doc.getString("certificateNumber") != null) {
            service.setCertificateNumber(doc.getString("certificateNumber"));
        }
        if (doc.getString("issuedAt") != null) {
            service.setIssuedAt(LocalDateTime.parse(doc.getString("issuedAt")));
        }
        return service;
    }
}
