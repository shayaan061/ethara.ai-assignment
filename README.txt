# Ethara.Ai Recruitment Platform

An AI-powered recruitment platform designed to streamline the hiring process with a premium, animated user experience. The platform includes dedicated portals for applicants and companies, along with a comprehensive admin dashboard for project and task management.

## Tech Stack

### Frontend
- **Framework:** Next.js 16
- **Library:** React 19
- **Styling:** Tailwind CSS v4
- **Animations:** Framer Motion
- **Language:** TypeScript

### Backend
- **Framework:** Django 5.2
- **API:** Django REST Framework
- **Database:** PostgreSQL
- **Authentication:** JWT (via djangorestframework-simplejwt)
- **Server:** Gunicorn

## Project Structure

- `/frontend` - Contains the Next.js application, including the UI components, pages, and Framer Motion animations.
- `/backend` - Contains the Django application, including the REST API, database models, and authentication logic.

## Getting Started

### Prerequisites
- Node.js (v20+)
- Python (v3.10+)
- PostgreSQL

### Frontend Setup
1. Navigate to the frontend directory:
   ```bash
   cd frontend
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. Start the development server:
   ```bash
   npm run dev
   ```

### Backend Setup
1. Navigate to the backend directory:
   ```bash
   cd backend
   ```
2. Create and activate a virtual environment (recommended):
   ```bash
   python -m venv venv
   source venv/bin/activate  # On Windows use `venv\Scripts\activate`
   ```
3. Install dependencies:
   ```bash
   pip install -r ../requirements.txt
   ```
4. Apply database migrations:
   ```bash
   python manage.py migrate
   ```
5. Create a superuser (optional):
   ```bash
   python manage.py createsuperuser
   ```
6. Start the development server:
   ```bash
   python manage.py runserver
   ```

## Deployment
The project is configured for deployment (e.g., on Railway or Heroku).
- The `Procfile` is set up to automatically run database migrations, create a default admin user, and start the Gunicorn server.
- The `/frontend` directory contains a `Dockerfile` for containerized deployment of the Next.js application.
