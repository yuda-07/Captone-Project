# 🚀 MicroCred AI Backend Architecture

## Sistem Penilaian Kelayakan Kredit UMKM Berbasis Deep Learning

Backend berfungsi sebagai pusat orkestrasi sistem yang menghubungkan Frontend, Database, Authentication Service, AI Inference Service, dan Monitoring Layer.

---

# 🏛 High Level Architecture

```mermaid
flowchart TB

    User[👤 User UMKM]

    FE[🌐 Frontend React + Vite]

    LB[⚖ API Gateway / Express Router]

    AUTH[🔐 Authentication Service]

    UMKM[🏪 UMKM Service]

    PREDICT[🧠 Prediction Service]

    AI[🤖 AI Inference API]

    MODEL[(Deep Learning Model .keras)]

    DB[(PostgreSQL Database)]

    LOG[(Audit & Activity Log)]

    User --> FE

    FE --> LB

    LB --> AUTH
    LB --> UMKM
    LB --> PREDICT

    AUTH --> DB

    UMKM --> DB

    PREDICT --> AI

    AI --> MODEL

    AI --> PREDICT

    PREDICT --> DB

    AUTH --> LOG
    UMKM --> LOG
    PREDICT --> LOG
```

---

# 🧠 Backend Core Responsibilities

Backend bertanggung jawab untuk:

* Authentication & Authorization
* User Management
* UMKM Profile Management
* Financial Data Validation
* AI Prediction Orchestration
* Database Persistence
* Error Handling
* Audit Logging
* API Security
* Data Integrity

---

# 🔄 End To End System Flow

```mermaid
sequenceDiagram

participant U as User
participant F as Frontend
participant B as Backend
participant DB as PostgreSQL
participant AI as AI Service
participant M as Deep Learning Model

U->>F: Input Data UMKM

F->>B: POST /api/predict

B->>B: Validate Request

alt Data Invalid

    B-->>F: 400 Validation Error

else Data Valid

    B->>DB: Save Request Log

    B->>AI: Send Financial Data

    AI->>M: Load Model

    M-->>AI: Generate Prediction

    AI-->>B: Credit Score

    B->>DB: Save Prediction

    B-->>F: Return Result

end

F-->>U: Display Credit Score
```

---

# 🔐 Authentication Flow

```mermaid
flowchart TD

A[User Register]
--> B[Validate Input]

B --> C{Valid?}

C -->|No| D[Return Error]

C -->|Yes| E[Hash Password]

E --> F[Save User]

F --> G[Success]

G --> H[Login]

H --> I[Verify Password]

I --> J{Match?}

J -->|No| K[Unauthorized]

J -->|Yes| L[Generate JWT]

L --> M[Return Access Token]

M --> N[Protected Endpoint]

N --> O[JWT Middleware]

O --> P[Authorized]
```

---

# 🧠 Credit Prediction Flow

```mermaid
flowchart TD

A[Receive Financial Data]

A --> B[Schema Validation]

B --> C[Business Rule Validation]

C --> D[Normalize Data]

D --> E[Build Payload]

E --> F[Call AI API]

F --> G{AI Available?}

G -->|No| H[Return Service Error]

G -->|Yes| I[Receive Prediction]

I --> J[Calculate Risk Category]

J --> K[Generate Final Response]

K --> L[Save History]

L --> M[Return JSON]
```

---

# 📊 Deep Learning Integration Flow

```mermaid
flowchart LR

Backend

--> Income[Monthly Income]

Backend

--> Expense[Monthly Expense]

Backend

--> Age[Business Age]

Backend

--> Late[Late Payment Count]

Income --> AI
Expense --> AI
Age --> AI
Late --> AI

AI --> Preprocessing

Preprocessing --> FeatureScaling

FeatureScaling --> NeuralNetwork

NeuralNetwork --> CreditScore

CreditScore --> RiskClassification

RiskClassification --> Backend
```

---

# 🗄 Database Architecture

```mermaid
erDiagram

USERS {

uuid id
string name
string email
string password
timestamp created_at

}

UMKM_PROFILE {

uuid id
uuid user_id
string business_name
integer business_age
bigint monthly_income
bigint monthly_expense
timestamp created_at

}

PREDICTION_HISTORY {

uuid id
uuid user_id
integer credit_score
string category
timestamp prediction_date

}

AUDIT_LOG {

uuid id
uuid user_id
string action
timestamp created_at

}

USERS ||--o{ UMKM_PROFILE : owns
USERS ||--o{ PREDICTION_HISTORY : generates
USERS ||--o{ AUDIT_LOG : creates
```

---

# 🌐 API Gateway Flow

```mermaid
flowchart TD

Client

--> Router

Router --> AuthMiddleware

AuthMiddleware --> ValidationMiddleware

ValidationMiddleware --> Controller

Controller --> Service

Service --> Repository

Repository --> PostgreSQL

Repository --> AI Service

Service --> Controller

Controller --> Response
```

---

# 📁 Backend Folder Structure

```text
backend
│
├── src
│
├── config
│   ├── database.js
│   ├── environment.js
│   └── jwt.js
│
├── controllers
│   ├── auth.controller.js
│   ├── user.controller.js
│   ├── umkm.controller.js
│   └── prediction.controller.js
│
├── services
│   ├── auth.service.js
│   ├── user.service.js
│   ├── umkm.service.js
│   ├── prediction.service.js
│   └── ai.service.js
│
├── repositories
│   ├── user.repository.js
│   ├── umkm.repository.js
│   └── prediction.repository.js
│
├── middlewares
│   ├── auth.middleware.js
│   ├── validation.middleware.js
│   ├── logger.middleware.js
│   └── error.middleware.js
│
├── routes
│   ├── auth.routes.js
│   ├── user.routes.js
│   ├── umkm.routes.js
│   └── prediction.routes.js
│
├── validators
│
├── utils
│
├── logs
│
├── prisma
│
├── tests
│
├── app.js
├── server.js
└── package.json
```

---

# ⚡ Deployment Architecture

```mermaid
flowchart TB

User

--> Vercel

Vercel

--> Render

Render

--> PostgreSQL

Render

--> FastAPI

FastAPI

--> TensorFlow

TensorFlow

--> KerasModel
```

---

# 🛡 Security Layer

## Authentication

* JWT Access Token
* Refresh Token

## Password Security

* bcrypt hashing
* Salt Rounds

## API Security

* Helmet
* CORS
* Rate Limiting

## Validation

* express-validator
* Request Sanitization

## Logging

* Winston Logger
* Audit Trail

---

# 📌 Main Endpoints

## Authentication

```http
POST /api/auth/register
POST /api/auth/login
GET  /api/auth/profile
```

## UMKM

```http
GET    /api/umkm
GET    /api/umkm/:id
POST   /api/umkm
PUT    /api/umkm/:id
DELETE /api/umkm/:id
```

## Prediction

```http
POST /api/predict
GET  /api/history
GET  /api/history/:id
```

---

# 🎯 Backend Milestone

### Sprint 1

* Architecture Design
* Database Design
* API Contract

### Sprint 2

* Express Setup
* PostgreSQL Setup
* Authentication

### Sprint 3

* CRUD UMKM
* Validation Layer

### Sprint 4

* AI Integration
* Prediction Service

### Sprint 5

* Security Hardening
* End-to-End Testing
* Deployment
* Documentation

```
```
