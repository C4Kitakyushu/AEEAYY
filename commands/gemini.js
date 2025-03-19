const axios = require("axios");
const { sendMessage } = require("../handles/sendMessage");
const fs = require("fs");

const token = fs.readFileSync("token.txt", "utf8");

module.exports = {
  name: "gemini",
  description:
    "Interact with GPT‑4 for text responses and Gemini Vision for image recognition",
  author: "developer",

  // The execute function now accepts an optional event parameter.
  async execute(senderId, args, event) {
    const pageAccessToken = token;
    // Use provided text or default to "Hello"
    const userPrompt = (args.join(" ") || "Hello").trim();
    let finalPrompt = userPrompt;
    // If the message is a reply, prepend the replied-to message text
    if (
      event &&
      event.message &&
      event.message.reply_to &&
      event.message.reply_to.message
    ) {
      finalPrompt = `${event.message.reply_to.message} ${userPrompt}`.trim();
    }

    if (!finalPrompt) {
      return sendMessage(
        senderId,
        { text: "❌ Please provide your message." },
        pageAccessToken
      );
    }

    // Attempt to extract an image URL from the event, if available.
    let imageUrl = null;
    if (event && event.message) {
      // Check if the current message contains an image attachment.
      if (
        event.message.attachments &&
        event.message.attachments.length > 0 &&
        event.message.attachments[0].type === "image"
      ) {
        imageUrl = event.message.attachments[0].payload.url;
      }
      // Otherwise, if this is a reply, try fetching the image from the replied message.
      else if (event.message.reply_to && event.message.reply_to.mid) {
        try {
          imageUrl = await getRepliedImage(
            event.message.reply_to.mid,
            pageAccessToken
          );
        } catch (error) {
          console.error("Error retrieving replied image:", error);
        }
      }
    }

    // If an image is detected, use the Gemini Vision API.
    if (imageUrl) {
      try {
        const apiUrl = "https://kaiz-apis.gleeze.com/api/gemini-vision";
        const response = await handleImageRecognition(
          apiUrl,
          finalPrompt,
          imageUrl,
          senderId
        );
        const result = response.response;
        const visionResponse = `${result}`;
        await sendConcatenatedMessage(senderId, visionResponse, pageAccessToken);
      } catch (error) {
        console.error("Error in Gemini Vision command:", error);
        return sendMessage(
          senderId,
          { text: `❌ Error: ${error.message || "Something went wrong."}` },
          pageAccessToken
        );
      }
    } else {
      // Otherwise, use the GPT‑4 API for a text response.
      try {
        const apiUrl = `https://ccprojectapis.ddns.net/api/gpt4?ask=${encodeURIComponent(
          finalPrompt
        )}&id=${encodeURIComponent(senderId)}`;
        const { data } = await axios.get(apiUrl);
        const responseText = data || "No response from the AI.";
        await sendConcatenatedMessage(senderId, responseText, pageAccessToken);
      } catch (error) {
        console.error("Error in GPT‑4 command:", error);
        return sendMessage(
          senderId,
          { text: "❌ Error: Something went wrong." },
          pageAccessToken
        );
      }
    }
  },
};

// Calls Gemini Vision API with the given prompt and image URL.
async function handleImageRecognition(apiUrl, prompt, imageUrl, senderId) {
  try {
    const { data } = await axios.get(apiUrl, {
      params: {
        q: prompt,
        uid: senderId,
        imageUrl: imageUrl || "",
      },
    });
    return data;
  } catch (error) {
    throw new Error("Failed to connect to the Gemini Vision API.");
  }
}

// Retrieves the image URL from a replied-to message (using its mid) via Facebook Graph API.
async function getRepliedImage(mid, pageAccessToken) {
  try {
    const { data } = await axios.get(
      `https://graph.facebook.com/v21.0/${mid}/attachments`,
      { params: { access_token: pageAccessToken } }
    );
    return data?.data[0]?.image_data?.url || "";
  } catch (error) {
    throw new Error("Failed to retrieve replied image.");
  }
}

// Splits a long message into chunks and sends them sequentially.
async function sendConcatenatedMessage(senderId, text, pageAccessToken) {
  const maxMessageLength = 2000;
  if (text.length > maxMessageLength) {
    const messages = splitMessageIntoChunks(text, maxMessageLength);
    for (const message of messages) {
      await new Promise((resolve) => setTimeout(resolve, 500));
      await sendMessage(senderId, { text: message }, pageAccessToken);
    }
  } else {
    await sendMessage(senderId, { text }, pageAccessToken);
  }
}

// Helper: splits a message string into smaller chunks.
function splitMessageIntoChunks(message, chunkSize) {
  const chunks = [];
  for (let i = 0; i < message.length; i += chunkSize) {
    chunks.push(message.slice(i, i + chunkSize));
  }
  return chunks;
}