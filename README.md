# TicketApp — Twig Implementation

## Overview
**TicketApp** is a fully responsive ticket management web application built with **Twig (PHP)**.  
It simulates authentication and ticket CRUD (Create, Read, Update, Delete) operations using **localStorage**, maintaining a consistent layout and design language shared across **React**, **Vue.js**, and **Twig** versions.

---

## Features
- **Landing Page:** Hero section with SVG wave, decorative circles, and clear call-to-action buttons.  
- **Authentication:** Login and Signup pages with inline validation and toast/snackbar notifications.  
- **Dashboard:** Displays KPIs for total, open, in-progress, and closed tickets.  
- **Ticket Management:** Full CRUD (Create, Read, Update, Delete) functionality with validation and feedback.  
- **Authorization Guards:** Restricts Dashboard and Tickets pages to authenticated users only.  
- **Responsive Layout:** Max width 1440px, centered layout, fully responsive across all devices.  
- **Accessibility:** Semantic HTML, visible focus states, and sufficient color contrast.

---

## Tech Stack
- **Frontend:** HTML5, CSS3, JavaScript (Vanilla)  
- **Templating Engine:** Twig (PHP)  
- **Storage:** localStorage (no backend required)

---

## Setup & Run Locally

### 1. Clone the Repository
```bash
git clone https://github.com/Favourite2024/TicketApp-Twig.git
cd TicketApp-Twig
2. Install Twig
Make sure you have Composer installed, then run:

bash
Copy code
composer require twig/twig
3. Start Local PHP Server
In the project root, run:

bash
Copy code
php -S localhost:8000 -t public
4. Open in Browser
Now visit the following URLs:

Landing: http://localhost:8000/?page=landing

Login: http://localhost:8000/?page=login

Signup: http://localhost:8000/?page=signup

Dashboard: http://localhost:8000/?page=dashboard

Tickets: http://localhost:8000/?page=tickets

Authentication
Simulated via localStorage under key: ticketapp_session.

Valid session grants access to Dashboard and Tickets pages.

Logout clears the session and redirects to the Landing page.

Ticket Storage
Tickets are saved locally in localStorage under key: ticketapp_tickets.

Each ticket contains:

id

title

status

description

Accepted Status Values:
open • in_progress • closed

Validation Rules
Field	Requirement	Notes
Title	Required	Max 100 characters
Status	Required	Must be open, in_progress, or closed
Description	Optional	Max 500 characters

All invalid inputs display inline error messages or toast alerts.

Example Test Credentials
Email: any valid email (e.g. user@example.com)

Password: any 6+ character string

Design Consistency
Unified theme across all frameworks.

Card-based layout for features, KPIs, and tickets.

Hero section with SVG wave and decorative circles.

Status color mapping:

Open → 🟢 Green

In Progress → 🟠 Amber

Closed → ⚪ Gray

Accessibility
Semantic HTML and ARIA roles

Keyboard and focus-visible elements

Sufficient color contrast for text and backgrounds

Clear inline feedback and toasts for errors/success

Known Notes
Data persists in browser via localStorage.

Clearing browser storage resets all tickets and sessions.

Dashboard auto-refreshes after any CRUD operation.

Repository
GitHub Repository: https://github.com/Favourite2024/TicketApp-Twig

License
This project is part of the Frontend Stage 2 – Multi-Framework Ticket Web App Challenge.
All rights reserved © 2025 — Developed by Favour.

