const axios = require("axios");
const { sendMessage } = require("../handles/sendMessage");

module.exports = {
  name: "test",
  description: "Get weather information for a specific city",
  author: "developer",

  async execute(senderId, args, pageAccessToken) {
    const city = args.join(" ").trim();

    if (!city) {
      return sendMessage(
        senderId,
        { text: `❌ Please provide a city name.\n\nUsage: weather <city>` },
        pageAccessToken
      );
    }

    try {
      const apiUrl = `https://jerome-web.gleeze.com/service?city=${encodeURIComponent(city)}`;
      const response = await axios.get(apiUrl);

      const data = response.data;

      if (data.cod !== 200) {
        return sendMessage(
          senderId,
          { text: `❌ Error: ${data.message || "City not found."}` },
          pageAccessToken
        );
      }

      const weatherInfo = `
🌤️ Weather in ${data.name}, ${data.sys.country}
- 🌡️ Temperature: ${data.main.temp}°C (Feels like: ${data.main.feels_like}°C)
- ☁️ Condition: ${data.weather[0].description}
- 💧 Humidity: ${data.main.humidity}%
- 🌬️ Wind Speed: ${data.wind.speed} m/s
- 🌅 Sunrise: ${new Date(data.sys.sunrise * 1000).toLocaleTimeString()}
- 🌇 Sunset: ${new Date(data.sys.sunset * 1000).toLocaleTimeString()}
      `.trim();

      await sendMessage(senderId, { text: weatherInfo }, pageAccessToken);

    } catch (error) {
      console.error("Error in weather command:", error);
      sendMessage(
        senderId,
        { text: `❌ Error: ${error.message || "Something went wrong."}` },
        pageAccessToken
      );
    }
  }
};