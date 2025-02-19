const axios = require('axios');

module.exports = {
  name: 'test',
  description: 'Search for YouTube videos and send multiple results',
  author: 'Rized',
  usage: 'ytsearch <search text>',

  async execute(senderId, args, pageAccessToken, sendMessage) {
    const searchQuery = args.join(' ');

    if (!searchQuery) {
      return sendMessage(senderId, { text: "𝑼𝒔𝒂𝒈𝒆: 𝒚𝒕𝒔𝒆𝒂𝒓𝒄𝒉 <𝒕𝒊𝒕𝒍𝒆>" }, pageAccessToken);
    }

    sendMessage(senderId, { text: "⚙ 𝑺𝒆𝒂𝒓𝒄𝒉𝒊𝒏𝒈 𝑭𝒐𝒓 𝒀𝒐𝒖𝑻𝒖𝒃𝒆 𝑽𝒊𝒅𝒆𝒐𝒔, 𝑷𝒍𝒆𝒂𝒔𝒆 𝑾𝒂𝒊𝒕..." }, pageAccessToken);

    try {
      const response = await axios.get(`https://kaiz-apis.gleeze.com/api/ytsearch?query=${encodeURIComponent(searchQuery)}`);
      const results = response.data.results;

      if (!results || results.length === 0) {
        return sendMessage(senderId, { text: '❌ 𝑵𝒐 𝒗𝒊𝒅𝒆𝒐𝒔 𝒇𝒐𝒖𝒏𝒅 𝒇𝒐𝒓 𝒕𝒉𝒊𝒔 𝒔𝒆𝒂𝒓𝒄𝒉.' }, pageAccessToken);
      }

      const responseTime = new Date().toLocaleString('en-US', { timeZone: 'Asia/Manila', hour12: true });

      for (const video of results) {
        const title = video.title;
        const url = video.url;
        const thumbnail = video.thumbnail;

        sendMessage(senderId, {
          text: `🎥 **𝒀𝒐𝒖𝑻𝒖𝒃𝒆 𝑺𝒆𝒂𝒓𝒄𝒉 𝑹𝒆𝒔𝒖𝒍𝒕** 🎥\n\n` +
                `🤖 **𝑻𝒊𝒕𝒍𝒆**: ${title}\n` +
                `🔗 **𝑼𝒓𝒍**: ${url}\n` +
                `🖼 **𝑻𝒉𝒖𝒎𝒃𝒏𝒂𝒊𝒍**: ${thumbnail}\n\n` +
                `⏰ **𝑨𝒔𝒊𝒂/𝑴𝒂𝒏𝒊𝒍𝒂 𝑻𝒊𝒎𝒆**: ${responseTime}\n\n` +
                `📽 **𝑬𝒏𝒋𝒐𝒚 𝑾𝒂𝒕𝒄𝒉𝒊𝒏𝒈!**`
        }, pageAccessToken);
      }
    } catch (error) {
      console.error(error);
      sendMessage(senderId, { text: `❌ 𝑨𝒏 𝒆𝒓𝒓𝒐𝒓 𝒐𝒄𝒄𝒖𝒓𝒓𝒆𝒅: ${error.message}` }, pageAccessToken);
    }
  }
};