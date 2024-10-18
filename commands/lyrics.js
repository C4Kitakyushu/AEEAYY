const axios = require('axios');

module.exports = {
  name: 'lyrics',
  description: 'fetches lyrics for a given song.',
  author: 'dev',
  async execute(senderId, args, pageAccessToken, sendMessage) {
    const songName = args.join(" ").trim();
    
    if (!songName) {
      return sendMessage(senderId, { text: "Please provide a song name!" }, pageAccessToken);
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
    url: (songName) => `https://lyrist.vercel.app/api/${encodeURIComponent(songName)}`,
  },
  {
    name: "Backup API 1",
    url: (songName) => `https://samirxpikachu.onrender.com/lyrics?query=${encodeURIComponent(songName)}`,
  },
  {
    name: "Backup API 2",
    url: (songName) => `https://markdevs-last-api.onrender.com/search/lyrics?q=${encodeURIComponent(songName)}`,
  },
  {
    name: "Backup API 3",
    url: (artist, song) => `https://openapi-idk8.onrender.com/lyrical/find?artist=${encodeURIComponent(artist)}&song=${encodeURIComponent(song)}`,
    requiresArtistAndSong: true,
  },
];

async function fetchLyrics(sendMessage, senderId, pageAccessToken, songName, attempt) {
  if (attempt >= apiConfigs.length) {
    sendMessage(senderId, { text: `Sorry, lyrics for "${songName}" not found in all APIs!` }, pageAccessToken);
    return;
  }

  const { name, url, requiresArtistAndSong } = apiConfigs[attempt];
  let apiUrl;

  try {
    if (requiresArtistAndSong) {
      const [artist, title] = songName.split('-').map(s => s.trim());
      if (!artist || !title) {
        throw new Error("Invalid format for artist and song title");
      }
      apiUrl = url(artist, title);
    } else {
      apiUrl = url(songName);
    }

    const response = await axios.get(apiUrl);
    const { lyrics, title, artist } = response.data;

    if (!lyrics) {
      throw new Error("Lyrics not found");
    }

    sendFormattedLyrics(sendMessage, senderId, pageAccessToken, title, artist, lyrics);
  } catch (error) {
    console.error(`Error fetching lyrics from ${name} for "${songName}":`, error.message || error);
    await fetchLyrics(sendMessage, senderId, pageAccessToken, songName, attempt + 1);
  }
}

function sendFormattedLyrics(sendMessage, senderId, pageAccessToken, title, artist, lyrics) {
  const formattedLyrics = `🎧 | Title: ${title}\n🎤 | Artist: ${artist}\n━━━━━━━━━━━━━━━━\n${lyrics}\n━━━━━━━━━━━━━━━━`;
  sendMessage(senderId, { text: formattedLyrics }, pageAccessToken);
}