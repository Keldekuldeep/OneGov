package com.onegov.controller;

import com.onegov.dto.request.HealthServiceRequest;
import com.onegov.dto.response.ApiResponse;
import com.onegov.model.HealthService;
import com.onegov.service.HealthServiceService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;
import java.util.concurrent.ExecutionException;

@RestController
@RequestMapping("/api/health-services")
public class HealthServiceController {

    @Autowired
    private HealthServiceService healthServiceService;

    @PostMapping
    public ResponseEntity<?> submitHealthService(@RequestBody HealthServiceRequest request) {
        try {
            HealthService service = healthServiceService.submitHealthService(request);
            return ResponseEntity.status(HttpStatus.CREATED).body(service);
        } catch (ExecutionException | InterruptedException e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(ApiResponse.error("Failed to submit health service"));
        }
    }

    @GetMapping("/{id}")
    public ResponseEntity<?> getServiceById(@PathVariable String id) {
        try {
            HealthService service = healthServiceService.getServiceById(id);
            return ResponseEntity.ok(service);
        } catch (RuntimeException e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND)
                    .body(ApiResponse.error(e.getMessage()));
        } catch (ExecutionException | InterruptedException e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(ApiResponse.error("Failed to fetch health service"));
        }
    }

    @GetMapping("/track/{trackingId}")
    public ResponseEntity<?> trackService(@PathVariable String trackingId) {
        try {
            HealthService service = healthServiceService.getServiceByTrackingId(trackingId);
            return ResponseEntity.ok(service);
        } catch (RuntimeException e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND)
                    .body(ApiResponse.error(e.getMessage()));
        } catch (ExecutionException | InterruptedException e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(ApiResponse.error("Failed to track health service"));
        }
    }

    @GetMapping("/user/{userId}")
    public ResponseEntity<?> getUserServices(@PathVariable String userId) {
        try {
            List<HealthService> services = healthServiceService.getUserServices(userId);
            return ResponseEntity.ok(services);
        } catch (ExecutionException | InterruptedException e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(ApiResponse.error("Failed to fetch health services"));
        }
    }

    @PutMapping("/{id}/status")
    public ResponseEntity<?> updateStatus(
            @PathVariable String id,
            @RequestBody Map<String, String> request) {
        try {
            String status = request.get("status");
            String certificateNumber = request.get("certificateNumber");
            
            HealthService service = healthServiceService.updateServiceStatus(id, status, certificateNumber);
            return ResponseEntity.ok(service);
        } catch (RuntimeException e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND)
                    .body(ApiResponse.error(e.getMessage()));
        } catch (ExecutionException | InterruptedException e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(ApiResponse.error("Failed to update status"));
        }
    }
}
