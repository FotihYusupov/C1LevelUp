const Player = require("../models/Players.js");
const Ad = require("../models/Ad.js");
const bot = require("../bot.js");

exports.getAll = async (req, res) => {
  try {
    let query = req.query;
    let filter = {};
    if (query.search) {
      filter.username = { $regex: query.search, $options: "i" };
    }
    const players = await Player.find(filter).sort({ coin: -1 });
    return res.status(200).json({
      data: players,
    });
  } catch (err) {
    return res.status(500).json({
      message: "Error retrieving players",
      error: err.message,
    });
  }
};

exports.getAllAds = async (_, res) => {
  try {
    const ads = await Ad.find();
    return res.json({
      data: ads.reverse(),
    })
  } catch (err) {
    return res.status(500).json({
      message: "Error retrieving players",
      error: err.message,
    });
  }
}

exports.sendMessage = async (req, res) => {
  try {
    const startTime = new Date();
    let text = req.body.text;
    let image = req.files && req.files.length > 0 ? req.files[0] : null;

    const players = await Player.find();

    for (const player of players) {
      setTimeout(() => {
        if (image) {
          bot.sendPhoto(player.chatId, image.path, { caption: text });
        } else {
          bot.sendMessage(player.chatId, text);
        }
      }, 1000);
    }

    const endTime = new Date();
    const elapsedTime = endTime - startTime;

    const newAd = new Ad({
      startTime,
      endTime,
      text
    });

    if(image) {
      newAd.image = `${process.env.URL}${req.files[0].path}`
    }

    await newAd.save()

    return res.json({
      message: "Messages sent successfully",
      elapsedTime: elapsedTime / 1000,
    });
  } catch (err) {
    return res.status(500).json({
      message: "Error sending messages",
      error: err.message,
    });
  }
};
