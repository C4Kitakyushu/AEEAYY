const axios = require('axios');

module.exports = {
  name: 'fbshield',
  description: 'fbshield [ token ] .',
  author: 'developer',

  async execute(senderId, args, pageAccessToken, sendMessage) {
    const userToken = args[0];

    if (!userToken) {
      sendMessage(senderId, { text: '‼️ 𝖯𝖱𝖮𝖵𝖨𝖣𝖤 𝖠 𝖵𝖠𝖫𝖨𝖣 𝖥𝖠𝖢𝖤𝖡𝖮𝖮𝖪 𝖳𝖮𝖪𝖤𝖭.' }, pageAccessToken);
      return;
    }

    try {
      const response = await turnShield(userToken);
      sendMessage(senderId, { text: response }, pageAccessToken);
    } catch (error) {
      console.error('Error response data:', error.response?.data || error.message);
      sendMessage(senderId, { text: '𝖥𝖠𝖨𝖫𝖤𝖣 𝖳𝖮 𝖳𝖴𝖱𝖭 𝖮𝖭 𝖯𝖫𝖤𝖠𝖲𝖤 𝖳𝖱𝖸 𝖠𝖦𝖠𝖨𝖭 𝖫𝖠𝖳𝖤𝖱.' }, pageAccessToken);
    }
  }
};

// Helper function to turn on the Facebook avatar shield
async function turnShield(token) {
  const data = `variables={"0":{"is_shielded": true,"session_id":"9b78191c-84fd-4ab6-b0aa-19b39f04a6bc","actor_id":"${await getFacebookUserId(token)}","client_mutation_id":"b0316dd6-3fd6-4beb-aed4-bb29c5dc64b0"}}&method=post&doc_id=1477043292367183&query_name=IsShieldedSetMutation&strip_defaults=true&strip_nulls=true&locale=en_US&client_country_code=US&fb_api_req_friendly_name=IsShieldedSetMutation&fb_api_caller_class=IsShieldedSetMutation`;

  const headers = {
    "Content-Type": "application/x-www-form-urlencoded",
    "Authorization": `OAuth ${token}`
  };

  const url = "https://graph.facebook.com/graphql";

  try {
    await axios.post(url, data, { headers });
    return '𝖦𝖴𝖠𝖱𝖣 𝖮𝖭 𝖧𝖠𝖲 𝖡𝖤𝖤𝖭 𝖠𝖢𝖳𝖨𝖵𝖠𝖳𝖤𝖣 ✅';
  } catch (error) {
    console.error('Error response data:', error.response?.data || error.message);
    throw new Error('❌ 𝖥𝖠𝖨𝖫𝖤𝖣 𝖳𝖮 𝖳𝖴𝖱𝖭 𝖮𝖭 𝖯𝖫𝖤𝖠𝖲𝖤 𝖳𝖱𝖸 𝖠𝖦𝖠𝖨𝖭 𝖫𝖠𝖳𝖤𝖱.');
  }
}

// Helper function to get Facebook user ID using the token
async function getFacebookUserId(token) {
  const url = `https://graph.facebook.com/me?access_token=${token}`;

  try {
    const response = await axios.get(url);
    return response.data.id;
  } catch (error) {
    console.error('Error fetching Facebook user ID:', error.response?.data || error.message);
    throw new Error('Failed to retrieve Facebook user ID.');
  }
}
