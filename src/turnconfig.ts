export const iceConfiguration = {
  iceServers: [
      {
          urls: 'stun:stun.l.google.com:19302',
      },
       {
      urls: [
        'turn:turn.ix.tc:3478' + "?transport=udp",
        'turn:turn.ix.tc:3478' + "?transport=tcp",
      ],
      username: 'guest',
      credential:'password'
    },

  ]
};