# Campus Marketplace

Campus Marketplace is a full-stack web application built with the MERN stack (MongoDB, Express, React, Node.js). It's a platform for students to buy and sell used items on campus.

## Features

*   **User Authentication:** Secure user registration and login with JWT.
*   **Listings:** Create, browse, and search for listings.
*   **Real-time Chat:** Real-time messaging between users with Socket.io.
*   **Image Uploads:** Upload images to Cloudinary.
*   **Dockerized:** Fully containerized for easy local development and deployment.

## Getting Started

### Prerequisites

*   [Docker](https://www.docker.com/get-started)
*   [Node.js](https://nodejs.org/en/) (for local development without Docker)

### Installation

1.  **Clone the repository:**

    ```bash
    git clone https://github.com/your-username/campus-marketplace.git
    cd campus-marketplace
    ```

2.  **Create a `.env` file in the `server` directory:**

    Copy the contents of `server/.env.example` to `server/.env` and fill in the required environment variables.

3.  **Run with Docker Compose:**

    ```bash
    docker-compose up --build
    ```

    The application will be available at `http://localhost:5173`.

### Running Tests

To run the tests, you can use the following command:

```bash
docker-compose run server npm test
```

## Project Structure

```
campus-marketplace/
├── client/              # React frontend
│   ├── public/
│   ├── src/
│   │   ├── app/         # Redux store
│   │   ├── components/  # Reusable components
│   │   ├── features/    # Redux slices
│   │   ├── hooks/       # Custom hooks
│   │   ├── pages/       # Page components
│   │   ├── App.jsx
│   │   ├── index.css
│   │   └── main.jsx
│   ├── Dockerfile
│   ├── nginx.conf
│   └── package.json
├── server/              # Node.js backend
│   ├── config/
│   ├── controllers/
│   ├── middleware/
│   ├── models/
│   ├── routes/
│   ├── .env.example
│   ├── Dockerfile
│   ├── package.json
│   └── server.js
├── .github/             # GitHub Actions workflows
│   └── workflows/
│       └── ci.yml
├── docker-compose.yml
└── README.md
```
