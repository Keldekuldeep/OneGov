# OneGov Portal - Backend Setup Guide

## Firebase Configuration

### Service Account (Backend - Spring Boot)
```json
{
  "type": "service_account",
  "project_id": "onegov-portal",
  "private_key_id": "bf969f0f8fd2b91c5f62a1c430bf31c416b20ba5",
  "client_email": "firebase-adminsdk-fbsvc@onegov-portal.iam.gserviceaccount.com"
}
```
**File Location:** `backend/src/main/resources/firebase-service-account.json`

### Web Config (Frontend - Next.js)
```javascript
const firebaseConfig = {
  apiKey: "AIzaSyDh3FZlVhabOLzN0dW2gL1qLpFpTnne2jA",
  authDomain: "onegov-portal.firebaseapp.com",
  projectId: "onegov-portal",
  storageBucket: "onegov-portal.firebasestorage.app",
  messagingSenderId: "898178093933",
  appId: "1:898178093933:web:8f6e59957c3d9a6bcf8064"
};
```
**File Location:** `lib/firebase/config.ts`

---

## Spring Boot Backend Architecture

### Tech Stack
- Spring Boot 3.2.x
- Firebase Admin SDK
- Spring Security
- Maven
- Java 17+

### Project Structure
```
onegov-backend/
├── src/main/java/com/onegov/
│   ├── OneGovApplication.java
│   ├── config/
│   │   ├── FirebaseConfig.java
│   │   ├── SecurityConfig.java
│   │   └── CorsConfig.java
│   ├── controller/
│   │   ├── AuthController.java
│   │   ├── ApplicationController.java
│   │   ├── DocumentController.java
│   │   ├── ComplaintController.java
│   │   └── SchemeController.java
│   ├── service/
│   │   ├── AuthService.java
│   │   ├── ApplicationService.java
│   │   ├── DocumentService.java
│   │   ├── ComplaintService.java
│   │   └── FirebaseService.java
│   ├── model/
│   │   ├── User.java
│   │   ├── Application.java
│   │   ├── Document.java
│   │   ├── Complaint.java
│   │   └── Scheme.java
│   ├── dto/
│   │   ├── request/
│   │   │   ├── LoginRequest.java
│   │   │   ├── RegisterRequest.java
│   │   │   └── ApplicationRequest.java
│   │   └── response/
│   │       ├── AuthResponse.java
│   │       └── ApiResponse.java
│   └── exception/
│       ├── GlobalExceptionHandler.java
│       └── CustomExceptions.java
└── src/main/resources/
    ├── application.properties
    ├── application-dev.properties
    └── firebase-service-account.json
```

---

## Firestore Database Collections

### 1. users
```javascript
{
  userId: "string",
  email: "string",
  name: "string",
  phone: "string",
  role: "citizen|officer|admin",
  createdAt: "timestamp",
  updatedAt: "timestamp"
}
```

### 2. applications
```javascript
{
  applicationId: "string",
  userId: "string",
  trackingId: "string (unique)",
  schemeName: "string",
  schemeId: "string",
  status: "submitted|verified|under_review|approved|rejected",
  submittedAt: "timestamp",
  updatedAt: "timestamp",
  documents: ["documentId1", "documentId2"],
  timeline: [
    {
      stage: "string",
      status: "string",
      timestamp: "timestamp",
      officer: {
        name: "string",
        id: "string"
      }
    }
  ],
  formData: {
    // Dynamic fields based on scheme
  }
}
```

### 3. documents
```javascript
{
  documentId: "string",
  userId: "string",
  type: "aadhaar|pan|income|caste|etc",
  fileName: "string",
  fileUrl: "string (Firebase Storage URL)",
  fileSize: "number",
  verificationStatus: "pending|verified|rejected",
  uploadedAt: "timestamp",
  verifiedBy: "string (officerId)",
  verifiedAt: "timestamp"
}
```

### 4. complaints
```javascript
{
  complaintId: "string",
  userId: "string",
  trackingId: "string (unique)",
  type: "service|corruption|infrastructure|other",
  category: "string",
  description: "string",
  status: "submitted|assigned|in_progress|resolved|closed",
  priority: "low|medium|high",
  assignedTo: "string (officerId)",
  createdAt: "timestamp",
  updatedAt: "timestamp",
  resolution: "string",
  resolvedAt: "timestamp"
}
```

### 5. schemes
```javascript
{
  schemeId: "string",
  name: "string",
  description: "string",
  department: "string",
  eligibilityCriteria: {
    minAge: "number",
    maxAge: "number",
    minIncome: "number",
    maxIncome: "number",
    gender: "string",
    category: ["string"],
    occupation: ["string"]
  },
  benefits: "string",
  requiredDocuments: ["string"],
  applicationDeadline: "timestamp",
  isActive: "boolean"
}
```

### 6. profiles
```javascript
{
  userId: "string",
  age: "number",
  gender: "male|female|other",
  income: "number",
  category: "general|obc|sc|st",
  occupation: "string",
  address: {
    street: "string",
    city: "string",
    state: "string",
    pincode: "string"
  },
  updatedAt: "timestamp"
}
```

---

## API Endpoints

### Authentication
```
POST   /api/auth/register          - Register new user
POST   /api/auth/login             - Login user
POST   /api/auth/verify-token      - Verify Firebase token
GET    /api/auth/profile           - Get user profile
PUT    /api/auth/profile           - Update user profile
```

### Applications
```
POST   /api/applications           - Submit new application
GET    /api/applications/{id}      - Get application by ID
GET    /api/applications/track/{trackingId} - Track application
GET    /api/applications/user/{userId} - Get user's applications
PUT    /api/applications/{id}/status - Update application status (Officer)
GET    /api/applications/pending   - Get pending applications (Officer)
```

### Documents
```
POST   /api/documents/upload       - Upload document
GET    /api/documents/user/{userId} - Get user's documents
GET    /api/documents/{id}         - Get document by ID
DELETE /api/documents/{id}         - Delete document
PUT    /api/documents/{id}/verify  - Verify document (Officer)
```

### Complaints
```
POST   /api/complaints             - File new complaint
GET    /api/complaints/{id}        - Get complaint by ID
GET    /api/complaints/track/{trackingId} - Track complaint
GET    /api/complaints/user/{userId} - Get user's complaints
PUT    /api/complaints/{id}/assign - Assign complaint to officer
PUT    /api/complaints/{id}/status - Update complaint status
```

### Schemes
```
GET    /api/schemes                - Get all active schemes
GET    /api/schemes/{id}           - Get scheme by ID
POST   /api/schemes/eligible       - Check eligibility
POST   /api/schemes/{id}/apply     - Apply for scheme
```

---

## Next Steps

1. **Create Spring Boot Project**
   - Use Spring Initializr
   - Add dependencies: Web, Security, Firebase Admin SDK

2. **Setup Firebase Configuration**
   - Add service account JSON
   - Configure Firebase initialization

3. **Implement Authentication**
   - Firebase token verification
   - JWT token generation
   - Role-based access control

4. **Create CRUD Operations**
   - Firestore read/write operations
   - File upload to Firebase Storage
   - Real-time updates

5. **Connect Frontend**
   - Update API base URL
   - Implement Firebase Auth in Next.js
   - Replace localStorage with API calls

---

## Environment Variables

### Backend (application.properties)
```properties
server.port=8080
firebase.database.url=https://onegov-portal.firebaseio.com
firebase.storage.bucket=onegov-portal.firebasestorage.app
```

### Frontend (.env.local)
```env
NEXT_PUBLIC_API_URL=http://localhost:8080/api
NEXT_PUBLIC_FIREBASE_API_KEY=AIzaSyDh3FZlVhabOLzN0dW2gL1qLpFpTnne2jA
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=onegov-portal.firebaseapp.com
NEXT_PUBLIC_FIREBASE_PROJECT_ID=onegov-portal
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=onegov-portal.firebasestorage.app
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=898178093933
NEXT_PUBLIC_FIREBASE_APP_ID=1:898178093933:web:8f6e59957c3d9a6bcf8064
```

---

## Development Workflow

1. Start Spring Boot backend: `mvn spring-boot:run`
2. Start Next.js frontend: `npm run dev`
3. Test APIs using Postman/Thunder Client
4. Monitor Firebase Console for data

---

## Security Considerations

- Never commit `firebase-service-account.json` to Git
- Use environment variables for sensitive data
- Implement proper CORS configuration
- Add rate limiting for APIs
- Validate all user inputs
- Use HTTPS in production
