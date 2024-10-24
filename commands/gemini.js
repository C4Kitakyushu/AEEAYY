const axios = require('axios');

module.exports = {
  name: 'gemini',
  description: 'Gemini AI text',
  author: 'developer',
  async execute(senderId, args, pageAccessToken, sendMessage) {
    let userInput = args.join(" ").trim();

    if (!userInput) {
      return sendMessage(senderId, { text: '𝗣𝗹𝗲𝗮𝘀𝗲 𝗽𝗿𝗼𝘃𝗶𝗱𝗲 𝗮 𝘃𝗮𝗹𝗶𝗱 𝗾𝘂𝗲𝘀𝘁𝗶𝗼𝗻.' }, pageAccessToken);
    }

    sendMessage(senderId, { text: '🔮 𝗣𝗹𝗲𝗮𝘀𝗲 𝗪𝗮𝗶𝘁, 𝗚𝗲𝗺𝗶𝗻𝗶 𝗶𝘀 𝗥𝗲𝘀𝗽𝗼𝗻𝗱𝗶𝗻𝗴...' }, pageAccessToken);

    // Delay for 2 seconds
    await new Promise(resolve => setTimeout(resolve, 2000));

    const apiUrl = `https://rest-api.joshuaapostol.site/gemini?prompt=${encodeURIComponent(userInput)}`;

    try {
      const response = await axios.get(apiUrl);

      if (response.data) {
        const geminiResponse = typeof response.data === 'string' ? response.data : response.data.response;
        const responseTime = new Date().toLocaleString('en-US', { timeZone: 'Asia/Manila', hour12: true });

        const message = `🔮 𝗚𝗲𝗺𝗶𝗻𝗶'𝘀 𝗥𝗲𝘀𝗽𝗼𝗻𝘀𝗲 🔮\n━━━━━━━━━━━━━━━\n${geminiResponse}\n━━━━━━━━━━━━━━━\n⏰ 𝗥𝗲𝘀𝗽𝗼𝗻𝗱 𝗧𝗶𝗺𝗲: ${responseTime}`;

        sendMessage(senderId, { text: message }, pageAccessToken);
      } else {
        console.error('API response did not contain expected data:', response.data);
        sendMessage(senderId, { text: '❌ An error occurred while generating the text response. Please try again later.' }, pageAccessToken);
      }
    } catch (error) {
      console.error('Error:', error);
      sendMessage(senderId, { text: `❌ An error occurred while generating the text response. Please try again later. Error details: ${error.message
}` }, pageAccessToken);
    }
  }
};
