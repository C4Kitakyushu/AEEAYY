const axios = require('axios');

module.exports = {
  name: 'mtestcmd',
  description: 'ask to ai using Claude-Sonnet 3.5',
  author: 'developer',
  async execute(senderId, args, pageAccessToken, sendMessage) {
    let prompt = args.join(" ").trim();

    if (!prompt) {
      return sendMessage(senderId, { text: 'Usage: ai [your question]' }, pageAccessToken);
    }

    sendMessage(senderId, { text: '🕧 | 𝗦𝗲𝗮𝗿𝗰𝗵𝗶𝗻𝗴 𝗳𝗼𝗿 𝗮𝗻 𝗮𝗻𝘀𝘄𝗲𝗿, 𝗽𝗹𝗲𝗮𝘀𝗲 𝘄𝗮𝗶𝘁...' }, pageAccessToken);

    // Delay for 2 seconds
    await new Promise(resolve => setTimeout(resolve, 2000));

    const apiUrl = `https://rest-api.joshuaapostol.site/blackbox/model/claude-sonnet-3.5?prompt=${encodeURIComponent(prompt)}`;

    try {
      const response = await axios.get(apiUrl);

      if (response.data && response.data.code === 200 && response.data.message === "success") {
        const generatedText = response.data.answer;
        const responseTime = new Date().toLocaleString('en-US', { timeZone: 'Asia/Manila', hour12: true });

        const message = `𝗠𝗜𝗚𝗢 𝗔𝗦𝗦𝗜𝗦𝗧𝗔𝗡𝗧 🤖\n━━━━━━━━━━━━━━━\n${generatedText}\n━━━━━━━━━━━━━━━\n⏰ 𝗥𝗲𝘀𝗽𝗼𝗻𝗱 𝗧𝗶𝗺𝗲: ${responseTime}`;

        sendMessage(senderId, { text: message }, pageAccessToken);
      } else {
        console.error('API response did not contain expected data:', response.data);
        sendMessage(senderId, { text: '❌ An error occurred while generating the text response. Please try again later.' }, pageAccessToken);
      }
    } catch (error) {
      console.error('Error:', error);
      sendMessage(senderId, { text: `❌ An error occurred while generating the text response. Please try again later. Error details: ${error.message}` }, pageAccessToken);
    }
  }
};
