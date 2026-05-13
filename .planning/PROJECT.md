# Project: IT Asset Management System

A professional, full-stack IT asset management system designed to track hardware, software, and materials with role-based access control (RBAC).

## What This Is
A secure web application for IT departments to manage the lifecycle of assets (PCs, Workstations, Materials) based on existing inventory data structures. It features a modern, premium UI with smooth animations and robust data management.

## Core Value
To provide a single, error-free source of truth for all IT assets, reducing manual overhead and improving accountability through RBAC.

## Context
- **Frontend**: Vanilla HTML/CSS/JS (Modern, responsive, glassmorphic).
- **Backend**: Node.js + Express.js.
- **Database**: MySQL (relational schema).
- **Inspiration**: Derived from `IT Asset Inventory (Responses).xlsx` and `Material Inventory.xlsx`.

## Requirements

### Validated
(None yet — greenfield project)

### Active
- [ ] **RBAC Authentication**: Login/Signup with roles (Admin, Manager, User).
- [ ] **Asset CRUD**: Comprehensive management of IT assets (Workstations, Laptops, etc.).
- [ ] **Material Inventory**: Tracking issuance and stock of peripherals and consumables.
- [ ] **Dashboard**: Real-time analytics and status visualization.
- [ ] **Search & Filter**: Advanced lookup for assets by department, user, or status.
- [ ] **Error Handling**: Robust backend validation and graceful frontend feedback.

### Out of Scope
- Mobile App (Native) — Web responsive only.
- External API Integrations (LDAP/AD) — Local DB auth for MVP.

## Key Decisions
| Decision | Rationale | Outcome |
|----------|-----------|---------|
| Vanilla JS Frontend | User requested HTML/CSS/JS; allows maximum design flexibility. | Pending |
| MySQL | Relational data fits the inventory structure perfectly. | Pending |
| JWT Auth | Secure, stateless authentication for multiple roles. | Pending |

## Evolution
This document evolves at phase transitions and milestone boundaries.

---
*Last updated: 2026-05-14 after initialization*
