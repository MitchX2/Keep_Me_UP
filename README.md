# Keep Me Up

**The app that keeps you up to date with your favourite team, anytime, anywhere.**

Keep Me Up is a Progressive Web Application built using **Ionic** and **Angular**.  
It allows users to explore football league tables, view team details, compare matchday fixtures, and personalise their experience through saved preferences and theming.

---

## Features

- View full league tables including:
  - position
  - team badge
  - points
  - recent form
  - promotion and relegation indicators

- Home page with:
  - favourite league as default
  - quick table preview
  - upcoming fixtures

- Team Detail page:
  - badge and jersey
  - stadium and location
  - year founded
  - recent matches
  - external links (website, maps)

- Matchday comparison:
  - side-by-side team comparison
  - recent results and form
  - league position and points
  - colour-based layout per team

- User preferences:
  - favourite league
  - favourite team
  - theme mode

- Theme system:
  - favourite team colour theme
  - light mode
  - dark mode

---

## Technologies Used

- Ionic Framework
- Angular
- TypeScript
- SCSS
- Ionic Storage
- Capacitor Browser Plugin
- TheSportsDB API

---

## API Used

This application uses football data from **TheSportsDB**.

Data includes:
- league standings
- team details
- recent matches
- upcoming fixtures
- team colours
- badges and jerseys

---

## Storage

User preferences are stored using **Ionic Storage**:

- favourite league
- favourite team
- selected theme mode

---

## Capacitor Plugin

The app uses the **Capacitor Browser Plugin** to open:

- team websites
- stadium map searches

This ensures consistent behaviour across:
- web browsers
- mobile devices
- desktop builds

---

## Main Pages

- **Home**
  - league overview and fixtures

- **League Table**
  - full standings and form tracking

- **Team Detail**
  - club information and recent results

- **Matchday**
  - comparison between two teams

- **Settings**
  - user preferences and theme selection

---

## Project Structure
src/
├── app/
│ ├── data/
│ ├── home/
│ ├── models/
│ ├── pages/
│ │ ├── league-table/
│ │ ├── matchday/
│ │ ├── settings/
│ │ └── team-detail/
│ ├── services/
│ └── shared/
├── assets/
└── theme/

---

## How to Run

### Prerequisites

# Ensure the following are installed:
- Node.js (v18 or later recommended)
- npm
- Ionic CLI

# Install Ionic CLI if needed:
- npm install -g @ionic/cli
# Setup
- Clone the repository
- git clone https://github.com/MitchX2/Keep_Me_UP.git
- cd keep-me-up
# Install dependencies
- npm install
# Run the application
- ionic serve

# The app will open in your browser at:
- http://localhost:8100

# Key Design Decisions
A shared header component is used across all pages for consistency
Theme handling is centralized using a ThemeService
Favourite team colour can be used as the global theme for the app
Team Detail page overrides the global theme to reflect the selected team
Matchday page uses split layouts to visually compare teams with stats
Documentation

Author
Sean Mitchell