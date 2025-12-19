# Internship Task Manager

A production-ready, full-stack Task Management application designed for interns and students to organize their work efficiently. Built with Next.js 14 (App Router), TypeScript, Tailwind CSS, MongoDB, and NextAuth.js.

## Features

- **Authentication**: Secure Login and Registration using Email/Password and Google OAuth.
- **Role-Based Access**: Support for Student and Admin roles.
- **Dashboard**: Visual overview of task progress, including completion rates and status distribution.
- **Task Management**: Create, Read, Update, and Delete (CRUD) tasks.
- **Task Organization**: Categorize tasks by Status (Pending, In Progress, Completed) and Priority (Low, Medium, High).
- **Responsive Design**: Fully responsive UI built with Tailwind CSS, supporting Dark Mode (system preference).
- **Security**: Protected API routes and middleware-based page protection.

## Tech Stack

- **Framework**: Next.js 14 (App Router)
- **Language**: TypeScript
- **Styling**: Tailwind CSS, clsx, tailwind-merge
- **Database**: MongoDB (via Mongoose)
- **Authentication**: NextAuth.js (v4)
- **Forms**: React Hook Form + Zod
- **Icons**: React Icons

## Getting Started

### Prerequisites

- Node.js (v18+)
- MongoDB Atlas Account (or local MongoDB)

### Installation

1.  **Clone the repository:**
    ```bash
    git clone <repository-url>
    cd taskmanager
    ```

2.  **Install dependencies:**
    ```bash
    npm install
    ```

3.  **Environment Setup:**
    Create a `.env.local` file in the root directory and add the following variables:

    ```env
    MONGODB_URI=your_mongodb_connection_string
    NEXTAUTH_SECRET=your_super_secret_key
    NEXTAUTH_URL=http://localhost:3000
    
    # Google Auth (Optional)
    GOOGLE_CLIENT_ID=your_google_client_id
    GOOGLE_CLIENT_SECRET=your_google_client_secret
    ```

4.  **Run the development server:**
    ```bash
    npm run dev
    ```

    Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

## Deployment

The application is deployment-ready for Vercel.

1.  Push your code to a GitHub repository.
2.  Import the project in Vercel.
3.  Add the Environment Variables (MONGODB_URI, NEXTAUTH_SECRET, etc.) in the Vercel Project Settings.
4.  Deploy!

## Project Structure

- `src/app`: App Router pages and API routes.
- `src/components`: Reusable UI components.
- `src/lib`: Utility functions and database connection.
- `src/models`: Mongoose database models.
- `src/app/actions`: Server Actions for data mutation.

## License

MIT
