const axios = require('axios');
const { sendMessage } = require('../handles/sendMessage');

module.exports = {
  name: 'email',
  description: 'generate a temporary email and retrieve confirmation codes automatically.',
  author: 'developer',

  async execute(akimitsu, args, metallic) { // Changed parameters here
    try {
      const { data: createResponse } = await axios.get('https://nethwieginedev.vercel.app/tempmail2/create');
      if (!createResponse.status || !createResponse.address) {
        return sendMessage(akimitsu, { text: '❌ Failed to generate a temporary email. Please try again.' }, metallic); // Updated variables here
      }

      const tempEmail = createResponse.address;

      await sendMessage(akimitsu, { text: tempEmail }, metallic); // Updated variables here

      const checkInterval = setInterval(async () => {
        try {
          const { data: checkResponse } = await axios.get(`https://nethwieginedev.vercel.app/tempmail2/get/?email=${encodeURIComponent(tempEmail)}`);
          if (checkResponse.status && checkResponse.messages.length > 0) {
            const latestMessage = checkResponse.messages[0];

            if (latestMessage) {
              const fullMessage = `📧 From: ${latestMessage.from}\n📩 Subject: ${latestMessage.subject}\n📅 Date: ${latestMessage.date}\n\n🗳️ Message:\n${latestMessage.message}`;

              await sendMessage(akimitsu, { text: fullMessage }, metallic); // Updated variables here
              clearInterval(checkInterval);
            }
          }
        } catch (error) {
          console.error('Error checking email:', error);
        }
      }, 10000);

    } catch (error) {
      console.error('❌ Error generating email:', error);
      await sendMessage(akimitsu, { text: 'An error occurred while creating the temporary email. Please try again.' }, metallic); // Updated variables here
    }
  }
};
