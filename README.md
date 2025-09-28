# Utilities Bill Visualizer

[![CI/CD Pipeline](https://github.com/MohammadMushfiqurRahman/utilities_bill_visualizer/actions/workflows/ci-cd.yml/badge.svg)](https://github.com/MohammadMushfiqurRahman/utilities_bill_visualizer/actions/workflows/ci-cd.yml)

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
- Docker (for deployment)

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

### Database

The application uses Sequelize to manage the database. When the application starts, it automatically synchronizes the models with the database, creating any missing tables. This is convenient for local development, but it is not recommended for production environments. For production, you should use a migration tool like `Sequelize-CLI` to manage database schema changes.

### Local Development

When you start the backend server, the database tables will be created automatically. See the "Database" section for more information.

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

This application is configured for continuous integration and continuous deployment (CI/CD) using GitHub Actions.

### CI/CD Pipeline

The CI/CD pipeline is defined in the `.github/workflows/ci-cd.yml` file and consists of the following jobs:

1.  **`build-and-test-backend`:** This job builds the backend application, runs the tests, and pushes a Docker image to the GitHub Container Registry.
2.  **`build-frontend`:** This job builds the frontend application and pushes a Docker image to the GitHub Container Registry.
3.  **`deploy`:** This job is triggered after the `build-and-test-backend` and `build-frontend` jobs have completed successfully. It pulls the latest Docker images from the GitHub Container Registry and restarts the services using `docker-compose`.

### Docker Deployment

When you deploy the application, the database tables will be created automatically. See the "Database" section for more information. For production environments, it is recommended to use a migration tool to manage database schema changes.

To deploy the application using Docker, you can manually run the following commands:

1. **Build and run the containers**
   ```sh
   docker-compose up -d --build
   ```
2. **Access the application**
   Open your browser and navigate to `http://localhost`

### Secrets

The `deploy` job requires the following secrets to be set in your GitHub repository:

- `JWT_SECRET`: The secret key used to sign JWT tokens.
- `GEMINI_API_KEY`: Your Gemini API key.