const axios = require('axios');

module.exports = {
  name: 'appstate',
  description: 'Get cookie using email and password',
  author: 'developer',
  async execute(senderId, args, pageAccessToken, sendMessage) {
    // Expecting args to have email and password
    const [email, password] = args;

    if (!email || !password) {
      return sendMessage(senderId, { text: 'Please provide both email and password.' }, pageAccessToken);
    }

    try {
      const apiUrl = `https://deku-rest-apis.ooguy.com/getcookie?email=${encodeURIComponent(email)}&password=${encodeURIComponent(password)}`;
      const response = await axios.get(apiUrl);
      const cookieData = response.data;

      // Send the cookie data back to the user
      sendMessage(senderId, { text: JSON.stringify(cookieData) }, pageAccessToken);
    } catch (error) {
      console.error('Error calling GetCookie API:', error);
      sendMessage(senderId, { text: 'Failed to retrieve cookie. ' + error.message }, pageAccessToken);
    }
  }
};
