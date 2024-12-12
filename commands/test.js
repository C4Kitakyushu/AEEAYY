const axios = require('axios');
const { sendMessage } = require('../handles/sendMessage');

// Define and export module
module.exports = {
  name: 'test', // Command name
  description: 'Fetch images from Pinterest based on a query.', // Description
  usage: 'pinterest <query>', // Usage
  author: 'Ali', // Author of the command

  async execute(senderId, args, pageAccessToken) {
    if (!args || args.length === 0) {
      // If no query is provided, notify the user
      await sendMessage(senderId, {
        text: 'Please provide a query to search for Pinterest images. Usage: pinterest <query>'
      }, pageAccessToken);
      return;
    }

    const query = args.join(' '); // Combine arguments into a query
    const apiUrl = `https://api.joshweb.click/api/pinterest?q=${encodeURIComponent(query)}`;

    await sendMessage(senderId, {
      text: `Searching for images related to "${query}"... Please wait.`
    }, pageAccessToken);

    try {
      const response = await axios.get(apiUrl);
      const { status, result } = response.data;

      if (status === 200 && result && result.length > 0) {
        // Send the first image URL as an attachment
        await sendMessage(senderId, {
          attachment: {
            type: 'image',
            payload: {
              url: result[0] // Sending the first image URL
            }
          }
        }, pageAccessToken);

        // Pretty-print the results for the user
        const prettyResults = result.map((url, index) => `${index + 1}. ${url}`).join('\n');
        await sendMessage(senderId, {
          text: `Found ${result.length} images:\n\n${prettyResults}`
        }, pageAccessToken);
      } else {
        await sendMessage(senderId, {
          text: 'No images were found for your query. Please try a different search term.'
        }, pageAccessToken);
      }

    } catch (error) {
      console.error('Error fetching images:', error);
      await sendMessage(senderId, {
        text: 'An error occurred while fetching images. Please try again later.'
      }, pageAccessToken);
    }
  }
};
