const axios = require('axios');

module.exports = {
  name: 'iplookup',
  description: 'fetch and send IP lookup details',
  author: 'developer',
  async execute(senderId, args, pageAccessToken, sendMessage) {
    const ip = args.join(" ").trim();

    if (!ip) {
      return sendMessage(senderId, { text: '❌ Please provide an IP address. Example: iplookup <ip>' }, pageAccessToken);
    }

    sendMessage(senderId, { text: '🔍 LOOKING UP IP...' }, pageAccessToken);

    const apiUrl = `https://joshweb.click/iplu?ip=${encodeURIComponent(ip)}`;

    try {
      const response = await axios.get(apiUrl);
      const result = response.data.result;

      if (result.status !== 'success') {
        return sendMessage(senderId, { text: '❌ Error: Unable to retrieve information.' }, pageAccessToken);
      }

      const message = `
🌐 YOUR DATA & INFORMATION :
➜ Continent: ${result.continent} (${result.continentCode})
➜ Country: ${result.country} (${result.countryCode})
➜ Region: ${result.regionName} (${result.region})
➜ City: ${result.city}
➜ Zip: ${result.zip}
➜ Lat/Lon: ${result.lat}, ${result.lon}
➜ Timezone: ${result.timezone} (Offset: ${result.offset})
➜ Currency: ${result.currency}
➜ ISP: ${result.isp}
➜ Organization: ${result.org}
➜ AS: ${result.as} (${result.asname})
➜ Reverse: ${result.reverse}
➜ Mobile: ${result.mobile ? 'Yes' : 'No'}
➜ Proxy: ${result.proxy ? 'Yes' : 'No'}
➜ Hosting: ${result.hosting ? 'Yes' : 'No'}
➜ Query: ${result.query}
      `;

      sendMessage(senderId, { text: message.trim() }, pageAccessToken);

    } catch (error) {
      console.error('Error:', error);
      sendMessage(senderId, { text: '❌ An error occurred while fetching the response.' }, pageAccessToken);
    }
  }
};
