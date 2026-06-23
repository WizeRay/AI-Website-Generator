# AI Website Generator

An AI-powered website builder that allows users to generate, edit, and manage websites using natural language prompts.

Users can create a website from a prompt, request revisions through a chat interface, manage project versions, and publish/unpublish their projects.

---

## Features

### Authentication

- User authentication using Better Auth
- Secure session management
- Protected routes

### AI Website Generation

- Generate complete websites from natural language prompts
- React + Tailwind based code generation
- AI-powered website revisions

### Project Management

- Create and manage multiple website projects
- Store generated website code
- Track project creation history
- Publish and unpublish websites

### Version Control

- Save website revisions
- Track previous versions
- Restore older versions

### Credits System

- Users receive credits
- Credits are consumed when generating or updating websites
- Credit tracking stored in database

### Conversation History

- Store user prompts
- Store AI responses
- Maintain project-specific chat history

---

## Tech Stack

### Frontend

- React
- Vite
- Tailwind CSS
- React Router

### Backend

- Node.js
- Express.js

### Database

- PostgreSQL
- Neon Database

### Authentication

- Better Auth

### AI

- OpenRouter
- Qwen Coder / Other LLMs

---

## Project Structure

```text
Client/
├── components/
├── pages/
├── hooks/
├── services/
├── App.jsx
└── main.jsx

Server/
├── controllers/
├── routes/
├── middlewares/
├── config/
├── services/
├── utils/
├── server.js
└── schema.sql
```

---

## Database Schema

Main tables:

- user
- account
- session
- verification
- website_project
- version
- conversation
- transaction

Relationships:

```text
User
 ├── Website Projects
 │     ├── Versions
 │     └── Conversations
 └── Transactions
```

---

## Environment Variables

Create a `.env` file inside the server directory.

```env
DATABASE_URL=your_database_url

BETTER_AUTH_SECRET=your_secret
BETTER_AUTH_URL=http://localhost:3000

OPENROUTER_API_KEY=your_openrouter_key
AI_MODEL=qwen/qwen3-coder-480b-a35b:free

PORT=3000
```

---

## Installation

### Clone Repository

```bash
git clone <repository-url>
cd ai-website-generator
```

### Install Frontend Dependencies

```bash
cd Client
npm install
```

### Install Backend Dependencies

```bash
cd ../Server
npm install
```

---

## Running the Project

### Start Backend

```bash
npm run dev
```

Backend:

```text
http://localhost:3000
```

### Start Frontend

```bash
npm run dev
```

Frontend:

```text
http://localhost:5173
```

---

## API Endpoints

### Projects

#### Generate Website

```http
POST /api/projects/generate
```

#### Get Single Project

```http
GET /api/projects/:projectId
```

#### Get User Projects

```http
GET /api/projects
```

#### Revise Website

```http
POST /api/projects/:projectId/revise
```

#### Publish / Unpublish Website

```http
PATCH /api/projects/:projectId/publish
```

### Authentication

Handled through Better Auth.

---

## Credits System

Example:

| Action | Credits |
|----------|----------|
| Generate Website | 5 |
| Website Revision | 5 |

Users start with an initial credit balance.

---

## Future Improvements

- Live website preview
- Custom domains
- Export project as ZIP
- Deployment integration
- Team collaboration
- AI-generated images
- Drag-and-drop editor
- Payment integration
- Project templates

---

## Security

- Authentication-protected routes
- Ownership validation for projects
- Parameterized SQL queries
- Session-based authentication

---

## License

MIT License

---

## Author

Shreyas Acharya

Built to simplify website creation using AI-powered code generation.

