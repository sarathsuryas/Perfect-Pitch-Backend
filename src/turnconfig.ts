export const iceConfiguration = {
  iceServers: [
    {
      urls: "stun:stun.relay.metered.ca:80",
    },
    {
      urls: "turn:global.relay.metered.ca:80",
      username: "836c17083ecba16b626af6f7",
      credential: "j/Du96pT1PjJXgP/",
    },
    {
      urls: "turn:global.relay.metered.ca:80?transport=tcp",
      username: "836c17083ecba16b626af6f7",
      credential: "j/Du96pT1PjJXgP/",
    },
    {
      urls: "turn:global.relay.metered.ca:443",
      username: "836c17083ecba16b626af6f7",
      credential: "j/Du96pT1PjJXgP/",
    },
    {
      urls: "turns:global.relay.metered.ca:443?transport=tcp",
      username: "836c17083ecba16b626af6f7",
      credential: "j/Du96pT1PjJXgP/",
    },
 ]
};