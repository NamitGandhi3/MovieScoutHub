# Development Guide

This document provides detailed information for developers who want to work on the Movie Explorer project.

## Project Overview

Movie Explorer is a full-stack web application built with:
- **Frontend**: React, TypeScript, Tailwind CSS, shadcn/ui
- **Backend**: Express.js, Node.js
- **API Integration**: TMDB API for movie data

The application is structured to be portable and environment-agnostic, allowing it to run on any local machine or hosting environment.

## Setting Up Your Development Environment

### Prerequisites

- Node.js (v16 or newer)
- npm or yarn
- Git
- TMDB API key

### Local Setup

1. **Clone the repository**
   ```bash
   git clone [repository-url]
   cd movie-explorer
   ```

2. **Set up the configuration files**
   ```bash
   # Copy the local package.json for development
   cp local-package.json package.json
   
   # Use the local Vite configuration
   cp local-vite.config.ts vite.config.ts
   
   # Create your environment file
   cp .env.example .env
   ```

3. **Configure environment variables**
   Edit the `.env` file and add your TMDB API key and other required variables:
   ```
   TMDB_API_KEY=your_api_key_here
   JWT_SECRET=your_jwt_secret_here
   PORT=5000
   NODE_ENV=development
   ```

4. **Install dependencies**
   ```bash
   npm install
   # or
   yarn install
   ```

## Development Workflow

### Running the Application

```bash
# Start both frontend and backend in development mode
npm run dev
```

This will start:
- The backend server at http://localhost:5000
- The frontend development server at http://localhost:3000

### Development Structure

- **Frontend**: All React code is in the `client/src` directory
- **Backend**: Express API routes are in the `server` directory
- **Shared**: Common types and schemas are in the `shared` directory

### Key Files and Directories

- `client/src/pages`: Page components
- `client/src/components`: Reusable UI components
- `client/src/hooks`: Custom React hooks
- `client/src/lib`: Utility functions and services
- `server/routes.ts`: Backend API routes
- `server/storage.ts`: Data storage implementation
- `shared/schema.ts`: Type definitions and schemas

## Data Storage

The application uses:

1. **Server-side**: In-memory storage via the `MemStorage` class in `server/storage.ts`
2. **Client-side**: 
   - `localStorage` for storing user authentication tokens and favorites
   - `React Context` for state management across components

### Authentication Flow

1. User registers or logs in
2. Server validates credentials and returns a JWT token
3. Client stores the token in localStorage
4. Future API requests include the token in the Authorization header

## API Integration

### TMDB API

The application uses The Movie Database (TMDB) API to fetch movie data. The integration is implemented in `client/src/lib/tmdb.ts`.

Key endpoints used:
- `/movie/popular`: Get popular movies
- `/movie/top_rated`: Get top-rated movies
- `/search/movie`: Search for movies
- `/movie/{id}`: Get detailed information about a movie

### Local API

The backend provides several API endpoints:

- **Authentication**:
  - `POST /api/auth/register`: Register a new user
  - `POST /api/auth/login`: Login with credentials

- **Favorites**:
  - `GET /api/favorites`: Get user's favorite movies
  - `POST /api/favorites`: Add a movie to favorites
  - `DELETE /api/favorites/:movieId`: Remove a movie from favorites

## Building and Deployment

### Building for Production

```bash
# Build the client and server
npm run build
```

This command:
1. Builds the React frontend with Vite
2. Compiles the TypeScript server code

### Running in Production

```bash
# Start the production server
npm start
```

This starts the Express server which:
1. Serves the static frontend files
2. Handles API requests
3. Manages server-side routing

## Customization

### Theme Customization

The application uses shadcn/ui with Tailwind CSS for styling. The theme can be customized in the `theme.json` file.

### Adding New Features

1. **New Pages**: Add new page components in `client/src/pages` and update routing in `client/src/App.tsx`
2. **New API Endpoints**: Add new routes in `server/routes.ts`
3. **New Data Models**: Update the schemas in `shared/schema.ts` and implement storage methods in `server/storage.ts`

## Troubleshooting

### Common Issues

1. **API Key Errors**: Ensure your TMDB API key is correctly set in the `.env` file
2. **Build Errors**: Make sure all dependencies are installed with `npm install`
3. **Environment Variables**: Check that your `.env` file is properly configured

### Debugging

- **Frontend**: Use browser developer tools and React DevTools
- **Backend**: Check server logs in the terminal
- **API Requests**: Use network tab in browser developer tools to inspect requests and responses

## Contributing

1. Fork the repository
2. Create a feature branch: `git checkout -b feature-name`
3. Commit your changes: `git commit -am 'Add feature'`
4. Push to the branch: `git push origin feature-name`
5. Submit a pull request

## Resources

- [React Documentation](https://reactjs.org/docs/getting-started.html)
- [TypeScript Documentation](https://www.typescriptlang.org/docs/)
- [Express.js Documentation](https://expressjs.com/)
- [Tailwind CSS Documentation](https://tailwindcss.com/docs)
- [TMDB API Documentation](https://developers.themoviedb.org/3/getting-started/introduction)
- [shadcn/ui Documentation](https://ui.shadcn.com/)