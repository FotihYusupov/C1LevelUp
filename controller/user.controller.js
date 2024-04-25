const Users = require("../models/User.js");
const { sign } = require("../utils/jwt.js");

exports.getMe = async (req, res) => {
  try {
    const { userId } = req.headers;
    const findUser = await Users.findById(userId);
    if (!findUser) {
      return res.status(404).json({
        message: "User Not Found!",
      });
    }
    return res.json({
      data: {
        token: sign(findUser._id),
        login: findUser.login,
      },
    });
  } catch (err) {
    return res.json(err);
  }
};

exports.login = async (req, res) => {
  try {
    const findUser = await Users.findOne({
      username: req.body.username,
      password: req.body.password,
    });
    if (!findUser) {
      return res.status(404).json({
        message: "User Not Found!",
      });
    }
    return res.json({
      data: {
        token: sign(findUser._id.toString()),
        username: findUser.username,
      },
    });
  } catch (err) {
    return res.json(err);
  }
};

exports.updateUser = async (req, res) => {
  try {
    const { userId } = req.headers;
    const updatedUser = await Users.findByIdAndUpdate(
      userId,
      {
        username: req.body.username,
        password: req.body.password,
      },
      {
        new: true,
      }
    );
    if (updatedUser) {
      return res.status(404).json({
        message: "User not found!",
      });
    }
    return res.json({
      message: "User updated",
      data: updatedUser,
    });
  } catch (err) {
    return res.json(err);
  }
};
