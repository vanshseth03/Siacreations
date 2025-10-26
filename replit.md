# Sia Creations - Premium Women's Fashion E-commerce

## Overview

Sia Creations is a premium women's fashion e-commerce website specializing in traditional and contemporary clothing. The platform offers a curated collection of stitched garments, unstitched fabrics, activewear, and daily wear items. Built as a single-page application (SPA), it provides an elegant shopping experience with features like product browsing, cart management, wishlist functionality, and responsive design optimized for both desktop and mobile users.

## User Preferences

Preferred communication style: Simple, everyday language.

## System Architecture

### Frontend Architecture
- **Single Page Application (SPA)**: Built with vanilla HTML, CSS, and JavaScript without any frameworks
- **Tab-based Navigation**: Uses JavaScript to dynamically switch between different sections (Home, About, Contact, Wishlist)
- **Responsive Design**: Mobile-first approach with CSS Grid and Flexbox for layout management
- **Component-based Structure**: Modular JavaScript functions handle different UI components (cart, product display, navigation)

### UI/UX Design Patterns
- **Premium Design System**: Custom CSS variables for consistent color palette (blush pink, soft gold, ivory tones)
- **Typography Hierarchy**: Combination of Playfair Display (serif) for headings and Inter (sans-serif) for body text
- **Smooth Animations**: CSS transitions with cubic-bezier easing for premium feel
- **Cart Sidebar**: Slide-out cart interface for seamless shopping experience

### Data Management
- **Client-side Data Storage**: Product catalog stored as JavaScript objects in memory
- **Local State Management**: Global variables manage cart, wishlist, and current application state
- **Product Categories**: Organized into stitched, unstitched, gym, daily, and casual wear categories
- **No Backend Integration**: Currently operates as a static frontend application

### Product Catalog Structure
- **Product Schema**: Each product contains id, name, price, category, image (emoji), and description
- **Category-based Organization**: Products grouped by type for easier navigation and filtering
- **Sample Data**: Includes 32+ products across different categories with detailed descriptions

### Shopping Features
- **Cart Management**: Add/remove items, quantity adjustment, total calculation
- **Wishlist Functionality**: Heart-based favoriting system with visual feedback
- **Product Details**: Modal-based product detail views with quantity selection
- **Price Display**: Indian Rupee pricing with formatted display

### Responsive Behavior
- **Mobile Navigation**: Hamburger menu for small screens
- **Flexible Grid**: CSS Grid adapts to different screen sizes
- **Touch-friendly**: Optimized button sizes and spacing for mobile interaction

## External Dependencies

### Frontend Libraries
- **Google Fonts**: Playfair Display and Inter font families for typography
- **No JavaScript Frameworks**: Pure vanilla JavaScript implementation
- **No CSS Frameworks**: Custom CSS with modern features (Grid, Flexbox, CSS Variables)

### Browser Requirements
- **Modern Browser Support**: Requires support for CSS Grid, Flexbox, and ES6 JavaScript
- **Responsive Design**: Optimized for viewport widths from 320px to 1920px+

### Future Integration Points
- **Payment Gateway**: Ready for integration with payment processors
- **Backend API**: Structure supports easy migration to API-driven data
- **Image CDN**: Currently uses emoji placeholders, designed for real product images
- **Analytics**: Structure supports Google Analytics or similar tracking integration

### Development Tools
- **No Build Process**: Direct HTML/CSS/JS files, no compilation required
- **Static Hosting Ready**: Can be deployed to any static hosting service
- **Progressive Enhancement**: Core functionality works without JavaScript