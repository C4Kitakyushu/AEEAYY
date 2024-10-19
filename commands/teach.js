const axios = require("axios");

module.exports = {
  name: "teach",
  description: "teach simsimi",
  author: "developer",
  async execute(senderId, args, pageAccessToken, sendMessage) {
    try {
      const text = args.join(" ");
      const text1 = text.substr(0, text.indexOf(' => '));
      const text2 = text.split(" => ").pop();

      if (!text1 || !text2) {
        return sendMessage(senderId, { text: "Usage: Teach hi => hello" }, pageAccessToken);
      }

      const apiUrl = `https://simsimi-api-pro.onrender.com/teach?ask=${encodeURIComponent(text1)}&ans=${encodeURIComponent(text2)}`;
      const response = await axios.get(apiUrl);

      sendMessage(senderId, {
        text: `Your ask: ${text1}\nSim respond: ${text2}\nSuccessfully taught SimSimi!`
      }, pageAccessToken);
    } catch (error) {
      console.error("An error occurred:", error);
      sendMessage(senderId, {
        text: "Please provide both a question and an answer.\nExample: Teach hi => hello"
      }, pageAccessToken);
    }
  }
};
