const axios = require('axios');

module.exports = {
  name: 'wattpad',
  description: 'Search for Wattpad stories and read specific chapters.',
  author: 'developer',
  async execute(senderId, args, pageAccessToken, sendMessage) {
    const searchQuery = args.join(" ");

    if (!searchQuery) {
      return sendMessage(senderId, { text: "Please provide a search query for Wattpad." }, pageAccessToken);
    }

    try {
      // Fetch search results from the Wattpad API
      const apiUrl = `https://joshweb.click/api/wattpad?q=${encodeURIComponent(searchQuery)}`;
      const response = await axios.get(apiUrl);
      const data = response.data;

      if (!data.status || !data.result || data.result.length === 0) {
        return sendMessage(senderId, { text: "No Wattpad stories found for the given query." }, pageAccessToken);
      }

      // Generate search results message
      let message = `🔍 Wattpad Search Results for: "${searchQuery}"\n\n`;
      data.result.forEach((item, index) => {
        message += `📖 ${index + 1}. *${item.title}*\n👤 Author: ${data.author}\n👀 Reads: ${item.read}\n⭐ Votes: ${item.vote}\n🔗 [Read Here](${item.link})\n🖼️ Thumbnail: ${item.thumbnail}\n\n`;
      });
      message += "Please choose a number (e.g., 'Wattpad read 1') to start reading.";

      // Send search results
      sendMessage(senderId, { text: message }, pageAccessToken);

      // Wait for the user's selection
    } catch (error) {
      console.error('Error fetching Wattpad data:', error);
      sendMessage(senderId, { text: "An error occurred while fetching Wattpad data." }, pageAccessToken);
    }
  },

  async readStory(senderId, storyNumber, pageAccessToken, sendMessage) {
    try {
      // Assume we have a way to store the search results temporarily
      const selectedStory = searchResults[storyNumber - 1]; // Retrieve selected story
      if (!selectedStory) {
        return sendMessage(senderId, { text: "Invalid selection. Please choose a valid number." }, pageAccessToken);
      }

      // Fetch the story content (assuming a way to get chapters)
      const storyApiUrl = `https://joshweb.click/api/wattpad_story?story_id=${selectedStory.link.split('/').pop()}`;
      const response = await axios.get(storyApiUrl);
      const storyData = response.data;

      if (!storyData || !storyData.chapters || storyData.chapters.length === 0) {
        return sendMessage(senderId, { text: "No chapters available for this story." }, pageAccessToken);
      }

      // Display the chapter options
      let chapterMessage = `📚 Chapters in "${selectedStory.title}":\n\n`;
      storyData.chapters.forEach((chapter, index) => {
        chapterMessage += `📖 Chapter ${index + 1}: ${chapter.title}\n`;
      });
      chapterMessage += "Please choose a chapter number (e.g., 'Wattpad read 1 chapter 1') to read.";

      sendMessage(senderId, { text: chapterMessage }, pageAccessToken);
    } catch (error) {
      console.error('Error fetching story data:', error);
      sendMessage(senderId, { text: "An error occurred while fetching story data." }, pageAccessToken);
    }
  },

  async readChapter(senderId, storyNumber, chapterNumber, pageAccessToken, sendMessage) {
    try {
      // Assume we have a way to store the search results and chapter content temporarily
      const selectedStory = searchResults[storyNumber - 1];
      if (!selectedStory) {
        return sendMessage(senderId, { text: "Invalid story selection. Please choose a valid number." }, pageAccessToken);
      }

      // Fetch the selected chapter content
      const chapterApiUrl = `https://joshweb.click/api/wattpad_chapter?story_id=${selectedStory.link.split('/').pop()}&chapter=${chapterNumber}`;
      const response = await axios.get(chapterApiUrl);
      const chapterData = response.data;

      if (!chapterData || !chapterData.content) {
        return sendMessage(senderId, { text: "Chapter not available. Please choose another chapter." }, pageAccessToken);
      }

      // Send chapter content
      sendMessage(senderId, { text: `📖 Chapter ${chapterNumber} of "${selectedStory.title}":\n\n${chapterData.content}` }, pageAccessToken);
    } catch (error) {
      console.error('Error fetching chapter data:', error);
      sendMessage(senderId, { text: "An error occurred while fetching chapter data." }, pageAccessToken);
    }
  }
};
