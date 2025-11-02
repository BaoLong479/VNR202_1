# Dòng Thời Gian Tương Tác: Thành Tựu Đổi Mới Việt Nam

## Overview
An interactive timeline web application showcasing Vietnam's achievements during the Đổi Mới (Renovation) period from 1986 to present. Users explore historical milestones by solving quiz puzzles to unlock timeline events.

## Project Structure
```
├── components/          # React components
│   ├── DetailModal.tsx      # Event detail modal
│   ├── LandingPage.tsx      # Welcome screen
│   ├── LoadingSpinner.tsx   # Loading indicator
│   ├── PuzzlePiece.tsx      # Quiz puzzle pieces
│   ├── QuizModal.tsx        # Quiz question modal
│   └── TimelineItem.tsx     # Timeline event item
├── data/
│   └── timelineData.ts      # Static timeline data
├── services/
│   └── geminiService.ts     # Data fetching service
├── App.tsx              # Main application component
├── index.tsx            # Application entry point
├── index.html           # HTML template
├── types.ts             # TypeScript type definitions
└── vite.config.ts       # Vite configuration
```

## Tech Stack
- **Frontend**: React 19.2.0, TypeScript 5.8.2
- **Build Tool**: Vite 6.2.0
- **Styling**: Tailwind CSS (CDN)
- **API Integration**: Google Gemini AI (@google/genai)

## Development Setup
The project is configured to run on port 5000 with proper host allowance for Replit's proxy environment.

### Key Configuration
- **Port**: 5000 (required for Replit webview)
- **Host**: 0.0.0.0 (allows external connections)
- **Allowed Hosts**: true (enables Replit proxy compatibility)

## Features
- Interactive landing page with engaging design
- Puzzle-solving gameplay (4 quiz questions per milestone)
- Visual timeline presentation
- Detailed information about each historical period
- All content and images integrated for instant loading

## Environment Variables
- `GEMINI_API_KEY`: API key for Google Gemini AI (optional, currently using static data)

## Recent Changes
- **2025-11-02**: Initial Replit setup
  - Configured Vite for port 5000
  - Added allowedHosts for proxy compatibility
  - Set up development workflow
  - Configured deployment settings
