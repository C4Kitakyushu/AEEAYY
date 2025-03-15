const axios = require('axios');

module.exports = {
  name: "pinterest",
  description: "searching pics from pinterest",
  author: "developer",

  async execute(senderId, args, pageAccessToken, sendMessage) {
    try {
      if (args.length === 0) {
        return sendMessage(senderId, {
          text: "🖼️•Invalid format! Use the command like this:\n\npinterest [search term] - [number of images]\nExample: pinterest Llama - 10"
        }, pageAccessToken);
      }

      const [searchTerm, count] = args.join(" ").split(" - ");
      if (!searchTerm || !count) {
        return sendMessage(senderId, {
          text: "🖼️•Invalid format! Use the command like this:\n\npinterest [search term] - [number of images]\nExample: pinterest Llama - 10"
        }, pageAccessToken);
      }

      const numOfImages = parseInt(count) || 5;
      if (isNaN(numOfImages) || numOfImages < 1 || numOfImages > 10) {
        return sendMessage(senderId, {
          text: "🖼️•Invalid number! Please enter a number of images between 1 and 10."
        }, pageAccessToken);
      }

      const apiUrl = `https://ccprojectapis.ddns.net/api/pin?title=${encodeURIComponent(searchTerm)}&count=${numOfImages}`;
      console.log(`Fetching data from API: ${apiUrl}`);
      const response = await axios.get(apiUrl);

      const data = response.data.data;
      if (!data || data.length === 0) {
        return sendMessage(senderId, { text: `No results found for "${searchTerm}".` }, pageAccessToken);
      }

      const imageUrls = data.slice(0, numOfImages);
      if (imageUrls.length === 0) {
        return sendMessage(senderId, { text: `No available images for "${searchTerm}".` }, pageAccessToken);
      }

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