const axios = require('axios');
const fs = require('fs');
const { sendMessage } = require('../handles/sendMessage');

const token = fs.readFileSync('token.txt', 'utf8');
const geminiApiUrl = 'https://joshweb.click/gemini';

module.exports = {
  name: 'gemini',
  description: 'Interact with Gemini AI',
  author: 'developer',

  async execute(senderId, args) {
    const pageAccessToken = token;

    // Set the photo URL and prompt
    const photoUrl = 'https://i.imgur.com/SmVaQ8D.jpeg';
    const prompt = 'describe this photo';

    try {
      // Make a request to the Gemini API
      const response = await axios.get(`${geminiApiUrl}?prompt=${encodeURIComponent(prompt)}&url=${encodeURIComponent(photoUrl)}`);
      const description = response.data.description;

      if (!description) {
        throw new Error("No valid response from Gemini API.");
      }

      const formattedMessage = `ᯓ★ | 𝙶𝚎𝚖𝚒𝚗𝚒\n・───────────・\n${description}\n・──── >ᴗ< ────・`;
      await sendMessage(senderId, { text: formattedMessage }, pageAccessToken);
    } catch (error) {
      console.error('Error with Gemini API:', error.message);
      await sendMessage(senderId, { text: 'Error: Unable to get a valid response from Gemini API.' }, pageAccessToken);
    }
  }
};
