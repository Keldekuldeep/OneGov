package com.onegov.service;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.CommandLineRunner;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.HashMap;
import java.util.Map;
import java.util.concurrent.ExecutionException;

@Service
public class DataInitializationService implements CommandLineRunner {

    @Autowired
    private FirebaseService firebaseService;

    @Autowired
    private PasswordEncoder passwordEncoder;

    private static final String OFFICERS_COLLECTION = "officers";
    private static final String ADMINS_COLLECTION = "admins";

    @Override
    public void run(String... args) throws Exception {
        System.out.println("Checking if demo data needs to be initialized...");
        initializeDemoOfficers();
        initializeDemoAdmins();
        System.out.println("Demo data initialization complete!");
    }

    private void initializeDemoOfficers() throws ExecutionException, InterruptedException {
        // Check if officers already exist
        var existingOfficers = firebaseService.queryDocuments(OFFICERS_COLLECTION, "email", "rajesh.kumar@gov.in");
        if (!existingOfficers.isEmpty()) {
            System.out.println("Demo officers already exist. Skipping initialization.");
            return;
        }

        System.out.println("Creating demo officers...");

        // Officer 1: Dr. Rajesh Kumar (Health)
        createOfficer("officer-1", "Dr. Rajesh Kumar", "rajesh.kumar@gov.in", 
                     "9876543210", "health", "Health Officer", "officer", "admin-1");

        // Officer 2: Priya Sharma (Education)
        createOfficer("officer-2", "Priya Sharma", "priya.sharma@gov.in", 
                     "9876543211", "education", "Senior Education Officer", "senior-officer", "admin-1");

        // Officer 3: Amit Singh (Revenue)
        createOfficer("officer-3", "Amit Singh", "amit.singh@gov.in", 
                     "9876543212", "revenue", "Revenue Officer", "officer", "admin-1");

        // Officer 4: Sunita Verma (General)
        createOfficer("officer-4", "Sunita Verma", "sunita.verma@gov.in", 
                     "9876543213", "general", "Head Officer", "head", "admin-1");

        System.out.println("Demo officers created successfully!");
    }

    private void createOfficer(String officerId, String name, String email, String phone,
                               String department, String designation, String role, String createdBy) 
            throws ExecutionException, InterruptedException {
        
        Map<String, Object> officerData = new HashMap<>();
        officerData.put("officerId", officerId);
        officerData.put("name", name);
        officerData.put("email", email);
        officerData.put("password", passwordEncoder.encode("officer123")); // Demo password
        officerData.put("phone", phone);
        officerData.put("department", department);
        officerData.put("designation", designation);
        officerData.put("role", role);
        officerData.put("status", "active");
        officerData.put("createdBy", createdBy);
        officerData.put("createdAt", LocalDateTime.now().toString());
        officerData.put("updatedAt", LocalDateTime.now().toString());

        // Performance data
        Map<String, Object> performance = new HashMap<>();
        performance.put("totalProcessed", 0);
        performance.put("avgResponseTime", 0.0);
        performance.put("rating", 0.0);
        officerData.put("performance", performance);

        firebaseService.createDocument(OFFICERS_COLLECTION, officerId, officerData);
    }

    private void initializeDemoAdmins() throws ExecutionException, InterruptedException {
        // Check if admins already exist
        var existingAdmins = firebaseService.queryDocuments(ADMINS_COLLECTION, "email", "super.admin@onegov.in");
        if (!existingAdmins.isEmpty()) {
            System.out.println("Demo admins already exist. Skipping initialization.");
            return;
        }

        System.out.println("Creating demo admins...");

        // Admin 1: Super Admin
        createAdmin("admin-1", "Super Admin", "super.admin@onegov.in", "9876543200", "super-admin");

        // Admin 2: Regular Admin
        createAdmin("admin-2", "Admin User", "admin@onegov.in", "9876543201", "admin");

        System.out.println("Demo admins created successfully!");
    }

    private void createAdmin(String adminId, String name, String email, String phone, String role) 
            throws ExecutionException, InterruptedException {
        
        Map<String, Object> adminData = new HashMap<>();
        adminData.put("adminId", adminId);
        adminData.put("name", name);
        adminData.put("email", email);
        adminData.put("password", passwordEncoder.encode("admin123")); // Demo password
        adminData.put("phone", phone);
        adminData.put("role", role);
        adminData.put("createdAt", LocalDateTime.now().toString());
        adminData.put("lastLogin", LocalDateTime.now().toString());

        firebaseService.createDocument(ADMINS_COLLECTION, adminId, adminData);
    }
}
