# Online Shopping Management System using MongoDB

A full-stack, production-quality B.Tech / CSE minor project designed to demonstrate modern **NoSQL document-oriented database principles** with **MongoDB Atlas**, **Mongoose ORM**, **Express.js REST APIs**, and a modern **React + Vite + Tailwind CSS** frontend.

---

## 🎯 Project Objective

The primary academic purpose of this project is to showcase how **MongoDB** handles high-concurrency e-commerce workloads using document modeling, embedded schema design, compound indexing, and real-time MongoDB Aggregation Pipelines for administrative analytics.

---

## 🚀 Features

### Customer Role
- **Account Registration & Security**: Hashed passwords using `bcryptjs` and JWT token authentication.
- **Product Discovery**: Multi-filter catalog search, category filtering, price range filter, minimum rating filter, and flexible sorting (Price Low/High, Rating, Newest, Popular).
- **Product Details & Reviews**: Rich product views, quantity selector, customer ratings, and review submissions.
- **Shopping Cart**: Persistent cart document stored in MongoDB with embedded item schemas.
- **Checkout & Simulated Payments**: Multi-step checkout workflow with shipping details, simulated UPI/Card/COD payments, and unique transaction IDs (`TXN-...`).
- **Order Management & Visual Tracking**: Order history with status badges and an interactive visual timeline tracker (`Order Placed -> Confirmed -> Shipped -> Delivered`).
- **Profile Management**: Update delivery address, contact details, and password.

### Admin Role
- **MongoDB Aggregation Analytics**: Live statistics (Total Revenue, Monthly Revenue, Category Sales, Order Status Counts, Top Selling Products, Average Rating) computed via MongoDB Aggregation Pipelines (`$match`, `$group`, `$lookup`, `$unwind`, `$project`).
- **Product Management (CRUD)**: Create new products, edit price/stock/discounts, and delete products.
- **Customer Audit**: View all registered customers, total orders, and lifetime spending.
- **Order Management**: Monitor orders and update order status (`Pending`, `Confirmed`, `Shipped`, `Delivered`, `Cancelled`).
- **Payment Log Audit**: View all simulated transaction records.
- **Review Moderation**: Moderate customer reviews and delete inappropriate comments (product rating auto-recalculates).

---

## 💻 Technology Stack

### Frontend
- **Framework**: React 18 / 19 + Vite
- **Styling**: Tailwind CSS + PostCSS
- **Animations**: Framer Motion (page transitions, staggered product cards, toast notifications)
- **Icons**: Lucide React
- **HTTP Client**: Axios

### Backend
- **Runtime**: Node.js
- **Web Framework**: Express.js
- **Authentication**: JWT (`jsonwebtoken`) & `bcryptjs`
- **Logging**: Morgan & CORS

### Database
- **Database Engine**: MongoDB Atlas (Cloud NoSQL DB)
- **Database Name**: `online_shopping_db`
- **ORM**: Mongoose

---

## 🏗️ System Architecture

```text
                                ONLINE SHOPPING SYSTEM

                                       FRONTEND
                             React + Vite + Tailwind CSS
                                         │
                                         ▼
                                    REST API
                                         │
                                         ▼
                                   EXPRESS SERVER
                                         │
                                         ▼
                                      MONGOOSE
                                         │
                                         ▼
                                   MONGODB ATLAS
                                         │
          ┌──────────────┼──────────────┼──────────────┐
          ▼              ▼              ▼              ▼
       users          products        carts          orders
          │              │              │              │
          └──────────────┼──────────────┴──────────────┘
                         ▼
                     payments & reviews
```

---

## 🗄️ Database Design (Mongoose Models)

### Collections:
1. **`users`**: Customer and Admin credentials, contact information, hashed passwords, and role flags (`customer` | `admin`).
2. **`products`**: Product catalog items with brand, category, price, discount, stock level, rating, and review counts.
3. **`carts`**: Shopping carts featuring embedded item sub-documents (`[{ productId, productName, quantity, price }]`).
4. **`orders`**: Customer purchase orders with shipping address, order items, status, and payment method.
5. **`payments`**: Simulated payment transaction logs linked to `orders` and `users`.
6. **`reviews`**: Ratings (1 to 5) and written feedback linked to products and users.

---

## 🍃 Key MongoDB Concepts Demonstrated

- **Document Model**: JSON-like BSON documents for flexible, schema-driven data representation.
- **Embedded Sub-documents**: Used in `carts` and `orders` to embed item lists directly into parent documents for fast single-query reads.
- **References (`$ref`)**: Used to link `orders`, `payments`, and `reviews` to `users` and `products`.
- **Indexing**:
  - `users.email` (unique index)
  - `products.name` & `products.category` (compound query indexes)
  - `orders.userId` (single field index)
  - `reviews.productId` (single field index)
- **Aggregation Pipelines**:
  - `$match`: Filtering non-cancelled orders.
  - `$group`: Grouping revenue by month and calculating sum of sales per category.
  - `$lookup`: Joining `orders` with `products` collection.
  - `$unwind`: Deconstructing items arrays for per-product sales calculations.
  - `$project`: Formatting output fields for analytics dashboard.

---

## ⚙️ MongoDB Atlas Setup Guide

1. Create a free cluster on [MongoDB Atlas](https://www.mongodb.com/cloud/atlas).
2. Create a Database User with read/write permissions.
3. Add `0.0.0.0/0` (or your IP) to Network Access IP Access List.
4. Copy your database connection string in the format:
   `mongodb+srv://<username>:<password>@cluster0.mongodb.net/online_shopping_db?retryWrites=true&w=majority`
5. Paste your connection string into `backend/.env`:
   ```env
   MONGODB_URI=your_mongodb_atlas_connection_string
   JWT_SECRET=super_secret_jwt_key_online_shopping_2026
   PORT=5000
   ```

---

## 🚀 Installation & Setup

### 1. Install Backend Dependencies & Start Server
```bash
cd backend
npm install
npm run seed     # Populates 2 Admins, 10 Customers, 30 Products, 15 Orders, 15 Payments, 30 Reviews
npm start        # Starts Express server on http://localhost:5000
```

### 2. Install Frontend Dependencies & Start App
```bash
cd frontend
npm install
npm run dev      # Starts Vite dev server on http://localhost:3000
```

---

## 🔑 Default Seed Credentials

- **Admin Account**:
  - **Email**: `admin@shopmongo.com`
  - **Password**: `adminpassword123`

- **Customer Account**:
  - **Email**: `rahul.sharma@example.com`
  - **Password**: `userpassword123`

---

## 📡 REST API Documentation

### Auth
- `POST /api/auth/register` - Register a new user
- `POST /api/auth/login` - User login & JWT issuance
- `GET /api/auth/me` - Get current user profile
- `PUT /api/auth/profile` - Update user profile

### Products
- `GET /api/products` - Get products (supports search, category, price, rating, sort, pagination)
- `GET /api/products/:id` - Get single product details
- `POST /api/products` - Create product (Admin)
- `PUT /api/products/:id` - Edit product (Admin)
- `DELETE /api/products/:id` - Delete product (Admin)

### Cart
- `GET /api/cart` - Get user shopping cart
- `POST /api/cart` - Add item to cart
- `PUT /api/cart/:itemId` - Update item quantity
- `DELETE /api/cart/:itemId` - Remove item from cart
- `DELETE /api/cart` - Clear cart

### Orders & Payments
- `POST /api/orders` - Place new order (checkout transaction)
- `GET /api/orders` - Get user order history
- `GET /api/orders/:id` - Get order & tracking info
- `PUT /api/orders/:id/status` - Update order status (Admin)
- `GET /api/payments` - Audit payment records (Admin)

### Admin Analytics
- `GET /api/admin/dashboard` - Get MongoDB Aggregation pipeline statistics
- `GET /api/admin/customers` - List all customers with spending aggregates
- `GET /api/admin/orders` - List all orders
- `GET /api/admin/reviews` - List all reviews for moderation
