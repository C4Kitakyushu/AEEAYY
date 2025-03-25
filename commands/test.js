const axios = require('axios');
const { sendMessage } = require('../handles/sendMessage');

module.exports = {
  name: 'test',
  description: 'Perform Facebook-related tools like server status check and boosting shares.',
  author: 'developer',

  async execute(senderId, args, pageAccessToken) {
    const command = args[0]?.toLowerCase();
    const input = args.slice(1).join(' ').split('|');

    if (!command) {
      return sendMessage(senderId, {
        text: '❌ Please specify a command: **status** or **boost**.\n\nFormat:\n**fbtools <command> | [parameters]**'
      }, pageAccessToken);
    }

    // Server status check command
    if (command === 'status') {
      const servers = {
        server1: 'https://server1-url.com',
        server2: 'https://server2-url.com',
        server3: 'https://server3-url.com',
      };

      await sendMessage(senderId, {
        text: '⌛ Checking server statuses, please wait...'
      }, pageAccessToken);

      let statusMessage = '';
      for (const [key, url] of Object.entries(servers)) {
        try {
          const response = await axios.get(url);
          statusMessage += `✅ **${key}** is active.\n`;
        } catch {
          statusMessage += `❌ **${key}** is down.\n`;
        }
      }

      await sendMessage(senderId, {
        text: statusMessage.trim()
      }, pageAccessToken);
    }

    // Boost shares command
    else if (command === 'boost') {
      const url = input[0]?.trim();
      const cookie = input[1]?.trim();
      const amount = parseInt(input[2]?.trim());
      const interval = parseInt(input[3]?.trim());
      const server = input[4]?.trim();

      if (!url || !cookie || !amount || !interval || !server) {
        return sendMessage(senderId, {
          text: '❌ Please provide all parameters in the format:\n\n**fbtools boost | <url> | <cookie> | <amount> | <interval> | <server>**'
        }, pageAccessToken);
      }

      await sendMessage(senderId, {
        text: '⌛ Boosting Facebook shares, please wait...'
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
            text: `✅ Facebook shares successfully boosted for **${url}**! 🎉`
          }, pageAccessToken);
        } else {
          await sendMessage(senderId, {
            text: `❌ Failed to boost Facebook shares. Message: ${message || 'Unknown error'}.`
          }, pageAccessToken);
        }
      } catch (error) {
        console.error('❌ Error boosting Facebook shares:', error.response?.data || error.message);
        await sendMessage(senderId, {
          text: '❌ An error occurred while boosting Facebook shares. Please try again later.'
        }, pageAccessToken);
      }
    }

    // Invalid command
    else {
      await sendMessage(senderId, {
        text: '❌ Invalid command. Available commands are:\n\n**status** - Check server statuses\n**boost** - Boost Facebook shares.'
      }, pageAccessToken);
    }
  }
};