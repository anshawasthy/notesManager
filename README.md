# Notes Manager

A full-stack MERN notes and workspace management application inspired by Notion-style productivity tools. Users can create workspaces, manage notes, organize content using tags and categories, generate AI-powered summaries, and share workspaces publicly in read-only mode.


# Features

- User Authentication (JWT + Cookies)
- Create and Manage Workspaces
- Create, Edit, and Delete Notes
- Tags and Categories Support
- AI-Powered Workspace Summarization
- AI Command-Based Note Creation
- Public Read-Only Share Links
- Responsive UI using React + Tailwind CSS
- MongoDB Database Integration

# Tech Stack

## Frontend
- React
- Vite
- Tailwind CSS
- Axios
- React Router DOM
- React Hot Toast

## Backend
- Node.js
- Express.js
- MongoDB + Mongoose
- JWT Authentication
- Cookie Parser
- Groq AI API


# Project Structure

```bash
project-root/
│
├── client/         # React Frontend
│
├── server/         # Express Backend
│
└── README.md
```


# Setup Instructions

## 1. Clone the Repository

```bash
git clone https://github.com/anshawasthy/notesManager.git

cd notesManager
```


# Backend Setup

## Navigate to Server Directory

```bash
cd server
```

## Install Dependencies

```bash
npm install
```

## Configure Environment Variables

Create a `.env` file inside the `server` folder:

```env
PORT=3000

MONGO_URI=your_mongodb_connection_string

JWT_SECRET=your_jwt_secret

GROQ_API_KEY=your_groq_api_key
```

## Run Backend Server

```bash
node server.js
```

or if using nodemon:

```bash
npx nodemon server.js
```

Backend runs on:

```txt
http://localhost:3000
```


# Frontend Setup

## Navigate to Client Directory

```bash
cd client
```

## Install Dependencies

```bash
npm install
```

## Configure Environment Variables

Create a `.env` file inside the `client` folder:

```env
VITE_API_BASE_URL=http://localhost:3000/api
```

## Run Frontend

```bash
npm run dev
```

Frontend runs on:

```txt
http://localhost:5173
```


# AI Setup

This project uses the Groq API for AI-powered workspace summarization and command-based note generation.

## Get API Key

Create a free API key from:

https://console.groq.com

Add the key to:

```env
GROQ_API_KEY=your_key_here
```


# Public Sharing Feature

Users can generate a public share link for any workspace.

Shared workspaces:
- Can be viewed publicly
- Are read-only
- Cannot be edited by viewers

Example:

```txt
/shared/:shareId
```


# Testing the Application

## Backend Testing

Use:
- Postman
- Thunder Client
- Insomnia

Test routes such as:

```txt
POST /api/auth/register

POST /api/auth/login

POST /api/workspace/create

GET /api/workspace/get

GET /api/workspace/:workspaceId/share
```


## Frontend Testing

1. Register/Login
2. Create Workspaces
3. Add/Edit/Delete Notes
4. Generate AI Summaries
5. Create Public Share Links
6. Open Shared Workspace URLs
7. Verify Shared Workspace is Read-Only


# Deployment

## Frontend Deployment
- Vercel

## Backend Deployment
- Render


# Future Improvements

- Real-time Collaboration
- Rich Text Editor
- Markdown Support
- Drag and Drop Notes
- Search and Filters
- AI Chat with Notes
- Workspace Permissions
- Password Protected Sharing


# Author

Ansh Awasthy
