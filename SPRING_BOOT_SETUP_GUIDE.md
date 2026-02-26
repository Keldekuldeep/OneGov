# Spring Boot Backend - Complete Setup Guide

## Step 1: Create Spring Boot Project

### Using Spring Initializr (https://start.spring.io/)

**Project Settings:**
- Project: Maven
- Language: Java
- Spring Boot: 3.2.0 (or latest)
- Java: 17 or 21
- Packaging: Jar
- Group: com.onegov
- Artifact: onegov-backend
- Name: onegov-backend
- Package name: com.onegov

**Dependencies to Add:**
1. Spring Web
2. Spring Security
3. Lombok
4. Validation

**Click "Generate" and extract the ZIP file**

---

## Step 2: Project Structure

Create this folder structure in `onegov-backend/`:

```
onegov-backend/
├── src/
│   ├── main/
│   │   ├── java/com/onegov/
│   │   │   ├── OneGovApplication.java
│   │   │   ├── config/
│   │   │   │   ├── FirebaseConfig.java
│   │   │   │   ├── SecurityConfig.java
│   │   │   │   └── CorsConfig.java
│   │   │   ├── controller/
│   │   │   │   ├── AuthController.java
│   │   │   │   ├── ApplicationController.java
│   │   │   │   ├── DocumentController.java
│   │   │   │   └── ComplaintController.java
│   │   │   ├── service/
│   │   │   │   ├── AuthService.java
│   │   │   │   ├── ApplicationService.java
│   │   │   │   ├── DocumentService.java
│   │   │   │   └── FirebaseService.java
│   │   │   ├── model/
│   │   │   │   ├── User.java
│   │   │   │   ├── Application.java
│   │   │   │   ├── Document.java
│   │   │   │   └── Complaint.java
│   │   │   ├── dto/
│   │   │   │   ├── request/
│   │   │   │   │   ├── LoginRequest.java
│   │   │   │   │   ├── RegisterRequest.java
│   │   │   │   │   └── ApplicationRequest.java
│   │   │   │   └── response/
│   │   │   │       ├── AuthResponse.java
│   │   │   │       └── ApiResponse.java
│   │   │   └── exception/
│   │   │       ├── GlobalExceptionHandler.java
│   │   │       └── ResourceNotFoundException.java
│   │   └── resources/
│   │       ├── application.properties
│   │       └── firebase-service-account.json
│   └── test/
└── pom.xml
```

---

## Step 3: Update pom.xml

Add Firebase Admin SDK dependency:

```xml
<?xml version="1.0" encoding="UTF-8"?>
<project xmlns="http://maven.apache.org/POM/4.0.0"
         xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"
         xsi:schemaLocation="http://maven.apache.org/POM/4.0.0 
         https://maven.apache.org/xsd/maven-4.0.0.xsd">
    <modelVersion>4.0.0</modelVersion>
    
    <parent>
        <groupId>org.springframework.boot</groupId>
        <artifactId>spring-boot-starter-parent</artifactId>
        <version>3.2.0</version>
        <relativePath/>
    </parent>
    
    <groupId>com.onegov</groupId>
    <artifactId>onegov-backend</artifactId>
    <version>0.0.1-SNAPSHOT</version>
    <name>onegov-backend</name>
    <description>OneGov Portal Backend</description>
    
    <properties>
        <java.version>17</java.version>
    </properties>
    
    <dependencies>
        <!-- Spring Boot Web -->
        <dependency>
            <groupId>org.springframework.boot</groupId>
            <artifactId>spring-boot-starter-web</artifactId>
        </dependency>
        
        <!-- Spring Security -->
        <dependency>
            <groupId>org.springframework.boot</groupId>
            <artifactId>spring-boot-starter-security</artifactId>
        </dependency>
        
        <!-- Validation -->
        <dependency>
            <groupId>org.springframework.boot</groupId>
            <artifactId>spring-boot-starter-validation</artifactId>
        </dependency>
        
        <!-- Firebase Admin SDK -->
        <dependency>
            <groupId>com.google.firebase</groupId>
            <artifactId>firebase-admin</artifactId>
            <version>9.2.0</version>
        </dependency>
        
        <!-- Lombok -->
        <dependency>
            <groupId>org.projectlombok</groupId>
            <artifactId>lombok</artifactId>
            <optional>true</optional>
        </dependency>
        
        <!-- Spring Boot Test -->
        <dependency>
            <groupId>org.springframework.boot</groupId>
            <artifactId>spring-boot-starter-test</artifactId>
            <scope>test</scope>
        </dependency>
    </dependencies>
    
    <build>
        <plugins>
            <plugin>
                <groupId>org.springframework.boot</groupId>
                <artifactId>spring-boot-maven-plugin</artifactId>
            </plugin>
        </plugins>
    </build>
</project>
```

---

## Step 4: Configuration Files

### application.properties
```properties
# Server Configuration
server.port=8080
spring.application.name=onegov-backend

# Firebase Configuration
firebase.database.url=https://onegov-portal.firebaseio.com
firebase.storage.bucket=onegov-portal.firebasestorage.app

# CORS Configuration
cors.allowed.origins=http://localhost:3000

# Logging
logging.level.com.onegov=DEBUG
logging.level.org.springframework.security=DEBUG
```

### firebase-service-account.json
Place your Firebase service account JSON file in `src/main/resources/`

---

## Step 5: Main Application Class

### OneGovApplication.java
```java
package com.onegov;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;

@SpringBootApplication
public class OneGovApplication {
    public static void main(String[] args) {
        SpringApplication.run(OneGovApplication.class, args);
    }
}
```

---

## Step 6: Firebase Configuration

### FirebaseConfig.java
```java
package com.onegov.config;

import com.google.auth.oauth2.GoogleCredentials;
import com.google.firebase.FirebaseApp;
import com.google.firebase.FirebaseOptions;
import com.google.firebase.cloud.FirestoreClient;
import com.google.cloud.firestore.Firestore;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.core.io.ClassPathResource;

import javax.annotation.PostConstruct;
import java.io.IOException;

@Configuration
public class FirebaseConfig {

    @PostConstruct
    public void initialize() throws IOException {
        if (FirebaseApp.getApps().isEmpty()) {
            FirebaseOptions options = FirebaseOptions.builder()
                    .setCredentials(GoogleCredentials.fromStream(
                            new ClassPathResource("firebase-service-account.json").getInputStream()))
                    .setStorageBucket("onegov-portal.firebasestorage.app")
                    .build();
            
            FirebaseApp.initializeApp(options);
        }
    }

    @Bean
    public Firestore firestore() {
        return FirestoreClient.getFirestore();
    }
}
```

---

## Step 7: CORS Configuration

### CorsConfig.java
```java
package com.onegov.config;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.web.cors.CorsConfiguration;
import org.springframework.web.cors.UrlBasedCorsConfigurationSource;
import org.springframework.web.filter.CorsFilter;

import java.util.Arrays;

@Configuration
public class CorsConfig {

    @Value("${cors.allowed.origins}")
    private String allowedOrigins;

    @Bean
    public CorsFilter corsFilter() {
        CorsConfiguration config = new CorsConfiguration();
        config.setAllowCredentials(true);
        config.setAllowedOrigins(Arrays.asList(allowedOrigins.split(",")));
        config.setAllowedHeaders(Arrays.asList("*"));
        config.setAllowedMethods(Arrays.asList("GET", "POST", "PUT", "DELETE", "OPTIONS"));
        
        UrlBasedCorsConfigurationSource source = new UrlBasedCorsConfigurationSource();
        source.registerCorsConfiguration("/**", config);
        
        return new CorsFilter(source);
    }
}
```

---

## Step 8: Security Configuration

### SecurityConfig.java
```java
package com.onegov.config;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.web.SecurityFilterChain;

@Configuration
@EnableWebSecurity
public class SecurityConfig {

    @Bean
    public SecurityFilterChain filterChain(HttpSecurity http) throws Exception {
        http
            .csrf(csrf -> csrf.disable())
            .sessionManagement(session -> 
                session.sessionCreationPolicy(SessionCreationPolicy.STATELESS))
            .authorizeHttpRequests(auth -> auth
                .requestMatchers("/api/auth/**").permitAll()
                .requestMatchers("/api/public/**").permitAll()
                .anyRequest().authenticated()
            );
        
        return http.build();
    }
}
```

---

## Step 9: Model Classes

### User.java
```java
package com.onegov.model;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class User {
    private String userId;
    private String email;
    private String name;
    private String phone;
    private String role; // citizen, officer, admin
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
}
```

### Application.java
```java
package com.onegov.model;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Map;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class Application {
    private String applicationId;
    private String userId;
    private String trackingId;
    private String schemeName;
    private String schemeId;
    private String status; // submitted, verified, under_review, approved, rejected
    private LocalDateTime submittedAt;
    private LocalDateTime updatedAt;
    private List<String> documents;
    private List<TimelineEntry> timeline;
    private Map<String, Object> formData;
}
```

### Document.java
```java
package com.onegov.model;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class Document {
    private String documentId;
    private String userId;
    private String type;
    private String fileName;
    private String fileUrl;
    private Long fileSize;
    private String verificationStatus; // pending, verified, rejected
    private LocalDateTime uploadedAt;
    private String verifiedBy;
    private LocalDateTime verifiedAt;
}
```

### Complaint.java
```java
package com.onegov.model;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class Complaint {
    private String complaintId;
    private String userId;
    private String trackingId;
    private String type;
    private String category;
    private String description;
    private String status; // submitted, assigned, in_progress, resolved, closed
    private String priority; // low, medium, high
    private String assignedTo;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
    private String resolution;
    private LocalDateTime resolvedAt;
}
```

---

## Step 10: DTO Classes

### LoginRequest.java
```java
package com.onegov.dto.request;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import lombok.Data;

@Data
public class LoginRequest {
    @NotBlank(message = "Email is required")
    @Email(message = "Invalid email format")
    private String email;
    
    @NotBlank(message = "Password is required")
    private String password;
}
```

### RegisterRequest.java
```java
package com.onegov.dto.request;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Pattern;
import lombok.Data;

@Data
public class RegisterRequest {
    @NotBlank(message = "Name is required")
    private String name;
    
    @NotBlank(message = "Email is required")
    @Email(message = "Invalid email format")
    private String email;
    
    @NotBlank(message = "Password is required")
    private String password;
    
    @Pattern(regexp = "^[0-9]{10}$", message = "Phone must be 10 digits")
    private String phone;
    
    private String role = "citizen"; // Default role
}
```

### ApiResponse.java
```java
package com.onegov.dto.response;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class ApiResponse<T> {
    private boolean success;
    private String message;
    private T data;
    
    public static <T> ApiResponse<T> success(String message, T data) {
        return new ApiResponse<>(true, message, data);
    }
    
    public static <T> ApiResponse<T> error(String message) {
        return new ApiResponse<>(false, message, null);
    }
}
```

---

## Step 11: Run Commands

```bash
# Navigate to project directory
cd onegov-backend

# Build the project
mvn clean install

# Run the application
mvn spring-boot:run

# Or run the JAR
java -jar target/onegov-backend-0.0.1-SNAPSHOT.jar
```

**Backend will run on:** http://localhost:8080

---

## Step 12: Test the Setup

Create a simple test controller:

### TestController.java
```java
package com.onegov.controller;

import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/test")
public class TestController {
    
    @GetMapping("/hello")
    public String hello() {
        return "OneGov Backend is running!";
    }
}
```

**Test URL:** http://localhost:8080/api/test/hello

---

## Next Steps

1. Implement AuthService with Firebase Authentication
2. Create CRUD operations for Applications
3. Implement Document upload to Firebase Storage
4. Add Complaint management APIs
5. Connect with Next.js frontend

---

## Troubleshooting

### Common Issues:

1. **Firebase initialization error**
   - Check firebase-service-account.json path
   - Verify JSON file is valid

2. **CORS error**
   - Update allowed origins in application.properties
   - Check CorsConfig.java

3. **Port already in use**
   - Change port in application.properties: `server.port=8081`

4. **Maven build fails**
   - Run: `mvn clean install -U`
   - Check Java version: `java -version`

---

## Development Tools

- **IDE:** IntelliJ IDEA / Eclipse / VS Code
- **API Testing:** Postman / Thunder Client
- **Database Viewer:** Firebase Console
- **Build Tool:** Maven

---

Ready to start! 🚀
