# FitVerse 💪

FitVerse is a comprehensive, full-stack fitness and health tracking application built with the MERN stack (MongoDB, Express.js, React, Node.js). It empowers users to monitor their workouts, manage their diet, track their physical progress, and engage with a supportive fitness community.

## 🌟 Key Features

*   **Secure Authentication**: Robust user registration and login system using JSON Web Tokens (JWT) and encrypted passwords.
*   **Intuitive Dashboard**: A central hub providing a quick overview of your daily goals, recent activities, and fitness summaries.
*   **Workout Tracking**: Easily log your exercises, track sets, reps, and weights to manage your workout routines effectively.
*   **Diet & Nutrition Management**: Set dietary goals, create meal plans, and log your daily meals to stay on top of your nutrition.
*   **Progress Dashboard**: Visualize your fitness journey over time with interactive charts and graphs measuring various health metrics.
*   **Community Engagement**: Share updates, read others' posts, and connect with fellow fitness enthusiasts in the Community forum.
*   **Customizable Profile**: Manage your personal information and application preferences to tailor FitVerse to your needs.

## 🛠️ Technology Stack

FitVerse leverages a modern web development stack for performance, scalability, and user experience.

### Frontend
*   **Framework**: [React.js](https://reactjs.org/) (bootstrapped with [Vite](https://vitejs.dev/))
*   **Styling**: [Tailwind CSS](https://tailwindcss.com/)
*   **UI Components**: [shadcn/ui](https://ui.shadcn.com/) (built on Radix UI)
*   **Routing**: React Router
*   **Data Fetching & State**: [TanStack Query](https://tanstack.com/query/latest) (React Query)
*   **Form Management**: Form handling with `react-hook-form` and validation via `zod`.
*   **Charting**: [Recharts](https://recharts.org/) for beautiful, responsive progress charts.

### Backend
*   **Runtime**: [Node.js](https://nodejs.org/)
*   **Framework**: [Express.js](https://expressjs.com/)
*   **Database**: [MongoDB](https://www.mongodb.com/) with [Mongoose](https://mongoosejs.com/) ODM
*   **Authentication**: Custom Auth using JWT (`jsonwebtoken`) and password hashing (`bcryptjs`)
*   **Middleware**: `cors`, `helmet` (for security), `morgan` (for request logging)

## 📁 Project Structure

The repository is organized into distinct directories for the frontend and backend to keep the codebase modular and scalable.

```text
FitVerse/
├── client/                 # Frontend React application (Vite)
│   ├── public/             # Static assets
│   ├── src/
│   │   ├── assets/         # Images, icons, and other creative assets
│   │   ├── components/     # Reusable UI components (shadcn/ui, etc.)
│   │   ├── contexts/       # React Context providers
│   │   ├── hooks/          # Custom React hooks
│   │   ├── lib/            # Utility functions and library wrappers
│   │   ├── pages/          # Application views/routes (Auth, Dashboard, Diet, Workouts, etc.)
│   │   ├── App.jsx         # Root application component
│   │   └── main.jsx        # Frontend application entry point
│   ├── package.json
│   └── vite.config.js      # Vite build configuration
│   
└── server/                 # Backend Node.js API (Express)
    ├── src/
    │   ├── config/         # Configuration files (Database connection, etc.)
    │   ├── controllers/    # API Request handlers and business logic
    │   ├── middleware/     # Custom Express middleware (Auth, Error Handling)
    │   ├── models/         # Mongoose schemas (User, Workout, Diet, Progress, etc.)
    │   ├── routes/         # Express API endpoint definitions
    │   └── utils/          # Backend utility functions
    ├── server.js           # Backend server setup and entry point
    └── package.json
```

## 🚀 Getting Started

Follow these instructions to set up the project locally for development and testing.

### Prerequisites

*   [Node.js](https://nodejs.org/) (v16 or higher recommended)
*   [MongoDB](https://www.mongodb.com/) (Local installation or a MongoDB Atlas URI)

### Installation

1.  **Clone the repository** (if applicable):
    ```bash
    git clone <repository-url>
    cd FitVerse
    ```

2.  **Setup Backend**:
    *   Navigate to the server directory:
        ```bash
        cd server
        ```
    *   Install dependencies:
        ```bash
        npm install
        ```
    *   Create a `.env` file in the `server` directory and configure your environment variables (e.g., `PORT`, `MONGODB_URI`, `JWT_SECRET`).
    *   Start the development server:
        ```bash
        npm run dev
        ```

3.  **Setup Frontend**:
    *   Open a new terminal and navigate to the client directory:
        ```bash
        cd client
        ```
    *   Install dependencies:
        ```bash
        npm install
        ```
    *   Create a `.env` file in the `client` directory if necessary (e.g., for setting `VITE_API_URL`).
    *   Start the Vite development server:
        ```bash
        npm run dev
        ```

4.  **Access the Application**:
    *   Open your browser and navigate to the local server address provided by Vite (typically `http://localhost:5173`).

## 🤝 Contributing

Contributions, issues, and feature requests are welcome!

## 📄 License

This project is licensed under the ISC License.
