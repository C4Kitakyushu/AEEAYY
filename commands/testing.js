const axios = require("axios");
const { sendMessage } = require("../handles/sendMessage");

module.exports = {
  name: "test",
  description: "Get song lyrics",
  author: "developer",

  async execute(senderId, args, pageAccessToken) {
    const songTitle = args.join(" ").trim();

    if (!songTitle) {
      return sendMessage(
        senderId,
        { text: `❌ Please provide a song title.\n\nUsage: lyrics <title>` },
        pageAccessToken
      );
    }

    try {
      const apiUrl = `https://kaiz-apis.gleeze.com/api/lyrics?title=${encodeURIComponent(songTitle)}`;
      const response = await axios.get(apiUrl);

      const data = response.data;

      if (!data || !data.lyrics) {
        return sendMessage(
          senderId,
          { text: `❌ No lyrics found for "${songTitle}".` },
          pageAccessToken
        );
      }

      // Send the thumbnail if available
      if (data.thumbnail) {
        await sendMessage(senderId, { attachment: { type: "image", payload: { url: data.thumbnail } } }, pageAccessToken);
      }

      // Display the title first
      await sendMessage(senderId, { text: `🎵 *${data.title}* 🎵\n` }, pageAccessToken);

      // Chunk the lyrics to prevent message overflow
      const chunkSize = 2000;
      for (let i = 0; i < data.lyrics.length; i += chunkSize) {
        await sendMessage(senderId, { text: data.lyrics.substring(i, i + chunkSize) }, pageAccessToken);
      }

    } catch (error) {
      console.error("Error in lyrics command:", error);
      sendMessage(
        senderId,
        { text: `❌ Error: ${error.message || "Something went wrong."}` },
        pageAccessToken
      );
    }
  }
};