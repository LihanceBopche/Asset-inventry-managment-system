# Requirements: IT Asset Management System

## 1. Authentication & RBAC
- [ ] Users must be able to Sign Up and Login.
- [ ] Multiple roles: `Admin`, `Manager`, `User`.
- [ ] Role-based UI: Dashboard must hide/show features based on permissions.
- [ ] JWT-based session management for secure API access.

## 2. IT Asset Management (Inventory)
- [ ] **Data Fields**: Based on `IT Asset Inventory` Excel:
  - Asset ID / PC Name, Serial No, Model, Department, Work Location, Asset Type.
  - Hardware Specs: RAM, Storage, OS, Mac Address.
  - Software: Antivirus, Office, Acrobat, Catia, etc.
- [ ] **CRUD Operations**:
  - Add new assets manually.
  - Update asset details (e.g., hardware upgrades).
  - Delete/Archive decommissioned assets.
- [ ] **Asset Status**: track if an asset is `Active`, `Repair`, `Scrapped`, or `In-Store`.

## 3. Material Inventory
- [ ] **Data Fields**: Based on `Material Inventory` Excel:
  - Material Name (e.g., Screen, Keyboard, Mouse).
  - Stock Quantity.
  - Issuance details: Date, Issuer, Receiver (User), Department.
- [ ] **Issuance Workflow**: Record when a material is given to a user or assigned to an asset.

## 4. Dashboard & Analytics
- [ ] **Overview Cards**: Total Assets, Total Materials Issued, Active Repairs.
- [ ] **Charts**: 
  - Assets by Department (Pie chart).
  - Material issuance over time (Line chart).
- [ ] **Recent Activity**: Log of last 10 actions (Login, Asset Update, etc.).

## 5. User Interface (UI)
- [ ] **Theme**: Premium Dark/Light mode with Glassmorphism.
- [ ] **Animations**: Smooth transitions between pages, hover effects on cards.
- [ ] **Responsiveness**: Must work on Desktop and Tablet.
- [ ] **Feedback**: Toast notifications for success/error messages.

## 6. Technical Requirements
- [ ] **Backend**: Node.js/Express with clean architecture.
- [ ] **Database**: MySQL with normalized tables (`users`, `assets`, `materials`, `issuance_logs`).
- [ ] **Frontend**: Vanilla HTML/CSS/JS (no frameworks as requested).
- [ ] **Security**: Input validation, password hashing (bcrypt), SQL injection prevention.
