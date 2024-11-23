const axios = require('axios');

module.exports = {
  name: 'wattpad',
  description: 'Search for stories on Wattpad and read selected stories.',
  author: 'developer',
  async execute(senderId, args, pageAccessToken, sendMessage) {
    const apiUrl = `https://joshweb.click/api/wattpad?q=Hell%20University`;

    try {
      // Fetch data from the Wattpad API
      const response = await axios.get(apiUrl);
      const data = response.data;

      // Check if the response is valid and contains results
      if (!data.status || !data.result || data.result.length === 0) {
        return sendMessage(senderId, { text: "No stories found on Wattpad for the given query." }, pageAccessToken);
      }

      // If no specific command given, list all stories with numbers
      if (args.length === 0) {
        let message = "📚 Wattpad Stories:\n\n";
        data.result.forEach((item, index) => {
          message += `${index + 1}. 📖 *${item.title}*\n👤 Author: ${data.author}\n👁️ Reads: ${item.read}\n👍 Votes: ${item.vote}\n🔗 [Read Now](${item.link})\n\n`;
        });
        message += "Reply with 'wattpad read [number]' to choose a story.";
        return sendMessage(senderId, { text: message }, pageAccessToken);
      }

      // If user wants to read a specific story, handle the 'read' command
      const readCommand = args[0].toLowerCase();
      if (readCommand === 'read' && args.length > 1) {
        const storyNumber = parseInt(args[1], 10);
        if (isNaN(storyNumber) || storyNumber < 1 || storyNumber > data.result.length) {
          return sendMessage(senderId, { text: "Invalid story number. Please choose a valid number from the list." }, pageAccessToken);
        }

        const selectedStory = data.result[storyNumber - 1];
        const message = `📖 *${selectedStory.title}*\n👁️ Reads: ${selectedStory.read}\n👍 Votes: ${selectedStory.vote}\n\n🖼️ Thumbnail:\n${selectedStory.thumbnail}\n🔗 [Read the full story here](${selectedStory.link})`;
        return sendMessage(senderId, { text: message }, pageAccessToken);
      }

      // Handle incorrect commands
      return sendMessage(senderId, { text: "Invalid command. Use 'wattpad read [number]' to choose a story." }, pageAccessToken);

    } catch (error) {
      console.error('Error fetching Wattpad data:', error);
      sendMessage(senderId, { text: "An error occurred while fetching Wattpad data." }, pageAccessToken);
    }
  }
};
