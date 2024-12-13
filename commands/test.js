const axios = require('axios');

module.exports = {
  name: 'weather',
  description: 'Fetch and display weather information',
  author: 'developer',
  async execute(senderId, args, pageAccessToken, sendMessage) {
    try {
      // Define the API URL
      const apiUrl = 'https://ccprojectapis.ddns.net/api/weather';
      const response = await axios.get(apiUrl);
      const data = response.data;

      // Extract key parameters from the API response
      const synopsis = data.synopsis || 'No synopsis available.';
      const issuedAt = data.issuedAt || 'No issuance time provided.';
      const temperatureMax = data.temperature?.max?.value || 'N/A';
      const temperatureMaxTime = data.temperature?.max?.time || 'N/A';
      const temperatureMin = data.temperature?.min?.value || 'N/A';
      const temperatureMinTime = data.temperature?.min?.time || 'N/A';
      const humidityMax = data.humidity?.max?.value || 'N/A';
      const humidityMaxTime = data.humidity?.max?.time || 'N/A';
      const humidityMin = data.humidity?.min?.value || 'N/A';
      const humidityMinTime = data.humidity?.min?.time || 'N/A';

      // Construct the message to send
      const weatherMessage = `
🌤️ **Weather Update** 🌤️
- **Synopsis:** ${synopsis}
- **Issued At:** ${issuedAt}

🌡️ **Temperature:**
  - Max: ${temperatureMax} at ${temperatureMaxTime}
  - Min: ${temperatureMin} at ${temperatureMinTime}

💧 **Humidity:**
  - Max: ${humidityMax} at ${humidityMaxTime}
  - Min: ${humidityMin} at ${humidityMinTime}
      `.trim();

      // Send the message
      sendMessage(senderId, { text: weatherMessage }, pageAccessToken);
    } catch (error) {
      console.error('Error calling weather API:', error);
      sendMessage(senderId, { text: 'Sorry, there was an error fetching the weather data.' }, pageAccessToken);
    }
  }
};
