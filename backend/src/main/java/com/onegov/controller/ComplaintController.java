package com.onegov.controller;

import com.onegov.dto.request.ComplaintRequest;
import com.onegov.dto.response.ApiResponse;
import com.onegov.model.Complaint;
import com.onegov.service.ComplaintService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;
import java.util.concurrent.ExecutionException;

@RestController
@RequestMapping("/api/complaints")
public class ComplaintController {

    @Autowired
    private ComplaintService complaintService;

    @PostMapping
    public ResponseEntity<?> fileComplaint(@RequestBody ComplaintRequest request) {
        try {
            Complaint complaint = complaintService.fileComplaint(request);
            return ResponseEntity.status(HttpStatus.CREATED).body(complaint);
        } catch (ExecutionException | InterruptedException e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(ApiResponse.error("Failed to file complaint"));
        }
    }

    @GetMapping("/{id}")
    public ResponseEntity<?> getComplaintById(@PathVariable String id) {
        try {
            Complaint complaint = complaintService.getComplaintById(id);
            return ResponseEntity.ok(complaint);
        } catch (RuntimeException e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND)
                    .body(ApiResponse.error(e.getMessage()));
        } catch (ExecutionException | InterruptedException e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(ApiResponse.error("Failed to fetch complaint"));
        }
    }

    @GetMapping("/track/{trackingId}")
    public ResponseEntity<?> trackComplaint(@PathVariable String trackingId) {
        try {
            Complaint complaint = complaintService.getComplaintByTrackingId(trackingId);
            return ResponseEntity.ok(complaint);
        } catch (RuntimeException e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND)
                    .body(ApiResponse.error(e.getMessage()));
        } catch (ExecutionException | InterruptedException e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(ApiResponse.error("Failed to track complaint"));
        }
    }

    @GetMapping("/user/{userId}")
    public ResponseEntity<?> getUserComplaints(@PathVariable String userId) {
        try {
            List<Complaint> complaints = complaintService.getUserComplaints(userId);
            return ResponseEntity.ok(complaints);
        } catch (ExecutionException | InterruptedException e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(ApiResponse.error("Failed to fetch complaints"));
        }
    }

    @PutMapping("/{id}/status")
    public ResponseEntity<?> updateStatus(
            @PathVariable String id,
            @RequestBody Map<String, String> request) {
        try {
            String status = request.get("status");
            String resolution = request.get("resolution");
            
            Complaint complaint = complaintService.updateComplaintStatus(id, status, resolution);
            return ResponseEntity.ok(complaint);
        } catch (RuntimeException e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND)
                    .body(ApiResponse.error(e.getMessage()));
        } catch (ExecutionException | InterruptedException e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(ApiResponse.error("Failed to update status"));
        }
    }

    @PutMapping("/{id}/assign")
    public ResponseEntity<?> assignComplaint(
            @PathVariable String id,
            @RequestBody Map<String, String> request) {
        try {
            String officerId = request.get("officerId");
            Complaint complaint = complaintService.assignComplaint(id, officerId);
            return ResponseEntity.ok(complaint);
        } catch (RuntimeException e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND)
                    .body(ApiResponse.error(e.getMessage()));
        } catch (ExecutionException | InterruptedException e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(ApiResponse.error("Failed to assign complaint"));
        }
    }
}
