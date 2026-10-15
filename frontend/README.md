# ShopKart Frontend — Login → Home Flow

React frontend for ShopKart, built with React Router DOM, Axios, and Tailwind CSS.

## Setup

```bash
npm install
npm run dev
```

Runs at http://localhost:5173

## Backend

Make sure the ShopKart backend (Lab 01) is running at http://localhost:3000.
The backend now has CORS enabled for http://localhost:5173 with credentials — see the updated `index.js` in the backend folder.

```bash
cd shopkart-backend
npm install
npm run dev
```

## Routes

- `/register` — Create a new account
- `/login` — Log in (sets HttpOnly cookie)
- `/home` — Protected route, fetches `/customers/me`; redirects to `/login` if not authenticated

## Notes

- Axios is configured with `withCredentials: true` (`src/services/api.js`) so the HttpOnly `token` cookie is sent/received automatically.
- Logout calls `POST /customers/logout` to clear the cookie, then redirects to `/login`.
