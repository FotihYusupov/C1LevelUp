const mongoose = require("mongoose");
const AdSchema = new mongoose.Schema({
  startTime: {
    type: String,
    required: true
  },
  endTime: {
    type: String,
    required: true,
  },
  image: {
    type: String,
  },
  text: {
    type: String,
  }
});

const Ads = mongoose.model("ad", AdSchema);
module.exports = Ads;