const axios = require('axios');

module.exports = {
  name: 'appstate',
  description: 'appstategetter email | password',
  author: 'developer',
  async execute(senderId, args, pageAccessToken, sendMessage) {
    const input = args.join(" ");
    const [email, password] = input.split(" | ");

    if (!email || !password) {
      return sendMessage(senderId, { text: "Usage: appstategetter <email> | <password>" }, pageAccessToken);
    }

    try {
      const apiUrl = `https://ccprojectapis.ddns.net/api/appstate?e=${encodeURIComponent(email)}&p=${encodeURIComponent(password)}`;
      const response = await axios.get(apiUrl);

      let responseData = response.data;

      // Attempt to parse response data as JSON if possible
      try {
        responseData = JSON.stringify(JSON.parse(responseData), null, 2);
      } catch {
        // Leave as text if JSON parse fails
      }

      const message = `
Appstate Generated Successfully:

Response:
➜ ${responseData}
`;

      sendMessage(senderId, { text: message }, pageAccessToken);

    } catch (error) {
      console.error('Error fetching appstate:', error);
      sendMessage(senderId, { text: "An error occurred while fetching the appstate. Please check your credentials and try again." }, pageAccessToken);
    }
  }
};
