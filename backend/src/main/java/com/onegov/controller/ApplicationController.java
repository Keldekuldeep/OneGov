package com.onegov.controller;

import com.onegov.dto.request.ApplicationRequest;
import com.onegov.dto.response.ApiResponse;
import com.onegov.model.Application;
import com.onegov.service.ApplicationService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;
import java.util.concurrent.ExecutionException;

@RestController
@RequestMapping("/api/applications")
public class ApplicationController {

    @Autowired
    private ApplicationService applicationService;

    @PostMapping
    public ResponseEntity<?> submitApplication(@RequestBody ApplicationRequest request) {
        try {
            Application application = applicationService.submitApplication(request);
            return ResponseEntity.status(HttpStatus.CREATED).body(application);
        } catch (ExecutionException | InterruptedException e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(ApiResponse.error("Failed to submit application"));
        }
    }

    @GetMapping("/{id}")
    public ResponseEntity<?> getApplicationById(@PathVariable String id) {
        try {
            Application application = applicationService.getApplicationById(id);
            return ResponseEntity.ok(application);
        } catch (RuntimeException e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND)
                    .body(ApiResponse.error(e.getMessage()));
        } catch (ExecutionException | InterruptedException e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(ApiResponse.error("Failed to fetch application"));
        }
    }

    @GetMapping("/track/{trackingId}")
    public ResponseEntity<?> trackApplication(@PathVariable String trackingId) {
        try {
            Application application = applicationService.getApplicationByTrackingId(trackingId);
            return ResponseEntity.ok(application);
        } catch (RuntimeException e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND)
                    .body(ApiResponse.error(e.getMessage()));
        } catch (ExecutionException | InterruptedException e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(ApiResponse.error("Failed to track application"));
        }
    }

    @GetMapping("/user/{userId}")
    public ResponseEntity<?> getUserApplications(@PathVariable String userId) {
        try {
            List<Application> applications = applicationService.getUserApplications(userId);
            return ResponseEntity.ok(applications);
        } catch (ExecutionException | InterruptedException e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(ApiResponse.error("Failed to fetch applications"));
        }
    }

    @PutMapping("/{id}/status")
    public ResponseEntity<?> updateStatus(
            @PathVariable String id,
            @RequestBody Map<String, String> request) {
        try {
            String status = request.get("status");
            String officerName = request.get("officerName");
            String officerId = request.get("officerId");
            
            Application application = applicationService.updateApplicationStatus(
                    id, status, officerName, officerId);
            return ResponseEntity.ok(application);
        } catch (RuntimeException e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND)
                    .body(ApiResponse.error(e.getMessage()));
        } catch (ExecutionException | InterruptedException e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(ApiResponse.error("Failed to update status"));
        }
    }
}
