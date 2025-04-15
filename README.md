
# 🚗 Car Shop - Inventory & E-Commerce Management Platform

A feature-rich, full-stack Car Shop web application built for managing car inventory, processing secure orders, and delivering a seamless e-commerce experience. Built with modern technologies like TypeScript, React, Redux, Node.js, and MongoDB.

Live URL 👉 [Your Live Site URL Here]  
Demo Video 🎥 👉 [Demo Video Link Here]

---

## 📌 Project Overview

This application provides a robust inventory management and car shopping experience with role-based access (User & Admin), secure authentication, order tracking, product filtering, and a seamless checkout process. It includes a responsive and visually appealing UI based on a Figma design guideline.

---

## 🧩 Features

### ✅ **Authentication & Authorization**
- Secure registration & login with hashed passwords
- JWT-based token system with local storage
- Role-based dashboards (User/Admin)
- Protected routes & logout functionality

### 🌐 **Public Pages**
- **Home Page**: Banner, featured cars, and a dynamic product overview
- **All Products**: Powerful filtering & sorting (brand, price, model, availability)
- **Product Details**: Full specs, image preview & "Buy Now" CTA
- **About Us**: Insight into company mission & values

### 🔒 **Private Pages**
- **Checkout Page**: Place orders with quantity validation and payment integration (SurjoPay)
- **User Dashboard**: Track orders, view purchase history, update profile/password
- **Admin Dashboard**:
  - Manage Users (deactivate/reactivate)
  - Manage Products (Add/Edit/Delete)
  - Manage Orders (CRUD + status updates)

### 💅 **UI/UX**
- Fully responsive on all screen sizes
- Clean typography and layout
- Toast notifications for key actions (login success, order placed, etc.)
- Loaders for API operations
- Error messages for form validation, login issues, and stock checks

### 📦 **Backend Functionalities**
- Built with Express and MongoDB
- Module-based architecture
- Product, Order, User schemas
- Middleware-protected routes
- Pagination support for listings
- Payment gateway integration (SurjoPay)

---

## ⚙️ Tech Stack

### 💻 Frontend
- React + TypeScript
- TailwindCSS
- Redux Toolkit + RTK Query
- React Router
- Shadcn/UI
- Lucide Icons & React Icons

### 🛠 Backend
- Node.js + Express.js
- MongoDB + Mongoose
- JWT for Auth
- bcryptjs for hashing
- CORS, Helmet, Express Async Handler

---

## 🚀 Getting Started

### Prerequisites
- Node.js & npm
- MongoDB (local or cloud)
- Environment variables setup (`.env`)

### 🔧 Backend Setup
```bash
git clone [your-backend-repo-link]
cd backend
npm install
npm run dev
```

### ⚙️ Frontend Setup
```bash
git clone [your-frontend-repo-link]
cd frontend
npm install
npm run dev
```

---

## 🔑 Admin Credentials (For Evaluation)
```
Email: admin@carshop.com
Password: Admin123!
```

> Note: Admin role needs to be manually set in the database for newly registered users.

---

## 📁 Project Structure

```
car-shop/
├── backend/
│   ├── controllers/
│   ├── models/
│   ├── routes/
│   ├── middleware/
│   ├── config/
│   └── server.ts
├── frontend/
│   ├── components/
│   ├── pages/
│   ├── redux/
│   ├── routes/
│   └── main.tsx
```

---

## 📸 Screenshots

> Add some screenshots or gifs here showcasing Home, Product Details, Dashboard, Checkout, etc.

---

## 📌 Assignment Requirements Covered

- ✅ Role-based authentication (User/Admin)
- ✅ Public routes (Home, Products, Product Detail, About)
- ✅ Private routes (Checkout, Dashboard)
- ✅ Admin Panel (Products, Orders, Users)
- ✅ RTK Query + RESTful API integration
- ✅ SurjoPay payment integration
- ✅ User profile & order tracking
- ✅ Pagination, filtering, and error handling

---

## 📬 Contact

For any queries or feedback:

📧 Email: [your-email@example.com]  
🐦 Twitter: [your-twitter-handle]  
🌐 Portfolio: [your-portfolio-link]

---

## 🏁 Final Notes

- Fully compliant with the [Assignment Requirements](#)
- Plagiarism-free and production-ready
- Focused on clean code, scalability, and user experience
