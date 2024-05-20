const mongoose = require("mongoose");
const PlayerSchema = new mongoose.Schema({
  username: {
    type: String,
    required: true,
  },
  phone: {
    type: String,
    required: true
  },
  coin: {
    type: Number,
    default: 5
  },
  chatId: {
    type: Number,
    required: true
  }
});

const Players = mongoose.model("players", PlayerSchema);
module.exports = Players;