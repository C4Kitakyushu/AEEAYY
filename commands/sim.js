const axios = require("axios");

module.exports = {
  name: "sim",
  description: "talk to simsimi",
  author: "developer",
  async execute(senderId, args, pageAccessToken, sendMessage) {
    const content = encodeURIComponent(args.join(" "));
    
    if (!args[0]) {
      return sendMessage(senderId, { text: "Please type a message..." }, pageAccessToken);
    }

    try {
      const apiUrl = `https://simsimi-api-pro.onrender.com/sim?query=${content}`;
      const response = await axios.get(apiUrl);
      const respond = response.data.respond;

      sendMessage(senderId, { text: respond }, pageAccessToken);
    } catch (error) {
      console.error("Error calling SimSimi API:", error);
      sendMessage(senderId, { text: "An error occurred while fetching the data." }, pageAccessToken);
    }
  }
};
