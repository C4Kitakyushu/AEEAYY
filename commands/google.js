const axios = require('axios');
const fs = require('fs');
const { GoogleGenerativeAI } = require("@google/generative-ai");
const { sendMessage } = require('../handles/sendMessage');

const token = fs.readFileSync('token.txt', 'utf8');
const primaryApiKey = "AIzaSyDMIUoKCQ_NRrc4tz-JKGZFh8CA1iCJLq8";
const alternativeApiKey = "AIzaSyCCBHy1B1-vdGpiNCEYfwxkmVnPUviYd4U";

module.exports = {
  name: 'google',
  description: 'interact with google assistant ',
  author: 'developer',

  async execute(senderId, args) {
    const pageAccessToken = token;

    // Set a default query if none is provided
    const input = (args.join(' ') || 'hi').trim();
    const modifiedPrompt = `${input}, direct answer.`;

    // Initialize Google Generative AI with the primary API key
    const genAI = new GoogleGenerativeAI(primaryApiKey);
    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

    try {
      // Generate AI response using Google Generative AI
      const result = await model.generateContent(modifiedPrompt);
      const response = await result.response;
      const text = await response.text();

      if (!text) {
        throw new Error("No valid response from primary API, switching to alternative API.");
      }

      const formattedMessage = ` 𝗚𝗼𝗼𝗴𝗹𝗲 𝗔𝘀𝘀𝗶𝘀𝘁𝗮𝗻𝘁 🤖\n━━━━━━━━━━━━━━━━━━\n${text}━━━━━━━━━━━━━━━━━━`;
      await sendMessage(senderId, { text: formattedMessage }, pageAccessToken);
    } catch (error) {
      console.error('Error with primary API:', error.message);

      try {
        // If the primary API fails, try the alternative API
        const alternativeGenAI = new GoogleGenerativeAI(alternativeApiKey);
        const alternativeModel = alternativeGenAI.getGenerativeModel({ model: "gemini-1.5-flash" });

        const altResult = await alternativeModel.generateContent(modifiedPrompt);
        const altResponse = await altResult.response;
        const altText = await altResponse.text();

        if (!altText) {
          throw new Error("No valid response from alternative API.");
        }

        const formattedMessage = `𝗚𝗲𝗺𝗶𝗻𝗶 ♊\n━━━━━━━━━━━━━━━━━━\n${altText}━━━━━━━━━━━━━━━━━━`;
        await sendMessage(senderId, { text: formattedMessage }, pageAccessToken);
      } catch (altError) {
        console.error('Error with alternative API:', altError.message);
        await sendMessage(senderId, { text: 'Error: Unable to get a valid response from both APIs.' }, pageAccessToken);
      }
    }
  }
};
