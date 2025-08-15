<div align="center">
<img src="https://i.imgur.com/your-queryai-logo.png" alt="Query AI Logo" width="150" />
<h1>Query AI - Ask your Query</h1>
<p>
<strong>A full-stack MERN application that translates the questions into the Answer using the Google Gemini API.</strong>
</p>
<p>
</p>
</div>

<div align="center">

</div>

Key Features
Natural Language Processing: Users can ask the question and Ai will give the answer.


User-Specific History: Each user has an account and can view a history of all the queries they've generated, allowing them to reuse or reference past results.

Secure Authentication: Built from scratch with JWT (JSON Web Tokens) and bcrypt to ensure user data and query history are protected.

Clean, Responsive UI: A modern interface built with React and Tailwind CSS that allows for easy input and clear display of the generated Answer.


Tech Stack & Architecture
Query AI is built on the MERN stack, demonstrating a classic and powerful full-stack architecture.

Backend (Server)
Runtime: Node.js

Framework: Express.js

Database: MongoDB with Mongoose for object data modeling.

Authentication: Custom JWT implementation.

AI Integration: Google Gemini API for the core translation functionality.

Frontend (Client)
Library: React

Framework: Vite

Styling: Tailwind CSS

State Management: React Hooks (useState, useEffect, useContext).

Routing: React Router

Setup and Installation
Prerequisites
Node.js (v18 or later)

npm or yarn

MongoDB instance (local or cloud-based)

1. Backend Setup
# Navigate to the server directory
cd server

# Install dependencies
npm install

 Create a .env file and add your environment variables:
 
 MONGO_URI="Your_MongoDB_Connection_String"
 
 JWT_SECRET="Your_JWT_Secret"
 
 GOOGLE_API_KEY="Your_Google_AI_API_Key"

# Start the server
npm run dev

2. Frontend Setup

Navigate to the client directory

cd client

# Install dependencies
npm install

Start the client
npm run dev
