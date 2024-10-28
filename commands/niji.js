const axios = require('axios');
const { sendMessage } = require('../handles/sendMessage');

module.exports = {
  name: 'niji',  // Command name
  description: 'Generates an image based on the provided prompt.',  // Command description
  usage: '/niji <prompt>',  // Command usage
  author: 'ArYAN',  // Author of the command

  async execute(senderId, args, pageAccessToken) {
    // Check if prompt arguments are provided
    if (!args || args.length === 0) {
      await sendMessage(senderId, {
        text: 'Please provide a prompt for image generation.'
      }, pageAccessToken);
      return;  // Exit if no prompt is provided
    }

    // Concatenate arguments to form the prompt
    const prompt = args.join(' ');
    const apiUrl = `https://c-v5.onrender.com/v1/niji?prompt=${encodeURIComponent(prompt)}`;
    const usageUrl = 'https://apizaryan.onrender.com/api/usage';

    // Notify user that the image is being generated
    await sendMessage(senderId, { text: 'Generating image... Please wait.' }, pageAccessToken);

    try {
      const startTime = new Date().getTime();

      // Fetch the generated image
      const imageResponse = await axios.get(apiUrl, { responseType: 'arraybuffer' });
      const usageResponse = await axios.get(usageUrl);
      
      // Calculate time taken
      const endTime = new Date().getTime();
      const timeTaken = ((endTime - startTime) / 1000).toFixed(2);

      // Send the generated image as an attachment
      await sendMessage(senderId, {
        attachment: {
          type: 'image',
          payload: {
            url: apiUrl
          }
        },
        text: `📦| Model: NIJI 1.1\n🔮| Total Requests: ${usageResponse.data.totalRequests}\n⏰| Time Taken: ${timeTaken} seconds`
      }, pageAccessToken);

    } catch (error) {
      console.error('Error generating image:', error);

      // Notify user of the error
      await sendMessage(senderId, {
        text: 'Failed to generate image. Please try again later.'
      }, pageAccessToken);
    }
  }
};
