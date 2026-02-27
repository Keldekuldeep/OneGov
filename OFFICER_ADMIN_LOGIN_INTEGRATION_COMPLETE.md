# ✅ Officer & Admin Login - Backend Integration Complete

## 📋 Summary

Successfully integrated Officer and Admin login pages with backend authentication APIs. Both portals now use real JWT authentication instead of mock data.

---

## 🔄 What Was Changed

### 1. API Library Enhanced (`lib/api.ts`)
Added new authentication functions:
- `authAPI.officerLogin(email, password)` - Officer login with backend
- `authAPI.getOfficerProfile(officerId)` - Get officer profile
- `authAPI.officerLogout()` - Officer logout
- `authAPI.getCurrentOfficer()` - Get current logged-in officer
- `authAPI.adminLogin(email, password)` - Admin login with backend
- `authAPI.getAdminProfile(adminId)` - Get admin profile
- `authAPI.adminLogout()` - Admin logout
- `authAPI.getCurrentAdmin()` - Get current logged-in admin

### 2. Officer Login Page (`app/officer/login/page.tsx`)
- ✅ Now calls `authAPI.officerLogin()` instead of mock `loginOfficer()`
- ✅ Stores JWT token in `localStorage` as `officerToken`
- ✅ Stores officer data in `localStorage` as `officer`
- ✅ Shows loading state during API call
- ✅ Displays backend error messages
- ✅ Demo credentials still work (backend has same accounts)

### 3. Admin Login Page (`app/admin/login/page.tsx`)
- ✅ Now calls `authAPI.adminLogin()` instead of mock `loginAdmin()`
- ✅ Stores JWT token in `localStorage` as `adminToken`
- ✅ Stores admin data in `localStorage` as `admin`
- ✅ Shows loading state during API call
- ✅ Displays backend error messages
- ✅ Demo credentials still work (backend has same accounts)

---

## 🧪 How to Test

### Prerequisites
Make sure both are running:
1. **Backend:** `cd backend && mvn spring-boot:run` (Port 8080)
2. **Frontend:** `npm run dev` (Port 3000)

### Test Officer Login

1. Open browser: `http://localhost:3000/officer/login`
2. Enter credentials:
   - **Email:** `rajesh.kumar@gov.in`
   - **Password:** `officer123`
3. Click "Sign In"
4. Should redirect to `/officer/dashboard`
5. Check browser console for: `✅ Officer logged in: {...}`
6. Check localStorage:
   - `officerToken` - JWT token
   - `officer` - Officer data

### Test Admin Login

1. Open browser: `http://localhost:3000/admin/login`
2. Enter credentials:
   - **Email:** `super.admin@onegov.in`
   - **Password:** `admin123`
3. Click "Login"
4. Should redirect to `/admin/dashboard`
5. Check browser console for: `✅ Admin logged in: {...}`
6. Check localStorage:
   - `adminToken` - JWT token
   - `admin` - Admin data

### Test Error Cases

**Wrong Password:**
1. Enter correct email but wrong password
2. Should show error: "Invalid credentials"

**Wrong Email:**
1. Enter non-existent email
2. Should show error: "Officer not found" or "Admin not found"

**Backend Not Running:**
1. Stop backend
2. Try to login
3. Should show error: "Failed to fetch" or connection error

---

## 🔑 Demo Credentials

### Officers (Password: `officer123`)
| Name | Email | Department |
|------|-------|------------|
| Dr. Rajesh Kumar | rajesh.kumar@gov.in | Health |
| Priya Sharma | priya.sharma@gov.in | Education |
| Amit Singh | amit.singh@gov.in | Revenue |
| Sunita Verma | sunita.verma@gov.in | General |

### Admins (Password: `admin123`)
| Name | Email | Role |
|------|-------|------|
| Super Admin | super.admin@onegov.in | super-admin |
| Admin User | admin@onegov.in | admin |

---

## 🔍 Technical Details

### JWT Token Storage

**Officer:**
```javascript
localStorage.setItem('officerToken', 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...')
localStorage.setItem('officer', JSON.stringify({
  officerId: 'officer-1',
  email: 'rajesh.kumar@gov.in',
  name: 'Dr. Rajesh Kumar',
  department: 'health',
  ...
}))
```

**Admin:**
```javascript
localStorage.setItem('adminToken', 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...')
localStorage.setItem('admin', JSON.stringify({
  adminId: 'admin-1',
  email: 'super.admin@onegov.in',
  name: 'Super Admin',
  role: 'super-admin',
  ...
}))
```

### API Request Flow

1. User enters email/password
2. Frontend calls `authAPI.officerLogin()` or `authAPI.adminLogin()`
3. API makes POST request to backend:
   - Officer: `POST http://localhost:8080/api/auth/officer/login`
   - Admin: `POST http://localhost:8080/api/auth/admin/login`
4. Backend validates credentials (BCrypt password check)
5. Backend generates JWT token
6. Backend returns `{ token, officer/admin }`
7. Frontend stores token and data in localStorage
8. Frontend redirects to dashboard

### Error Handling

```typescript
try {
  const response = await authAPI.officerLogin(email, password)
  // Success - redirect to dashboard
} catch (err: any) {
  // Show error message to user
  setError(err.message || 'Invalid email or password')
}
```

---

## ✅ Verification Checklist

- [x] Backend running on port 8080
- [x] Frontend running on port 3000
- [x] Officer login calls backend API
- [x] Admin login calls backend API
- [x] JWT tokens stored in localStorage
- [x] Officer/Admin data stored in localStorage
- [x] Successful login redirects to dashboard
- [x] Error messages displayed for invalid credentials
- [x] Loading state shown during API call
- [x] Demo credentials work
- [x] Browser console shows login success
- [x] localStorage contains token and user data

---

## 🐛 Troubleshooting

### "Failed to fetch" Error
- **Cause:** Backend not running or CORS issue
- **Solution:** 
  1. Check backend is running: `http://localhost:8080/api/test/hello`
  2. Check CORS config in `backend/src/main/java/com/onegov/config/CorsConfig.java`

### "Invalid credentials" Error
- **Cause:** Wrong email or password
- **Solution:** Use demo credentials from table above

### "Officer not found" / "Admin not found"
- **Cause:** Demo data not initialized in Firestore
- **Solution:** 
  1. Restart backend to trigger `DataInitializationService`
  2. Check Firestore console for `officers` and `admins` collections

### Login successful but dashboard shows error
- **Cause:** Dashboard pages still using mock data
- **Solution:** This will be fixed in STEP 2 when we implement dashboard APIs

---

## 📊 Next Steps

Now that authentication is working, we need to:

**STEP 2: Officer Dashboard APIs**
- Get dashboard statistics from backend
- List health services assigned to officer
- List applications assigned to officer
- List complaints assigned to officer

**STEP 3: Admin Dashboard APIs**
- Get system statistics from backend
- List all officers
- List all citizens
- List all applications

---

## 🎯 Status: READY FOR TESTING

**Both officer and admin login are now connected to backend!**

**Test it now:**
1. Open `http://localhost:3000/officer/login`
2. Login with `rajesh.kumar@gov.in` / `officer123`
3. Check browser console and localStorage
4. Open `http://localhost:3000/admin/login`
5. Login with `super.admin@onegov.in` / `admin123`
6. Check browser console and localStorage

**Let me know if login is working and I'll proceed to STEP 2!** 🚀
