# IT Asset Management Pro 🚀

A modern, full-stack IT Asset & Inventory Management System equipped with an advanced Data Analytics and Prescriptive Logic module. Built natively for enterprises and internship capstone projects.

---

## ✨ Key Features
- **Secure Authentication:** Role-Based Access Control (Admin, Manager, User).
- **Core Inventory Management:** Track PCs, Laptops, Servers, and Hardware allocations dynamically.
- **Smart Analytics Dashboard:** Built with React & Recharts featuring Hardware Aging Trajectory, Department Cost Metrics, and a Prescriptive Analyst Bot.
- **Premium UI/UX:** Dark Theme Glassmorphism interface for the analytics suite.
- **One-Click Export:** Export interactive dashboards straight to A3 PDF formatted reports.
- **Department & Employee Architecture:** Map assets directly to operational branches.

---

## 🛠️ Technology Stack
- **Backend:** Node.js, Express.js
- **Database:** MongoDB (Mongoose ORM)
- **Frontend Core:** Vanilla HTML/JS, CSS3 (Glassmorphism)
- **Frontend Analytics:** React (Babel Standalone), Tailwind CSS, Recharts.js
- **Export Utility:** html2pdf.js

---

## ⚙️ Project Setup Guide

Follow these steps exactly to set up the project on any local environment or new machine.

### 1. Prerequisites
Ensure you have the following installed on your machine:
- [Node.js](https://nodejs.org/en/) (v16.0 or higher)
- [MongoDB](https://www.mongodb.com/try/download/community) (Local server or MongoDB Atlas Cloud Account)

### 2. Clone and Install Dependencies
Navigate into the root directory of the project in your terminal and install all required Node modules:
```bash
npm install
```

### 3. Environment Variables
Create a file named `.env` in the root folder of the project. Add the following configuration variables inside:
```env
PORT=5000
MONGO_URL=your_mongodb_connection_string_here
JWT_SECRET=your_super_secret_jwt_key
```
*(Note: Replace `your_mongodb_connection_string_here` with your actual MongoDB URL, e.g., `mongodb://localhost:27017/it_assets` or your Atlas cluster URL.)*

### 4. Seed the Database (Important for Analytics!)
The project comes with an automatic dataset generator to populate your dashboard with realistic 50+ IT assets, 5 departments, and 25 employees so the platform doesn't look empty.
Run this command in the terminal:
```bash
node seed_full_data.js
```

### 5. Create the Super-Admin User
To log into the system, you need an Admin account. Generate one easily via the built-in script:
```bash
node create_admin.js
```
*(This script will prompt or output the credentials for your main administrator account).*

### 6. Run the Application
Start the development server using nodemon:
```bash
npm run dev
```
Alternatively, for standard production launch:
```bash
npm start
```

### 7. Access the Portal
Open Chrome or Edge and navigate to:
**[http://localhost:5000](http://localhost:5000)**

---

## 📂 Folder Structure
* `public/` - Contains all frontend HTML pages, CSS files, and vanilla JS scripts.
  * `analytics.html` - The ML-powered independent React dashboard.
* `src/` - The backend Node/Express application.
  * `routes/` - API endpoint definitions.
  * `controllers/` - Action logic (e.g., Auth, Inventory, Analytics).
  * `models/` - MongoDB database schemas.
  * `middleware/` - Security authentication scripts (JWT & roles).
* `seed_full_data.js` - Auto-populates realistic data.

---

*Made with ❤️ for modern IT infrastructures.*
