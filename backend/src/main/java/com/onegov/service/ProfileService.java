package com.onegov.service;

import com.google.cloud.firestore.DocumentSnapshot;
import com.onegov.dto.request.ProfileRequest;
import com.onegov.exception.ResourceNotFoundException;
import com.onegov.model.CitizenProfile;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.*;
import java.util.concurrent.ExecutionException;

@Service
public class ProfileService {

    @Autowired
    private FirebaseService firebaseService;

    private static final String COLLECTION = "citizen_profiles";

    public CitizenProfile createOrUpdateProfile(ProfileRequest request) throws ExecutionException, InterruptedException {
        // Check if profile exists for user
        var existingProfiles = firebaseService.queryDocuments(COLLECTION, "userId", request.getUserId());
        
        String profileId;
        LocalDateTime createdAt;
        
        if (!existingProfiles.isEmpty()) {
            // Update existing profile
            DocumentSnapshot existingDoc = existingProfiles.get(0);
            profileId = existingDoc.getString("profileId");
            createdAt = LocalDateTime.parse(existingDoc.getString("createdAt"));
        } else {
            // Create new profile
            profileId = UUID.randomUUID().toString();
            createdAt = LocalDateTime.now();
        }

        CitizenProfile profile = new CitizenProfile();
        profile.setProfileId(profileId);
        profile.setUserId(request.getUserId());
        profile.setName(request.getName());
        profile.setAge(request.getAge());
        profile.setGender(request.getGender());
        profile.setCategory(request.getCategory());
        profile.setOccupation(request.getOccupation());
        profile.setIncome(request.getIncome());
        profile.setState(request.getState());
        profile.setHasBPLCard(request.getHasBPLCard());
        profile.setIsMinority(request.getIsMinority());
        profile.setHasDisability(request.getHasDisability());
        profile.setIsStudent(request.getIsStudent());
        profile.setIsFarmer(request.getIsFarmer());
        profile.setCreatedAt(createdAt);
        profile.setUpdatedAt(LocalDateTime.now());

        // Calculate eligible schemes
        List<String> eligibleSchemes = calculateEligibleSchemes(profile);
        profile.setEligibleSchemes(eligibleSchemes);

        Map<String, Object> data = convertToMap(profile);
        firebaseService.createDocument(COLLECTION, profileId, data);

        return profile;
    }

    public CitizenProfile getProfileByUserId(String userId) throws ExecutionException, InterruptedException {
        var docs = firebaseService.queryDocuments(COLLECTION, "userId", userId);
        
        if (docs.isEmpty()) {
            throw new ResourceNotFoundException("Profile not found");
        }

        return convertToProfile(docs.get(0));
    }

    public CitizenProfile getProfileById(String profileId) throws ExecutionException, InterruptedException {
        DocumentSnapshot doc = firebaseService.getDocument(COLLECTION, profileId);
        
        if (!doc.exists()) {
            throw new ResourceNotFoundException("Profile not found");
        }

        return convertToProfile(doc);
    }

    private List<String> calculateEligibleSchemes(CitizenProfile profile) {
        List<String> eligible = new ArrayList<>();

        // PM Kisan - Farmers with land
        if (Boolean.TRUE.equals(profile.getIsFarmer())) {
            eligible.add("pm-kisan");
        }

        // Ayushman Bharat - Income < 5 lakhs or BPL
        if (profile.getIncome() < 500000 || Boolean.TRUE.equals(profile.getHasBPLCard())) {
            eligible.add("ayushman-bharat");
        }

        // PM Scholarship - Students
        if (Boolean.TRUE.equals(profile.getIsStudent())) {
            eligible.add("pm-scholarship");
        }

        // Widow Pension - Female, age > 40
        if ("Female".equalsIgnoreCase(profile.getGender()) && profile.getAge() > 40) {
            eligible.add("widow-pension");
        }

        // Old Age Pension - Age > 60
        if (profile.getAge() > 60) {
            eligible.add("old-age-pension");
        }

        // SC/ST Scholarship
        if ("SC".equals(profile.getCategory()) || "ST".equals(profile.getCategory())) {
            eligible.add("sc-st-scholarship");
        }

        // Minority Scholarship
        if (Boolean.TRUE.equals(profile.getIsMinority())) {
            eligible.add("minority-scholarship");
        }

        // Disability Pension
        if (Boolean.TRUE.equals(profile.getHasDisability())) {
            eligible.add("disability-pension");
        }

        return eligible;
    }

    private Map<String, Object> convertToMap(CitizenProfile profile) {
        Map<String, Object> map = new HashMap<>();
        map.put("profileId", profile.getProfileId());
        map.put("userId", profile.getUserId());
        map.put("name", profile.getName());
        map.put("age", profile.getAge());
        map.put("gender", profile.getGender());
        map.put("category", profile.getCategory());
        map.put("occupation", profile.getOccupation());
        map.put("income", profile.getIncome());
        map.put("state", profile.getState());
        map.put("hasBPLCard", profile.getHasBPLCard());
        map.put("isMinority", profile.getIsMinority());
        map.put("hasDisability", profile.getHasDisability());
        map.put("isStudent", profile.getIsStudent());
        map.put("isFarmer", profile.getIsFarmer());
        map.put("eligibleSchemes", profile.getEligibleSchemes());
        map.put("createdAt", profile.getCreatedAt().toString());
        map.put("updatedAt", profile.getUpdatedAt().toString());
        return map;
    }

    private CitizenProfile convertToProfile(DocumentSnapshot doc) {
        CitizenProfile profile = new CitizenProfile();
        profile.setProfileId(doc.getString("profileId"));
        profile.setUserId(doc.getString("userId"));
        profile.setName(doc.getString("name"));
        profile.setAge(doc.getLong("age").intValue());
        profile.setGender(doc.getString("gender"));
        profile.setCategory(doc.getString("category"));
        profile.setOccupation(doc.getString("occupation"));
        profile.setIncome(doc.getLong("income"));
        profile.setState(doc.getString("state"));
        profile.setHasBPLCard(doc.getBoolean("hasBPLCard"));
        profile.setIsMinority(doc.getBoolean("isMinority"));
        profile.setHasDisability(doc.getBoolean("hasDisability"));
        profile.setIsStudent(doc.getBoolean("isStudent"));
        profile.setIsFarmer(doc.getBoolean("isFarmer"));
        profile.setEligibleSchemes((List<String>) doc.get("eligibleSchemes"));
        profile.setCreatedAt(LocalDateTime.parse(doc.getString("createdAt")));
        profile.setUpdatedAt(LocalDateTime.parse(doc.getString("updatedAt")));
        return profile;
    }
}
