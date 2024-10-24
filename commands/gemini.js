const axios = require('axios');
const fs = require('fs');
const { sendMessage } = require('../handles/sendMessage');

const token = fs.readFileSync('token.txt', 'utf8');
const geminiApiUrl = 'https://joshweb.click/gemini';

module.exports = {
  name: 'gemini',
  description: 'Interact with Gemini AI',
  author: 'Coffee',

  async execute(senderId, args) {
    const pageAccessToken = token;

    // Set the photo URL and prompt
    const photoUrl = 'https://i.imgur.com/SmVaQ8D.jpeg';
    const prompt = 'describe this photo';

    try {
      // Make a request to the Gemini API
      const apiUrl = `${geminiApiUrl}?prompt=${encodeURIComponent(prompt)}&url=${encodeURIComponent(photoUrl)}`;
      console.log('Requesting URL:', apiUrl);  // Log the API request URL
      
      const response = await axios.get(apiUrl);
      console.log('API Response:', response.data); // Log the full API response

      // Check for expected data in the response
      if (response.data && response.data.description) {
        const description = response.data.description;
        
        const formattedMessage = `ᯓ★ | 𝙶𝚎𝚖𝚒𝚗𝚒\n・───────────・\n${description}\n・──── >ᴗ< ────・`;
        await sendMessage(senderId, { text: formattedMessage }, pageAccessToken);
      } else {
        throw new Error("No valid description found in the response.");
      }
    } catch (error) {
      console.error('Error with Gemini API:', error.message);
      await sendMessage(senderId, { text: 'Error: Unable to get a valid response from Gemini API.' }, pageAccessToken);
    }
  }
};
