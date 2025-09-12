

# To-Do Fullstack (React, Vue, Node, MongoDB)

Proyecto de prueba técnica: To-Do List con 2 frontends (React y Vue) y un backend Node/Express + MongoDB.

## Estructura
- `backend/` - API REST (Node, Express, Mongoose)
- `frontend-react/` - React (Vite)
- `frontend-vue/` - Vue (Vite)

## Requisitos
- Node.js (v16+)
- MongoDB (local o Atlas)
- Git

## Setup

### Backend
1. `cd backend`
2. Copiar `.env.example` a `.env` y configurar `MONGODB_URI`
3. `npm install`
4. `npm run dev` (desarrollo)

### Frontend React
1. `cd frontend-react`
2. crear `.env` con `VITE_API_URL=http://localhost:5000/api`
3. `npm install`
4. `npm run dev`

### Frontend Vue
1. `cd frontend-vue`
2. crear `.env` con `VITE_API_URL=http://localhost:5000/api`
3. `npm install`
4. `npm run dev`

## Endpoints principales
- `GET /api/todos` - lista todos
- `POST /api/todos` - crea
- `PUT /api/todos/:id` - actualiza
- `PATCH /api/todos/:id/complete` - toggle completado
- `DELETE /api/todos/:id` - elimina

## Commits
Use Conventional Commits (ej: `feat(backend): add todos API`).



---

Desarrollado por Ingeniero Vasquez 💻🚀
