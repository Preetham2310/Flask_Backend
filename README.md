# Flask_Backend
# 🚀 CertifyMe — Full Stack Intern Assessment

## 📌 Project Overview
This project is a full-stack web application built as part of the CertifyMe assessment.  
It provides an Admin Portal to manage opportunities with full CRUD functionality.

---

## 🛠️ Tech Stack

### Backend
- Python (Flask)
- Flask SQLAlchemy
- SQLite

### Frontend
- HTML
- CSS
- JavaScript (Vanilla JS)

---

## ✨ Features Implemented

### 🔐 Authentication
- Admin Signup
- Admin Login
- Forgot Password (Token-based)

---

### 📊 Opportunity Management

#### ✅ US-2.1 View Opportunities
- Fetch opportunities from database
- Show only logged-in admin’s data

#### ✅ US-2.2 Add Opportunity
- Create new opportunity
- Form validation
- Stored in database

#### ✅ US-2.3 Persistence
- Data persists after login/logout
- No local storage-based data

#### ✅ US-2.4 View Details
- Modal shows complete opportunity details

#### ✅ US-2.5 Edit Opportunity
- Pre-filled form
- Update existing record
- Real-time UI update

#### ✅ US-2.6 Delete Opportunity
- Confirmation before delete
- Secure (only owner can delete)
- Instant UI removal

---

## 📁 Project Structure
Test1/
│
├── backend/
│ ├── app.py
│ ├── models.py
│ ├── routes/
│ ├── templates/
│ │ └── admin.html
│ ├── static/
│ │ ├── admin.css
│ │ └── admin.js
│ └── database.db

---

## ⚙️ Setup Instructions

### 1. Clone Repository
git clone https://github.com/Preetham2310/Flask_Backend.git
cd <repo-name>/backend


---

## 🔐 Notes

- Data is stored in SQLite database
- Each admin can only access their own opportunities
- No frontend UI modifications were made as per instructions

---

## 🎯 Key Highlights

- Full CRUD operations
- REST API integration
- Dynamic UI updates (no page refresh)
- Secure user-specific data handling
- Clean modular backend structure

---

## 📌 Author

**Preetham N**