const axios = require('axios');
const { sendMessage } = require('../handles/sendMessage');

// Define and export module
module.exports = {
  // Metadata for the command
  name: 'bing',  // Command name
  description: 'Generate and send images directly from Bing based on your prompt.',  // description 
  usage: '/binggen <prompt>',  // usage
  author: 'Jerome',  // Author of the command

  // Main function that executes the command
  async execute(senderId, args, pageAccessToken) {
    // Check if prompt arguments are provided
    if (!args || args.length === 0) {
      // Send message requesting a prompt if missing
      await sendMessage(senderId, {
        text: 'Please provide a prompt. Example: /binggen dog'
      }, pageAccessToken);
      return;  // Exit the function if no prompt is provided
    }

    // Concatenate arguments to form the prompt
    const prompt = args.join(' ');
    const apiUrl = `https://jerome-web.onrender.com/service/api/bing?prompt=${encodeURIComponent(prompt)}`;  // API endpoint with the prompt

    // Notify user that the image is being generated
    await sendMessage(senderId, { text: 'Generating image... Please wait.' }, pageAccessToken);

    try {
      const response = await axios.get(apiUrl);
      const data = response.data;

      if (data.success && data.result && data.result.length > 0) {
        // Prepare up to 4 image messages
        const imageMessages = data.result.slice(0, 4).map((imageUrl) => ({
          attachment: {
            type: 'image',
            payload: {
              url: imageUrl,
              is_reusable: true
            }
          }
        }));

        // Send each image message
        for (const imageMessage of imageMessages) {
          await sendMessage(senderId, imageMessage, pageAccessToken);
        }
      } else {
        await sendMessage(senderId, { text: `Sorry, no images were found for "${prompt}".` }, pageAccessToken);
      }
    } catch (error) {
      // Handle and log any errors during image generation
      console.error('Error fetching Bing images:', error);
      
      // Notify user of the error
      await sendMessage(senderId, { text: 'Sorry, there was an error processing your request.' }, pageAccessToken);
    }
  }
};
