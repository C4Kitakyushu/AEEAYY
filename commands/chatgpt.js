const axios = require('axios');

module.exports = {
  name: 'chatgpt',
  description: 'Ask a question to ChatGPT model',
  author: 'developer',
  async execute(senderId, args, pageAccessToken, sendMessage) {
    let userInput = args.join(" ").trim();

    if (!userInput) {
      return sendMessage(senderId, { text: '𝗣𝗹𝗲𝗮𝘀𝗲 𝗽𝗿𝗼𝘃𝗶𝗱𝗲 𝗮 𝘃𝗮𝗹𝗶𝗱 𝗾𝘂𝗲𝘀𝘁𝗶𝗼𝗻.' }, pageAccessToken);
    }

    sendMessage(senderId, { text: '🕧 | 𝗦𝗲𝗮𝗿𝗰𝗵𝗶𝗻𝗴 𝗳𝗼𝗿 𝗮𝗻 𝗮𝗻𝘀𝘄𝗲𝗿, 𝗽𝗹𝗲𝗮𝘀𝗲 𝘄𝗮𝗶𝘁...' }, pageAccessToken);

    // Delay for 2 seconds
    await new Promise(resolve => setTimeout(resolve, 2000));

    const apiUrl = `https://mekumi-rest-api.onrender.com/api/chatgpt?question=${encodeURIComponent(userInput)}`;

    try {
      const response = await axios.get(apiUrl);

      if (response.data && response.data.answer) {
        const generatedText = response.data.answer;
        const responseTime = new Date().toLocaleString('en-US', { timeZone: 'Asia/Manila', hour12: true });

        const message = `𝗖𝗵𝗮𝘁𝗚𝗣𝗧 𝗠𝗢𝗗𝗘𝗟 🤖\n━━━━━━━━━━━━━━━\n${generatedText}\n━━━━━━━━━━━━━━━\n⏰ 𝗥𝗲𝘀𝗽𝗼𝗻𝗱 𝗧𝗶𝗺𝗲: ${responseTime}`;

        sendMessage(senderId, { text: message }, pageAccessToken);
      } else {
        console.error('API response did not contain expected data:', response.data);
        sendMessage(senderId, { text: '❌ An error occurred while generating the text response. Please try again later.' }, pageAccessToken);
      }
    } catch (error) {
      console.error('Error calling ChatGPT API:', error.message);
      sendMessage(senderId, { text: `❌ An error occurred while generating the text response. Please try again later. Error details: ${error.message}` }, pageAccessToken);
    }
  }
};
