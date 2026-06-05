# CabsOnline

A full-stack taxi booking system built in two parts — a PHP/MySQL backend with a vanilla JS frontend, and a React + Vite admin dashboard.

## Overview

CabsOnline lets customers book a taxi online and gives admins a panel to search, view, and assign bookings to drivers. Built as a university assignment with a focus on server-side validation, real-time UI updates, and a clean separation between the customer-facing and admin-facing sides.

---

## Part 1 — Booking System (PHP / MySQL / JS)

The core booking system. Customers fill out a form, and the system generates a unique booking reference (BRN format). Admins can search bookings by reference or view all unassigned pickups within the next 2 hours.

### Features
- Customer booking form with client-side and server-side validation
- Auto-generated booking references (BRN00001, BRN00002, ...)
- Async form submission via Fetch API — no page reloads
- Admin search by booking reference or view upcoming unassigned bookings
- One-click taxi assignment that updates status in real time
- Past date/time validation on pickup scheduling

### Tech Stack
- PHP (server-side logic)
- MySQL (bookings database)
- HTML / CSS / JavaScript (vanilla)
- Fetch API (async communication)

### File Structure
```
part1/
├── booking.html       # Customer-facing booking form
├── booking.js         # Client-side validation + Fetch API calls
├── booking.css        # Shared stylesheet
├── booking.php        # Server-side booking handler, generates BRN
├── admin.html         # Admin search and assign interface
├── admin.js           # Admin-side JS, regex BRN validation
├── admin.php          # Server-side search and assign handler
└── mysqlcommand.txt   # SQL to create the bookings table
```

### Database Setup
Run the contents of `mysqlcommand.txt` in phpMyAdmin to create the `bookings` table before using the system.

---

## Part 2 — React Dashboard (React / Vite)

A React + Vite frontend that wraps the booking system in a polished dual-view interface — a customer view and a full admin dashboard.

### Features
- Customer view with booking form (iframe embed) and payment panel
- Admin dashboard with four tabs:
  - **Driver Query** — filterable bookings table (all / unassigned / assigned / paid)
  - **Customer Lookup** — search customers by name or reference
  - **Map View** — visual overview of active bookings
  - **Admin Panel** — iframe embed of the PHP admin page
- Light/dark theme switching between customer and admin views

### Tech Stack
- React 19
- Vite 8
- CSS (custom, no component library)

### File Structure
```
part2/
├── src/
│   ├── App.jsx                    # Root component, view and tab state
│   ├── dashboard.css              # Admin dashboard styles
│   ├── components/
│   │   ├── BookingList.jsx        # Filterable bookings table
│   │   ├── CustomerLookup.jsx     # Customer search
│   │   ├── MapView.jsx            # Map overview
│   │   └── PaymentPanel.jsx       # Payment UI
│   ├── hooks/
│   │   └── useBookings.js         # Bookings data hook
│   └── data/
│       └── mockData.js            # Mock data for development
├── public/
├── package.json
└── vite.config.js
```

### Running Part 2 Locally
```bash
cd part2
npm install
npm run dev
```

---

## Author
Joseph Reanzares — [github.com/hallowseph](https://github.com/hallowseph)
