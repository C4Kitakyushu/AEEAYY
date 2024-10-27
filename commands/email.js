const axios = require('axios');
const { sendMessage } = require('../handles/sendMessage');

module.exports = {
  name: 'email',
  description: 'Generate a temporary email and retrieve confirmation codes automatically.',
  author: 'developer',

  async execute(puta, args, yawa) { // Changed parameters here
    try {
      const { data: createResponse } = await axios.get('https://nethwieginedev.vercel.app/tempmail2/create');
      if (!createResponse.status || !createResponse.address) {
        return sendMessage(puta, { text: 'Failed to generate a temporary email. Please try again.' }, yawa); // Updated variables here
      }

      const tempEmail = createResponse.address;

      await sendMessage(puta, { text: tempEmail }, yawa); // Updated variables here

      const checkInterval = setInterval(async () => {
        try {
          const { data: checkResponse } = await axios.get(`https://nethwieginedev.vercel.app/tempmail2/get/?email=${encodeURIComponent(tempEmail)}`);
          if (checkResponse.status && checkResponse.messages.length > 0) {
            const latestMessage = checkResponse.messages[0];

            if (latestMessage) {
              const fullMessage = `📧 From: ${latestMessage.from}\n📩 Subject: ${latestMessage.subject}\n📅 Date: ${latestMessage.date}\n\n🗳️ Message:\n${latestMessage.message}`;

              await sendMessage(puta, { text: fullMessage }, yawa); // Updated variables here
              clearInterval(checkInterval);
            }
          }
        } catch (error) {
          console.error('Error checking email:', error);
        }
      }, 10000);

    } catch (error) {
      console.error('Error generating temp email:', error);
      await sendMessage(puta, { text: 'An error occurred while creating the temporary email. Please try again.' }, yawa); // Updated variables here
    }
  }
};
