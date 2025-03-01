const axios = require('axios');
const { sendMessage } = require('../handles/sendMessage');

module.exports = {
  name: 'test',
  description: 'Generate a temporary email and retrieve confirmation codes automatically.',
  author: 'chilli',

  async execute(kupal, args, chilli) {
    try {
      // Generate a temporary email
      const { data: createResponse } = await axios.get('https://zaikyoo-api.onrender.com/api/tmail1-gen');
      if (!createResponse.status || !createResponse.email) {
        return sendMessage(kupal, { text: 'Failed to generate a temporary email. Please try again.' }, chilli);
      }

      const tempEmail = createResponse.email;

      await sendMessage(kupal, { text: `Temporary Email: ${tempEmail}` }, chilli);

      // Check for incoming emails periodically
      const checkInterval = setInterval(async () => {
        try {
          const { data: checkResponse } = await axios.get(`https://zaikyoo-api.onrender.com/api/tmail1-inbox?email=${encodeURIComponent(tempEmail)}`);
          
          if (checkResponse.status && checkResponse.messages.length > 0) {
            const latestMessage = checkResponse.messages[0];

            if (latestMessage) {
              const fullMessage = `From: ${latestMessage.from}\nSubject: ${latestMessage.subject}\nDate: ${latestMessage.date}\n\nMessage:\n${latestMessage.message}`;

              await sendMessage(kupal, { text: fullMessage }, chilli);
              clearInterval(checkInterval); // Stop checking once a message is received
            }
          }
        } catch (error) {
          console.error('Error checking email:', error);
        }
      }, 10000); // Check every 10 seconds

    } catch (error) {
      console.error('Error generating temp email:', error);
      await sendMessage(kupal, { text: 'An error occurred while creating the temporary email. Please try again.' }, chilli);
    }
  }
};