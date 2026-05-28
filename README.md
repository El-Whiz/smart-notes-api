# 📝 Smart Notes API

A Node.js REST API that generates personalized, AI-powered study notes from multiple input sources — plain text, documents, audio, and web links.

---

## Features

- **AI-Powered Note Generation** — Creates structured study notes tailored to your learning profile
- **Multiple Input Sources** — Generate notes from plain text, PDFs, DOCX files, audio recordings, or URLs (including YouTube)
- **User Profiles** — Personalize notes based on your study goal, learning style, and pace
- **Avatar Uploads** — Upload a profile picture via Cloudinary
- **JWT Authentication** — Secure, token-based auth for all protected routes
- **Per-User Note Management** — View and delete notes with ownership enforcement

---

## Tech Stack

- **Runtime:** Node.js (CommonJS)
- **Framework:** Express v5
- **Database:** MongoDB via Mongoose
- **Auth:** JSON Web Tokens (JWT) + bcrypt
- **File Handling:** Multer
- **Storage:** Cloudinary (avatar images)
- **AI / Transcription:** OpenAI API
- **Parsing:** pdf-parse, mammoth (DOCX), youtube-transcript
- **Validation:** Joi
- **Dev:** Nodemon

---

## Getting Started

### Prerequisites

- Node.js v18+
- MongoDB (local or Atlas)
- Cloudinary account
- OpenAI API key

### Installation

```bash
git clone https://github.com/El-Whiz/smart-notes-api.git
cd smart-notes-api
npm install
```

### Environment Variables

Copy `.env.example` to `.env` and fill in your values:

```bash
cp .env.example .env
```

| Variable            | Description                                       |
| ------------------- | ------------------------------------------------- |
| `PORT`              | Port the server listens on (default: `4040`)      |
| `MONGO_URI`         | MongoDB connection string                         |
| `JWT_SECRET`        | Secret key for signing JWTs                       |
| `CLOUDINARY_NAME`   | Cloudinary cloud name                             |
| `CLOUDINARY_KEY`    | Cloudinary API key                                |
| `CLOUDINARY_SECRET` | Cloudinary API secret                             |
| `OPENAI_API_KEY`    | OpenAI API key (required for audio transcription) |

### Running the Server

```bash
# Development (with auto-reload)
npm run dev

# Production
npm start
```

The API will be available at `http://localhost:4040/api`.

---

## API Reference

All routes are mounted under `/api`. Protected routes require a Bearer token in the `Authorization` header:

```
Authorization: Bearer YOUR_JWT_TOKEN
```

---

### Health Check

| Method | Route         | Auth |
| ------ | ------------- | ---- |
| GET    | `/api/health` | None |

Returns `{ status: "ok", timestamp: "..." }`.

---

### Auth

#### Sign Up

```
POST /api/user/sign-up
```

**Body (JSON):**

```json
{
  "email": "jane@example.com",
  "password": "yourpassword"
}
```

**Response:**

```json
{
  "message": "...",
  "user": { "id": "...", "email": "..." },
  "token": "..."
}
```

#### Log In

```
POST /api/user/login
```

**Body (JSON):**

```json
{
  "email": "jane@example.com",
  "password": "yourpassword"
}
```

**Response:** Same shape as sign-up. Save the returned `token` for subsequent requests.

---

### User Profile

| Method | Route                       | Auth     | Description                       |
| ------ | --------------------------- | -------- | --------------------------------- |
| POST   | `/api/user/add-avatar`      | Required | Upload a profile avatar image     |
| POST   | `/api/user/profile`         | Required | Set profile preferences           |
| GET    | `/api/user/profile/:userId` | Required | Get profile for a user            |
| PATCH  | `/api/user/profile/:userId` | Required | Update one or more profile fields |

#### Avatar Upload

Send as `multipart/form-data` with the image in the `avatar` field. Only image files are accepted.

#### Set / Update Profile

**Body (JSON):**

```json
{
  "name": "Jane Doe",
  "goal": "pass exam",
  "style": "visual",
  "pace": "slow"
}
```

Accepted fields: `name`, `goal`, `style`, `pace`. For PATCH, include only the fields you want to update.

> ⚠️ Profile routes check that `:userId` matches the authenticated user.

---

### Note Generation

All generation routes require a Bearer token.

#### From Plain Text

```
POST /api/notes/generate/text
Content-Type: application/json
```

**Body:**

```json
{
  "studyMode": "exam",
  "text": "Photosynthesis is the process by which plants convert sunlight into chemical energy."
}
```

#### From a Document

```
POST /api/notes/generate/document
Content-Type: multipart/form-data
```

**Fields:** `file` (PDF, DOCX, or plain text), `studyMode`

#### From Audio

```
POST /api/notes/generate/audio
Content-Type: multipart/form-data
```

**Fields:** `file` (audio file), `studyMode`

> Requires a valid `OPENAI_API_KEY` for transcription.

#### From a Link

```
POST /api/notes/generate/link
Content-Type: application/json
```

**Body:**

```json
{
  "studyMode": "revision",
  "url": "https://example.com/article"
}
```

Supports regular web pages and YouTube URLs (transcript extracted automatically).

---

### Notes

| Method | Route                        | Auth     | Description                  |
| ------ | ---------------------------- | -------- | ---------------------------- |
| GET    | `/api/notes/:userId`         | Required | Get all notes (newest first) |
| GET    | `/api/notes/:userId/:noteId` | Required | Get a single note            |
| DELETE | `/api/notes/:userId/:noteId` | Required | Delete a note                |

> ⚠️ All note routes enforce that `:userId` matches the authenticated user.

---

## Route Summary

| Route                          | Method | Auth Required |
| ------------------------------ | ------ | ------------- |
| `/api/health`                  | GET    | ❌            |
| `/api/user/sign-up`            | POST   | ❌            |
| `/api/user/login`              | POST   | ❌            |
| `/api/user/add-avatar`         | POST   | ✅            |
| `/api/user/profile`            | POST   | ✅            |
| `/api/user/profile/:userId`    | GET    | ✅            |
| `/api/user/profile/:userId`    | PATCH  | ✅            |
| `/api/notes/generate/text`     | POST   | ✅            |
| `/api/notes/generate/document` | POST   | ✅            |
| `/api/notes/generate/audio`    | POST   | ✅            |
| `/api/notes/generate/link`     | POST   | ✅            |
| `/api/notes/:userId`           | GET    | ✅            |
| `/api/notes/:userId/:noteId`   | GET    | ✅            |
| `/api/notes/:userId/:noteId`   | DELETE | ✅            |

---

## Project Structure

```
smart-notes-api/
├── src/
│   ├── routes/
│   │   ├── user.route.js
│   │   └── note.route.js
│   ├── controllers/
│   │   ├── user.controller.js
│   │   └── note.controller.js
│   └── middleware/
│       └── auth.js
├── index.js
├── .env.example
└── package.json
```

---
