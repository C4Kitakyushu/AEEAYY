const axios = require('axios');
const { sendMessage } = require('../handles/sendMessage');
const fs = require('fs');
const path = require('path');

const token = fs.readFileSync('token.txt', 'utf8');

module.exports = {
  name: 'soundcloud',
  description: 'soundcloud [ track name ]',
  usage: '-soundcloud [track name]',
  author: 'developer',

  async execute(senderId, args) {
    const pageAccessToken = token;

    if (!Array.isArray(args) || args.length === 0) {
      return await sendMessage(senderId, { text: 'Error: Missing track name!' }, pageAccessToken);
    }

    const query = args.join(' ').trim();
    const apiUrl = `https://betadash-search-download.vercel.app/sc?search=${encodeURIComponent(query)}`;

    try {
      const response = await axios.get(apiUrl, { responseType: 'arraybuffer' });

      if (response && response.data) {
        // Save the audio file locally
        const audioPath = path.resolve(__dirname, `../temp/${query}.mp3`);
        fs.writeFileSync(audioPath, response.data);

        // Send the caption first
        await sendMessage(senderId, { text: `🎵 Now playing: ${query}` }, pageAccessToken);

        // Send the audio file directly
        await sendAudio(senderId, audioPath, pageAccessToken);

        // Delete the temporary file after sending
        fs.unlinkSync(audioPath);
      } else {
        await sendMessage(senderId, { text: 'Error: Unable to find or play the track.' }, pageAccessToken);
      }
    } catch (error) {
      console.error('Error fetching SoundCloud track:', error);
      await sendMessage(senderId, { text: 'Error: Unable to process your request.' }, pageAccessToken);
    }
  },
};

// Function to send the audio file directly
async function sendAudio(senderId, filePath, pageAccessToken) {
  try {
    const formData = new FormData();
    formData.append('filedata', fs.createReadStream(filePath));

    const response = await axios.post(
      `https://graph.facebook.com/v14.0/me/messages?access_token=${pageAccessToken}`,
      {
        recipient: { id: senderId },
        message: {
          attachment: {
            type: 'audio',
            payload: {},
          },
        },
        filedata: formData,
      },
      {
        headers: formData.getHeaders(),
      }
    );

    if (response.data.error) {
      console.error('Error sending audio:', response.data.error);
      await sendMessage(senderId, { text: 'Error: Unable to send the audio file.' }, pageAccessToken);
    }
  } catch (error) {
    console.error('Error uploading audio file:', error);
    await sendMessage(senderId, { text: 'Error: Failed to send audio.' }, pageAccessToken);
  }
}