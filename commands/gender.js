const axios = require('axios');

module.exports = {
  name: 'gender',
  description: 'Fetches the gender based on the provided name.',
  author: 'Apollo Quiboloy',
  async execute(senderId, args, pageAccessToken, sendMessage) {
    const name = args.join(" ");

    if (!name) {
      return sendMessage(senderId, { text: "🚫 | Please provide a name to check." }, pageAccessToken);
    }

    sendMessage(senderId, { text: "🕗 | Recognizing gender information, please wait..." }, pageAccessToken);

    try {
      const apiUrl = `https://nash-rest-api-production.up.railway.app/gender?name=${encodeURIComponent(name)}`;
      const response = await axios.get(apiUrl);
      const gender = response.data.gender;

      if (!gender) {
        return sendMessage(senderId, { text: `☹ Sorry, I couldn't fetch the gender information for "${name}".` }, pageAccessToken);
      }

      const message = `🧑‍🤝‍🧑 The gender associated with the name "${name}" is: ${gender}.`;

      // Send the gender information
      sendMessage(senderId, { text: message }, pageAccessToken);
    } catch (error) {
      console.error('Error fetching gender information:', error);
      sendMessage(senderId, { text: `❌ An error occurred: ${error.message}` }, pageAccessToken);
    }
  }
};