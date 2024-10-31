const axios = require('axios');

module.exports = {
  name: 'llama',
  description: 'Ask LLaMA 3.2 AI with Vision Instruct',
  author: 'developer',
  async execute(senderId, args, pageAccessToken, sendMessage) {
    let userInput = args.join(" ").trim();

    if (!userInput) {
      return sendMessage(senderId, { text: 'Please provide a valid question.' }, pageAccessToken);
    }

    sendMessage(senderId, { text: '⏳ Searching for an answer, please wait...' }, pageAccessToken);

    // Delay for 2 seconds
    await new Promise(resolve => setTimeout(resolve, 2000));

    const uid = "your-uid"; // Replace with actual UID
    const apiEndpoint = `https://joshweb.click/ai/llama-3.2-11b-vision-instruct?q=${encodeURIComponent(userInput)}&uid=${uid}`;

    try {
      const response = await axios.get(apiEndpoint);

      if (response.data && response.data.result) {
        const generatedText = response.data.result;
        const responseTime = new Date().toLocaleString('en-US', { timeZone: 'Asia/Manila', hour12: true });

        const message = `🤖 LLaMA 3.2 AI\n━━━━━━━━━━━━━━━\n${generatedText}\n━━━━━━━━━━━━━━━\n⏰ Response Time: ${responseTime}`;

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
