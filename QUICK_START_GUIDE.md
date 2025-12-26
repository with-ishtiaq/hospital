# 🚀 Hospital Management System - Quick Start Guide

## Overview
This guide will help you get the Hospital Management System up and running in under 10 minutes.

## Prerequisites
- **Node.js** (v16 or higher) - [Download here](https://nodejs.org/)
- **MongoDB** (v5.0 or higher) - [Download here](https://www.mongodb.com/try/download/community)
- **Python** (v3.8 or higher) - [Download here](https://www.python.org/downloads/)
- **Git** - [Download here](https://git-scm.com/)

## Quick Setup (3 Steps)

### Step 1: Clone and Setup Backend
```bash
# Clone the repository
git clone <your-repository-url>
cd Hospital-main/BACKEND

# Install dependencies
npm install

# Create environment file
cp .env.example .env
# Edit .env with your MongoDB connection string

# Start the backend server
npm start
```

### Step 2: Setup Frontend
```bash
# Open a new terminal and navigate to frontend
cd Hospital-main/FRONTEND/hospital_management

# Install dependencies
npm install

# Start the development server
npm run dev
```

### Step 3: Setup AI Chatbot (Optional)
```bash
# Open a new terminal and navigate to backend
cd Hospital-main/BACKEND

# Install Python dependencies
pip install -r requirements.txt

# Start the AI service
python meditron_service.py
```

## Access the Application

- **Frontend**: http://localhost:5173
- **Backend API**: http://localhost:5000
- **API Documentation**: http://localhost:5000/api-docs
- **AI Chatbot Service**: http://localhost:8000

## Default Test Accounts

### Doctor Account
- **Email**: doctor@hospital.com
- **Password**: doctor123
- **Role**: Doctor

### Patient Account
- **Email**: patient@hospital.com
- **Password**: patient123
- **Role**: Patient

## Environment Configuration

### Backend (.env)
```bash
PORT=5000
MONGODB_URI=mongodb://localhost:27017/hospital_management
JWT_SECRET=your_super_secret_jwt_key_here
JWT_EXPIRE=7d
NODE_ENV=development
```

### AI Service Configuration
```bash
# Optional: Add Hugging Face API key for enhanced AI features
HUGGINGFACE_API_KEY=your_hf_api_key_here
```

## Troubleshooting

### Common Issues

#### MongoDB Connection Error
```bash
# Make sure MongoDB is running
mongod

# Or start MongoDB service (Windows)
net start MongoDB

# Or start MongoDB service (macOS with Homebrew)
brew services start mongodb-community
```

#### Port Already in Use
```bash
# Kill process on port 5000
npx kill-port 5000

# Kill process on port 5173
npx kill-port 5173
```

#### Python Dependencies Error
```bash
# Create virtual environment
python -m venv venv

# Activate virtual environment
# Windows:
venv\Scripts\activate
# macOS/Linux:
source venv/bin/activate

# Install dependencies
pip install -r requirements.txt
```

## Features to Test

### 1. Patient Features
- Register as a new patient
- Book appointments with doctors
- View medical history
- Chat with AI medical assistant

### 2. Doctor Features
- View patient appointments
- Manage availability schedule
- Create prescriptions
- Access patient records

### 3. General Features
- Browse hospitals and doctors
- Search for medicines
- Responsive design on mobile/tablet

## Next Steps

1. **Read Full Documentation**: Check `DOCUMENTATION.md` for detailed technical information
2. **Customize**: Modify the system according to your requirements
3. **Deploy**: Follow deployment guidelines for production setup
4. **Contribute**: Submit issues and pull requests to improve the system

## Support

- **Documentation**: See `DOCUMENTATION.md` for comprehensive technical details
- **Issues**: Report bugs and request features via GitHub Issues
- **API Reference**: Visit http://localhost:5000/api-docs for interactive API documentation

## Development Commands

### Backend
```bash
npm start          # Start development server
npm run dev        # Start with nodemon (auto-restart)
npm test           # Run tests
```

### Frontend
```bash
npm run dev        # Start development server
npm run build      # Build for production
npm run preview    # Preview production build
npm run lint       # Run ESLint
```

### AI Service
```bash
python meditron_service.py    # Start AI service
uvicorn main:app --reload     # Start with auto-reload
```

---

**Happy Coding! 🎉**

For detailed technical documentation, architecture details, and advanced configuration, please refer to `DOCUMENTATION.md`.
