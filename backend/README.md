# Backend Setup

## Prerequisites

- Node.js and npm installed
- A MongoDB Atlas account and a connection string

## Installation

1.  Navigate to the `backend` directory:
    ```bash
    cd backend
    ```
2.  Install the dependencies:
    ```bash
    npm install
    ```

## Configuration

1.  Open `server.js` and replace `'YOUR_MONGO_URI'` with your actual MongoDB Atlas connection string.

## Running the Server

1.  Start the server with the following command:
    ```bash
    npm start
    ```
2.  The server will be running on `http://localhost:5000`.

## API Endpoints

-   `POST /api/auth/signup`: Create a new user.
-   `POST /api/auth/login`: Log in an existing user.
