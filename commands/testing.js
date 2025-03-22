const axios = require('axios');
const { sendMessage } = require('../handles/sendMessage');

module.exports = {
  name: 'test',
  description: 'Generate an art image based on the provided prompt.',
  author: 'developer',
  async execute(senderId, args, pageAccessToken) {
    // Validate if a prompt is provided
    if (!args || args.length === 0) {
      console.log('No prompt provided.');
      await sendMessage(senderId, { text: 'Please provide a prompt for generating art.' }, pageAccessToken);
      return;
    }

    const prompt = args.join(' ');
    const apiUrl = `https://elevnnnx-rest-api.onrender.com/api/art?prompt=${encodeURIComponent(prompt)}`;

    console.log(`Generated API URL: ${apiUrl}`); // Debugging log

    try {
      // Send request to the API
      const response = await axios.get(apiUrl);
      console.log('API Response:', response.data); // Debug log for response

      // Check if the API returned a valid image URL
      if (response.data) {
        const imageUrl = response.data; // Assuming the API returns the direct URL in the response

        console.log('Sending image URL:', imageUrl); // Debugging log
        // Send the image to the user
        await sendMessage(
          senderId,
          {
            attachment: {
              type: 'image',
              payload: {
                url: imageUrl,
                is_reusable: true,
              },
            },
          },
          pageAccessToken
        );
      } else {
        console.log('Invalid API response structure:', response.data);
        await sendMessage(senderId, { text: 'Failed to generate the art. Please try again.' }, pageAccessToken);
      }
    } catch (error) {
      console.error('Error fetching art image:', error.message); // Log the error for debugging
      await sendMessage(senderId, { text: 'An error occurred while generating the art. Please try again later.' }, pageAccessToken);
    }
  },
};