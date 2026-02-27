# 🏛️ OneGov Portal

A comprehensive digital government services platform built with Next.js 14, Spring Boot, and Firebase. This portal provides citizens with seamless access to government services, document management, application tracking, and complaint resolution.

![Next.js](https://img.shields.io/badge/Next.js-14-black)
![Spring Boot](https://img.shields.io/badge/Spring%20Boot-3.2.0-green)
![Firebase](https://img.shields.io/badge/Firebase-Firestore-orange)
![TypeScript](https://img.shields.io/badge/TypeScript-5.0-blue)
![Java](https://img.shields.io/badge/Java-17-red)

## 🌟 Features

### Citizen Portal
- **12 Integrated Government Services**
  - 🏥 Health Services (Birth/Death Certificates, Health Cards, Vaccination)
  - 🎓 Education Services (Scholarships, School Admission, Transfer Certificates)
  - 🚗 Transport Services (Driving License, Vehicle Registration)
  - 📜 Revenue Services (Caste/Income/Domicile Certificates, Land Records)
  - ⚡ Utility Services (Electricity, Water, Ration Card, Pension)

- **Document Vault** 📁
  - Upload once, use everywhere
  - Auto-attach documents to applications
  - Document verification tracking

- **Scheme Eligibility Engine** 🎯
  - Smart eligibility matching
  - 10 government schemes
  - Auto-filled applications

- **Application Tracking** 🔍
  - Real-time status updates
  - Complete timeline visualization
  - SMS/Email notifications ready

- **Complaint Management** 📢
  - File complaints with tracking
  - Priority-based resolution
  - Status monitoring

- **Voice Assistant** 🎤
  - Voice-based complaint filing
  - Natural language processing
  - Accessibility features

## 🛠️ Tech Stack

### Frontend
- **Framework**: Next.js 14 (App Router)
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **UI Components**: Shadcn UI
- **State Management**: React Hooks

### Backend
- **Framework**: Spring Boot 3.2.0
- **Language**: Java 17
- **Database**: Firebase Firestore
- **Authentication**: JWT Tokens
- **Security**: BCrypt Password Hashing

### Infrastructure
- **Database**: Firebase Firestore (NoSQL)
- **Storage**: Firebase Storage (for documents)
- **API**: RESTful APIs
- **CORS**: Configured for localhost:3000

## 📦 Installation

### Prerequisites
- Node.js 18+ and npm
- Java 17+
- Maven 3.6+
- Firebase Account

### 1. Clone the Repository
```bash
git clone https://github.com/Keldekuldeep/OneGov.git
cd OneGov
```

### 2. Frontend Setup
```bash
# Install dependencies
npm install

# Run development server
npm run dev
```

Frontend will run on: http://localhost:3000

### 3. Backend Setup

#### Configure Firebase
1. Go to [Firebase Console](https://console.firebase.google.com)
2. Create a new project named `onegov-portal`
3. Go to Project Settings → Service Accounts
4. Click "Generate New Private Key"
5. Save as `backend/src/main/resources/firebase-service-account.json`

#### Run Backend
```bash
cd backend

# Build the project
mvn clean install

# Run Spring Boot
mvn spring-boot:run
```

Backend will run on: http://localhost:8080

## 🚀 Usage

### For Citizens
1. Visit http://localhost:3000
2. Browse available services
3. Upload documents to Document Vault
4. Apply for services/schemes
5. Track applications with tracking ID
6. File complaints if needed

### API Endpoints

#### Authentication
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - Login user
- `GET /api/auth/profile/{userId}` - Get user profile

#### Health Services
- `POST /api/health-services` - Submit health service request
- `GET /api/health-services/track/{trackingId}` - Track service
- `GET /api/health-services/user/{userId}` - Get user's services

#### Applications
- `POST /api/applications` - Submit application
- `GET /api/applications/track/{trackingId}` - Track application
- `GET /api/applications/user/{userId}` - Get user's applications

#### Documents
- `POST /api/documents/upload` - Upload document
- `GET /api/documents/user/{userId}` - Get user's documents
- `DELETE /api/documents/{id}` - Delete document

#### Complaints
- `POST /api/complaints` - File complaint
- `GET /api/complaints/track/{trackingId}` - Track complaint
- `GET /api/complaints/user/{userId}` - Get user's complaints

See [API_TESTING_GUIDE.md](backend/API_TESTING_GUIDE.md) for complete API documentation.

## 📊 Project Structure

```
OneGov/
├── app/                          # Next.js pages
│   ├── services/                 # Service pages
│   ├── document-vault/           # Document management
│   ├── scheme-eligibility/       # Scheme matching
│   ├── track-application/        # Application tracking
│   └── file-complaint/           # Complaint system
├── components/                   # React components
│   ├── schemes/                  # Scheme components
│   ├── ui/                       # UI components
│   └── ...                       # Form components
├── lib/                          # Utilities
│   ├── api.ts                    # API client
│   ├── schemeData.ts             # Scheme rules
│   └── ...                       # Helper functions
├── backend/                      # Spring Boot backend
│   ├── src/main/java/com/onegov/
│   │   ├── controller/           # REST controllers
│   │   ├── service/              # Business logic
│   │   ├── model/                # Data models
│   │   ├── config/               # Configuration
│   │   └── dto/                  # Data transfer objects
│   └── src/main/resources/
│       └── application.properties
└── public/                       # Static assets
```

## 🔐 Security Features

- JWT-based authentication
- BCrypt password hashing
- CORS protection
- Input validation
- Firebase security rules
- Secure document storage

## 📱 Responsive Design

- Mobile-first approach
- Tablet optimized
- Desktop enhanced
- Accessibility compliant

## 🌐 Browser Support

- Chrome (latest)
- Firefox (latest)
- Safari (latest)
- Edge (latest)

## 📈 Future Enhancements

- [ ] Officer Portal (for processing applications)
- [ ] Admin Dashboard (for system management)
- [ ] SMS/Email notifications
- [ ] Payment gateway integration
- [ ] Multi-language support
- [ ] Mobile app (React Native)
- [ ] Biometric authentication
- [ ] AI-powered chatbot

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## 📄 License

This project is licensed under the MIT License.

## 👨‍💻 Developed By

**Team CodeSphere**
- GitHub: [@Keldekuldeep](https://github.com/Keldekuldeep)
- Email: support@onegov.in

## 🙏 Acknowledgments

- Next.js team for the amazing framework
- Spring Boot for robust backend
- Firebase for seamless database
- Shadcn UI for beautiful components
- Tailwind CSS for styling

## 📞 Support

For support, email support@onegov.in or open an issue on GitHub.

---

Made with ❤️ by Team CodeSphere for Digital India 🇮🇳
