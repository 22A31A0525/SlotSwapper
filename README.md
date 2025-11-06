# SlotSwapper

[![License](https://img.shields.io/badge/License-MIT-blue.svg)](LICENSE)
[![Java](https://img.shields.io/badge/Java-21-orange)](https://openjdk.java.net/)
[![Spring Boot](https://img.shields.io/badge/Spring%20Boot-3.5.7-brightgreen)](https://spring.io/projects/spring-boot)
[![React](https://img.shields.io/badge/React-19-blue)](https://reactjs.org/)
[![Docker](https://img.shields.io/badge/Docker-Ready-blue)](https://www.docker.com/)

SlotSwapper is a comprehensive full-stack web application for seamless event slot management and swapping. Empower users to create, organize, and trade schedule slots effortlessly, fostering efficient time management and collaboration.

## ✨ Features

- 🔐 **Secure Authentication**: JWT-based login and registration system
- 📅 **Event Management**: Create, view, and update event statuses (Busy/Swappable)
- 🔄 **Swap Marketplace**: Browse and request slot exchanges with other users
- 📱 **Responsive Design**: Modern UI built with Material-UI for optimal user experience
- ⚡ **Real-time Notifications**: WebSocket-powered instant updates on swap activities
- 🛠️ **RESTful API**: Robust backend with Spring Boot and PostgreSQL
- 🐳 **Containerized**: Easy deployment with Docker and Docker Compose

## 🛣️ Frontend Routes

| Route          | Component       | Description                                |
| -------------- | --------------- | ------------------------------------------ |
| `/login`       | LoginPage       | User authentication portal                 |
| `/signup`      | SignupPage      | New user registration form                 |
| `/dashboard`   | DashboardPage   | Personal schedule management interface     |
| `/marketplace` | MarketplacePage | Browse and initiate slot swap requests     |
| `/requests`    | RequestsPage    | Manage incoming and outgoing swap requests |

## Technologies Used

### Backend

- **Java 21**
- **Spring Boot 3.5.7** (Web, Security, Data JPA)
- **PostgreSQL** (Database)
- **JWT** (Authentication)
- **Lombok** (Code simplification)
- **Maven** (Build tool)

### Frontend

- **React 19** (UI Framework)
- **Vite** (Build tool and dev server)
- **Material-UI (MUI)** (Component library)
- **Redux Toolkit** (State management)
- **Axios** (HTTP client)
- **React Router** (Routing)

### Infrastructure

- **Docker & Docker Compose** (Containerization)
- **PostgreSQL 15-alpine** (Database container)

## Prerequisites

Before running the application, ensure you have the following installed:

- **Docker** (version 20.10 or later)
- **Docker Compose** (version 2.0 or later)
- **Git** (for cloning the repository)

## Installation & Setup

1. **Clone the repository**:

   ```bash
   git clone <repository-url>
   cd SlotSwapper
   ```

2. **Environment Variables** (Optional):

   - The application uses default configurations in `docker-compose.yml`.
   - For production, consider setting environment variables for sensitive data like database credentials.

3. **Build and run with Docker Compose**:

   ```bash
   docker-compose up --build
   ```

   This will:

   - Start a PostgreSQL database on port 5433
   - Build and run the Spring Boot backend on port 8080
   - Build and run the React frontend on port 5173

## Running the Application

Once the containers are up:

- **Frontend**: Access at `http://localhost:5173`
- **Backend API**: Available at `http://localhost:8080`
- **Database**: PostgreSQL running on `localhost:5433` (user: slotuser, password: 123, db: slotdb)

### Development Mode

For frontend development without Docker:

```bash
cd frontend
npm install
npm run dev
```

For backend development:

```bash
cd backend
./mvnw spring-boot:run
```

## API Endpoints

## 📝 API Endpoints

| Method | Endpoint | Description |
|
| `POST` | `/auth/signup` | Register a new user account |
| `POST` | `/auth/login` | Authenticate and receive JWT |
| `GET` | `/api/events` | Fetch current user's calendar |
| `POST` | `/api/events` | Create a new busy slot |
| `PUT` | `/api/events/{id}/status` | Update slot status (BUSY/SWAPPABLE) |
| `GET` | `/api/swappable-slots` | View all available slots in marketplace |
| `POST` | `/api/swap-request` | Initiate a trade request |
| `GET` | `/api/swap-requests/incoming` | View requests received from others |
| `GET` | `/api/swap-requests/outgoing` | View requests sent to others |
| `POST` | `/api/swap-response/{id}` | Accept or Reject a pending request |

The backend provides RESTful endpoints for managing events, swaps, and user authentication. All endpoints except authentication require JWT authentication via `Authorization: Bearer <token>` header.

### Authentication Endpoints

- `POST /auth/signup` - User registration
  - Body: `{ "email": "string", "password": "string", "firstName": "string", "lastName": "string" }`
  - Returns: `{ "token": "jwt-token" }`
- `POST /auth/login` - User login
  - Body: `{ "email": "string", "password": "string" }`
  - Returns: `{ "token": "jwt-token" }`

### Event Endpoints

- `GET /api/events` - Get all events for the authenticated user
  - Returns: Array of event objects
- `POST /api/events` - Create a new event
  - Body: `{ "title": "string", "description": "string", "startTime": "datetime", "endTime": "datetime" }`
  - Returns: Created event object
- `PUT /api/events/{id}/status` - Update event status
  - Body: `{ "status": "BUSY|SWAPPABLE|CANCELLED" }`
  - Returns: Updated event object

### Swap Endpoints

- `GET /api/swappable-slots` - Get all swappable events from other users
  - Returns: Array of swappable event objects
- `GET /api/swap-requests/incoming` - Get incoming swap requests for the user
  - Returns: Array of swap request objects
- `GET /api/swap-requests/outgoing` - Get outgoing swap requests from the user
  - Returns: Array of swap request objects
- `POST /api/swap-request` - Create a new swap request
  - Body: `{ "mySlotId": number, "theirSlotId": number }`
  - Returns: Created swap request object
- `POST /api/swap-response/{requestId}` - Respond to a swap request
  - Body: `{ "accepted": boolean }`
  - Returns: Updated swap request object

## Project Structure

```
SlotSwapper/
├── docker-compose.yml          # Docker Compose configuration
├── backend/                    # Spring Boot application
│   ├── Dockerfile              # Backend Docker configuration
│   ├── pom.xml                 # Maven dependencies
│   ├── src/
│   │   ├── main/java/com/slotswapper/backend/
│   │   │   ├── BackendApplication.java
│   │   │   ├── config/         # Security configuration
│   │   │   ├── controller/     # REST controllers
│   │   │   ├── dto/            # Data Transfer Objects
│   │   │   ├── model/          # JPA entities
│   │   │   ├── repository/     # Data repositories
│   │   │   ├── security/       # JWT utilities
│   │   │   └── service/        # Business logic
│   │   └── main/resources/
│   │       └── application.properties
│   └── src/test/               # Unit tests
└── frontend/                   # React application
    ├── Dockerfile              # Frontend Docker configuration
    ├── package.json            # NPM dependencies
    ├── vite.config.js          # Vite configuration
    ├── public/                 # Static assets
    └── src/
        ├── components/         # Reusable UI components
        ├── pages/              # Page components
        ├── services/           # API service layer
        └── ...
```
