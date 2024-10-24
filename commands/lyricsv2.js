const axios = require('axios');

module.exports = {
  name: 'lyricsv2',
  description: 'fetches lyrics for a given song.',
  author: 'developer',
  async execute(senderId, args, pageAccessToken, sendMessage) {
    const songName = args.join(" ").trim();

    if (!songName) {
      return sendMessage(senderId, { text: "Missing song title for the lyrics command!" }, pageAccessToken);
    }

    try {
      await fetchLyrics(sendMessage, senderId, pageAccessToken, songName, 0);
    } catch (error) {
      console.error(`Error fetching lyrics for "${songName}":`, error);
      sendMessage(senderId, { text: `Sorry, there was an error getting the lyrics for "${songName}"!` }, pageAccessToken);
    }
  },
};

const apiConfigs = [
  {
    name: "Primary API",
    url: (songName) => `uhttps://markdevs-last-api-2epw.onrender.com/search/lyrics?q=${encodeURIComponent(songName)}`,
  },
  // Add additional APIs if needed here...
];

async function fetchLyrics(sendMessage, senderId, pageAccessToken, songName, attempt) {
  if (attempt >= apiConfigs.length) {
    sendMessage(senderId, { text: `Sorry, lyrics for "${songName}" not found in all APIs!` }, pageAccessToken);
    return;
  }

  const { name, url } = apiConfigs[attempt];
  const apiUrl = url(songName);

  try {
    const response = await axios.get(apiUrl);
    const { lyrics, title, artist, image } = response.data.result;

    if (!lyrics || !title || !artist || !image) {
      throw new Error("Lyrics not found");
    }

    sendFormattedLyrics(sendMessage, senderId, pageAccessToken, title, artist, lyrics, image);
  } catch (error) {
    console.error(`Error fetching lyrics from ${name} for "${songName}":`, error.message || error);
    await fetchLyrics(sendMessage, senderId, pageAccessToken, songName, attempt + 1);
  }
}

function sendFormattedLyrics(sendMessage, senderId, pageAccessToken, title, artist, lyrics, image) {
  const formattedLyrics = `🎧 | Title: ${title}\n🎤 | Artist: ${artist}\n━━━━━━━━━━━━━━━━\n${lyrics}\n━━━━━━━━━━━━━━━━`;
  sendMessage(senderId, { text: formattedLyrics, attachment: image }, pageAccessToken);
}
