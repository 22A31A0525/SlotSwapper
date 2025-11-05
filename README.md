# SlotSwapper

SlotSwapper is a full-stack web application designed for managing and swapping event slots or schedules. It allows users to create events, request swaps, and manage their schedules efficiently. The platform features user authentication, event management, and a marketplace for swap requests.

## Features

- **User Authentication**: Secure login and signup with JWT-based authentication.
- **Event Management**: Create, view, and manage events with different statuses.
- **Swap Requests**: Request and manage slot swaps between users.
- **Marketplace**: Browse and interact with available swap opportunities.
- **Responsive UI**: Modern React-based frontend with Material-UI components.
- **RESTful API**: Backend API built with Spring Boot for robust data handling.

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
