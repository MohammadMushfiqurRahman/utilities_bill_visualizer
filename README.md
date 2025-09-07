# Utilities Bill Visualizer

This project is a web application that allows users to upload their utility bills in PDF format, extracts the relevant data using AI, and displays it in a user-friendly dashboard.

## About the Project

The Utilities Bill Visualizer is designed to simplify the process of tracking and analyzing utility expenses. Users can upload multiple bills in a single PDF, and the application will automatically identify and extract key information such as vendor name, bill date, total amount, and usage details. The extracted data is then presented in a clear and interactive dashboard, allowing users to visualize their utility consumption and costs over time.

## Features

- **PDF Bill Parsing:** Automatically extracts data from PDF utility bills using the Gemini API.
- **Data Visualization:** Displays extracted data in a clean and interactive dashboard.
- **Apartment Filtering:** Allows users to filter bills by apartment to analyze costs for individual units.
- **Secure Authentication:** User registration and login functionality to protect user data.
- **RESTful API:** A well-defined API for managing bills and user authentication.

## Technologies Used

- **Frontend:**
  - React
  - TypeScript
  - Vite
  - Tailwind CSS
- **Backend:**
  - Node.js
  - Express.js
  - Sequelize
  - SQLite
  - JWT for authentication
- **AI:**
  - Google Gemini API

## Getting Started

To get a local copy up and running, follow these simple steps.

### Prerequisites

- Node.js
- npm

### Installation

1. **Clone the repo**
   ```sh
   git clone https://github.com/your_username/your_project_name.git
   ```
2. **Install NPM packages for the frontend**
   ```sh
   npm install
   ```
3. **Install NPM packages for the backend**
   ```sh
   cd backend
   npm install
   ```
4. **Set up environment variables**
   - Create a `.env` file in the root directory and add your Gemini API key:
     ```
     GEMINI_API_KEY=your_gemini_api_key
     ```
   - Create a `.env` file in the `backend` directory and add your JWT secret:
     ```
     JWT_SECRET=your_jwt_secret
     ```

### Usage

1. **Start the backend server**
   ```sh
   cd backend
   npm start
   ```
2. **Start the frontend development server**
   ```sh
   npm run dev
   ```
3. Open your browser and navigate to `http://localhost:5173`

## API Endpoints

The backend provides the following RESTful API endpoints:

### Authentication

- `POST /api/register`: Register a new user.
- `POST /api/login`: Log in an existing user and receive a JWT token.

### Bills

- `POST /api/upload`: Upload a PDF utility bill for processing and data extraction.
- `GET /api/bills`: Retrieve a list of all bills.
- `GET /api/bills/:id`: Retrieve a specific bill by its ID.

## Deployment

This application is configured for deployment using Docker and Nginx. The `docker-compose.yml` file in the root directory can be used to build and run the application in a containerized environment. The `nginx.conf` file is provided for configuring Nginx as a reverse proxy for the frontend and backend services. The CI/CD pipeline is set up using GitHub Actions to automatically build and deploy the application.