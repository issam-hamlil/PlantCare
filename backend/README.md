# PlantCare Backend

## Overview
The PlantCare application is designed to help users manage their plants effectively. This backend service is built using Node.js and provides a RESTful API for the frontend React application.

## Project Structure
The backend is organized into several directories, each serving a specific purpose:

- **src**: Contains the source code for the backend application.
  - **config**: Configuration files, including database connection settings.
  - **controllers**: Functions that handle incoming requests and return responses.
  - **middleware**: Custom middleware for authentication, error handling, and file uploads.
  - **models**: Mongoose models that define the structure of the data in MongoDB.
  - **routes**: Route definitions for handling API endpoints.
  - **services**: Business logic and external service integrations.
  - **utils**: Utility functions for various tasks.

## Installation
1. Clone the repository:
   ```
   git clone <repository-url>
   ```
2. Navigate to the backend directory:
   ```
   cd backend
   ```
3. Install the dependencies:
   ```
   npm install
   ```

## Environment Variables
Create a `.env` file in the backend directory and add the following variables:
```
MONGODB_URI=<your_mongodb_connection_string>
PORT=3002
JWT_SECRET=<your_jwt_secret>
```

## Running the Application
To start the backend server, run:
```
npm start
```
The server will run on `http://localhost:3002`.

## API Documentation
Refer to the individual route files in the `routes` directory for detailed API documentation.

## Contributing
Contributions are welcome! Please submit a pull request or open an issue for any enhancements or bug fixes.

## License
This project is licensed under the MIT License. See the LICENSE file for details.