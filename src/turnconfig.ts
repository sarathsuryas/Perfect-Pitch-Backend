
// export const  iceConfiguration = {

//   iceServers: [{   urls: [ "stun:bn-turn2.xirsys.com" ]}, {   username: "o8_s2lbVKiqxpNa5Ntw5kG_h7g9zYj-AbK49RHWtnH26b_exoUgSkD5MrvzAQkpMAAAAAGcrwiBzYXJhdGhz",   credential: "90886c3c-9c74-11ef-8e6e-0242ac140004",   urls: [       "turn:bn-turn2.xirsys.com:80?transport=udp",       "turn:bn-turn2.xirsys.com:3478?transport=udp",       "turn:bn-turn2.xirsys.com:80?transport=tcp",       "turn:bn-turn2.xirsys.com:3478?transport=tcp",       "turns:bn-turn2.xirsys.com:443?transport=tcp",       "turns:bn-turn2.xirsys.com:5349?transport=tcp"   ]}]

// };
export const  iceConfiguration = {
  iceServers: [
{
urls: "stun:stun.relay.metered.ca:80",
},
{
urls: "turn:global.relay.metered.ca:80",
username: "f5baae95181d1a3b2947f791",
credential: "n67tiC1skstIO4zc",
},
{
urls: "turn:global.relay.metered.ca:80?transport=tcp",
username: "f5baae95181d1a3b2947f791",
credential: "n67tiC1skstIO4zc",
},
{
urls: "turn:global.relay.metered.ca:443",
username: "f5baae95181d1a3b2947f791",
credential: "n67tiC1skstIO4zc",
},
{
urls: "turns:global.relay.metered.ca:443?transport=tcp",
username: "f5baae95181d1a3b2947f791",
credential: "n67tiC1skstIO4zc",
},
],
};