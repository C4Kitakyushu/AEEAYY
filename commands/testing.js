const axios = require("axios");
const { sendMessage } = require("../handles/sendMessage");

module.exports = {
  name: "test",
  description: "Get song lyrics with thumbnail",
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

      const lyricsPayload = {
        attachment: {
          type: "template",
          payload: {
            template_type: "generic",
            elements: [
              {
                title: data.title,
                image_url: data.thumbnail || "https://example.com/default-image.jpg",
                subtitle: `Lyrics by ${data.author}`,
                buttons: [
                  {
                    type: "postback",
                    title: "View Lyrics",
                    payload: `VIEW_LYRICS_${data.title}`,
                  }
                ]
              }
            ]
          }
        }
      };

      await sendMessage(senderId, lyricsPayload, pageAccessToken);

      // Send lyrics separately if they're too long for the template
      if (data.lyrics.length > 600) {
        const trimmedLyrics = data.lyrics.substring(0, 600) + "...";
        await sendMessage(senderId, { text: trimmedLyrics }, pageAccessToken);
      } else {
        await sendMessage(senderId, { text: data.lyrics }, pageAccessToken);
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