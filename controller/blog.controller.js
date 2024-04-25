const Blog = require("../models/Blog.js");
const pagination = require("../utils/pagination.js")

exports.getAllBlog = async (req, res) => {
  try {
    const blogs = await pagination(Blog, req.query);
    return res.json(blogs);
  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
};

exports.getBlogById = async (req, res) => {
  try {
    const blog = await Blog.findById(req.params.blogId);
    if (!blog) {
      return res.status(404).json({ message: "Blog not found" });
    }
    blog.views += 1;
    await blog.save();
    return res.json({ data: blog });
  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
};

exports.createBlog = async (req, res) => {
  try {
    req.body.image = req.images;
    const newBlog = await Blog.create({...req.body});
    return res.json({ data: newBlog });
  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
};

exports.updateBlog = async (req, res) => {
  try {
    const oldBlog = await Blog.findById(req.params.blogId);
    if (!oldBlog) {
      return res.status(404).json({ message: "Blog not found" });
    }
    req.body.image = req.images;
    Object.assign(oldBlog, req.body)
    return res.json({ data: updatedBlog });
  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
};

exports.deleteBlog = async (req, res) => {
  try {
    const deletedBlog = await Blog.findByIdAndDelete(req.params.blogId);
    if (!deletedBlog) {
      return res.status(404).json({ message: "Blog not found" });
    }
    return res.json({ message: "Blog deleted successfully" });
  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
};
