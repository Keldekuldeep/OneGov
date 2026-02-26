package com.onegov.controller;

import com.onegov.dto.request.ProfileRequest;
import com.onegov.dto.response.ApiResponse;
import com.onegov.model.CitizenProfile;
import com.onegov.service.ProfileService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.concurrent.ExecutionException;

@RestController
@RequestMapping("/api/profiles")
public class ProfileController {

    @Autowired
    private ProfileService profileService;

    @PostMapping
    public ResponseEntity<?> createOrUpdateProfile(@RequestBody ProfileRequest request) {
        try {
            CitizenProfile profile = profileService.createOrUpdateProfile(request);
            return ResponseEntity.status(HttpStatus.CREATED).body(profile);
        } catch (ExecutionException | InterruptedException e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(ApiResponse.error("Failed to save profile"));
        }
    }

    @GetMapping("/user/{userId}")
    public ResponseEntity<?> getProfileByUserId(@PathVariable String userId) {
        try {
            CitizenProfile profile = profileService.getProfileByUserId(userId);
            return ResponseEntity.ok(profile);
        } catch (RuntimeException e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND)
                    .body(ApiResponse.error(e.getMessage()));
        } catch (ExecutionException | InterruptedException e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(ApiResponse.error("Failed to fetch profile"));
        }
    }

    @GetMapping("/{profileId}")
    public ResponseEntity<?> getProfileById(@PathVariable String profileId) {
        try {
            CitizenProfile profile = profileService.getProfileById(profileId);
            return ResponseEntity.ok(profile);
        } catch (RuntimeException e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND)
                    .body(ApiResponse.error(e.getMessage()));
        } catch (ExecutionException | InterruptedException e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(ApiResponse.error("Failed to fetch profile"));
        }
    }
}
