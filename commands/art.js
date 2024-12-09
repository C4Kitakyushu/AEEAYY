const axios = require('axios');

module.exports = {
  name: 'youtube',
  description: 'search video based on youtube',
  author: 'Dale Mekumi', 
  usage: 'ytmp3 songtitle',
  async execute(senderId, args, pageAccessToken, sendMessage) {

    const prompt = args.join(' ');
    if (!prompt) return sendMessage(senderId, { text: "❌ Please provide song or video title" }, pageAccessToken);

    try {
      const response = await axios.get(`https://apiv2.kenliejugarap.com/ytsearch?title=${encodeURIComponent(prompt)}`);
      const info = response.data.videos[0];
      const title = info.title;
      const url = info.url;

      sendMessage(senderId, { 
        text: `📃Video Title: ${title}\n🔗 Youtube URL: ${url}\n⌛ Downloading video please wait..` 
      }, pageAccessToken);


      const responses = await axios.get(`https://apiv2.kenliejugarap.com/video?url=${url}`);
      const dlink = responses.data.response;
     // const url = info.url;

      const audiomessage = {
    attachment: {
      type: 'video',
      payload: {
        url: dlink,
      },
    },
  };
  await sendMessage(senderId, audiomessage, pageAccessToken);
    } catch (error) {
      console.error(error);
      sendMessage(senderId, { text: `❌ 𝗔𝗻 𝗲𝗿𝗿𝗼𝗿 𝗼𝗰𝗰𝘂𝗿𝗿𝗲𝗱: ${error.message}` }, pageAccessToken);
    }
  }
};