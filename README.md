
# Discover Businesses

A modern web application for discovering, exploring, and saving businesses across various categories. This platform allows users to search for businesses, view detailed information, create wishlists, and more.

## Features

### User Features
- **Business Discovery**: Browse and search businesses across multiple categories
- **Detailed Business Profiles**: View comprehensive information about each business
- **User Authentication**: Create an account, log in, and manage your profile
- **Wishlist Management**: Create and manage personal wishlists of favorite businesses
- **Category Exploration**: Discover businesses by categories
- **Business Comparison**: Compare features and services of different businesses
- **Responsive Design**: Optimized for all devices from mobile to desktop
- **Theme Support**: Choose between light, dark, or system theme
- **User Profiles**: Personalized dashboards and preferences

### Business Owner Features
- **Business Dashboard**: Central hub for managing business presence
- **Profile Editor**: Update business details, descriptions, and features
- **Media Gallery**: Manage logos, screenshots, and promotional images
- **Analytics & Insights**: Track performance, views, and user engagement
- **Product Management**: Add and manage products/services
- **Engagement Tools**: Manage user questions and reviews
- **Verification**: Confirm business ownership and display verification status

### Admin Features
- **Dashboard**: Overview statistics and charts showing system activity
- **Business Management**: Create, edit, delete, and feature businesses
- **Category Management**: Organize businesses with categories and subcategories
- **User Management**: Monitor and manage user accounts with role-based permissions
- **News Management**: Create and publish news articles related to businesses
- **System Settings**: Configure site settings, email templates, and data backups

## Routes

### Main Routes
- Home page: `/`
- Authentication: `/auth`
- User dashboard: `/dashboard`
- Brand dashboard: `/brand-dashboard`
- Business details: `/business/:id`
- Category details: `/category/:categoryId`
- News section: `/news`
- Collections: `/collections`
- Discover page: `/discover`
- Wishlists: `/wishlists`

### Business Owner Routes
- Business login: `/business/login`
- Business dashboard: `/business/dashboard`
- Business profile: `/business/profile`

### Admin Routes
- Admin login: `/admin`
- Admin dashboard: `/admin/dashboard`
- Business management: `/admin/businesses`
- Category management: `/admin/categories`
- User management: `/admin/users`
- News management: `/admin/news`
- System settings: `/admin/settings`

## Authentication System
- **User Registration**: Email and password-based signup
- **User Login**: Secure authentication with session management
- **Role-Based Access**: Different interfaces for regular users, businesses, and admins
- **Protected Routes**: Secure areas accessible only to authenticated users with appropriate roles

## Database Structure

The application uses Supabase for database storage with the following tables:

- **businesses**: Stores business information, descriptions, and metadata
- **categories**: Contains business categories and their counts
- **wishlists**: User-created collections of businesses
- **wishlist_items**: Individual businesses saved to wishlists
- **business_analytics**: Tracks views, clicks, and engagement metrics for businesses
- **products**: Products and services offered by businesses
- **user_profiles**: Extended user profile information
- **reviews**: User reviews and ratings for businesses
- **questions**: User questions and business owner answers

## Tech Stack

This project is built with a modern tech stack:

- **Vite**: Fast, modern frontend build tool
- **TypeScript**: Type-safe JavaScript for better development experience
- **React**: UI library for building component-based interfaces
- **React Router**: Navigation and routing for the React application
- **Tailwind CSS**: Utility-first CSS framework for rapid UI development
- **shadcn/ui**: High-quality UI components built with Radix UI and Tailwind
- **Supabase**: Backend-as-a-Service for authentication and data storage
- **Tanstack Query**: Data fetching and state management
- **Recharts**: Flexible charting library for data visualization

## Getting Started

Follow these steps to set up the project locally:

```sh
# Step 1: Clone the repository using the project's Git URL.
git clone <YOUR_GIT_URL>

# Step 2: Navigate to the project directory.
cd <YOUR_PROJECT_NAME>

# Step 3: Install the necessary dependencies.
npm i

# Step 4: Start the development server with auto-reloading and an instant preview.
npm run dev
```

## Project Structure

- `src/assets`: Static assets and mock data
- `src/components`: Reusable UI components
- `src/hooks`: Custom React hooks
- `src/lib`: Utility functions and services
- `src/pages`: Top-level page components
- `src/types`: TypeScript type definitions
- `src/integrations`: External service integrations

## Deployment

The application can be deployed to any static hosting service such as Vercel, Netlify, or GitHub Pages.

## Default Accounts

For testing purposes, the application comes with pre-configured accounts:

- **Admin Account**: 
  - Email: admin@example.com
  - Password: admin123

- **Regular User Account**:
  - Email: user@example.com
  - Password: user123

- **Business Account**:
  - Email: business@example.com
  - Password: business123

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.
