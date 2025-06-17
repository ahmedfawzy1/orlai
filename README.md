# Lustria

This is a modern full-featured e-commerce platform built using **Next.js**,
**React** and **Typescript**. It supports both client-side and server-side
rendering for a fast and seamless shopping experience. Key functionalities
include product management, shopping cart, reviews, wishlist, payment
integration, blog system, and an admin dashboard for store management.

## Overview

Lustria offers a wide variety of stylish and high-quality clothing for every
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
[Lustria Demo](https://lustria.shop)

Admin Test Account

- Email: demo@demo.com
- Password: demodemo

Use these credentials to log in and explore the admin panel (e.g., product
management, orders, brands, etc.).

## Installation

### Prerequisites

Ensure you have the following installed on your local machine:

- **Node.js** (v18 or above)
- **npm** or **yarn**

### Getting Started

1. Clone the repository:

   ```bash
   git clone https://github.com/ahmedfawzy1/lustria
   ```

2. Install dependencies:

   ```bash
   cd lustria
   npm install
   ```

3. Set up environment variables: Create a `.env` file at the root of the project
   with the following keys (adjust the values as needed):

   ```
   DATABASE_URL="mongodb://username:password@hostname:port/database"
   NEXTAUTH_SECRET="your-nextauth-secret"
   NEXTAUTH_URL="http://localhost:3000"
   GOOGLE_CLIENT_ID="your-google-client-id"
   GOOGLE_CLIENT_SECRET="your-google-client-secret"
   NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME="your-cloudinary-cloud-name"
   NEXT_PUBLIC_CLOUDINARY_API_KEY="your-cloudinary-api-key"
   CLOUDINARY_API_SECRET="your-cloudinary-api-secret"
   NEXT_PUBLIC_STRIPE_PUBLIC_KEY=your-stripe-public-key
   STRIPE_SECRET_KEY=your-stripe-secret-key
   WEBHOOK_SIGNIN_SECRET=your-stripe-webhook-secret
   ```

4. Generate the Prisma client and run migrations:

   ```bash
   npx prisma generate
   npx prisma migrate dev
   ```

5. Run the development server:
   ```bash
   npm run dev
   ```
