const axios = require('axios');

module.exports = {
  name: 'test',
  description: 'Get weather information for a specified location.',
  author: 'developer',

  async execute(senderId, args, pageAccessToken, sendMessage) {
    const query = args.join(' ').trim();

    if (!query) {
      return sendMessage(senderId, { text: '❌ Please provide a location.\n\nUsage: weather <location>' }, pageAccessToken);
    }

    try {
      const apiUrl = `https://kaiz-apis.gleeze.com/api/weather?q=${encodeURIComponent(query)}`;
      const response = await axios.get(apiUrl);

      // Corrected data structure based on the API response
      const data = response.data.op;

      if (data && data.location) {
        const location = data.location.name;
        const currentWeather = data.current;
        const forecast = data.forecast;

        let weatherMessage = `🌍 *Weather Report for ${location}*\n\n`;
        weatherMessage += `🌡️ Temperature: ${currentWeather.temperature}°C\n`;
        weatherMessage += `💨 Wind: ${currentWeather.wind}\n`;
        weatherMessage += `🌫️ Humidity: ${currentWeather.humidity}%\n`;
        weatherMessage += `📅 Observation Time: ${currentWeather.observationtime}\n\n`;

        // Forecast Summary
        weatherMessage += `📋 *3-Day Forecast*\n`;
        forecast.slice(0, 3).forEach(day => {
          weatherMessage += `📆 ${day.shortday} - ${day.skytextday}, ${day.high}°C / ${day.low}°C\n`;
        });

        // Send main weather info
        await sendMessage(senderId, { text: weatherMessage }, pageAccessToken);

        // Send weather image if available
        if (currentWeather.imageUrl) {
          await sendMessage(senderId, {
            attachment: {
              type: 'image',
              payload: {
                url: currentWeather.imageUrl,
                is_reusable: true
              }
            }
          }, pageAccessToken);
        }
      } else {
        sendMessage(senderId, { text: '❌ No weather data found for the specified location.' }, pageAccessToken);
      }

    } catch (error) {
      console.error('❗ Error calling Weather API:', error?.response?.data || error);
      sendMessage(senderId, { text: '❌ Error processing your request. Please try again later.' }, pageAccessToken);
    }
  }
};