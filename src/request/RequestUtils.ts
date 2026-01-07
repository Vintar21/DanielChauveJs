const https = require("https");
const optionJson = require("../../package.json");
const token = optionJson.password.split(":")[1];
const clientId = optionJson["client-id"];

// Follower request

const isFollowerOptions = {
  port: 443,
  method: "GET",
  headers: {
    Authorization: "Bearer " + token,
    "Client-Id": clientId,
  },
};

export async function isFollowerRequest(
  channelId: number,
  userId: number
): Promise<boolean> {
  const response = await fetch(
    "https://api.twitch.tv/helix/channels/followers?broadcaster_id=" +
      channelId +
      "&user_id=" +
      userId,
    isFollowerOptions
  );
  const data = await response.json().then((data) => {
    return data.data?.length > 0;
  });
  return data;
}
