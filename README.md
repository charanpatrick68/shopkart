# ShopKart 🛍️

**A full-stack e-commerce web application built with React, Node.js, Express, and MongoDB.**

ShopKart is a full-stack web application designed to provide an online shopping experience with a modern frontend, a REST API backend, database integration, and authentication. The application is deployed on Render, with MongoDB Atlas used for cloud database hosting.

**Live Demo:** [ShopKart](https://shopkart-53rz.onrender.com)
**Backend API:** [ShopKart Backend](https://shopkart-backend-8nm6.onrender.com)
**Source Code:** [GitHub Repository](https://github.com/charanpatrick68/shopkart)

---

## ✨ Features

* **Full-stack architecture** — React frontend connected to a Node.js and Express backend.
* **REST API integration** — frontend communicates with backend endpoints using Axios.
* **Database integration** — MongoDB Atlas for persistent data storage.
* **Authentication** — token-based authentication using HTTP-only cookies.
* **Cross-origin support** — configured CORS for communication between the deployed frontend and backend.
* **Responsive user interface** — a web interface built with modern frontend tooling.
* **Cloud deployment** — frontend and backend deployed independently on Render.
* **Environment-based configuration** — separate frontend API configuration for development and production.

> Update this section to include only the features implemented in the current version, such as product search, shopping cart, checkout, order management, or admin functionality, if applicable.

## 🛠️ Tech Stack

| Layer           | Technologies                                  |
| --------------- | --------------------------------------------- |
| Frontend        | React, Vite, JavaScript                       |
| HTTP Client     | Axios                                         |
| Backend         | Node.js, Express.js                           |
| Database        | MongoDB, MongoDB Atlas                        |
| Authentication  | Token-based authentication, HTTP-only cookies |
| Deployment      | Render                                        |
| Version Control | Git, GitHub                                   |

## 🏗️ Architecture

```text
                   ┌─────────────────────┐
                   │       Customer      │
                   └──────────┬──────────┘
                              │
                              ▼
                   ┌─────────────────────┐
                   │  React + Vite       │
                   │     Frontend        │
                   └──────────┬──────────┘
                              │
                       HTTP / Axios
                              │
                              ▼
                   ┌─────────────────────┐
                   │  Node.js + Express  │
                   │      Backend        │
                   └──────────┬──────────┘
                              │
                              ▼
                   ┌─────────────────────┐
                   │   MongoDB Atlas     │
                   │      Database       │
                   └─────────────────────┘
```

The frontend and backend are deployed as separate services. The frontend sends API requests to the backend, which handles application logic and communicates with MongoDB.

## 🚀 Getting Started

Follow these steps to run ShopKart locally.

### Prerequisites

Install the following before getting started:

* [Node.js](https://nodejs.org/) — an LTS version compatible with the project
* npm — included with Node.js
* [Git](https://git-scm.com/)
* A MongoDB instance, either local or through [MongoDB Atlas](https://www.mongodb.com/atlas)

### 1. Clone the repository

```bash
git clone https://github.com/charanpatrick68/shopkart.git
cd shopkart
```

### 2. Configure the backend

Open a terminal in the project root:

```bash
cd backend
npm install
```

Create a `.env` file inside the `backend` directory and add the environment variables required by your backend.

Example configuration:

```env
PORT=3000
MONGODB_URI=your_mongodb_connection_string
JWT_SECRET=your_long_random_secret
```

**Important:** These are example variable names. Check the backend source code and use the exact names expected by your application. Add any additional variables your implementation requires.

Never commit real credentials, database connection strings, or token secrets to GitHub.

### 3. Start the backend

From the `backend` directory, run:

```bash
npm run dev
```

If your `package.json` does not define a `dev` script, use the appropriate script listed under `scripts` in that file.

The backend should start on the configured local port.

### 4. Configure the frontend

Open a second terminal:

```bash
cd frontend
npm install
```

Check the frontend environment configuration. For local development, the API URL should point to your local backend.

For example, if your backend runs on port `3000`:

```env
VITE_API_URL=http://localhost:3000
```

Place this in `frontend/.env.development` if that is how your project is configured.

### 5. Start the frontend

From the `frontend` directory, run:

```bash
npm run dev
```

Vite will display the local development URL in the terminal, usually:

```text
http://localhost:5173
```

Open that URL in your browser to access the application.

### 6. Build the frontend for production

From the `frontend` directory:

```bash
npm run build
```

Vite generates the production build in the `dist` directory.

To verify the production build locally, run:

```bash
npm run preview
```

The preview command serves the built frontend locally; it does not deploy the application.

## 🔐 Environment Variables

Keep secrets in environment variables rather than hardcoding them in the source code.

| Variable       | Purpose                                                                     |
| -------------- | --------------------------------------------------------------------------- |
| `PORT`         | Port used by the backend server, if configurable                            |
| `MONGODB_URI`  | MongoDB connection string                                                   |
| `JWT_SECRET`   | Example secret for signing tokens; use the exact name expected by your code |
| `VITE_API_URL` | Base URL used by the frontend to contact the backend                        |

The table contains common examples, not a guaranteed exhaustive list of the project's environment variables. Check both frontend and backend configuration before deployment.

**Security notes:**

* Never expose backend secrets through frontend environment variables.
* Variables prefixed with `VITE_` are embedded into the frontend build and must not contain private credentials.
* Keep `.env` files out of version control.
* Use strong, unique secrets for production.
* Configure allowed frontend origins and cookie settings correctly for cross-origin authentication.

## ☁️ Deployment

ShopKart is deployed using Render.

### Frontend — Static Site

* **Root directory:** `frontend`
* **Build command:** `npm install && npm run build`
* **Publish directory:** `dist`
* **Production API URL:** `https://shopkart-backend-8nm6.onrender.com`

Configure the frontend environment variable `VITE_API_URL` in Render to point to the deployed backend.

Because this is a single-page application, configure a frontend rewrite so that client-side routes resolve correctly after refreshing the page:

| Setting     | Value         |
| ----------- | ------------- |
| Source      | `/*`          |
| Destination | `/index.html` |
| Action      | `Rewrite`     |

### Backend — Web Service

* **Root directory:** `backend`
* **Build command:** `npm install`
* **Start command:** Use the production start script defined in `backend/package.json`.
* **Environment:** Configure the required database connection string, token secrets, and other backend environment variables in Render.

Make sure the backend CORS configuration permits the deployed frontend origin and that production cookies use settings appropriate for HTTPS and cross-site requests.

### Database — MongoDB Atlas

The backend connects to MongoDB Atlas using a connection string stored in an environment variable. Configure database network access and database-user permissions appropriately for your deployment.

## 🧪 Testing and Verification

After starting the application, verify the following:

* The frontend loads without console errors.
* The backend starts successfully and connects to MongoDB.
* Frontend API requests reach the deployed or local backend.
* Authentication works as expected.
* Protected requests behave correctly when authenticated and unauthenticated.
* Refreshing client-side routes does not produce a 404.
* Production configuration does not expose private secrets.

Automated test commands depend on the scripts configured in the frontend and backend `package.json` files.

## 📁 Project Structure

The repository is organized into separate frontend and backend applications.

```text
shopkart/
├── frontend/
│   ├── public/
│   ├── src/
│   │   ├── services/
│   │   │   └── api.js
│   │   └── ...
│   ├── .env.development
│   ├── .env.production
│   └── package.json
│
├── backend/
│   ├── ...
│   └── package.json
│
├── .gitignore
└── README.md
```

This is a high-level illustration of the structure. Keep the directory names and files aligned with the actual repository.

## 🔮 Future Improvements

Potential improvements for future versions include:

* Product search, filtering, and sorting.
* Shopping cart and order management enhancements.
* Improved input validation and centralized error handling.
* Automated API and integration tests.
* Accessibility and responsive-design improvements.
* Pagination and performance optimization.
* CI/CD checks for build and test failures.
* More detailed API documentation.

These are possible directions for future development, not claims about currently implemented features.

## 🤝 Contributing

Contributions, suggestions, and bug reports are welcome.

1. Fork the repository.
2. Create a feature branch.
3. Make your changes and test them.
4. Commit your changes with a clear message.
5. Open a pull request describing the changes.

## 📄 License

No license has been specified here. If you want others to reuse, modify, or distribute your code, choose an appropriate open-source license and add its corresponding `LICENSE` file to the repository.

## 👨‍💻 Author

**Charan**

* GitHub: [@charanpatrick68](https://github.com/charanpatrick68)

---

*ShopKart — building a full-stack shopping experience, one feature at a time.*
