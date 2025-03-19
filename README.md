# Movie Explorer

A responsive movie explorer website with authentication, TMDB API integration, and favorites management. This application allows users to browse movies, search for specific titles, view movie details, and save favorites to their profile.

## Features

- User authentication (register/login)
- Browse popular and top-rated movies
- Search for movies by title
- View detailed movie information
- Save and manage favorite movies
- Responsive design for all devices

## Tech Stack

- **Frontend**: React, TypeScript, Tailwind CSS, shadcn/ui
- **Backend**: Express.js, Node.js
- **State Management**: React Query
- **Authentication**: JWT
- **Routing**: wouter
- **Form Handling**: React Hook Form + Zod validation
- **API Integration**: TMDB API

## Prerequisites

- Node.js (v16 or newer)
- npm or yarn
- TMDB API key (get one at [https://www.themoviedb.org/settings/api](https://www.themoviedb.org/settings/api))

## Installation

1. Clone the repository:
   ```bash
   git clone [repository-url]
   cd movie-explorer
   ```

2. Copy the local package.json:
   ```bash
   cp local-package.json package.json
   ```

3. Install dependencies:
   ```bash
   npm install
   # or
   yarn install
   ```

4. Create a `.env` file in the root directory:
   ```bash
   cp .env.example .env
   ```

5. Add your TMDB API key to the `.env` file:
   ```
   TMDB_API_KEY=your_api_key_here
   JWT_SECRET=your_jwt_secret_here
   PORT=5000
   NODE_ENV=development
   ```

6. Use the local Vite configuration:
   ```bash
   cp local-vite.config.ts vite.config.ts
   ```

## Running the Application

### Development Mode

To run the application in development mode with hot reloading:

```bash
npm run dev
# or
yarn dev
```

This will start both the backend server and frontend development server concurrently.

- Backend API will be available at: http://localhost:5000/api
- Frontend will be available at: http://localhost:3000

### Build for Production

To build the application for production:

```bash
npm run build
# or
yarn build
```

### Start Production Server

To start the production server after building:

```bash
npm start
# or
yarn start
```

The application will be available at: http://localhost:5000

## Data Storage

This application uses local storage for client-side data persistence. User authentication tokens and favorite movies are stored in the browser's localStorage. On the server side, data is stored in memory using a Map-based storage implementation.

## API Endpoints

### Authentication

- `POST /api/auth/register` - Register a new user
- `POST /api/auth/login` - Login with username and password

### Favorites

- `GET /api/favorites` - Get user favorites (requires authentication)
- `POST /api/favorites` - Add movie to favorites (requires authentication)
- `DELETE /api/favorites/:movieId` - Remove movie from favorites (requires authentication)

### Movies

- `GET /api/movies/popular` - Get popular movies
- `GET /api/movies/top_rated` - Get top-rated movies
- `GET /api/movies/search?query={query}` - Search movies by title
- `GET /api/movies/:id` - Get detailed movie information

## Project Structure

```
├── client/              # Frontend code
│   ├── src/
│   │   ├── components/  # UI components
│   │   ├── hooks/       # Custom hooks
│   │   ├── lib/         # Utility functions
│   │   ├── pages/       # Page components
│   │   ├── App.tsx      # Main application component
│   │   └── main.tsx     # Entry point
│   └── index.html       # HTML template
├── server/              # Backend code
│   ├── index.ts         # Server entry point
│   ├── routes.ts        # API routes
│   ├── storage.ts       # In-memory data storage
│   └── vite.ts          # Vite server configuration
├── shared/              # Shared code
│   └── schema.ts        # Data schemas and types
├── .env.example         # Example environment variables
├── package.json         # Project dependencies
├── vite.config.ts       # Vite configuration
└── README.md            # Project documentation
```

## License

MIT