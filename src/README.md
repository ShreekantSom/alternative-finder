
# Discover Businesses

A modern web application for discovering, exploring, and saving businesses across various categories. This platform allows users to search for businesses, view detailed information, create wishlists, and more.

## Features

- **Business Discovery**: Browse and search businesses across multiple categories
- **Detailed Business Profiles**: View comprehensive information about each business including:
  - Business details, features, and services
  - External reviews from platforms like TrustPilot, Google, and Yelp
  - Franchise information for businesses offering franchise opportunities
  - Social media links and presence
  - Service areas by pincode/zipcode
- **User Authentication**: Create an account, log in, and manage your profile
- **Wishlist Management**: Create and manage personal wishlists of favorite businesses
- **Category Exploration**: Discover businesses by categories
- **Business Comparison**: Compare features and services of different businesses
- **Responsive Design**: Optimized for all devices from mobile to desktop
- **Theme Support**: Choose between light, dark, or system theme
- **Brand Submissions**: Businesses can submit their information for listing
- **Advanced Filtering**: Filter businesses by type, pricing model, features, and more
- **News Feed**: Stay updated with the latest news about businesses
- **Social Sharing**: Share businesses with friends and colleagues

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
- **Framer Motion**: Animation library for creating fluid UI transitions
- **Lucide React**: Beautiful, consistent icon set

## Database Structure

The application stores data in Supabase with the following main tables:
- **businesses**: Stores business information, descriptions, and metadata
- **categories**: Contains business categories and their counts
- **wishlists**: User-created collections of businesses
- **wishlist_items**: Individual businesses saved to wishlists

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
  - `ui`: shadcn/ui components
  - `service`: Business and service related components
  - `alternatives`: Components for displaying business alternatives
- `src/hooks`: Custom React hooks
- `src/lib`: Utility functions and services
- `src/pages`: Top-level page components
- `src/types`: TypeScript type definitions
- `src/integrations`: External service integrations (Supabase)

## Deployment

The application can be deployed to any static hosting service such as Vercel, Netlify, or GitHub Pages.

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## License

This project is licensed under the MIT License - see the LICENSE file for details.
