const axios = require('axios');

module.exports = {
  name: 'test',
  description: 'Fetches lyrics for a given song.',
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
  const apiUrl = `https://betadash-api-swordslush.vercel.app/lyrics-finder?title=${encodeURIComponent(songName)}`;

  try {
    const response = await axios.get(apiUrl);
    const { lyrics, title, artist } = response.data;

    if (!lyrics) {
      throw new Error("Lyrics not found");
    }

    sendFormattedLyrics(sendMessage, senderId, pageAccessToken, title, artist, lyrics);
  } catch (error) {
    console.error(`Error fetching lyrics from Primary API for "${songName}":`, error.message || error);
    sendMessage(senderId, { text: `Sorry, lyrics for "${songName}" not found!` }, pageAccessToken);
  }
}

function sendFormattedLyrics(sendMessage, senderId, pageAccessToken, title, artist, lyrics) {
  const formattedLyrics = `🎧 | Title: ${title}\n🎤 | Artist: ${artist}\n━━━━━━━━━━━━━━━━\n${lyrics}\n━━━━━━━━━━━━━━━━`;
  sendMessage(senderId, { text: formattedLyrics }, pageAccessToken);
}