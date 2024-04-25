const mongoose = require("mongoose");
const blogSchame = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
    },
    description: {
      type: String,
      required: true,
    },
    image: {
      type: Array,
      required: true,
    },
    views: {
      type: Number,
      default: 1
    },
    status: {
      type: Boolean,
      default: true,
    }
  },
  { timestamps: true }
);

const Blogs = mongoose.model("blog", blogSchame);
module.exports = Blogs;
