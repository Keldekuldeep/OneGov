# STEP 1: Officer & Admin Authentication - Testing Guide

## ✅ What Was Implemented

### New Models
1. `Officer.java` - Officer model with department, designation, role, performance
2. `Admin.java` - Admin model with role (super-admin/admin)

### New DTOs
1. `OfficerLoginRequest.java` - Officer login request
2. `AdminLoginRequest.java` - Admin login request
3. `OfficerResponse.java` - Officer login response with JWT token
4. `AdminResponse.java` - Admin login response with JWT token

### Enhanced Services
1. `AuthService.java` - Added officer and admin authentication methods
2. `DataInitializationService.java` - Auto-creates demo officers and admins on startup

### Enhanced Controllers
1. `AuthController.java` - Added officer and admin login endpoints

### New Firestore Collections
1. `officers` - Stores officer data
2. `admins` - Stores admin data

---

## 🔑 Demo Credentials

### Officers (Password: `officer123`)
1. **Dr. Rajesh Kumar** (Health Officer)
   - Email: `rajesh.kumar@gov.in`
   - Department: Health
   - Role: officer

2. **Priya Sharma** (Senior Education Officer)
   - Email: `priya.sharma@gov.in`
   - Department: Education
   - Role: senior-officer

3. **Amit Singh** (Revenue Officer)
   - Email: `amit.singh@gov.in`
   - Department: Revenue
   - Role: officer

4. **Sunita Verma** (Head Officer)
   - Email: `sunita.verma@gov.in`
   - Department: General
   - Role: head

### Admins (Password: `admin123`)
1. **Super Admin**
   - Email: `super.admin@onegov.in`
   - Role: super-admin

2. **Admin User**
   - Email: `admin@onegov.in`
   - Role: admin

---

## 🧪 API Testing

### 1. Officer Login
**Endpoint:** `POST http://localhost:8080/api/auth/officer/login`

**Request Body:**
```json
{
  "email": "rajesh.kumar@gov.in",
  "password": "officer123"
}
```

**Expected Response (200 OK):**
```json
{
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "officer": {
    "officerId": "officer-1",
    "email": "rajesh.kumar@gov.in",
    "name": "Dr. Rajesh Kumar",
    "phone": "9876543210",
    "department": "health",
    "designation": "Health Officer",
    "role": "officer",
    "status": "active",
    "password": null
  }
}
```

### 2. Get Officer Profile
**Endpoint:** `GET http://localhost:8080/api/auth/officer/profile/officer-1`

**Expected Response (200 OK):**
```json
{
  "officerId": "officer-1",
  "email": "rajesh.kumar@gov.in",
  "name": "Dr. Rajesh Kumar",
  "phone": "9876543210",
  "department": "health",
  "designation": "Health Officer",
  "role": "officer",
  "status": "active"
}
```

### 3. Admin Login
**Endpoint:** `POST http://localhost:8080/api/auth/admin/login`

**Request Body:**
```json
{
  "email": "super.admin@onegov.in",
  "password": "admin123"
}
```

**Expected Response (200 OK):**
```json
{
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "admin": {
    "adminId": "admin-1",
    "email": "super.admin@onegov.in",
    "name": "Super Admin",
    "phone": "9876543200",
    "role": "super-admin",
    "password": null,
    "lastLogin": "2026-02-27T..."
  }
}
```

### 4. Get Admin Profile
**Endpoint:** `GET http://localhost:8080/api/auth/admin/profile/admin-1`

**Expected Response (200 OK):**
```json
{
  "adminId": "admin-1",
  "email": "super.admin@onegov.in",
  "name": "Super Admin",
  "phone": "9876543200",
  "role": "super-admin"
}
```

---

## 🔍 Error Cases to Test

### 1. Invalid Officer Credentials
**Request:**
```json
{
  "email": "rajesh.kumar@gov.in",
  "password": "wrongpassword"
}
```

**Expected Response (401 Unauthorized):**
```json
{
  "success": false,
  "message": "Invalid credentials",
  "data": null
}
```

### 2. Officer Not Found
**Request:**
```json
{
  "email": "nonexistent@gov.in",
  "password": "officer123"
}
```

**Expected Response (401 Unauthorized):**
```json
{
  "success": false,
  "message": "Officer not found",
  "data": null
}
```

### 3. Invalid Admin Credentials
**Request:**
```json
{
  "email": "super.admin@onegov.in",
  "password": "wrongpassword"
}
```

**Expected Response (401 Unauthorized):**
```json
{
  "success": false,
  "message": "Invalid credentials",
  "data": null
}
```

---

## 🚀 How to Test

### Using Command Line (curl)

**Officer Login:**
```bash
curl -X POST http://localhost:8080/api/auth/officer/login ^
  -H "Content-Type: application/json" ^
  -d "{\"email\":\"rajesh.kumar@gov.in\",\"password\":\"officer123\"}"
```

**Admin Login:**
```bash
curl -X POST http://localhost:8080/api/auth/admin/login ^
  -H "Content-Type: application/json" ^
  -d "{\"email\":\"super.admin@onegov.in\",\"password\":\"admin123\"}"
```

### Using Postman
1. Create a new POST request
2. Set URL to `http://localhost:8080/api/auth/officer/login`
3. Set Headers: `Content-Type: application/json`
4. Set Body (raw JSON):
   ```json
   {
     "email": "rajesh.kumar@gov.in",
     "password": "officer123"
   }
   ```
5. Click Send

---

## ✅ Verification Checklist

- [ ] Backend starts without errors
- [ ] Demo officers are created in Firestore (check `officers` collection)
- [ ] Demo admins are created in Firestore (check `admins` collection)
- [ ] Officer login works with correct credentials
- [ ] Officer login fails with wrong credentials
- [ ] Admin login works with correct credentials
- [ ] Admin login fails with wrong credentials
- [ ] JWT tokens are generated correctly
- [ ] Officer profile can be fetched by ID
- [ ] Admin profile can be fetched by ID
- [ ] Passwords are hashed in Firestore (not plain text)

---

## 🔧 Troubleshooting

### Backend won't start
```bash
cd backend
mvn clean install
mvn spring-boot:run
```

### Demo data not created
- Check console logs for "Creating demo officers..." and "Creating demo admins..."
- Check Firestore console for `officers` and `admins` collections
- If needed, delete collections and restart backend

### 401 Unauthorized errors
- Verify email and password are correct
- Check Firestore to ensure officer/admin exists
- Verify password is hashed in Firestore

---

## 📊 Next Steps

After testing STEP 1, we will proceed to:
- **STEP 2:** Officer Dashboard APIs
- **STEP 3:** Officer Application Management
- **STEP 4:** Officer Document Verification
- **STEP 5:** Officer Complaint Management

---

## 🎯 Status: READY FOR TESTING

**Please test the officer and admin login endpoints and let me know if everything works!**
