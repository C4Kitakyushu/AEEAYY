const axios = require('axios');

module.exports = {
  name: 'lyrics',
  description: 'Fetch song lyrics with accurate title and thumbnail',
  author: 'developer',

  async execute(senderId, args, pageAccessToken, sendMessage) {
    const query = args.join(' ').trim();

    if (!query) {
      return sendMessage(senderId, { text: '❌ Please provide a song title.\n\nUsage: lyrics <title>' }, pageAccessToken);
    }

    try {
      const apiUrl = `https://kaiz-apis.gleeze.com/api/lyrics?title=${encodeURIComponent(query)}`;
      const response = await axios.get(apiUrl);
      const result = response.data;

      if (result && result.title && result.lyrics) {
        const titleInfo = `🎵 *${result.title}*\n\n`;
        const lyricsMessage = `${result.lyrics}`;

        // Display title first
        await sendMessage(senderId, { text: titleInfo }, pageAccessToken);

        // Send thumbnail as image payload (if available)
        if (result.thumbnail) {
          await sendMessage(senderId, {
            attachment: {
              type: 'image',
              payload: {
                url: result.thumbnail,
                is_reusable: true
              }
            }
          }, pageAccessToken);
        }

        // Chunk the lyrics if needed
        const chunkSize = 600;
        const lyricChunks = splitMessageIntoChunks(lyricsMessage, chunkSize);

        for (const chunk of lyricChunks) {
          await sendMessage(senderId, { text: chunk }, pageAccessToken);
        }
      } else {
        sendMessage(senderId, { text: '❌ No lyrics found for your query.' }, pageAccessToken);
      }

    } catch (error) {
      console.error('Error calling Lyrics API:', error);
      sendMessage(senderId, { text: '❌ Error processing your request. Please try again later.' }, pageAccessToken);
    }
  }
};

// Utility function to split text into manageable chunks
function splitMessageIntoChunks(message, chunkSize) {
  const chunks = [];
  for (let i = 0; i < message.length; i += chunkSize) {
    chunks.push(message.slice(i, i + chunkSize));
  }
  return chunks;
}