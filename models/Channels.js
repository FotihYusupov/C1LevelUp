const mongoose = require("mongoose");
const ChannelSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  channelLink: {
    type: String,
    required: true,
  },
  chatId: {
    type: String,
    require: true,
  },
});

const Channels = mongoose.model("channel", ChannelSchema);
module.exports = Channels;