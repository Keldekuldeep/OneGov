package com.onegov.controller;

import com.onegov.dto.response.ApiResponse;
import com.onegov.service.AdminService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/admin")
public class AdminController {

    @Autowired
    private AdminService adminService;

    // Get System Dashboard Statistics
    @GetMapping("/dashboard/stats")
    public ResponseEntity<?> getSystemStats() {
        try {
            Map<String, Object> stats = adminService.getSystemStats();
            return ResponseEntity.ok(stats);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(ApiResponse.error("Failed to fetch system stats: " + e.getMessage()));
        }
    }

    // ============================================
    // OFFICER MANAGEMENT
    // ============================================

    // Get All Officers
    @GetMapping("/officers")
    public ResponseEntity<?> getAllOfficers() {
        try {
            List<Map<String, Object>> officers = adminService.getAllOfficers();
            return ResponseEntity.ok(officers);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(ApiResponse.error("Failed to fetch officers: " + e.getMessage()));
        }
    }

    // Get Officer by ID
    @GetMapping("/officers/{officerId}")
    public ResponseEntity<?> getOfficerById(@PathVariable String officerId) {
        try {
            Map<String, Object> officer = adminService.getOfficerById(officerId);
            return ResponseEntity.ok(officer);
        } catch (RuntimeException e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND)
                    .body(ApiResponse.error(e.getMessage()));
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(ApiResponse.error("Failed to fetch officer: " + e.getMessage()));
        }
    }

    // Create Officer
    @PostMapping("/officers")
    public ResponseEntity<?> createOfficer(@RequestBody Map<String, Object> officerData) {
        try {
            Map<String, Object> officer = adminService.createOfficer(officerData);
            return ResponseEntity.status(HttpStatus.CREATED).body(officer);
        } catch (RuntimeException e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                    .body(ApiResponse.error(e.getMessage()));
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(ApiResponse.error("Failed to create officer: " + e.getMessage()));
        }
    }

    // Update Officer
    @PutMapping("/officers/{officerId}")
    public ResponseEntity<?> updateOfficer(
            @PathVariable String officerId,
            @RequestBody Map<String, Object> updates) {
        try {
            Map<String, Object> officer = adminService.updateOfficer(officerId, updates);
            return ResponseEntity.ok(officer);
        } catch (RuntimeException e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND)
                    .body(ApiResponse.error(e.getMessage()));
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(ApiResponse.error("Failed to update officer: " + e.getMessage()));
        }
    }

    // Delete Officer
    @DeleteMapping("/officers/{officerId}")
    public ResponseEntity<?> deleteOfficer(@PathVariable String officerId) {
        try {
            adminService.deleteOfficer(officerId);
            return ResponseEntity.ok(ApiResponse.success("Officer deleted successfully", null));
        } catch (RuntimeException e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND)
                    .body(ApiResponse.error(e.getMessage()));
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(ApiResponse.error("Failed to delete officer: " + e.getMessage()));
        }
    }

    // ============================================
    // CITIZEN MANAGEMENT
    // ============================================

    // Get All Citizens
    @GetMapping("/citizens")
    public ResponseEntity<?> getAllCitizens() {
        try {
            List<Map<String, Object>> citizens = adminService.getAllCitizens();
            return ResponseEntity.ok(citizens);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(ApiResponse.error("Failed to fetch citizens: " + e.getMessage()));
        }
    }

    // Block/Unblock Citizen
    @PutMapping("/citizens/{userId}/status")
    public ResponseEntity<?> updateCitizenStatus(
            @PathVariable String userId,
            @RequestBody Map<String, String> request) {
        try {
            String status = request.get("status");
            Map<String, Object> citizen = adminService.updateCitizenStatus(userId, status);
            return ResponseEntity.ok(citizen);
        } catch (RuntimeException e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND)
                    .body(ApiResponse.error(e.getMessage()));
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(ApiResponse.error("Failed to update citizen status: " + e.getMessage()));
        }
    }

    // ============================================
    // APPLICATION & COMPLAINT MANAGEMENT
    // ============================================

    // Get All Applications
    @GetMapping("/applications")
    public ResponseEntity<?> getAllApplications() {
        try {
            List<Map<String, Object>> applications = adminService.getAllApplications();
            return ResponseEntity.ok(applications);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(ApiResponse.error("Failed to fetch applications: " + e.getMessage()));
        }
    }

    // Get All Complaints
    @GetMapping("/complaints")
    public ResponseEntity<?> getAllComplaints() {
        try {
            List<Map<String, Object>> complaints = adminService.getAllComplaints();
            return ResponseEntity.ok(complaints);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(ApiResponse.error("Failed to fetch complaints: " + e.getMessage()));
        }
    }
}
