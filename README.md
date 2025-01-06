# Digi-Cry

## 📝 Description
**Your personal, interactive mood journaling web application**

Tracks moods over time via **Google Cloud Natural Language** sentiment analysis and offers motivational quotes, local events, and a supportive community forum.

## Table of Contents

1. [About the Project](#about-the-project)
2. [Key Features](#key-features)
3. [Tech Stack](#tech-stack)
4. [Getting Started](#getting-started)
    1. [Prerequisites](#prerequisites)
    2. [Installation](#installation)
    3. [Environment Variables](#environment-variables)
    4. [Seed Data](#seed-data)
5. [Usage](#usage)
6. [APIs & Services](#apis--services)
7. [Contact](#contact)

---

## 📂 About the Project

**Digi-Cry** is a web application designed to help users reflect on their emotional well-being through journal entries. By leveraging the **Google Cloud Natural Language API**, each entry is analyzed for sentiment, allowing users to visualize mood trends over time. The app also fosters a supportive environment by providing:

- Motivational quotes to lift spirits.
- Local event recommendations (to encourage community engagement).
- A forum system for users to discuss topics, goals, and challenges together.

---

## 🎯 Key Features

1. **User Authentication**
   - Utilizes **Google OAuth/Passport** for easy login.
2. **Motivational Quotes**
   - Fetches quotes from the **Stoic Tekloon** API to inspire users upon each visit.
3. **Journal Functionality**
   - Create, Read, Update, and Delete (CRUD) journal entries.
   - Each entry is analyzed for sentiment score and magnitude.
4. **Mood Analytics**
   - Visualize mood trends over time with data-rich charts.
   - Quick snapshot on the home page plus a detailed analytics page.
5. **Local Event Discovery**
    - Geolocation-based event finding
    - Google Maps integration
    - SERP API event searching
    - Event details with dates and locations
    - Direct links to event pages
6. **Community Forums**
    - Five focused categories:
        1. Physical Health
        2. Finances
        3. Personal Development
        4. Mental Health
        5. Career
  - Post creation and viewing
  - Like system for engagement
  - AI Goal Analysis powered by Google's Gemini AI
  - Recent posts feed

---

## 🛠️ Tech Stack

- **Front End:**
  - [React](https://reactjs.org/) (using React Router for navigation, Material UI for styling)
  - [Chart.js](https://www.chartjs.org/) & [react-chartjs-2](https://react-chartjs-2.js.org/) for data visualization
  - Bundled via [Webpack](https://webpack.js.org/) with [Babel](https://babeljs.io/) as a JavaScript compiler

- **Back End:**
  - [Node.js](https://nodejs.org/) & [Express](https://expressjs.com/)
  - [Mongoose](https://mongoosejs.com/) for [MongoDB](https://www.mongodb.com/) interactions
  - [Passport.js](http://www.passportjs.org/) with [Google OAuth](https://developers.google.com/identity) for authentication

- **Database:**
  - [MongoDB](https://www.mongodb.com/)

- **Deployment & Cloud Services:**
  - [Google Cloud Natural Language API](https://cloud.google.com/natural-language)
  - [Google Cloud Platform](https://cloud.google.com/) for hosting

- **Other Notable Libraries:**
  - [Axios](https://github.com/axios/axios) for HTTP requests
  - [dotenv](https://github.com/motdotla/dotenv) for environment variables

---

## 🚀 Getting Started

### Prerequisites

1. **Node.js** (version 16+ recommended)
2. **npm** (version 8+ recommended) or **Yarn**
3. **MongoDB** - Make sure you have a local or remote MongoDB instance ready.
4. **Google Cloud Project** with **Natural Language API** enabled (to get the proper credentials).

### Installation

1. **Clone** the repository
```bash
git clone https://github.com/your-username/digicry.git
cd digicry
```

2. **Install** dependencies
```bash
npm install
```

3. **Set up** environment variables
```bash
cp .env.example .env
```
Edit `.env` with your API keys and configuration

---

### Environment Variables

```
GOOGLE_CLIENT_ID=your-google-client-id
GOOGLE_CLIENT_SECRET=your-google-client-secret
PORT=5000
HOME_URL=http://localhost:8080/
SERVER_URL=http://localhost:5000/
CALLBACK_URL
DEPLOYMENT=FALSE
GOOGLE_MAPS_API_KEY
EVENTS_API_KEY
AI_API_KEY
```

### 🌱 Seed Data

To seed the database with sample **journal entries**:

```bash
npm run server
# In a new terminal:
node server/db/seed/js
```
---

## 🔧 Usage

- `npm run dev`: Start both frontend and backend in development mode
- `npm run server`: Start backend server only
- `npm run client`: Start frontend client only
- `npm run build`: Build the production version
- `npm run start-prod`: Start production server
- `npm run lint`: Run ESLint
- `npm run clean-deps`: Clean and reinstall dependencies

---

## 🔗 APIs & Services

  - [Stoicism Quote API](https://github.com/tlcheah2/stoic-quote-lambda-public-api) for Motivation Quotes
  - [Google Cloud Natural Language API](https://cloud.google.com/natural-language/docs/basics) for sentiment analysis of journal entries for mood tracking
  - [Google Gemini API](https://ai.google.dev/gemini-api/docs/quickstart?lang=node) for setting and achieving goals
  - [Google Maps Geocoding API](https://developers.google.com/maps/documentation/geocoding/overview)
  - [SERP API](https://serpapi.com/) for event discovery

## Contact

### 👥 Team

- [Colton Gray](https://github.com/coltongraygg)
- [Barrington Hebert](https://github.com/bkhebert)
- [Ashley Theriot](https://github.com/atheriot827)

---

## 🙏 Acknowledgments

- All contributors who have helped shape this project

---

<p align="center">Made with ❤️ by The 404's</p>
