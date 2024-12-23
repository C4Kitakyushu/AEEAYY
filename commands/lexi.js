const { sendMessage } = require('../handles/sendMessage');

module.exports = {
  name: 'lexi',
  description: 'lexi <text>',
  usage: 'lexi <text>',
  author: 'developer',
  async execute(senderId, args, pageAccessToken) {
    // Validate input arguments
    if (!args || !Array.isArray(args) || args.length === 0) {
      await sendMessage(senderId, { text: '❌ Please provide the text for the canvas.' }, pageAccessToken);
      return;
    }

    // Join arguments into a single text string
    const text = args.join(' ');
    // Construct the API URL using the provided endpoint
    const apiUrl = `https://api-canvass.vercel.app/lexi?text=${encodeURIComponent(text)}`;

    try {
      // Send the generated image to the user
      await sendMessage(senderId, { 
        attachment: { 
          type: 'image', 
          payload: { url: apiUrl } 
        } 
      }, pageAccessToken);
    } catch (error) {
      // Log the error and send a failure message
      console.error('Error:', error);
      await sendMessage(senderId, { text: '⚠️ Error: Unable to generate the canvas image.' }, pageAccessToken);
    }
  }
};
