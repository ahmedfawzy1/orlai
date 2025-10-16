# Orlai

This is a modern full-featured e-commerce platform built using **Next.js**,
**React** and **Typescript**. It supports both client-side and server-side
rendering for a fast and seamless shopping experience. Key functionalities
include product management, shopping cart, reviews, wishlist, payment
integration, blog system, and an admin dashboard for store management.

## Overview

Orlai offers a wide variety of stylish and high-quality clothing for every
occasion. Discover the latest fashion trends with curated collections for men,
women, and kids. Shop now for unique pieces that elevate your wardrobe,
delivered right to your doorstep with easy returns and excellent customer
service. It leverages modern web technologies, a robust database schema, and a
clean folder structure with dedicated route handlers for each feature.

## Features

- **Product Management**:
  - Create, update, and delete products from the admin dashboard
  - Rich product detail pages with images, descriptions, pricing, size/color
    options
  - Inventory tracking
  - Product categorization and organization
  - Size and color variants management
  - Product reviews and ratings system
- **Filters & Categories**:
  - Category, color, size, and style filtering
  - Price range filtering
  - Search functionality
  - Dynamic category management
- **Shopping Experience**:

  - User-friendly cart management
  - Secure checkout process with Stripe
  - Order history and tracking
  - Wishlist functionality
  - Coupon system for discounts
  - Address management for shipping

- **User Authentication & Authorization**:

  - Email/password login
  - Google OAuth integration
  - User roles (admin, customer)
  - Password reset functionality
  - Profile management

- **Reviews & Ratings**:

  - Leave ratings and comments on products
  - Display average ratings
  - Review management system
  - User-specific reviews

- **Admin Dashboard**:

  - Product management
  - Inventory control
  - Brand management
  - Order management (view, update status)
  - Sales analytics and reporting
  - Customer management
  - Coupon management

- **Additional Enhancements**:
  - Stripe Webhook integration for real-time order and payment updates
  - Sitemap generation for improved SEO
  - Image handling with next-cloudinary
  - Responsive UI built with Tailwind CSS and NextUI components
  - Form validation with React Hook Form and Zod
  - Real-time notifications with React Hot Toast
  - Interactive charts and analytics with Recharts
  - SEO Optimization:
    - Dynamic sitemap generation
    - Robots.txt configuration
    - Meta tags management
  - Authentication Features:
    - Google OAuth integration
    - Email/password authentication
    - Password reset functionality
  - Shop Features:
    - Product filtering and sorting
    - Wishlist functionality
    - Shopping cart management
    - Checkout process
    - Order tracking
    - Product reviews and ratings
    - Coupon system
    - Address management
  - Admin Dashboard:
    - Product management
    - Order management
    - Analytics and reporting
    - Inventory tracking
    - Brand management
    - Customer management
    - Coupon management

## Tech Stack

- **Frontend**:
  - Next.js 15.3.1
  - React 19
  - TypeScript 5
  - Tailwind CSS 4
  - State Management:
    - Zustand
  - Form Handling:
    - React Hook Form
    - Zod Validation
  - Styling:
    - Tailwind CSS
  - Authentication:
    - NextAuth.js
    - Google OAuth
  - API Integration:
    - Axios
    - RESTful APIs
  - Development Tools:
    - ESLint
    - Prettier
    - TypeScript
    - Turbopack
- **Backend**:
  - Next.js API Routes / Route Handlers
  - Prisma 6.2.1 (ORM)
  - PostgreSQL (database)
  - Sanity.io (Headless CMS for blog)
- **Payment Processing**:
  - Stripe (checkout and webhook)
- **Other Tools**:
  - React Hot Toast (notifications)
  - Recharts (data visualization)
- **Authentication**:
  - NextAuth.js
  - Google OAuth
- **Payment Processing**:

  - Stripe integration
  - Webhook handling
  - Payment status tracking

- **Other Tools**:
  - Axios (HTTP client)
  - React Hook Form + Zod (form handling & validation)
  - React Hot Toast (notifications)
  - Recharts (data visualization)
  - Zustand (state management)
  - Lucide React (icons)

## Live Preview

A live preview of the application is available here:
[Orlai Demo](https://orlai.store)

Admin Test Account

- Email: demo@demo.com
- Password: demodemo

Use these credentials to log in and explore the admin panel (e.g., product
management, orders, brands, etc.).

## Installation

### Prerequisites

- Node.js 18+
- MongoDB database
- Stripe account (for payments)
- Google OAuth credentials (for authentication)

### Setup

1. **Clone the repository**

   ```bash
   git clone https://github.com/ahmedfawzy1/orlai
   cd orlai
   ```

2. **Install dependencies**

   ```bash
   npm install
   ```

3. **Environment Variables**

   Create `.env` files in both frontend and backend directories:

   **Backend (.env)**

   ```env
   MONGODB_URI=your_mongodb_connection_string
   ```

   **Frontend (.env.local)**

   ```env
   NEXT_PUBLIC_API_URL=http://localhost:5001/api
   ```

4. **Start development servers**

   ```bash
   npm run dev
   ```
