const axios = require('axios');

module.exports = {
  name: 'gemini',
  description: 'Gemini AI text generation',
  author: 'developer',
  async execute(senderId, args, pageAccessToken, sendMessage) {
    const prompt = args.join(" ");

    if (!prompt) {
      return sendMessage(senderId, { text: "Please provide a prompt (e.g., gemini What will my day be like?)." }, pageAccessToken);
    }

    try {
      const apiUrl = `https://rest-api.joshuaapostol.site/gemini?prompt=${encodeURIComponent(prompt)}`;
      const response = await axios.get(apiUrl);

      if (response.data) {
        const geminiResponse = typeof response.data === 'string' ? response.data : response.data.response;

        const message = `🔮 Gemini's Response 🔮\n\n${geminiResponse}`;
        sendMessage(senderId, { text: message }, pageAccessToken);
      } else {
        sendMessage(senderId, { text: `No response from Gemini for the prompt: "${prompt}".` }, pageAccessToken);
      }
    } catch (error) {
      console.error('Error fetching Gemini response:', error);
      sendMessage(senderId, { text: "An error occurred while fetching a response from Gemini." }, pageAccessToken);
    }
  }
};
