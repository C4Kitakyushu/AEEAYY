const axios = require('axios');

module.exports = {
  name: 'locationInfo',
  description: 'fetches location information based on ip address',
  author: 'developer',
  async execute(senderId, args, pageAccessToken, sendMessage) {
    const ip = args[0] || ''; // Accept IP as an argument, default is empty for current IP.
    try {
      const apiUrl = `https://ipinfo.io/${ip}/json?token=60117f9430a2b5`;
      const response = await axios.get(apiUrl);
      const { ip: ipAddress, city, region, country, loc, org } = response.data;

      const message = `🌐 Here is the location information for ${ip || 'your current IP'}:\n\n` +
                      `- IP: ${ipAddress}\n` +
                      `- City: ${city}\n` +
                      `- Region: ${region}\n` +
                      `- Country: ${country}\n` +
                      `- Location (lat, long): ${loc}\n` +
                      `- Org: ${org}`;

      // Send the response back to the user
      sendMessage(senderId, { text: message }, pageAccessToken);
    } catch (error) {
      console.error('Error fetching location info:', error);
      sendMessage(senderId, { text: 'An error occurred while fetching the location data.' }, pageAccessToken);
    }
  }
};
