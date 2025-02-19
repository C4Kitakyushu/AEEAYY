const axios = require('axios');

module.exports = {
  name: "pinterest",
  description: "fetch images from pinterest based on a query",
  author: "developer",

  async execute(senderId, args, pageAccessToken, sendMessage) {
    try {
      if (args.length === 0) {
        return sendMessage(senderId, {
          text: `🖼️•Invalid format! Use the command like this:\n\npinterest [search term] - [number of images]\nExample: pinterest Llama - 3`
        }, pageAccessToken);
      }

      const [searchTerm, count] = args.join(" ").split(" - ");
      if (!searchTerm) {
        return sendMessage(senderId, {
          text: `🖼️•Invalid format! Use the command like this:\n\npinterest [search term] - [number of images]\nExample: pinterest Llama - 3`
        }, pageAccessToken);
      }

      const numOfImages = parseInt(count) || 3;
      const apiUrl = `https://api.zetsu.xyz/api/pinterest?q=${encodeURIComponent(searchTerm)}`;
      const response = await axios.get(apiUrl);
      const images = response.data.result;

      if (!images || images.length === 0) {
        return sendMessage(senderId, { text: `No images found for "${searchTerm}".` }, pageAccessToken);
      }

      const imageUrls = images.slice(0, numOfImages);
      for (const url of imageUrls) {
        await sendMessage(senderId, {
          attachment: {
            type: "image",
            payload: {
              url: url,
              is_reusable: true
            }
          }
        }, pageAccessToken);
      }
    } catch (error) {
      console.error("Error fetching Pinterest images:", error);
      sendMessage(senderId, { text: `❌ Failed to retrieve images from Pinterest. Error: ${error.message || error}` }, pageAccessToken);
    }
  }
};