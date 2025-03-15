const axios = require('axios');

module.exports = {
  name: 'lyrics',
  description: 'fetches lyrics for a given song.',
  author: 'developer',
  async execute(senderId, args, pageAccessToken, sendMessage) {
    const songName = args.join(" ").trim();

    if (!songName) {
      return sendMessage(senderId, { text: "Please provide a song name!" }, pageAccessToken);
    }

    try {
      await fetchLyrics(sendMessage, senderId, pageAccessToken, songName);
    } catch (error) {
      console.error(`Error fetching lyrics for "${songName}":`, error);
      sendMessage(senderId, { text: `Sorry, there was an error getting the lyrics for "${songName}"!` }, pageAccessToken);
    }
  },
};

async function fetchLyrics(sendMessage, senderId, pageAccessToken, songName) {
  const apiUrl = `https://api.popcat.xyz/lyrics?song=${encodeURIComponent(songName)}`;

  try {
    const response = await axios.get(apiUrl);
    const { lyrics, title, artist, image } = response.data;

    if (!lyrics) {
      throw new Error("Lyrics not found");
    }

    const messageData = {
      text: `🎧 | Title: ${title}\n🎤 | Artist: ${artist}\n━━━━━━━━━━━━━━━━\n${lyrics}\n━━━━━━━━━━━━━━━━`
    };

    // Add image if available
    if (image) {
      const imgResponse = await axios.get(image, { responseType: 'arraybuffer' });
      messageData.attachment = Buffer.from(imgResponse.data, 'binary');
    }

    sendMessage(senderId, messageData, pageAccessToken);

  } catch (error) {
    console.error(`Error fetching lyrics from Popcat API for "${songName}":`, error.message || error);
    sendMessage(senderId, { text: `Sorry, lyrics for "${songName}" were not found!` }, pageAccessToken);
  }
}