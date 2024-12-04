export const turnConfig = {
  iceServers: [
    {
      urls: "stun:global.stun.twilio.com:3478"
    },
    {
      urls: "turn:global.turn.twilio.com:3478?transport=udp",
      username: "978b4e0aa4bd05e0e6f47f1f68a7b5edf9fe1e6bbdc777a1042b8924bf3c5a2e",
      credential: "cYV04JfTfKFBDwAwRMIoYYRCNQWsccvXd6V/7vJ2zLI="
    },
    {
      urls: "turn:global.turn.twilio.com:3478?transport=tcp",
      username: "978b4e0aa4bd05e0e6f47f1f68a7b5edf9fe1e6bbdc777a1042b8924bf3c5a2e",
      credential: "cYV04JfTfKFBDwAwRMIoYYRCNQWsccvXd6V/7vJ2zLI="
    },
    {
      urls: "turn:global.turn.twilio.com:443?transport=tcp",
      username: "978b4e0aa4bd05e0e6f47f1f68a7b5edf9fe1e6bbdc777a1042b8924bf3c5a2e",
      credential: "cYV04JfTfKFBDwAwRMIoYYRCNQWsccvXd6V/7vJ2zLI="
    }
  ]
}