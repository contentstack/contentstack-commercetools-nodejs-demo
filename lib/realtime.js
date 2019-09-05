const Pusher = require('pusher');
const pusher = new Pusher(config.realtime);

const broadcast = (channel, event, data={}) => pusher.trigger(channel, event, data);

module.exports.broadcast = broadcast;