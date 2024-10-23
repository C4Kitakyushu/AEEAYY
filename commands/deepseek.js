const axios = require("axios");

module.exports = {
  name: "deepseek",
  description: "interact with the coder ai",
  author: "developer",
  async execute(senderId, args, pageAccessToken, sendMessage) {
    let userInput = args.join(" ").trim();

    if (!userInput) {
      return sendMessage(senderId, { text: " 𝗣𝗿𝗼𝘃𝗶𝗱𝗲 𝘆𝗼𝘂𝗿 𝗾𝘂𝗲𝘀𝘁𝗶𝗼𝗻 𝘁𝗼 𝗗𝗲𝗲𝗸𝗦𝗲𝗲𝗸 𝗖𝗼𝗱𝗲𝗿..." }, pageAccessToken);
    }

    sendMessage(senderId, { text: "𝗗𝗲𝗲𝗸𝗦𝗲𝗲𝗸𝗖𝗼𝗱𝗲, 𝗔𝗻𝘀𝘄𝗲𝗿𝗶𝗻𝗴 𝘆𝗼𝘂𝗿 𝗾𝘂𝗲𝘀𝘁𝗶𝗼𝗻𝘀 𝗽𝗹𝗲𝗮𝘀𝗲 𝘄𝗮𝗶𝘁..." }, pageAccessToken);

    // Delay for 2 seconds
    await new Promise(resolve => setTimeout(resolve, 2000));

    const apiUrl = `https://joshweb.click/ai/deepseek-coder?q=${encodeURIComponent(userInput)}&uid=100`;

    try {
      const response = await axios.get(apiUrl);

      if (response.data && response.data.result) {
        const answer = response.data.result;
        const responseTime = new Date().toLocaleString('en-US', { timeZone: 'Asia/Manila', hour12: true });

        const message = `𝗗𝗲𝗲𝗽𝗦𝗲𝗲𝗸𝗖𝗼𝗱𝗲𝗿 𝗔𝗜 🤖\n━━━━━━━━━━━━━━━\n${answer}\n━━━━━━━━━━━━━━━\n⏰ 𝗥𝗲𝘀𝗽𝗼𝗻𝘀𝗲 𝗧𝗶𝗺𝗲: ${responseTime}`;

        sendMessage(senderId, { text: message }, pageAccessToken);
      } else {
        console.error("API response did not contain expected data:", response.data);
        sendMessage(senderId, { text: "❌ An error occurred while processing your request." }, pageAccessToken);
      }
    } catch (error) {
      console.error("Error:", error);
      sendMessage(senderId, { text: `❌ An error occurred while processing your request. Error details: ${error.message}` }, pageAccessToken);
    }
  }
};