# ⚡ LinkSnap - URL Shortener with Real-Time Analytics

[![Spring Boot](https://img.shields.io/badge/Spring%20Boot-3.2.5-brightgreen.svg?logo=springboot)](https://spring.io/projects/spring-boot)
[![React](https://img.shields.io/badge/React-19-blue.svg?logo=react)](https://react.dev)
[![Vite](https://img.shields.io/badge/Vite-8.3-646CFF.svg?logo=vite)](https://vitejs.dev)
[![PostgreSQL](https://img.shields.io/badge/PostgreSQL-16-336791.svg?logo=postgresql)](https://www.postgresql.org)
[![Railway](https://img.shields.io/badge/Deploy-Railway-0B0D0E.svg?logo=railway)](https://railway.app)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)

> A modern, high-performance URL shortening platform with real-time click tracking, interactive analytics, JWT-based user authentication, and seamless Railway cloud deployment.

---

## ✨ Features

- **⚡ Fast URL Shortening**: Generate ultra-compact short URLs instantly with automatic unique code generation.
- **🎯 Custom Aliases**: Create branded and human-readable custom back-halves for links.
- **📊 Real-Time Analytics**:
  - Total click volume and unique visitor tracking.
  - Interactive daily click timeline charts powered by **Recharts**.
  - Top performing URLs by total traffic.
  - Recent click event audit trail with timestamps.
- **🔒 Secure Authentication**:
  - User registration and login protected with Spring Security & BCrypt password hashing.
  - Stateless JWT token authorization with automated frontend interceptors.
- **🎨 Modern Glassmorphic UI**:
  - Sleek dark theme with micro-interactions, responsive navigation, and Lucide icons.
  - One-click copy to clipboard with toast notifications.
- **☁️ Cloud & Production Ready**:
  - Pre-configured Nixpacks build configurations (`nixpacks.toml`, `railway.json`, `Procfile`) for one-click Railway deployments.
  - PostgreSQL database support with automatic schema management.

---

## 🛠️ Tech Stack

### Backend
- **Language**: Java 21
- **Framework**: Spring Boot 3.2.5
- **Security**: Spring Security 6 & JJWT 0.12.5
- **Database / ORM**: Spring Data JPA & Hibernate with PostgreSQL
- **Testing**: JUnit 5, H2 In-Memory DB, `@SpringBootTest` Integration Tests
- **Build Tool**: Maven (`mvnw`)

### Frontend
- **Framework**: React 19 & Vite 8
- **Routing**: React Router DOM v7
- **Data Visualization**: Recharts
- **Icons**: Lucide React
- **HTTP Client**: Axios with interceptors
- **Styling**: Vanilla CSS Design Tokens (Glassmorphic dark design)

---

## 📁 Repository Structure

```
.
├── backend/                             # Spring Boot 3 Java Backend
│   ├── src/main/java/com/urlshortener/  # Application Controllers, Services, Entities & Security
│   ├── src/main/resources/              # Configuration (application.properties, application-test.properties)
│   ├── src/test/                        # Integration and unit tests
│   ├── nixpacks.toml                    # Nixpacks build definition
│   ├── pom.xml                          # Maven build dependencies
│   └── railway.json                     # Railway deployment configuration
├── frontend/                            # React 19 + Vite Frontend
│   ├── src/api/                         # Axios client & API endpoints
│   ├── src/components/                  # Navbar, Toast, & Reusable UI elements
│   ├── src/context/                     # AuthContext state management
│   ├── src/pages/                       # Landing, Login, Register, Dashboard, Analytics
│   ├── package.json                     # Frontend dependencies
│   └── vite.config.js                   # Vite configuration
├── railway.json                         # Root Railway multi-service orchestrator
└── README.md                            # Documentation
```

---

## 🚀 Getting Started Locally

### Prerequisites
- **JDK 21** or higher
- **Node.js 18+** & npm
- **PostgreSQL** (or run with default local fallback)

---

### 1. Backend Setup

```bash
cd backend

# Run with Maven Wrapper
./mvnw clean spring-boot:run
```

The Spring Boot backend will start on `http://localhost:8080`.

> **Test Suite**: Run `mvn test` to execute all `@SpringBootTest` integration tests using the in-memory H2 database.

---

### 2. Frontend Setup

```bash
cd frontend

# Install dependencies
npm install

# Start development server
npm run dev
```

The Vite frontend will be available at `http://localhost:5173`.

---

## 🌐 API Reference

### Authentication
| Method | Endpoint | Description |
|---|---|---|
| `POST` | `/api/auth/register` | Register new user account |
| `POST` | `/api/auth/login` | Log in and receive JWT bearer token |

### URL Management
| Method | Endpoint | Description | Auth Required |
|---|---|---|---|
| `POST` | `/api/urls` | Create short URL (optional custom code) | Yes |
| `GET` | `/api/urls` | List all URLs for authenticated user | Yes |
| `PUT` | `/api/urls/{id}` | Update long URL destination | Yes |
| `DELETE` | `/api/urls/{id}` | Delete a short URL | Yes |

### Redirection & Analytics
| Method | Endpoint | Description | Auth Required |
|---|---|---|---|
| `GET` | `/{shortCode}` | Redirect to original URL & log click | No |
| `GET` | `/api/urls/{id}/analytics` | Get click stats, daily breakdown & recent visits | Yes |

---

## ☁️ Deployment

This project is configured for seamless deployment on **[Railway](https://railway.app)**:

1. Push this repository to GitHub.
2. Link the repository in your Railway project.
3. Add a **PostgreSQL** plugin in Railway — `DATABASE_URL` will be automatically populated.
4. Set optional environment variables:
   - `JWT_SECRET`: A secure 256-bit secret string.
   - `APP_BASE_URL`: Your deployed frontend/backend domain for generating full short links.

---

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.
