# AgriSense Hub - Web Application

This directory contains the source code for the AgriSense Hub web application,
which includes both the client-side and server-side components.

## Prerequisites

- [Node.js](https://nodejs.org/) (v18 or later recommended)
- [npm](https://www.npmjs.com/)

## Project Structure

- `src/client/`: Contains the frontend React application.
- `src/server/`: Contains the backend Node.js/Express application.

## Installation

1.  Clone the repository.
2.  Navigate to the `Web` directory.
3.  Install all dependencies for both the client and server by running:

    ```sh
    npm run install:all
    ```

    This will run `npm install` in both the `src/client` and `src/server`
    directories.

## Configuration

Before running the application, you need to set up the environment variables and
SSL certificates for the server.

### 1. Server Environment Variables

The server requires a `.env` file for its configuration. An example file is
provided at `src/server/.env.example`.

1.  Create a copy of `.env.example` in the `src/server/` directory and name it
    `.env`.
    ```sh
    # From the Web/src/server directory
    copy .env.example .env
    ```
2.  Open the new `Web/src/server/.env` file and fill in the values for your
    environment.

### 2. SSL Certificates

The server requires SSL certificates to run over HTTPS. An example certificate,
`example.pem`, is included in the `src/server/certs` directory for reference.

1.  Place your own certificate files inside the `Web/src/server/certs/`
    directory:
    - `cert.pem` (your SSL certificate)
    - `key.pem` (your SSL private key)
    - `isrgrootx1.pem` (the root certificate for MQTT, if required)

The final structure should look like this:

```
Web/
└── src/
    └── server/
        ├── certs/
        │   ├── cert.pem
        │   ├── key.pem
        │   ├── isrgrootx1.pem
        │   └── example.pem  (For reference)
        ├── .env
        └── .env.example
```

### 3. Client Environment Variables

The client application may also require an environment file. If needed, create a
`.env` file in the `src/client/` directory (`Web/src/client/.env`).

## Running the Application

You can run the client and server concurrently with a single command from the
`Web` directory:

```sh
npm run run:all
```

This will start:

- The **server** in development mode at `https://<your-ip-or-localhost>:3000`.
- The **client** development server, typically at `http://localhost:3001` (check
  the client's console output for the exact URL).

Alternatively, you can run them separately:

- **To run the server only:**

    ```sh
    npm run run:server
    ```

- **To run the client only:**
    ```sh
    npm run run:client
    ```

## Building for Production

To build the server for production, navigate to the `src/server` directory and
run the `start` script. This will transpile the TypeScript code to JavaScript in
the `dist` directory and start the server.

```sh
cd src/server
npm run start
```
