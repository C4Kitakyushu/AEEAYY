const axios = require('axios');

module.exports = {
  name: 'ipInfo',
  description: 'get information about an ip address',
  author: 'developer',
  async execute(senderId, args, pageAccessToken, sendMessage) {
    // Check if the user provided an IP address
    if (args.length === 0) {
      return sendMessage(senderId, { text: 'Please provide an IP address.' }, pageAccessToken);
    }

    const ip = args[0];
    try {
      const apiUrl = `https://deku-rest-apis.ooguy.com/iplu?ip=${encodeURIComponent(ip)}`;
      const response = await axios.get(apiUrl);
      
      // Assuming the response has relevant fields to send back
      const { country, city, region, isp } = response.data;
      const message = `IP Address: ${ip}\nCountry: ${country}\nCity: ${city}\nRegion: ${region}\nISP: ${isp}`;

      // Send the response back to the user
      sendMessage(senderId, { text: message }, pageAccessToken);
    } catch (error) {
      console.error('Error calling IP API:', error);
      sendMessage(senderId, { text: 'Failed to retrieve IP information. Please try again later.' }, pageAccessToken);
    }
  }
};
