const axios = require('axios');
const { sendMessage } = require('../handles/sendMessage');

module.exports = {
  name: 'test',
  description: 'Generate an art image based on the provided prompt.',
  author: 'developer',
  async execute(senderId, args, pageAccessToken) {
    // Validate if arguments are provided
    if (!args || args.length === 0) {
      console.log('No prompt provided.');
      await sendMessage(senderId, { text: 'Please provide a prompt for generating art.' }, pageAccessToken);
      return;
    }

    const prompt = args.join(' ');
    const apiUrl = `https://elevnnnx-rest-api.onrender.com/api/art?prompt=${encodeURIComponent(prompt)}`;

    console.log(`Generated API URL: ${apiUrl}`); // Debug log for API URL

    try {
      // Send request to the API
      const response = await axios.get(apiUrl);
      console.log('API Response:', response.data); // Log full response for debugging

      if (response.data && response.data.imageUrl) {
        // Send the image to the user
        console.log('Sending image URL:', response.data.imageUrl); // Debug log for image URL
        await sendMessage(
          senderId,
          {
            attachment: {
              type: 'image',
              payload: {
                url: response.data.imageUrl,
                is_reusable: true,
              },
            },
          },
          pageAccessToken
        );
      } else {
        console.log('Invalid response structure:', response.data); // Log if the response is not as expected
        await sendMessage(senderId, { text: 'Could not fetch the art image. Please try again later.' }, pageAccessToken);
      }
    } catch (error) {
      console.error('Error fetching art image:', error); // Log detailed error message
      await sendMessage(senderId, { text: 'An error occurred while generating the art. Please try again later.' }, pageAccessToken);
    }
  },
};