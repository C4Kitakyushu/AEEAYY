const axios = require('axios');

module.exports = {
  name: "pinterest",
  description: "Search for images on Pinterest",
  author: "developer",

  async execute(senderId, args, pageAccessToken, sendMessage) {
    try {
      // Validate input: must include a dash separator between search term and number.
      if (args.length === 0) {
        return sendMessage(senderId, {
          text: "Usage: pinterest [search term] - [number of images]\nexample: pinterest dog - 10"
        }, pageAccessToken);
      }

      // Combine the args into one string and split by " - "
      const [searchTerm, count] = args.join(" ").split(" - ");

      if (!searchTerm || !count) {
        return sendMessage(senderId, {
          text: "🖼️ Invalid format! Use the command like this:\n\npinterest [search term] - [number of images]\nExample: pinterest cats - 5"
        }, pageAccessToken);
      }

      // Parse the number of images and check that it’s within a valid range (1-10)
      const numOfImages = parseInt(count) || 5;
      if (isNaN(numOfImages) || numOfImages < 1 || numOfImages > 20) {
        return sendMessage(senderId, {
          text: "Usage: pinterest [search term] - [number of images]\nexample: pinterest dog - 10"
        }, pageAccessToken);
      }

      // Call the Pinterest API
      const apiUrl = `https://kaiz-apis.gleeze.com/api/pinterest?search=${encodeURIComponent(searchTerm)}`;
      console.log(`Fetching data from API: ${apiUrl}`);
      const response = await axios.get(apiUrl);

      const data = response.data.data;
      if (!data || data.length === 0) {
        return sendMessage(senderId, { text: `No results found for "${searchTerm}".` }, pageAccessToken);
      }

      // Use the first numOfImages URLs provided by the API
      const imageUrls = data.slice(0, numOfImages);
      if (imageUrls.length === 0) {
        return sendMessage(senderId, { text: `No available images for "${searchTerm}".` }, pageAccessToken);
      }

      // Send each image URL as an attachment
      for (const url of imageUrls) {
        await sendMessage(senderId, {
          attachment: {
            type: "image",
            payload: { url }
          }
        }, pageAccessToken);
      }

    } catch (error) {
      console.error("Failed to retrieve images from Pinterest:", error);
      sendMessage(senderId, { text: `❌ Failed to retrieve images from Pinterest. Error: ${error.message || error}` }, pageAccessToken);
    }
  }
};