const Channel = require("../models/Channels.js");

exports.createChannel = async (req, res) => {
  try {
    const { name, channelLink, chatId } = req.body;
    const newChannel = new Channel({
      name,
      channelLink,
      chatId,
    });
    const savedChannel = await newChannel.save();
    return res.status(201).json({
      message: "Channel created successfully",
      data: savedChannel,
    });
  } catch (err) {
    return res.status(500).json({
      message: "Error creating channel",
      error: err.message,
    });
  }
};

exports.getAllChannels = async (req, res) => {
  try {
    const channels = await Channel.find();
    return res.json({
      data: channels,
    });
  } catch (err) {
    return res.status(500).json({
      message: "Error retrieving channels",
      error: err.message,
    });
  }
};

exports.getChannelById = async (req, res) => {
  try {
    const { channelId } = req.params;
    const channel = await Channel.findById(channelId);
    if (!channel) {
      return res.status(404).json({
        message: "Channel not found",
      });
    }
    return res.json({
      data: channel,
    });
  } catch (err) {
    return res.status(500).json({
      message: "Error retrieving channel",
      error: err.message,
    });
  }
};

exports.updateChannel = async (req, res) => {
  try {
    const { id } = req.params;
    const { name, channelLink, chatId } = req.body;
    const updatedChannel = await Channel.findByIdAndUpdate(
      id,
      {
        name,
        channelLink,
        chatId,
      },
      { new: true }
    );
    if (!updatedChannel) {
      return res.status(404).json({
        message: "Channel not found",
      });
    }
    return res.json({
      message: "Channel updated successfully",
      data: updatedChannel,
    });
  } catch (err) {
    return res.status(500).json({
      message: "Error updating channel",
      error: err.message,
    });
  }
};

exports.deleteChannel = async (req, res) => {
  try {
    const { id } = req.params;
    const deletedChannel = await Channel.findByIdAndDelete(id);
    if (!deletedChannel) {
      return res.status(404).json({
        message: "Channel not found",
      });
    }
    return res.json({
      message: "Channel deleted successfully",
      data: deletedChannel,
    });
  } catch (err) {
    return res.status(500).json({
      message: "Error deleting channel",
      error: err.message,
    });
  }
};
