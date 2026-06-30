# Expense Tracker

A full-stack, production-ready Expense Tracker application built with modern web technologies and deployed using Docker and Kubernetes. This project demonstrates full-stack development, containerization, cloud-native deployment, and CI/CD practices suitable for a DevOps portfolio.
2026
---

## Features

* User registration and login with JWT authentication
* Secure HTTP-only cookie authentication
* Dashboard with financial overview
* Income management
* Expense management
* Category management
* Responsive modern UI
* Charts and analytics
* Protected routes
* RESTful API
* PostgreSQL database with Prisma ORM

---

## Tech Stack

### Frontend

* React 19
* TypeScript
* Vite
* Tailwind CSS
* Redux Toolkit
* React Router
* Axios
* Recharts

### Backend

* Node.js
* Express.js
* TypeScript
* Prisma ORM
* PostgreSQL
* JWT Authentication
* Cookie Parser

### DevOps

* Docker
* Docker Compose
* Kubernetes
* GitHub Actions
* Nginx

---

## Project Structure

```
expense-tracker/
│
├── frontend/
├── backend/
├── k8s/
├── .github/workflows/
├── docker-compose.yml
└── README.md
```

---

## Running Locally

### Clone the repository

```bash
git clone <repository-url>
cd expense-tracker
```

### Start with Docker Compose

```bash
docker compose up --build -d
```

The application will be available at:

Frontend

```
http://localhost:3000
```

Backend API

```
http://localhost:4000/api/v1
```

---

## Kubernetes Deployment

Apply all Kubernetes manifests:

```bash
kubectl apply -f k8s/
```

Check Deployments

```bash
kubectl get deployments
```

Check Pods

```bash
kubectl get pods
```

Check Services

```bash
kubectl get svc
```

---

## CI/CD

GitHub Actions automatically:

* Builds the frontend
* Builds the backend
* Runs project checks
* Builds Docker images
* Ready for automated deployment

---

## Screenshots

Add screenshots here:

* Login Page
* Dashboard
* Income Management
* Expense Management
* Categories
* Docker Containers
* Kubernetes Pods

---

## Future Improvements

* AWS deployment
* HTTPS with Nginx
* Monitoring using Prometheus and Grafana
* Logging with Loki
* Helm Charts
* Terraform Infrastructure
* GitOps using ArgoCD

---

## Author

Khalil Wali

GitHub: https://github.com/walikhalil480-art

