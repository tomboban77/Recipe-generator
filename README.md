Recipe Finder App
A modern React application that helps users discover recipes based on available ingredients. Built with Material-UI and integrated with the Spoonacular API (max 150 ) for real-time ingredient search and recipe recommendations.
Features
• Smart Ingredient Selection: Choose from popular ingredients or search through thousands of options
• Real-time Autocomplete: Type-ahead search with keyboard navigation for finding specific ingredients via api results.
• Recipe Matching: Get personalized recipe recommendations with match scores based on your selected ingredients
• Visual Recipe Cards: Beautiful cards displaying recipe images, ingredient lists, and match percentages
• Favorites System: Save your favorite recipes with a dedicated favorites panel - heart any recipe to add it to your collection
• Persistent Storage: Your favorite recipes are saved locally and are persistant
• Dark/Light Theme: Toggle between themes for comfortable viewing
• Responsive Design: Works seamlessly on desktop, tablet, and mobile devices
Tech Stack
• Frontend: React 18 with TypeScript
• UI Framework: Material-UI (MUI)
• API Integration: Spoonacular Food API
• State Management: React Hooks (useState, useEffect, custom hooks)
• Build Tool: Create React App
Deployment
• Deployed to Vercel: https://github.com/tomboban77/Recipe-generator

Setup instructions

Installation
• Clone the repository
• Install dependencies
• npm install
• Environment Setup
Create a .env file in the root directory:
REACT\_APP\_SPOONACULAR\_API\_KEY="key"
• Start the development server
• npm start
• Open your browser

Time Spent
Total Development Time: 14 hours
• Initial Setup \& UI Components: 4 hours
• Ingredient Selection System: 2 hours
• API Integration: 3 hours
• Autocomplete and search Feature: 2.5 hours
• Recipe Display \& Images: 1.5 hours
• Favorites Panel: 1 hour

Assumptions Made
• Free Tier Limitations: Designed around Spoonacular's 150 requests/day limit
• Local Storage: Used browser storage for favorites
• Static Fallbacks: Included sample ingredient lists in case of api failure

What I'd Improve With More Time
• Use AI / ChatGPT (OpenAI's API) for AI receipes.
• Integrating Zustland or Redux for global state management
• Performance Monitoring: Analytics and performance tracking
• Recipe Rating System: Allow users to rate recipes
• Pagination and scrolling for recipe lists

