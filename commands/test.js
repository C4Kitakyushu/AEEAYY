const axios = require('axios');
const { sendMessage } = require('../handles/sendMessage');

module.exports = {
  name: 'test',
  description: 'Check server statuses and handle share boosts.',
  author: 'developer',

  async execute(senderId, args, pageAccessToken) {
    const command = args[0]?.toLowerCase();

    if (!command) {
      return sendMessage(senderId, {
        text: '❌ Please specify a command: **status** or **boost**.\n\nFormat:\n**serverAndBoostTools <command> | [parameters]**'
      }, pageAccessToken);
    }

    // Check server statuses
    if (command === 'status') {
      const serverUrls = {
        server1: 'https://server2-u8y4.onrender.com',
        server2: 'https://burat-rvhg.onrender.com',
        server3: 'https://server1-qmqz.onrender.com',
      };

      await sendMessage(senderId, {
        text: '⌛ Checking server statuses, please wait...'
      }, pageAccessToken);

      let statusMessage = '';
      for (const [key, url] of Object.entries(serverUrls)) {
        try {
          const response = await axios.get(url);
          if (response.status === 200) {
            statusMessage += `✅ **${key}** is active.\n`;
          } else {
            statusMessage += `❌ **${key}** is down.\n`;
          }
        } catch {
          statusMessage += `❌ **${key}** is down.\n`;
        }
      }

      await sendMessage(senderId, {
        text: statusMessage.trim()
      }, pageAccessToken);
    }

    // Handle boosting shares
    else if (command === 'boost') {
      const input = args.join(' ').split('|');
      const url = input[0]?.trim();
      const cookie = input[1]?.trim();
      const amount = parseInt(input[2]?.trim());
      const interval = parseInt(input[3]?.trim());
      const server = input[4]?.trim();

      if (!url || !cookie || !amount || !interval || !server) {
        return sendMessage(senderId, {
          text: '❌ Please provide all parameters in the format:\n\n**boost | <url> | <cookie> | <amount> | <interval> | <server>**'
        }, pageAccessToken);
      }

      await sendMessage(senderId, {
        text: '⌛ Boosting shares, please wait...'
      }, pageAccessToken);

      try {
        const apiUrl = `${server}/api/submit`;
        const response = await axios.post(apiUrl, {
          url,
          cookie,
          amount,
          interval
        }, {
          headers: { 'Content-Type': 'application/json' }
        });

        const { status, message } = response.data;

        if (status === 'success') {
          await sendMessage(senderId, {
            text: `✅ Shares successfully boosted for **${url}**!`
          }, pageAccessToken);
        } else {
          await sendMessage(senderId, {
            text: `❌ Failed to boost shares. Message: ${message || 'Unknown error'}.`
          }, pageAccessToken);
        }
      } catch (error) {
        console.error('❌ Error boosting shares:', error.response?.data || error.message);
        await sendMessage(senderId, {
          text: '❌ An error occurred while boosting shares. Please try again later.'
        }, pageAccessToken);
      }
    }

    // Invalid command
    else {
      await sendMessage(senderId, {
        text: '❌ Invalid command. Available commands are:\n\n**status** - Check server statuses.\n**boost** - Boost shares.'
      }, pageAccessToken);
    }
  }
};