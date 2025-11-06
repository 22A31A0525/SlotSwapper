# 🚀 SlotSwapper: Peer-to-Peer Time-Slot Scheduling

SlotSwapper is a full-stack web app built for the **ServiceHive technical challenge**. It lets users manage personal schedules, mark busy slots as **swappable**, and browse a **marketplace** to request peer-to-peer trades with other users. Swaps are handled atomically to avoid race conditions.

---

## 🔗 Live Links

- **Frontend (Vercel):** [https://slot-swapper-six.vercel.app/](https://slot-swapper-six.vercel.app/)
- **Backend API (Render):** [https://slotswapper-api-itq5.onrender.com/](https://slotswapper-api-itq5.onrender.com/)

---

## ✨ Features

### Core (Completed)

- **Secure Authentication:** Sign up & login with JWT for stateless sessions.

- **Calendar Management:** Create, view, and update events (e.g., BUSY → SWAPPABLE).

- **Marketplace:** Browse other users’ swappable slots (`GET /api/swappable-slots`).

- **Atomic Swap Logic:**

  - `POST /api/swap-request` locks both slots to `SWAP_PENDING`.
  - `POST /api/swap-response` atomically swaps `userId` on both events using `@Transactional`.

- **Notifications UI:**

  - Incoming requests (Accept / Reject)
  - Outgoing requests (Pending)

### Bonus (Completed)

- **Real-time Notifications:** WebSockets (STOMP)
- **Deployment:** Vercel + Render
- **Containerization:** Docker & Docker Compose

---

## 🛠️ Tech Stack

| Layer     | Technology              | Why                                    |
| --------- | ----------------------- | -------------------------------------- |
| Backend   | Java (Spring Boot)      | Robust transactional business logic    |
| Frontend  | React (Vite)            | Fast modern SPA tooling                |
| Database  | PostgreSQL              | Strong ACID guarantees for swaps       |
| State     | React Context           | Global notification badge state        |
| Styling   | Material UI (MUI)       | Professional ready UI components       |
| Real-time | WebSockets (STOMP)      | Instant peer notifications             |
| DevOps    | Docker / Docker Compose | Consistent environment and quick setup |

---

## 🧪 Run Locally

### Prerequisites

- Docker Desktop 20.10+
- Git

### Steps

```bash
git clone https://github.com/22A31A0525/SlotSwapper
cd SlotSwapper

docker-compose up --build
```

### Local URLs

- **Frontend:** [http://localhost:5173](http://localhost:5173)
- **Backend:** [http://localhost:8080](http://localhost:8080)
- **Postgres:** `localhost:5433`

  - User: `slotuser`
  - Pass: `123`
  - DB: `slotdb`

---

## 🔐 Authentication

All endpoints (except `/auth/**`) require:

```
Authorization: Bearer <token>
```

| Method | Endpoint     | Description         |
| ------ | ------------ | ------------------- |
| POST   | /auth/signup | Register a new user |
| POST   | /auth/login  | Login & obtain JWT  |

---

## 📅 Event Management

| Method | Endpoint                | Description          |
| ------ | ----------------------- | -------------------- |
| GET    | /api/events             | Get your events      |
| POST   | /api/events             | Create busy event    |
| PUT    | /api/events/{id}/status | Set BUSY / SWAPPABLE |

---

## 🔁 Swap Logic

| Method | Endpoint                    | Description            |
| ------ | --------------------------- | ---------------------- |
| GET    | /api/swappable-slots        | View marketplace items |
| POST   | /api/swap-request           | Initiate trade         |
| GET    | /api/swap-requests/incoming | Incoming requests      |
| GET    | /api/swap-requests/outgoing | Outgoing requests      |
| POST   | /api/swap-response/{id}     | Accept / Reject swap   |

**Atomic Guarantee:** Entire swap succeeds or rolls back.

---

## 🔔 Real-time Notifications

| Protocol  | Endpoint                  | Purpose                |
| --------- | ------------------------- | ---------------------- |
| WS        | /ws                       | WebSocket connect      |
| SUBSCRIBE | /user/queue/notifications | Receive private alerts |

---

## 🧩 Design Highlights

- Users identified by numeric `id`, not email.
- `@Transactional` ensures safe swap consistency.
- WebSocket sessions authenticated via JWT in `STOMP CONNECT`.
- Split deployment: Vercel (frontend) + Render (backend & DB).

---

## 📂 Project Structure

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
