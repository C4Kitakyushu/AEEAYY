const axios = require('axios');

module.exports = {
  name: "test",
  description: "Search for a YouTube video and retrieve its download information",
  author: "developer",

  async execute(senderId, args, pageAccessToken, sendMessage) {
    try {
      // Validate input: ensure the user provides a query
      if (args.length === 0) {
        return sendMessage(senderId, {
          text: "🎥 Invalid format! Use the command like this:\n\nvideo [search term]\nExample: video Tibok"
        }, pageAccessToken);
      }

      // Combine the args into a search query
      const query = args.join(" ").trim();

      // Call the Video API
      const apiUrl = `https://kaiz-apis.gleeze.com/api/video?query=${encodeURIComponent(query)}`;
      console.log(`Fetching data from API: ${apiUrl}`);
      const response = await axios.get(apiUrl);

      const { title, duration, thumbnail, download_url } = response.data;

      if (!title || !thumbnail || !download_url) {
        return sendMessage(senderId, {
          text: `❌ No results found for "${query}".`
        }, pageAccessToken);
      }

      // Send video details with thumbnail and download link
      await sendMessage(senderId, {
        attachment: {
          type: "image",
          payload: { url: thumbnail }
        }
      }, pageAccessToken);

      await sendMessage(senderId, {
        text: `🎥 **Title**: ${title}\n🕒 **Duration**: ${duration}\n\n📥 **Download**: ${download_url}`
      }, pageAccessToken);

    } catch (error) {
      console.error("Failed to retrieve video details:", error);
      sendMessage(senderId, {
        text: `❌ Failed to retrieve video details. Error: ${error.message || error}`
      }, pageAccessToken);
    }
  }
};