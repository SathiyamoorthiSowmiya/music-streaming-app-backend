# TuneStream — Music Streaming App (Backend)

REST API for a full-stack MERN music streaming application. Handles authentication, song catalog, playlists, likes and comments.

🔗 **Live API**: https://music-streaming-app-backend-2vly.onrender.com
🎵 **Live App**: https://musicstreaming-app.netlify.app/
💻 **Frontend Repo**: https://github.com/SathiyamoorthiSowmiya/music-streaming-app-frontend

> Hosted on Render's free tier — the server sleeps after inactivity, so the first request after a while may take 30-50s to wake up.

## Tech Stack

- Node.js + Express.js
- MongoDB + Mongoose
- JWT authentication + Bcrypt password hashing
- Role-based access control (user / admin)

## Features

- User register/login with JWT auth
- Admin-only song management (create, update, delete)
- Search songs by title, artist, album or movie name
- Like / unlike songs
- Create, update, delete playlists and manage songs within them
- Add and delete comments on songs

## Getting Started

### Prerequisites

- Node.js (v18+)
- MongoDB running locally or a MongoDB Atlas connection string

### Setup

```bash
npm install
```

Create a `.env` file in the root:

```
PORT=5050
MONGO_URI=mongodb://127.0.0.1:27017/music_streaming_app
JWT_SECRET=your_secret_key
```

Seed the database with demo songs and an admin account:

```bash
npm run seed
```

This creates an admin user: `admin@musicapp.com` / `Admin@123`

Run the server:

```bash
npm run dev
```

Server runs on `http://localhost:5050`.

## API Endpoints

| Method | Endpoint | Description | Auth |
|---|---|---|---|
| POST | /api/auth/register | Register a new user | Public |
| POST | /api/auth/login | Login | Public |
| GET | /api/songs | List/search songs | Public |
| GET | /api/songs/liked/mine | Songs liked by current user | User |
| GET | /api/songs/:id | Get a song | Public |
| POST | /api/songs | Add a song | Admin |
| PUT | /api/songs/:id | Update a song | Admin |
| DELETE | /api/songs/:id | Delete a song | Admin |
| PATCH | /api/songs/:id/like | Like/unlike a song | User |
| GET | /api/playlists | Get user's playlists | User |
| POST | /api/playlists | Create a playlist | User |
| PUT | /api/playlists/:id | Rename a playlist | User |
| DELETE | /api/playlists/:id | Delete a playlist | User |
| PATCH | /api/playlists/:id/add-song | Add song to playlist | User |
| PATCH | /api/playlists/:id/remove-song | Remove song from playlist | User |
| GET | /api/comments/song/:songId | Get comments for a song | Public |
| POST | /api/comments/song/:songId | Add a comment | User |
| DELETE | /api/comments/:id | Delete own comment | User |

## Note on Audio Content

Demo songs use royalty-free placeholder audio tracks (SoundHelix) with fictional metadata, to avoid any copyright issues with hosting commercial music.
