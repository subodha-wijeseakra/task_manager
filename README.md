# 📋 Internship Task Manager

![Project Status](https://img.shields.io/badge/status-active-success.svg)
![License](https://img.shields.io/badge/license-MIT-blue.svg)
![Next.js](https://img.shields.io/badge/Next.js-14-black)
![TypeScript](https://img.shields.io/badge/TypeScript-5.0-blue)
![Tailwind CSS](https://img.shields.io/badge/Tailwind-3.0-38B2AC)
![MongoDB](https://img.shields.io/badge/MongoDB-4.4-47A248)

> **A production-ready, full-stack Task Management application designed to help interns and students organize their work efficiently.**

Built with modern web technologies including **Next.js 14 (App Router)**, **TypeScript**, **Tailwind CSS**, **MongoDB**, and **NextAuth.js**.

---

## 🚀 Key Features

### 🔐 Advanced Authentication
- **Secure Login**: Email/Password authentication using `bcryptjs` for encryption.
- **Social Login**: Seamless Google OAuth integration.
- **Role-Based Access Control (RBAC)**: Distinct roles for **Students** and **Admins**.

### 📊 Smart Dashboard
- **Visual Insights**: Interactive charts powered by `Recharts` to visualize task completion and status distribution.
- **Progress Tracking**: Real-time stats on pending, in-progress, and completed tasks.

### 📝 Comprehensive Task Management
- **CRUD Operations**: Create, Read, Update, and Delete tasks with ease.
- **Rich Task Details**: Add titles, descriptions, due dates, priorities, and statuses.
- **Multiple Views**:
    - **List View**: A standard, detailed list of all tasks.
    - **Board View**: Kanban-style drag-and-drop board (powered by `@hello-pangea/dnd`).
    - **Calendar View**: Monthly view to track deadlines.

### 🎨 Modern UI/UX
- **Responsive Design**: Mobile-first architecture ensures a great experience on all devices.
- **Dark Mode**: Fully supported dark/light themes via `next-themes`.
- **Interactive Components**: Smooth transitions and clean layout using `framer-motion` (if used) and `react-icons`.

### 🛡️ Security & Performance
- **Protected Routes**: Middleware ensures only authenticated users access private pages.
- **Form Validation**: Robust client/server validation using `Zod` and `React Hook Form`.

---

## 🛠️ Tech Stack

| Category | Technology |
|----------|------------|
| **Framework** | [Next.js 14](https://nextjs.org/) (App Router) |
| **Language** | [TypeScript](https://www.typescriptlang.org/) |
| **Styling** | [Tailwind CSS](https://tailwindcss.com/), `clsx`, `tailwind-merge` |
| **Database** | [MongoDB](https://www.mongodb.com/) (Atlas or Local) |
| **ORM** | [Mongoose](https://mongoosejs.com/) |
| **Auth** | [NextAuth.js](https://next-auth.js.org/) (v4) |
| **Forms** | [React Hook Form](https://react-hook-form.com/), [Zod](https://zod.dev/) |
| **Charts** | [Recharts](https://recharts.org/) |
| **Icons** | [React Icons](https://react-icons.github.io/react-icons/) |

---

## 🚀 Getting Started

Follow these steps to set up the project locally.

### Prerequisites

Ensure you have the following installed:
- [Node.js](https://nodejs.org/) (v18 or higher)
- [MongoDB Atlas](https://www.mongodb.com/atlas/database) account or a local MongoDB instance.

### Installation

1.  **Clone the repository:**
    ```bash
    git clone https://github.com/yourusername/taskmanager.git
    cd taskmanager
    ```

2.  **Install dependencies:**
    ```bash
    npm install
    ```

3.  **Environment Setup:**  
    Create a `.env.local` file in the root directory and populate it with your credentials:

    ```env
    # Database
    MONGODB_URI=mongodb+srv://<username>:<password>@cluster.mongodb.net/taskmanager

    # NextAuth
    NEXTAUTH_SECRET=your_super_secret_generated_key
    NEXTAUTH_URL=http://localhost:3000

    # Google Auth (Optional, for social login)
    GOOGLE_CLIENT_ID=your_google_client_id
    GOOGLE_CLIENT_SECRET=your_google_client_secret
    ```

    > **Tip**: You can generate a random secret for `NEXTAUTH_SECRET` using `openssl rand -base64 32`.

4.  **Run the development server:**
    ```bash
    npm run dev
    ```

5.  **Open the app:**  
    Visit [http://localhost:3000](http://localhost:3000) in your browser.

---

## 📂 Project Structure

```bash
├── src/
│   ├── app/            # App Router pages & API routes
│   ├── components/     # Reusable UI components
│   │   ├── ui/         # Generic UI elements (Buttons, Inputs)
│   │   ├── views/      # Complex views (Calendar, Board)
│   │   └── ...
│   ├── lib/            # Utilities (DB connection, validators)
│   ├── models/         # Mongoose schemas (User, Task)
│   └── ...
├── public/             # Static assets
└── ...
```

---

## 🤝 Contributing

Contributions are welcome!
1.  Fork the project.
2.  Create your feature branch (`git checkout -b feature/AmazingFeature`).
3.  Commit your changes (`git commit -m 'Add some AmazingFeature'`).
4.  Push to the branch (`git push origin feature/AmazingFeature`).
5.  Open a Pull Request.

---

## 📄 License

Distributed under the MIT License. See `LICENSE` for more information.
