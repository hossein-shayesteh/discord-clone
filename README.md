# Discord Clone
Discord Clone is a replica of the popular communication platform Discord. This project is built using modern web technologies, including Next.js, React, Tailwind CSS, Prisma, and more. It aims to provide a robust and scalable application for real-time communication.

## Table of Contents
- [Features](#features)
- [Tech Stack](#tech-stack)
- [Installation](#installation)
- [Running the Project](#running-the-project)
- [Scripts](#scripts)

## Features
- User authentication and management with Clerk
- Real-time messaging
- Real-time communication via video and audio
- Theme support with Next Themes
- Form validation with React Hook Form and Zod
- Responsive design with Tailwind CSS

## Tech Stack
- **Framework:** [Next.js](https://nextjs.org/)
- **Language:** [TypeScript](https://www.typescriptlang.org/)
- **Styling:** [Tailwind CSS](https://tailwindcss.com/)
- **Authentication:** [Clerk](https://clerk.dev/)
- **State Management:** [Zustand](https://github.com/pmndrs/zustand)
- **Database:** [Prisma](https://www.prisma.io/)
- **UI Components:** [Shadcn/ui](https://ui.shadcn.com/)

## Installation
To set up this project locally, follow these steps:

1. **Clone the repository:**
    ```bash
    git clone https://github.com/hossein-shayesteh/discord-clone.git
    cd discord-clone
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Set up environment variables:**
    ```bash
    DATABASE_URL=your_database_url
    
    NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=your_clerk_frontend_api
    CLERK_SECRET_KEY=your_clerk_secret_key
    NEXT_PUBLIC_CLERK_SIGN_IN_URL=/sign-in
    NEXT_PUBLIC_CLERK_SIGN_UP_URL=/sign-up
    NEXT_PUBLIC_CLERK_AFTER_SIGN_IN_URL=/
    NEXT_PUBLIC_CLERK_AFTER_SIGN_UP_URL=/
    
    UPLOADTHING_SECRET=uploadthing_secret
    UPLOADTHING_APP_ID=uploadthing_app_id

    LIVEKIT_API_KEY=liveKit_api_key
    LIVEKIT_API_SECRET=liveKit_api_secret
    NEXT_PUBLIC_LIVEKIT_URL=liveKit_url
    ```

4. **Set up the database:**
   ```bash
   npx prisma migrate dev --name init
   ```
## Running the Project
To run the project locally, use the following command:
   ```bash
   npm run dev
   ```
This will start the Next.js development server at http://localhost:3000.

## Scripts
- `dev`: Starts the development server.
- `build`: Builds the application for production.
- `start`: Starts the production server.
- `lint`: Runs ESLint to check for linting errors.
