const axios = require("axios"); const { sendMessage } = require("../handles/sendMessage");

module.exports = { 

name: "deepseek-v3", 
description: "Interact with DeepSeek V3 AI for text-based responses", 
author: "developer",

async execute(senderId, args, pageAccessToken) { const userPrompt = args.join(" ").trim();

if (!userPrompt) {
  return sendMessage(
    senderId,
    { text: "❌ Please provide a message for DeepSeek V3 to respond to." },
    pageAccessToken
  );
}

sendMessage(
  senderId,
  { text: "⌛ Processing your request, please wait..." },
  pageAccessToken
);

try {
  const apiUrl = "https://kaiz-apis.gleeze.com/api/deepseek-v3";
  const response = await handleDeepSeekV3Request(apiUrl, userPrompt);

  const result = response.response;

  await sendConcatenatedMessage(senderId, result, pageAccessToken);
} catch (error) {
  console.error("Error in DeepSeek V3 command:", error);
  sendMessage(
    senderId,
    { text: `❌ Error: ${error.message || "Something went wrong."}` },
    pageAccessToken
  );
}

} };

async function handleDeepSeekV3Request(apiUrl, query) { const { data } = await axios.get(apiUrl, { params: { ask: query || "" } });

return data; }

async function sendConcatenatedMessage(senderId, text, pageAccessToken) { const maxMessageLength = 2000;

if (text.length > maxMessageLength) { const messages = splitMessageIntoChunks(text, maxMessageLength);

for (const message of messages) {
  await new Promise((resolve) => setTimeout(resolve, 500));
  await sendMessage(senderId, { text: message }, pageAccessToken);
}

} else { await sendMessage(senderId, { text }, pageAccessToken); } }

function splitMessageIntoChunks(message, chunkSize) { const chunks = []; for (let i = 0; i < message.length; i += chunkSize) { chunks.push(message.slice(i, i + chunkSize)); } return chunks; }

