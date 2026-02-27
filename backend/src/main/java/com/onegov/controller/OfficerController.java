package com.onegov.controller;

import com.onegov.dto.response.ApiResponse;
import com.onegov.service.OfficerService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;
import java.util.concurrent.ExecutionException;

@RestController
@RequestMapping("/api/officer")
public class OfficerController {

    @Autowired
    private OfficerService officerService;

    // Get Dashboard Statistics
    @GetMapping("/dashboard/stats")
    public ResponseEntity<?> getDashboardStats(@RequestParam String officerId) {
        try {
            Map<String, Object> stats = officerService.getDashboardStats(officerId);
            return ResponseEntity.ok(stats);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(ApiResponse.error("Failed to fetch dashboard stats: " + e.getMessage()));
        }
    }

    // Get All Health Services
    @GetMapping("/health-services")
    public ResponseEntity<?> getAllHealthServices() {
        try {
            List<Map<String, Object>> services = officerService.getAllHealthServices();
            return ResponseEntity.ok(services);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(ApiResponse.error("Failed to fetch health services: " + e.getMessage()));
        }
    }

    // Update Health Service Status
    @PutMapping("/health-services/{serviceId}/status")
    public ResponseEntity<?> updateHealthServiceStatus(
            @PathVariable String serviceId,
            @RequestBody Map<String, String> request) {
        try {
            String status = request.get("status");
            String certificateNumber = request.get("certificateNumber");
            String remarks = request.get("remarks");

            Map<String, Object> updated = officerService.updateHealthServiceStatus(
                    serviceId, status, certificateNumber, remarks);
            
            return ResponseEntity.ok(updated);
        } catch (RuntimeException e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND)
                    .body(ApiResponse.error(e.getMessage()));
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(ApiResponse.error("Failed to update status: " + e.getMessage()));
        }
    }

    // Get All Applications
    @GetMapping("/applications")
    public ResponseEntity<?> getAllApplications() {
        try {
            List<Map<String, Object>> applications = officerService.getAllApplications();
            return ResponseEntity.ok(applications);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(ApiResponse.error("Failed to fetch applications: " + e.getMessage()));
        }
    }

    // Update Application Status
    @PutMapping("/applications/{applicationId}/status")
    public ResponseEntity<?> updateApplicationStatus(
            @PathVariable String applicationId,
            @RequestBody Map<String, String> request) {
        try {
            String status = request.get("status");
            String officerName = request.get("officerName");
            String remarks = request.get("remarks");

            Map<String, Object> updated = officerService.updateApplicationStatus(
                    applicationId, status, officerName, remarks);
            
            return ResponseEntity.ok(updated);
        } catch (RuntimeException e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND)
                    .body(ApiResponse.error(e.getMessage()));
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(ApiResponse.error("Failed to update status: " + e.getMessage()));
        }
    }

    // Get All Complaints
    @GetMapping("/complaints")
    public ResponseEntity<?> getAllComplaints() {
        try {
            List<Map<String, Object>> complaints = officerService.getAllComplaints();
            return ResponseEntity.ok(complaints);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(ApiResponse.error("Failed to fetch complaints: " + e.getMessage()));
        }
    }

    // Update Complaint Status
    @PutMapping("/complaints/{complaintId}/status")
    public ResponseEntity<?> updateComplaintStatus(
            @PathVariable String complaintId,
            @RequestBody Map<String, String> request) {
        try {
            String status = request.get("status");
            String resolution = request.get("resolution");
            String officerName = request.get("officerName");

            Map<String, Object> updated = officerService.updateComplaintStatus(
                    complaintId, status, resolution, officerName);
            
            return ResponseEntity.ok(updated);
        } catch (RuntimeException e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND)
                    .body(ApiResponse.error(e.getMessage()));
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(ApiResponse.error("Failed to update status: " + e.getMessage()));
        }
    }

    // Get All Documents for Verification
    @GetMapping("/documents")
    public ResponseEntity<?> getAllDocuments() {
        try {
            List<Map<String, Object>> documents = officerService.getAllDocuments();
            return ResponseEntity.ok(documents);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(ApiResponse.error("Failed to fetch documents: " + e.getMessage()));
        }
    }

    // Verify Document
    @PutMapping("/documents/{documentId}/verify")
    public ResponseEntity<?> verifyDocument(
            @PathVariable String documentId,
            @RequestBody Map<String, String> request) {
        try {
            String verifiedBy = request.get("verifiedBy");
            String status = request.get("status");
            String remarks = request.get("remarks");

            Map<String, Object> updated = officerService.verifyDocument(
                    documentId, verifiedBy, status, remarks);
            
            return ResponseEntity.ok(updated);
        } catch (RuntimeException e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND)
                    .body(ApiResponse.error(e.getMessage()));
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(ApiResponse.error("Failed to verify document: " + e.getMessage()));
        }
    }
}
