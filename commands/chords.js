const axios = require('axios');

module.exports = {
  name: 'chords',
  description: 'fetch song chords',
  author: 'developer',

  async execute(senderId, args, pageAccessToken, sendMessage) {
    const query = args.join(' ');
    try {
      const apiUrl = `https://markdevs-last-api-2epw.onrender.com/search/chords?q=${encodeURIComponent(query)}`;
      const response = await axios.get(apiUrl);
      const result = response.data.chord;

      if (result && result.chords) {
        const chordsMessage = `Title: ${result.title}\nArtist: ${result.artist}\nKey: ${result.key}\n\n${result.chords}`;

        // Split the response into chunks if it exceeds 2000 characters
        const maxMessageLength = 2000;
        if (chordsMessage.length > maxMessageLength) {
          const messages = splitMessageIntoChunks(chordsMessage, maxMessageLength);
          for (const message of messages) {
            sendMessage(senderId, { text: message }, pageAccessToken);
          }
        } else {
          sendMessage(senderId, { text: chordsMessage }, pageAccessToken);
        }

        if (result.url) {
          sendMessage(senderId, { text: `You can also view the chords here: ${result.url}` }, pageAccessToken);
        }
      } else {
        console.error('Error: No chords found in the response.');
        sendMessage(senderId, { text: 'Sorry, no chords were found for your query.' }, pageAccessToken);
      }
    } catch (error) {
      console.error('Error calling Chords API:', error);
      sendMessage(senderId, { text: 'Sorry, there was an error processing your request.' }, pageAccessToken);
    }
  }
};

function splitMessageIntoChunks(message, chunkSize) {
  const chunks = [];
  for (let i = 0; i < message.length; i += chunkSize) {
    chunks.push(message.slice(i, i + chunkSize));
  }
  return chunks;
}
