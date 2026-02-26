# OneGov Backend - API Testing Guide

## Backend Status: ✅ RUNNING
- **URL**: http://localhost:8080
- **Status**: All endpoints operational

---

## 🧪 Test Endpoints

### 1. Health Check
```bash
curl http://localhost:8080/api/test/hello
```

**Expected Response:**
```json
{
  "message": "OneGov Backend is running!",
  "status": "success"
}
```

---

## 🔐 Authentication APIs

### Register User
```bash
curl -X POST http://localhost:8080/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "email": "user@example.com",
    "password": "password123",
    "name": "John Doe",
    "phone": "9876543210",
    "role": "citizen"
  }'
```

**Expected Response:**
```json
{
  "token": "eyJhbGciOiJIUzI1NiJ9...",
  "user": {
    "userId": "uuid",
    "email": "user@example.com",
    "name": "John Doe",
    "phone": "9876543210",
    "role": "citizen"
  }
}
```

### Login User
```bash
curl -X POST http://localhost:8080/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "user@example.com",
    "password": "password123"
  }'
```

### Get User Profile
```bash
curl http://localhost:8080/api/auth/profile/{userId}
```

### Verify Token
```bash
curl http://localhost:8080/api/auth/verify \
  -H "Authorization: Bearer YOUR_JWT_TOKEN"
```

---

## 📝 Application APIs

### Submit Application
```bash
curl -X POST http://localhost:8080/api/applications \
  -H "Content-Type: application/json" \
  -d '{
    "userId": "user-uuid",
    "schemeName": "PM Kisan Yojana",
    "schemeId": "pm-kisan",
    "documents": ["doc1-id", "doc2-id"],
    "formData": {
      "name": "John Doe",
      "aadhaar": "1234-5678-9012"
    }
  }'
```

**Expected Response:**
```json
{
  "applicationId": "uuid",
  "userId": "user-uuid",
  "trackingId": "APP1234567890",
  "schemeName": "PM Kisan Yojana",
  "status": "submitted",
  "submittedAt": "2026-02-27T00:00:00",
  "timeline": [...]
}
```

### Track Application by Tracking ID
```bash
curl http://localhost:8080/api/applications/track/APP1234567890
```

### Get Application by ID
```bash
curl http://localhost:8080/api/applications/{applicationId}
```

### Get User's Applications
```bash
curl http://localhost:8080/api/applications/user/{userId}
```

### Update Application Status (Officer)
```bash
curl -X PUT http://localhost:8080/api/applications/{applicationId}/status \
  -H "Content-Type: application/json" \
  -d '{
    "status": "approved",
    "officerName": "Officer Name",
    "officerId": "officer-uuid"
  }'
```

---

## 📄 Document APIs

### Upload Document
```bash
curl -X POST http://localhost:8080/api/documents/upload \
  -H "Content-Type: application/json" \
  -d '{
    "userId": "user-uuid",
    "type": "aadhaar",
    "fileName": "aadhaar.pdf",
    "fileUrl": "https://storage.url/aadhaar.pdf",
    "fileSize": 102400
  }'
```

### Get Document by ID
```bash
curl http://localhost:8080/api/documents/{documentId}
```

### Get User's Documents
```bash
curl http://localhost:8080/api/documents/user/{userId}
```

### Delete Document
```bash
curl -X DELETE http://localhost:8080/api/documents/{documentId}
```

### Verify Document (Officer)
```bash
curl -X PUT http://localhost:8080/api/documents/{documentId}/verify \
  -H "Content-Type: application/json" \
  -d '{
    "verifiedBy": "officer-uuid",
    "status": "verified"
  }'
```

---

## 🚨 Complaint APIs

### File Complaint
```bash
curl -X POST http://localhost:8080/api/complaints \
  -H "Content-Type: application/json" \
  -d '{
    "userId": "user-uuid",
    "type": "service",
    "category": "delay",
    "description": "Application processing is delayed",
    "priority": "high"
  }'
```

**Expected Response:**
```json
{
  "complaintId": "uuid",
  "userId": "user-uuid",
  "trackingId": "CMP1234567890",
  "type": "service",
  "category": "delay",
  "status": "submitted",
  "priority": "high",
  "createdAt": "2026-02-27T00:00:00"
}
```

### Track Complaint by Tracking ID
```bash
curl http://localhost:8080/api/complaints/track/CMP1234567890
```

### Get Complaint by ID
```bash
curl http://localhost:8080/api/complaints/{complaintId}
```

### Get User's Complaints
```bash
curl http://localhost:8080/api/complaints/user/{userId}
```

### Update Complaint Status
```bash
curl -X PUT http://localhost:8080/api/complaints/{complaintId}/status \
  -H "Content-Type: application/json" \
  -d '{
    "status": "resolved",
    "resolution": "Issue has been resolved"
  }'
```

### Assign Complaint to Officer
```bash
curl -X PUT http://localhost:8080/api/complaints/{complaintId}/assign \
  -H "Content-Type: application/json" \
  -d '{
    "officerId": "officer-uuid"
  }'
```

---

## 🔧 Testing with Postman/Thunder Client

### Import Collection
1. Create a new collection named "OneGov API"
2. Add base URL: `http://localhost:8080`
3. Import all endpoints from above

### Environment Variables
```json
{
  "baseUrl": "http://localhost:8080",
  "token": "",
  "userId": "",
  "applicationId": "",
  "documentId": "",
  "complaintId": ""
}
```

---

## 📊 Testing Flow

### Complete User Journey:
1. **Register** → Get JWT token
2. **Login** → Verify token works
3. **Upload Documents** → Get document IDs
4. **Submit Application** → Get tracking ID
5. **Track Application** → Check status
6. **File Complaint** (if needed) → Get complaint tracking ID
7. **Track Complaint** → Check resolution

---

## ⚠️ Common Issues

### Issue: Connection Refused
**Solution**: Ensure backend is running on port 8080
```bash
cd backend
mvn spring-boot:run
```

### Issue: Firebase Error
**Solution**: Check `firebase-service-account.json` exists in `backend/src/main/resources/`

### Issue: JWT Token Invalid
**Solution**: Token expires after configured time. Login again to get new token.

---

## 🎯 Next Steps

1. ✅ All APIs are working
2. ⏳ Integrate with Next.js frontend
3. ⏳ Add file upload to Firebase Storage
4. ⏳ Add email notifications
5. ⏳ Add SMS notifications

---

## 📝 Notes

- All passwords are hashed using BCrypt
- JWT tokens expire based on `jwt.expiration` in `application.properties`
- CORS is configured to allow `http://localhost:3000` (Next.js frontend)
- All timestamps are in ISO 8601 format


---

## 🏥 Health Services APIs

### Submit Birth Certificate
```bash
curl -X POST http://localhost:8080/api/health-services \
  -H "Content-Type: application/json" \
  -d '{
    "userId": "user-uuid",
    "serviceType": "birth-certificate",
    "formData": {
      "childName": "Baby Name",
      "fatherName": "Father Name",
      "motherName": "Mother Name",
      "dateOfBirth": "2024-01-01",
      "placeOfBirth": "Hospital Name",
      "hospitalName": "Hospital Name",
      "address": "Full Address"
    }
  }'
```

### Submit Death Certificate
```bash
curl -X POST http://localhost:8080/api/health-services \
  -H "Content-Type: application/json" \
  -d '{
    "userId": "user-uuid",
    "serviceType": "death-certificate",
    "formData": {
      "deceasedName": "Deceased Name",
      "dateOfDeath": "2024-01-01",
      "placeOfDeath": "Hospital Name",
      "causeOfDeath": "Natural",
      "informantName": "Informant Name",
      "relationship": "Son"
    }
  }'
```

### Submit Health Card Application
```bash
curl -X POST http://localhost:8080/api/health-services \
  -H "Content-Type: application/json" \
  -d '{
    "userId": "user-uuid",
    "serviceType": "health-card",
    "formData": {
      "fullName": "John Doe",
      "aadhaar": "1234-5678-9012",
      "dateOfBirth": "1990-01-01",
      "bloodGroup": "O+",
      "address": "Full Address"
    }
  }'
```

### Submit Vaccination Certificate
```bash
curl -X POST http://localhost:8080/api/health-services \
  -H "Content-Type: application/json" \
  -d '{
    "userId": "user-uuid",
    "serviceType": "vaccination-certificate",
    "formData": {
      "fullName": "John Doe",
      "aadhaar": "1234-5678-9012",
      "vaccineName": "COVID-19",
      "dose": "1",
      "dateOfVaccination": "2024-01-01"
    }
  }'
```

### Track Health Service
```bash
curl http://localhost:8080/api/health-services/track/BIRTH1234567890
```

### Get User's Health Services
```bash
curl http://localhost:8080/api/health-services/user/{userId}
```

### Update Health Service Status (Officer)
```bash
curl -X PUT http://localhost:8080/api/health-services/{serviceId}/status \
  -H "Content-Type: application/json" \
  -d '{
    "status": "issued",
    "certificateNumber": "CERT123456"
  }'
```

---

## 👤 Citizen Profile & Scheme Eligibility APIs

### Create/Update Citizen Profile
```bash
curl -X POST http://localhost:8080/api/profiles \
  -H "Content-Type: application/json" \
  -d '{
    "userId": "user-uuid",
    "name": "John Doe",
    "age": 35,
    "gender": "Male",
    "category": "General",
    "occupation": "Farmer",
    "income": 300000,
    "state": "Maharashtra",
    "hasBPLCard": false,
    "isMinority": false,
    "hasDisability": false,
    "isStudent": false,
    "isFarmer": true
  }'
```

**Expected Response:**
```json
{
  "profileId": "uuid",
  "userId": "user-uuid",
  "name": "John Doe",
  "age": 35,
  "eligibleSchemes": ["pm-kisan", "ayushman-bharat"],
  "createdAt": "2026-02-27T00:00:00",
  "updatedAt": "2026-02-27T00:00:00"
}
```

### Get Profile by User ID
```bash
curl http://localhost:8080/api/profiles/user/{userId}
```

### Get Profile by Profile ID
```bash
curl http://localhost:8080/api/profiles/{profileId}
```

---

## 📊 Complete API Summary

### Total Endpoints: 31

**Authentication (4 endpoints)**
- POST /api/auth/register
- POST /api/auth/login
- GET /api/auth/profile/{userId}
- GET /api/auth/verify

**Applications (5 endpoints)**
- POST /api/applications
- GET /api/applications/{id}
- GET /api/applications/track/{trackingId}
- GET /api/applications/user/{userId}
- PUT /api/applications/{id}/status

**Documents (5 endpoints)**
- POST /api/documents/upload
- GET /api/documents/{id}
- GET /api/documents/user/{userId}
- DELETE /api/documents/{id}
- PUT /api/documents/{id}/verify

**Complaints (6 endpoints)**
- POST /api/complaints
- GET /api/complaints/{id}
- GET /api/complaints/track/{trackingId}
- GET /api/complaints/user/{userId}
- PUT /api/complaints/{id}/status
- PUT /api/complaints/{id}/assign

**Health Services (5 endpoints)**
- POST /api/health-services
- GET /api/health-services/{id}
- GET /api/health-services/track/{trackingId}
- GET /api/health-services/user/{userId}
- PUT /api/health-services/{id}/status

**Citizen Profiles (3 endpoints)**
- POST /api/profiles
- GET /api/profiles/user/{userId}
- GET /api/profiles/{profileId}

**Test (1 endpoint)**
- GET /api/test/hello

---

## 🎯 Scheme Eligibility Logic

The backend automatically calculates eligible schemes based on profile:

- **PM Kisan**: Farmers with land
- **Ayushman Bharat**: Income < ₹5 lakhs OR BPL card holder
- **PM Scholarship**: Students
- **Widow Pension**: Female, Age > 40
- **Old Age Pension**: Age > 60
- **SC/ST Scholarship**: SC or ST category
- **Minority Scholarship**: Minority status
- **Disability Pension**: Has disability

---

## 🔄 Voice Assistant Integration

Voice assistant data is processed through the complaint API:
1. Voice input is converted to text (frontend)
2. NLP processing extracts complaint details (frontend)
3. Complaint is submitted via POST /api/complaints
4. Tracking ID is returned for monitoring

---

## ✅ All Features Covered

Your complete OneGov portal now has backend support for:
- ✅ User Authentication (JWT)
- ✅ Health Services (Birth/Death/Health Card/Vaccination)
- ✅ Scheme Applications
- ✅ Document Vault
- ✅ Application Tracking
- ✅ Complaint Management
- ✅ Citizen Profile & Eligibility
- ✅ Voice Assistant (via Complaints API)
