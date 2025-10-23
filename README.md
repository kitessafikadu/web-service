# 🚀 TypeScript Web Service API

A simple RESTful Web Service built using **TypeScript** and **Express.js**.  
This project demonstrates how to design, implement, and test modern APIs using Node.js, Express, and Postman.

---

## 📘 Table of Contents

- [About](#about)
- [Features](#features)
- [Tech Stack](#tech-stack)
- [Project Structure](#project-structure)
- [Installation](#installation)
- [Running the Server](#running-the-server)
- [API Endpoints](#api-endpoints)
- [Testing with Postman](#testing-with-postman)
---

## 🧩 About

This project was created as part of an assignment to explore **web service development in TypeScript**.  
It includes RESTful API endpoints that perform basic **CRUD operations** for students.  

The service can be easily extended for real-world applications such as authentication, database integration, and API documentation using Swagger.

---

## ✨ Features

- Built with **TypeScript** for type safety  
- **Express.js** server for RESTful routing  
- Simple **CRUD operations**  
- **Postman**-ready API testing  
- Hot reloading using `ts-node-dev`

---

## 🧰 Tech Stack

| Tool | Purpose |
|------|----------|
| **TypeScript** | Strongly typed JavaScript |
| **Express.js** | Web framework for Node.js |
| **Node.js** | JavaScript runtime |
| **Postman** | API testing tool |
| **ts-node-dev** | For running the server with hot reload |
| **npm** | Dependency management |

---

## 📁 Project Structure

```

web-service/
├── src/
│   ├── index.ts
│   └── routes/
│       └── userRoutes.ts
├── package.json
├── tsconfig.json
└── README.md

````

- `index.ts` → Application entry point  
- `userRoutes.ts` → Contains REST API routes for users  

---

## ⚙️ Installation

Clone the repository and install dependencies:

```bash
git clone https://github.com/kitessafikadu/web-service.git
cd web-service
npm install
````

---

## ▶️ Running the Server

Start the development server using:

```bash
npm run dev
```

The server will start on:

```
http://localhost:3000
```

You should see:

```
🚀 Server running on http://localhost:3000
```

---

## 📡 API Endpoints

| Method     | Endpoint         | Description               |
| ---------- | ---------------- | ------------------------- |
| **GET**    | `/api/students`     | Fetch all users           |
| **GET**    | `/api/students/:id` | Get a specific user by ID |
| **POST**   | `/api/students`     | Add a new user            |
| **DELETE** | `/api/students/:id` | Delete a user (optional)  |

### Example `POST /api/student` Request

```json
{
  "firstName": "Abebe",
  "lastName": "Kebede",
  "email": "abe@gmail.com",
  "dob": "1990-05-15"
}
```

### Example Response

```json
{
    "id": 5,
    "firstName": "Abebe",
    "lastName": "Kebede",
    "email": "abe@gmail.com",
    "dob": "1990-05-15T00:00:00.000Z",
    "createdAt": "2025-10-23T18:50:07.467Z",
    "updatedAt": "2025-10-23T18:50:07.467Z"
}
```

---

## 🧪 Testing with Postman

1. Open **Postman**.
2. Create a new **collection** named *TypeScript Web Service*.
3. Add requests:

   * `GET http://localhost:3000/api/students`
   * `POST http://localhost:3000/api/students`
4. Send requests and verify the JSON responses.


