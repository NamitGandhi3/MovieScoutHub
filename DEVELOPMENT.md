# Movie Explorer Development Guide

This document provides instructions for setting up and developing the Movie Explorer application locally.

## Prerequisites

- Node.js v18 or later
- npm v9 or later
- A TMDB API key (get one at [The Movie Database API](https://www.themoviedb.org/settings/api))

## Getting Started

1. Clone the repository
```bash
git clone https://github.com/yourusername/movie-explorer.git
cd movie-explorer
```

2. Create a `.env` file
Copy the example environment file and update it with your TMDB API key:
```bash
cp .env.example .env
```
Then edit the `.env` file and replace `your_tmdb_api_key_here` with your actual API key.

3. Install dependencies
```bash
npm install
```

4. Start the development server
```bash
npm run dev
```

The application should now be running at http://localhost:5000

## Project Structure

```
├── client/                 # Frontend React application
│   ├── src/
│   │   ├── components/     # Reusable UI components
│   │   ├── hooks/          # Custom React hooks
│   │   ├── lib/            # Utility functions and API clients
│   │   ├── pages/          # Page components
│   │   ├── App.tsx         # Root application component
│   │   └── main.tsx        # Application entry point
├── server/                 # Backend Express application
│   ├── index.ts            # Server entry point
│   ├── routes.ts           # API route definitions
│   ├── storage.ts          # Data storage implementation
│   └── static-server.ts    # Static file server for production
├── shared/                 # Shared code between client and server
│   └── schema.ts           # Data schema definitions
└── .env                    # Environment variables (local)
```

## Development Workflow

1. **Frontend Development**: The frontend is a React application using TypeScript, Tailwind CSS, and shadcn/ui components. It's located in the `client/` directory.

2. **Backend Development**: The backend is an Express server that serves the API endpoints and acts as a proxy for the TMDB API. The server code is in the `server/` directory.

3. **Environment Variables**: 
   - `PORT`: The port the server runs on (default: 5000)
   - `NODE_ENV`: The environment mode (development or production)
   - `TMDB_API_KEY`: Your TMDB API key
   - `JWT_SECRET`: Secret key for JWT token generation
   - `JWT_EXPIRY`: JWT token expiration time (default: 7d)

## Building for Production

To build the application for production:

```bash
npm run build
```

This will:
1. Build the frontend into static files
2. Compile the TypeScript server code

## Running in Production

To run the application in production mode:

```bash
NODE_ENV=production npm start
```

The application will serve optimized static files and run with production settings.

## Troubleshooting

- **TMDB API Issues**: Ensure your API key is correctly set in the `.env` file. Check that it's active and valid in your TMDB account.

- **JWT Token Issues**: If you're experiencing authentication problems, check that your JWT_SECRET is correctly set and hasn't been changed since users registered.

- **Port Conflicts**: If port 5000 is already in use, change the PORT in your `.env` file to an available port.