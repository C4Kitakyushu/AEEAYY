const axios = require('axios');

module.exports = {
  name: 'spamshare',
  description: 'spamshare',
  author: 'developer',
  async execute(senderId, args, pageAccessToken, sendMessage) {
    // Split the arguments using " | "
    const parameters = args.join(' ').split(' | ');

    // Destructure the parameters
    const [appstate | pogiUrl | quantity | delay] = parameters;

    // Check for required parameters
    if (!appstate || !pogiUrl || !quantity || !delay) {
      return sendMessage(senderId, { text: 'Please provide all required parameters: appstate | url | quantity | delay.' }, pageAccessToken);
    }

    const apiUrl = `https://rest-api.joshuaapostol.site/spamshare?state=${appstate}&url=${pogiUrl}&quantity=${quantity}&delay=${delay}`;

    try {
      const response = await axios.get(apiUrl);
      const result = response.data;

      // Send the response back to the user
      sendMessage(senderId, { text: JSON.stringify(result, null, 2) }, pageAccessToken);
    } catch (error) {
      console.error('Error:', error);
      sendMessage(senderId, { text: error.message }, pageAccessToken);
    }
  }
};
