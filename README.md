# AI Resume Screener

An AI-powered resume screening assistant built with Node.js and Google Gemini API.

## Features

- User authentication with secure login/signup
- PDF resume upload and text extraction
- AI-powered resume analysis using Google Gemini
- Automated scoring and skill matching
- Analysis history and dashboard

## Tech Stack

- **Backend**: Express.js (Node.js)
- **Database**: MongoDB with Mongoose
- **Authentication**: Passport.js
- **AI**: Google Generative AI (Gemini)
- **File Upload**: Multer
- **Template Engine**: EJS
- **Password Hashing**: bcryptjs

## Prerequisites

- Node.js v14+
- MongoDB Atlas account
- Google Gemini API key

## Installation

1. Clone the repository and install dependencies:
   ```bash
   npm install
   ```

2. Create `.env` file:
   ```bash
   cp .env.example .env
   ```
   Add your credentials:
   - `MONGO_URI`: MongoDB connection string
   - `SESSION_SECRET`: Random string for session encryption
   - `GEMINI_API_KEY`: Google Gemini API key
   - `PORT`: Server port (default: 3000)

3. Start the application:
   ```bash
   npm run dev
   ```

4. Open `http://localhost:3000` in your browser

## API Keys Setup

### Google Gemini API
Visit [Google AI Studio](https://aistudio.google.com/) and create an API key.

### MongoDB Atlas
Create an account at [MongoDB Atlas](https://www.mongodb.com/cloud/atlas) and get your connection string.

## Security

- Never commit `.env` to version control
- Use strong session secrets
- Keep API keys secure
- Validate all user inputs

## License

MIT
