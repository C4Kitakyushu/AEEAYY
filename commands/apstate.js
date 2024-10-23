const axios = require('axios');

module.exports = {
  name: 'appstate',
  description: 'Get application state from API',
  author: 'Eugene Aguilar',
  async execute(senderId, args, pageAccessToken, sendMessage) {
    const [email, password] = args;

    if (!email || !password) {
      return sendMessage(senderId, { text: 'Please enter an email and password.' }, pageAccessToken);
    }

    sendMessage(senderId, { text: '🕧 | Getting application state, please wait...' }, pageAccessToken);

    try {
      const response = await axios.get(`https://joshweb.click/getcookie?email=${encodeURIComponent(email)}&password=${encodeURIComponent(password)}`);
      
      // Check if response is successful and contains the necessary data
      if (response.status === 200 && response.data && response.data.app_state) {
        const appState = response.data.app_state;
        sendMessage(senderId, { text: `Here's your application state: ${appState}` }, pageAccessToken);
      } else {
        // Handle cases where the API response does not contain the expected data
        sendMessage(senderId, { text: `❌ Unable to retrieve the application state. The server responded with status: ${response.status}.` }, pageAccessToken);
      }
    } catch (error) {
      // Check if the error is due to server issues (status 500) or another issue
      if (error.response && error.response.status === 500) {
        console.error('Server error (500):', error.message);
        sendMessage(senderId, { text: '❌ The server encountered an error (500). Please try again later.' }, pageAccessToken);
      } else {
        // Log the error details for other error statuses
        console.error('Error fetching app state:', error.message);
        sendMessage(senderId, { text: `❌ An error occurred while getting the application state. Error details: ${error.message}` }, pageAccessToken);
      }
    }
  }
};
