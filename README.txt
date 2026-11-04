# 🚗 Vehicle Inspection & Repair Advisory Web System

<div align="center">

![Vehicle Inspection](https://img.shields.io/badge/Project-Vehicle%20Inspection-1a237e?style=for-the-badge&logo=car&logoColor=white)
![Spring Boot](https://img.shields.io/badge/Spring%20Boot-3.4.5-6DB33F?style=for-the-badge&logo=springboot&logoColor=white)
![React](https://img.shields.io/badge/React-18-61DAFB?style=for-the-badge&logo=react&logoColor=black)
![Flutter](https://img.shields.io/badge/Flutter-Mobile-02569B?style=for-the-badge&logo=flutter&logoColor=white)
![MySQL](https://img.shields.io/badge/MySQL-8.0-4479A1?style=for-the-badge&logo=mysql&logoColor=white)
![JWT](https://img.shields.io/badge/JWT-Auth-000000?style=for-the-badge&logo=jsonwebtokens&logoColor=white)

**A full-stack web platform connecting vehicle buyers with certified inspectors across Sri Lanka**

*EAD2 Coursework Project — NIBM Higher National Diploma in Software Engineering*

[🌐 Live Demo](#) · [📱 Mobile App](#) · [📖 API Docs](#api-endpoints) · [🐛 Report Bug](https://github.com/kavindugayasiri/Madara_Motors_web_System/issues)

</div>

---

## 📋 Table of Contents

- [About the Project](#-about-the-project)
- [Features](#-features)
- [Tech Stack](#-tech-stack)
- [System Architecture](#-system-architecture)
- [Getting Started](#-getting-started)
- [API Endpoints](#-api-endpoints)
- [User Roles](#-user-roles)
- [Screenshots](#-screenshots)
- [Database Schema](#-database-schema)
- [Contributing](#-contributing)
- [Author](#-author)

---

## 🎯 About the Project

The **Vehicle Inspection & Repair Advisory Web System** is a comprehensive digital platform designed to solve a critical problem in Sri Lanka's used vehicle market — the lack of transparent, accessible, and reliable vehicle inspection services.

### 🔍 Problem Statement
When purchasing a used vehicle in Sri Lanka, buyers face significant risks due to hidden mechanical issues, lack of professional inspection services, and no centralized platform to find certified vehicle inspectors. This often leads to costly repairs after purchase.

### ✅ Solution
This platform bridges the gap between **vehicle buyers (customers)** and **certified vehicle inspectors**, providing:
- A searchable directory of verified inspectors across Sri Lanka
- Direct inspector hiring with appointment booking
- Repair cost advisory and estimates
- Ratings and reviews for inspectors
- Real-time request tracking for both customers and inspectors

---

## ✨ Features

### 👤 Customer Features
- 🔍 **Search & Browse Inspectors** — Filter by location, specialization, rating, and availability
- 📋 **Inspector Profiles** — View detailed profiles, certifications, and customer reviews
- 📅 **Hire Directly** — Send hiring requests with vehicle details and preferred date
- 📊 **Track Requests** — Real-time status updates (Pending → Accepted → Completed)
- ⭐ **Rate & Review** — Leave feedback for completed inspections
- 🔧 **Repair Info** — Browse repair cost estimates and advisory guides

### 🔧 Inspector Features
- 🗂️ **Professional Dashboard** — Manage all incoming hiring requests
- ✅ **Accept/Reject Requests** — Full control over workload and schedule
- 📈 **Job History** — Track completed inspections and earnings
- 👤 **Profile Management** — Update certifications, location, and specializations

### 🛡️ Admin Features
- 👥 **User Management** — View and manage all registered users
- ✔️ **Inspector Verification** — Approve/reject inspector registrations
- 🔧 **Repair Database** — Add, update, and delete repair information
- 📊 **Platform Analytics** — Monitor system activity and usage statistics

---

## 🛠️ Tech Stack

### Backend
| Technology | Version | Purpose |
|-----------|---------|---------|
| **Java** | 17 | Core language |
| **Spring Boot** | 3.4.5 | REST API framework |
| **Spring Security** | 6.x | Authentication & authorization |
| **JWT (jjwt)** | 0.12.6 | Token-based authentication |
| **Spring Data JPA** | — | ORM and database layer |
| **Hibernate** | 6.x | JPA implementation |
| **Maven** | 3.x | Build and dependency management |

### Frontend (Web)
| Technology | Version | Purpose |
|-----------|---------|---------|
| **React** | 18 | UI framework |
| **Vite** | 5.x | Build tool and dev server |
| **React Router DOM** | v6 | Client-side routing |
| **Axios** | 1.x | HTTP client with JWT interceptor |
| **Context API** | — | Global auth state management |

### Mobile App
| Technology | Version | Purpose |
|-----------|---------|---------|
| **Flutter** | 3.x | Cross-platform mobile framework |
| **Dart** | 3.x | Programming language |
| **Provider / Riverpod** | — | State management |
| **HTTP / Dio** | — | API communication |

### Database & Infrastructure
| Technology | Purpose |
|-----------|---------|
| **MySQL 8.0** | Primary relational database |
| **Spring Boot DevTools** | Hot reload in development |

---

## 🏗️ System Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                        CLIENTS                              │
│                                                             │
│   ┌─────────────────┐        ┌──────────────────────────┐  │
│   │   React Web App │        │  Flutter Mobile App      │  │
│   │  (Vite + React) │        │  (Android / iOS)         │  │
│   │   Port: 5173    │        │                          │  │
│   └────────┬────────┘        └──────────┬───────────────┘  │
│            │                            │                   │
└────────────┼────────────────────────────┼───────────────────┘
             │  HTTP/REST + JWT           │  HTTP/REST + JWT
             ▼                            ▼
┌─────────────────────────────────────────────────────────────┐
│              Spring Boot REST API (Port: 8080)              │
│                                                             │
│  ┌────────────┐  ┌────────────┐  ┌────────────────────┐    │
│  │   Auth     │  │  Hiring    │  │  Inspector/Admin   │    │
│  │ Controller │  │ Controller │  │    Controllers     │    │
│  └─────┬──────┘  └─────┬──────┘  └────────┬───────────┘    │
│        │               │                  │                 │
│  ┌─────▼───────────────▼──────────────────▼───────────┐    │
│  │            Spring Security + JWT Filter             │    │
│  └─────────────────────────────────────────────────────┘    │
│                           │                                 │
│  ┌────────────────────────▼────────────────────────────┐    │
│  │            Service Layer (Business Logic)            │    │
│  └────────────────────────┬────────────────────────────┘    │
│                           │                                 │
│  ┌────────────────────────▼────────────────────────────┐    │
│  │         Repository Layer (Spring Data JPA)          │    │
│  └────────────────────────┬────────────────────────────┘    │
│                           │                                 │
└───────────────────────────┼─────────────────────────────────┘
                            │  JPA / Hibernate
                            ▼
              ┌─────────────────────────┐
              │     MySQL Database      │
              │  vehicle_inspection_db  │
              └─────────────────────────┘
```

---

## 🚀 Getting Started

### Prerequisites

Make sure you have the following installed:

- ☕ **Java 17** — [Download](https://www.oracle.com/java/technologies/downloads/#java17)
- 📦 **Maven 3.6+** — [Download](https://maven.apache.org/download.cgi)
- 🗄️ **MySQL 8.0** — [Download](https://dev.mysql.com/downloads/)
- 🌐 **Node.js 18+** — [Download](https://nodejs.org/)
- 📱 **Flutter SDK** (for mobile) — [Download](https://flutter.dev/docs/get-started/install)
- 💻 **VS Code** with Java Extension Pack + Spring Boot Extension Pack

---

### 1️⃣ Clone the Repository

```bash
git clone https://github.com/kavindugayasiri/Madara_Motors_web_System.git
cd Madara_Motors_web_System
```

---

### 2️⃣ Database Setup

Open **MySQL Workbench** or **MySQL CLI** and run:

```sql
CREATE DATABASE vehicle_inspection_db;
USE vehicle_inspection_db;
```

Then insert the default admin user (after running the backend once to auto-create tables):

```sql
INSERT INTO users (full_name, email, password, role, phone, created_at)
VALUES (
  'Admin User',
  'admin@vehicleinspect.lk',
  '$2a$10$N9qo8uLOickgx2ZMRZoMyeIjZAgcfl7p92ldGxad68LJZdL17lKqe',
  'ADMIN',
  '0771234567',
  NOW()
);
-- Default password: admin123
```

---

### 3️⃣ Backend Setup

Navigate to the backend folder:

```bash
cd Madara_Motos_WEBSysteme
```

Configure your database credentials in `src/main/resources/application.properties`:

```properties
server.port=8080
spring.datasource.url=jdbc:mysql://localhost:3306/vehicle_inspection_db
spring.datasource.username=root
spring.datasource.password=YOUR_MYSQL_PASSWORD
spring.jpa.hibernate.ddl-auto=update
app.jwt.secret=YOUR_JWT_SECRET_KEY
app.jwt.expiration=86400000
```

Run the backend:

```bash
mvn spring-boot:run
```

✅ Backend starts at **http://localhost:8080**

---

### 4️⃣ Frontend (Web) Setup

```bash
# Navigate to frontend folder
cd vehicle-inspection-frontend

# Install dependencies
npm install

# Start development server
npm run dev
```

✅ Frontend starts at **http://localhost:5173**

---

### 5️⃣ Flutter Mobile App Setup

```bash
# Navigate to mobile folder
cd vehicle-inspection-mobile

# Get Flutter dependencies
flutter pub get

# Run on Android emulator or device
flutter run
```

---

## 📡 API Endpoints

### 🔐 Authentication
| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|---------------|
| `POST` | `/api/auth/register` | Register new user | ❌ |
| `POST` | `/api/auth/login` | Login and get JWT token | ❌ |

### 👥 Inspectors
| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|---------------|
| `GET` | `/api/inspectors` | Get all verified inspectors | ❌ |
| `GET` | `/api/inspectors/{id}` | Get inspector by ID | ❌ |
| `GET` | `/api/inspectors/search?location=&specialization=` | Search inspectors | ❌ |

### 📋 Hiring
| Method | Endpoint | Description | Role |
|--------|----------|-------------|------|
| `POST` | `/api/hiring/request` | Send hiring request | CUSTOMER |
| `GET` | `/api/hiring/my-requests` | Customer's requests | CUSTOMER |
| `GET` | `/api/hiring/inspector-requests` | Inspector's requests | INSPECTOR |
| `PUT` | `/api/hiring/{id}/status` | Accept/Reject request | INSPECTOR |

### 🛡️ Admin
| Method | Endpoint | Description | Role |
|--------|----------|-------------|------|
| `GET` | `/api/admin/users` | Get all users | ADMIN |
| `GET` | `/api/admin/inspectors` | Get all inspectors | ADMIN |
| `PATCH` | `/api/admin/inspectors/{id}/verify` | Verify inspector | ADMIN |
| `POST` | `/api/admin/repairs` | Add repair info | ADMIN |
| `DELETE` | `/api/admin/repairs/{id}` | Delete repair info | ADMIN |

> 🔒 **Authentication**: All protected endpoints require `Authorization: Bearer <JWT_TOKEN>` header

---

## 👥 User Roles

| Role | Description | Access Level |
|------|-------------|-------------|
| 🙋 **CUSTOMER** | Vehicle buyers looking for inspection services | Hire inspectors, track requests, rate inspectors |
| 🔧 **INSPECTOR** | Certified vehicle inspection professionals | Manage requests, update profile, view job history |
| 🛡️ **ADMIN** | Platform administrators | Full platform management, user verification |

---

## 📱 Mobile App Screens

### Customer App (9 Screens)
- Splash Screen & Login/Register
- Home Dashboard
- Inspector Search & Filter
- Inspector Profile View
- Hire Inspector Form
- My Requests & Status Tracking
- Ratings & Reviews
- Profile Settings

### Inspector App (8 Screens)
- Dashboard & Job Overview
- Incoming Request List
- Request Details & Accept/Reject
- Job History
- Profile Management
- Notifications

### Admin App (8 Screens)
- Admin Dashboard
- User Management
- Inspector Verification
- Repair Database Management
- Platform Analytics
- Settings

---

## 🗄️ Database Schema

### Key Tables

```sql
-- Users table (all roles)
users (id, full_name, email, password, role, phone, created_at)

-- Inspector profiles
inspector_profiles (id, user_id, location, specialization, experience, 
                   rating, is_verified, bio, profile_image)

-- Hiring requests
hiring_requests (id, customer_id, inspector_id, vehicle_type, 
                vehicle_reg, description, status, requested_at, updated_at)
-- Status: PENDING | ACCEPTED | REJECTED | COMPLETED

-- Repair information
repair_info (id, vehicle_type, issue_type, description, 
            estimated_cost_min, estimated_cost_max, created_at)

-- Ratings & Reviews  
ratings (id, customer_id, inspector_id, hiring_request_id, 
        rating, review, created_at)
```

---

## 🔒 Security Features

- ✅ **JWT Authentication** — Stateless token-based auth (24h expiry)
- ✅ **BCrypt Password Hashing** — Secure password storage
- ✅ **Role-Based Access Control** — Endpoint protection by user role
- ✅ **CORS Configuration** — Controlled cross-origin requests
- ✅ **Email-Based Login** — No username required
- ✅ **Input Validation** — `@Valid` annotations on all DTOs

---

## 📂 Project Structure

```
Madara_Motors_web_System/
│
├── 📁 Madara_Motos_WEBSysteme/          # Spring Boot Backend
│   ├── src/main/java/com/vehicleinspection/
│   │   ├── config/          # Security & CORS config
│   │   ├── controller/      # REST controllers
│   │   ├── dto/             # Request/Response DTOs
│   │   ├── model/           # JPA entities
│   │   ├── repository/      # Spring Data repositories
│   │   ├── security/        # JWT filter & UserDetailsService
│   │   └── service/         # Business logic
│   └── src/main/resources/
│       └── application.properties
│
├── 📁 vehicle-inspection-frontend/      # React Web App
│   ├── src/
│   │   ├── components/      # Navbar, shared components
│   │   ├── context/         # AuthContext (JWT state)
│   │   ├── pages/
│   │   │   ├── auth/        # Login, Register
│   │   │   ├── customer/    # Inspector search, hire, requests
│   │   │   ├── inspector/   # Dashboard
│   │   │   ├── admin/       # Admin panel
│   │   │   └── ...          # Home, RepairInfo, Reviews
│   │   ├── services/        # Axios API service
│   │   └── App.jsx
│   └── package.json
│
└── 📁 vehicle-inspection-mobile/        # Flutter App
    ├── lib/
    │   ├── screens/         # All 25 app screens
    │   ├── models/          # Data models
    │   ├── services/        # API calls
    │   └── main.dart
    └── pubspec.yaml
```

---

## 🎓 Academic Information

| Detail | Information |
|--------|-------------|
| **Student** | Kavidu Gayasiri Bandara |
| **Student ID** | kavindugayasiri |
| **Course** | Higher National Diploma in Software Engineering |
| **Institute** | NIBM — National Institute of Business Management |
| **Module** | Enterprise Application Development 2 (EAD2) |
| **Project Type** | Individual Coursework |

---

## 👨‍💻 Author

<div align="center">

**Kavidu Gayasiri Bandara**

[![GitHub](https://img.shields.io/badge/GitHub-kavindugayasiri-181717?style=for-the-badge&logo=github)](https://github.com/kavindugayasiri)
[![Email](https://img.shields.io/badge/Email-kavindugayasiri%40gmail.com-D14836?style=for-the-badge&logo=gmail&logoColor=white)](mailto:kavindugayasiri@gmail.com)

*NIBM Software Engineering Student | Kurunegala, Sri Lanka*

</div>

---

## 📄 License

This project is submitted as coursework for NIBM EAD2 module.

---

<div align="center">

Made with ❤️ by **Kavidu Gayasiri Bandara** | NIBM Sri Lanka 🇱🇰

⭐ Star this repo if you found it helpful!

</div>
