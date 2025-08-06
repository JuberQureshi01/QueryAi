// utils/gemini.js

import "dotenv/config";
import axios from "axios";

/**
 * Gets a response from the Gemini API.
 * @param {string} message - The user's message.
 * @returns {Promise<string|null>} The text response from the API or null if an error occurs.
 */
const getGeminiAPIResponse = async (message) => {
  // The Gemini API uses a different endpoint structure.
  // The API key is passed as a query parameter.
  const API_KEY = process.env.GEMINI_API_KEY;
  const API_URL = `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash-latest:generateContent?key=${API_KEY}`;

  // The request body format is different for Gemini.
  const requestBody = {
    contents: [
      {
        parts: [{ text: message }],
      },
    ],
  };

  const options = {
    headers: {
      "Content-Type": "application/json",
    },
  };

  try {
    // We use axios.post(url, body, options)
    const response = await axios.post(API_URL, requestBody, options);
    
    // The response structure is also different.
    // It's good practice to add checks in case the response is blocked for safety.
    if (response.data.candidates && response.data.candidates.length > 0) {
      return response.data.candidates[0].content.parts[0].text; // The reply
    } else {
      return "I'm sorry, I couldn't generate a response for that.";
    }

  } catch (err) {
    // Axios provides more detailed error information.
    console.error("Error calling Gemini API:", err.response ? err.response.data.error : err.message);
    return null; // Return null to indicate an error.
  }
};

export default getGeminiAPIResponse;