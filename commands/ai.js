// Import required modules
const axios = require('axios');                       // For making HTTP requests
const { sendMessage } = require('../handles/sendMessage'); // Custom function to send messages
const fs = require('fs');                             // For file system operations

// Read API token from file
const token = fs.readFileSync('token.txt', 'utf8');   // Reads token from 'token.txt' file

// Export the module configuration
module.exports = {
  name: 'ai',                                         // Command name
  description: 'chat with gpt4 assistant',            // Description of the command
  usage: 'i loveu',                                   // Usage example
  author: 'developer',                                // Author of the command
  
  // Execute function to process the command
  async execute(senderId, args) {                     // Main function for handling chat
    const pageAccessToken = token;                    // Set the access token
    const input = (args.join(' ') || 'hello').trim(); // Format input from user
    await handleChatResponse(senderId, input, pageAccessToken); // Call chat handler
  },
};

// Function to handle the API response
const handleChatResponse = async (senderId, input, pageAccessToken) => {
  const systemRole = 'you are Chromyy AI. an AI assistant.';  // Define system role
  const prompt = `${systemRole}\n${input}`;                   // Format prompt for API
  const apiUrl = `https://joshweb.click/gpt4?prompt=${encodeURIComponent(prompt)}&uid=${senderId}`; // Construct API URL

  try {
    const { data } = await axios.get(apiUrl);                 // Make GET request to API
    const responseText = data.gpt4 || 'No response from the API.';  // Get response text
    const responseTime = new Date().toLocaleString('en-US', { timeZone: 'Asia/Manila', hour12: true }); // Format response time

    // Format and send message
    const formattedMessage = `𝗠𝗘𝗧𝗔𝗟𝗟𝗜𝗖 𝗖𝗛𝗥𝗢𝗠𝗘 𝗔𝗜 🤖\n━━━━━━━━━━━━━━━━━━\n${responseText}\n━━━━━━━━━━━━━━━━━━\n⏰ 𝗥𝗲𝘀𝗽𝗼𝗻𝗱 𝗧𝗶𝗺𝗲: ${responseTime}`;
    await sendMessage(senderId, { text: formattedMessage }, pageAccessToken);
  } catch (error) {
    console.error('Error reaching the API:', error);          // Log error
    await sendError(senderId, 'An error occurred while trying to reach the API.', pageAccessToken); // Handle error
  }
};

// Function to handle and send error messages
const sendError = async (senderId, errorMessage, pageAccessToken) => {
  const responseTime = new Date().toLocaleString('en-US', { timeZone: 'Asia/Manila', hour12: true }); // Format error time
  const formattedMessage = `𝗠𝗘𝗧𝗔𝗟𝗟𝗜𝗖 𝗖𝗛𝗥𝗢𝗠𝗘 𝗔𝗜 🤖 \n━━━━━━━━━━━━━━━━━━\n${errorMessage}\n━━━━━━━━━━━━━━━━━━\n⏰ 𝗥𝗲𝘀𝗽𝗼𝗻𝗱 𝗧𝗶𝗺𝗲: ${responseTime}`;

  await sendMessage(senderId, { text: formattedMessage }, pageAccessToken); // Send error message
};
