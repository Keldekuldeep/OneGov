package com.onegov.service;

import com.google.cloud.firestore.DocumentSnapshot;
import com.onegov.dto.request.AdminLoginRequest;
import com.onegov.dto.request.LoginRequest;
import com.onegov.dto.request.OfficerLoginRequest;
import com.onegov.dto.request.RegisterRequest;
import com.onegov.dto.response.AdminResponse;
import com.onegov.dto.response.AuthResponse;
import com.onegov.dto.response.OfficerResponse;
import com.onegov.exception.ResourceNotFoundException;
import com.onegov.model.Admin;
import com.onegov.model.Officer;
import com.onegov.model.User;
import com.onegov.util.JwtUtil;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.HashMap;
import java.util.Map;
import java.util.UUID;
import java.util.concurrent.ExecutionException;

@Service
public class AuthService {

    @Autowired
    private FirebaseService firebaseService;

    @Autowired
    private PasswordEncoder passwordEncoder;

    @Autowired
    private JwtUtil jwtUtil;

    private static final String USERS_COLLECTION = "users";
    private static final String OFFICERS_COLLECTION = "officers";
    private static final String ADMINS_COLLECTION = "admins";

    public AuthResponse register(RegisterRequest request) throws ExecutionException, InterruptedException {
        // Check if user already exists
        var existingUsers = firebaseService.queryDocuments(USERS_COLLECTION, "email", request.getEmail());
        if (!existingUsers.isEmpty()) {
            throw new RuntimeException("User with this email already exists");
        }

        // Create new user
        String userId = UUID.randomUUID().toString();
        User user = new User();
        user.setUserId(userId);
        user.setEmail(request.getEmail());
        user.setPassword(passwordEncoder.encode(request.getPassword()));
        user.setName(request.getName());
        user.setPhone(request.getPhone());
        user.setRole(request.getRole());
        user.setCreatedAt(LocalDateTime.now());
        user.setUpdatedAt(LocalDateTime.now());

        // Save to Firestore
        Map<String, Object> userData = new HashMap<>();
        userData.put("userId", user.getUserId());
        userData.put("email", user.getEmail());
        userData.put("password", user.getPassword());
        userData.put("name", user.getName());
        userData.put("phone", user.getPhone());
        userData.put("role", user.getRole());
        userData.put("createdAt", user.getCreatedAt().toString());
        userData.put("updatedAt", user.getUpdatedAt().toString());

        firebaseService.createDocument(USERS_COLLECTION, userId, userData);

        // Generate JWT token
        String token = jwtUtil.generateToken(userId, user.getEmail(), user.getRole());

        // Remove password from response
        user.setPassword(null);

        return new AuthResponse(token, user);
    }

    public AuthResponse login(LoginRequest request) throws ExecutionException, InterruptedException {
        // Find user by email
        var users = firebaseService.queryDocuments(USERS_COLLECTION, "email", request.getEmail());
        
        if (users.isEmpty()) {
            throw new ResourceNotFoundException("User not found");
        }

        DocumentSnapshot userDoc = users.get(0);
        String storedPassword = userDoc.getString("password");

        // Verify password
        if (!passwordEncoder.matches(request.getPassword(), storedPassword)) {
            throw new RuntimeException("Invalid credentials");
        }

        // Create user object
        User user = new User();
        user.setUserId(userDoc.getString("userId"));
        user.setEmail(userDoc.getString("email"));
        user.setName(userDoc.getString("name"));
        user.setPhone(userDoc.getString("phone"));
        user.setRole(userDoc.getString("role"));

        // Generate JWT token
        String token = jwtUtil.generateToken(user.getUserId(), user.getEmail(), user.getRole());

        return new AuthResponse(token, user);
    }

    public User getUserById(String userId) throws ExecutionException, InterruptedException {
        DocumentSnapshot userDoc = firebaseService.getDocument(USERS_COLLECTION, userId);
        
        if (!userDoc.exists()) {
            throw new ResourceNotFoundException("User not found");
        }

        User user = new User();
        user.setUserId(userDoc.getString("userId"));
        user.setEmail(userDoc.getString("email"));
        user.setName(userDoc.getString("name"));
        user.setPhone(userDoc.getString("phone"));
        user.setRole(userDoc.getString("role"));

        return user;
    }

    public User getUserByToken(String token) throws ExecutionException, InterruptedException {
        String userId = jwtUtil.extractUserId(token);
        return getUserById(userId);
    }

    // Officer Authentication
    public OfficerResponse officerLogin(OfficerLoginRequest request) throws ExecutionException, InterruptedException {
        // Find officer by email
        var officers = firebaseService.queryDocuments(OFFICERS_COLLECTION, "email", request.getEmail());
        
        if (officers.isEmpty()) {
            throw new ResourceNotFoundException("Officer not found");
        }

        DocumentSnapshot officerDoc = officers.get(0);
        String storedPassword = officerDoc.getString("password");

        // Verify password
        if (!passwordEncoder.matches(request.getPassword(), storedPassword)) {
            throw new RuntimeException("Invalid credentials");
        }

        // Check if officer is active
        String status = officerDoc.getString("status");
        if (!"active".equals(status)) {
            throw new RuntimeException("Officer account is inactive");
        }

        // Create officer object
        Officer officer = new Officer();
        officer.setOfficerId(officerDoc.getString("officerId"));
        officer.setEmail(officerDoc.getString("email"));
        officer.setName(officerDoc.getString("name"));
        officer.setPhone(officerDoc.getString("phone"));
        officer.setDepartment(officerDoc.getString("department"));
        officer.setDesignation(officerDoc.getString("designation"));
        officer.setRole(officerDoc.getString("role"));
        officer.setStatus(status);

        // Generate JWT token with role
        String token = jwtUtil.generateToken(officer.getOfficerId(), officer.getEmail(), "OFFICER");

        return new OfficerResponse(token, officer);
    }

    public Officer getOfficerById(String officerId) throws ExecutionException, InterruptedException {
        DocumentSnapshot officerDoc = firebaseService.getDocument(OFFICERS_COLLECTION, officerId);
        
        if (!officerDoc.exists()) {
            throw new ResourceNotFoundException("Officer not found");
        }

        Officer officer = new Officer();
        officer.setOfficerId(officerDoc.getString("officerId"));
        officer.setEmail(officerDoc.getString("email"));
        officer.setName(officerDoc.getString("name"));
        officer.setPhone(officerDoc.getString("phone"));
        officer.setDepartment(officerDoc.getString("department"));
        officer.setDesignation(officerDoc.getString("designation"));
        officer.setRole(officerDoc.getString("role"));
        officer.setStatus(officerDoc.getString("status"));

        return officer;
    }

    // Admin Authentication
    public AdminResponse adminLogin(AdminLoginRequest request) throws ExecutionException, InterruptedException {
        // Find admin by email
        var admins = firebaseService.queryDocuments(ADMINS_COLLECTION, "email", request.getEmail());
        
        if (admins.isEmpty()) {
            throw new ResourceNotFoundException("Admin not found");
        }

        DocumentSnapshot adminDoc = admins.get(0);
        String storedPassword = adminDoc.getString("password");

        // Verify password
        if (!passwordEncoder.matches(request.getPassword(), storedPassword)) {
            throw new RuntimeException("Invalid credentials");
        }

        // Create admin object
        Admin admin = new Admin();
        admin.setAdminId(adminDoc.getString("adminId"));
        admin.setEmail(adminDoc.getString("email"));
        admin.setName(adminDoc.getString("name"));
        admin.setPhone(adminDoc.getString("phone"));
        admin.setRole(adminDoc.getString("role"));
        admin.setLastLogin(LocalDateTime.now());

        // Update last login in Firestore
        Map<String, Object> updates = new HashMap<>();
        updates.put("lastLogin", admin.getLastLogin().toString());
        firebaseService.updateDocument(ADMINS_COLLECTION, admin.getAdminId(), updates);

        // Generate JWT token with role
        String token = jwtUtil.generateToken(admin.getAdminId(), admin.getEmail(), "ADMIN");

        return new AdminResponse(token, admin);
    }

    public Admin getAdminById(String adminId) throws ExecutionException, InterruptedException {
        DocumentSnapshot adminDoc = firebaseService.getDocument(ADMINS_COLLECTION, adminId);
        
        if (!adminDoc.exists()) {
            throw new ResourceNotFoundException("Admin not found");
        }

        Admin admin = new Admin();
        admin.setAdminId(adminDoc.getString("adminId"));
        admin.setEmail(adminDoc.getString("email"));
        admin.setName(adminDoc.getString("name"));
        admin.setPhone(adminDoc.getString("phone"));
        admin.setRole(adminDoc.getString("role"));

        return admin;
    }
}
