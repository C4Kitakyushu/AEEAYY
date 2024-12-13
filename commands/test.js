const axios = require('axios');

module.exports = {
  name: 'test',
  description: 'Search videos based on YouTube',
  author: 'Dale Mekumi', 
  usage: 'youtube <search query>',
  async execute(senderId, args, pageAccessToken, sendMessage) {

    const searchQuery = args.join(' ');
    if (!searchQuery) {
      return sendMessage(senderId, { text: "❌ Please provide a video title or keyword." }, pageAccessToken);
    }

    try {
      // Step 1: Search for videos
      const searchResponse = await axios.get(`https://apis-markdevs69v2.onrender.com/new/api/youtube?q=${encodeURIComponent(searchQuery)}`);
      const video = searchResponse.data.data.videos[0]; // Get the first video

      if (!video) {
        return sendMessage(senderId, { text: "❌ No videos found for the given search query." }, pageAccessToken);
      }

      const title = video.title;
      const url = video.url;

      // Step 2: Send initial message with video details
      sendMessage(senderId, { 
        text: `📃 Video Title: ${title}\n🔗 YouTube URL: ${url}\n⌛ Downloading video, please wait...` 
      }, pageAccessToken);

      // Step 3: Fetch video download link
      const downloadResponse = await axios.get(`https://apis-markdevs69v2.onrender.com/new/api/youtube/download?url=${encodeURIComponent(url)}`);
      const downloadLink = downloadResponse.data.response;

      // Step 4: Send the downloadable video link
      const videoMessage = {
        attachment: {
          type: 'video',
          payload: {
            url: downloadLink,
          },
        },
      };

      await sendMessage(senderId, videoMessage, pageAccessToken);

    } catch (error) {
      console.error(error);
      sendMessage(senderId, { text: `❌ An error occurred: ${error.message}` }, pageAccessToken);
    }
  }
};
