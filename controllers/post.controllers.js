const Comment = require("../models/comment.model");
const Post = require("../models/post.model");
const User = require("../models/user.model");



module.exports.getMyPosts = async function(req,res){
  try {
    const userId = req.user._id; // Get the authenticated user's ID
    const posts = await Post.find({ author: userId }); // Find posts by the user
    if (posts.length === 0) {
      return res.status(404).send("No posts found");
    }
    res.status(200).json(posts); // Send the posts back as a response
  } catch (error) {
    console.error(error);
    res.status(500).send("Error fetching posts");
  }
}
module.exports.createPost = async function (req, res) {
  try {
    const { title, content, categories, tags } = req.body;
    let userId = req.user._id;
    if (!title || !content || !categories || !tags) {
      return res
        .status(400)
        .send("Please provide all the required information");
    }
    // Categories and tags are expected to be arrays
    const newPost = new Post({
      title,
      content,
      author: userId,
      image: req.file.filename,
      categories: categories.split(","), // Assuming categories are comma-separated in the request body
      tags: tags.split(","), // Assuming tags are comma-separated in the request body
    });
    await newPost.save();
    const user = await User.findById(userId); // Corrected to use userId directly
    user.posts.push(newPost._id);
    await user.save();
    res.status(201).send(newPost);
  } catch (error) {
    console.error(error);
    res.status(500).send("Error creating post");
  }
};

module.exports.getPosts = async function (req, res) {
  try {
    const posts = await Post.find()
      .populate("author", "username profilePicture")
      .sort({ createdAt: -1 });
    if (!posts) {
      res.status(400).json({
        message: "No Posts.",
      });
    }
    res.status(200).json({
      posts,
    });
  } catch (error) {
    res.status(500).json({ message: "Error fetching posts", error });
  }
};

module.exports.getPostById = async function (req, res) {
  try {
    const post = await Post.findById(req.params.id)
      .populate("author", "username profilePicture")
      .populate("comments")
      .sort({ createdAt: -1 });
    if (!post) return res.status(404).json({ message: "Post not found" });
    res.status(200).json(post);
  } catch (error) {
    res.status(500).json({ message: "Error fetching post", error });
  }
};
module.exports.updatePost = async function (req, res) {
  try {
    const post = await Post.findById(req.params.id);
    if (!post) return res.status(404).json({ message: "Post not found" });

    // Ensure the logged-in user is the author
    if (post.author.toString() !== req.user.id) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    const { title, content, categories, tags } = req.body;

    post.title = title || post.title;
    post.content = content || post.content;
    post.image = req.file ? req.file.filename : post.image;
    post.categories = categories ? categories.split(",") : post.categories;
    post.tags = tags ? tags.split(",") : post.tags;
    post.updatedAt = Date.now();

    const updatedPost = await post.save();
    res.status(200).json(updatedPost);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error updating post", error });
  }
};

module.exports.deletePost = async function (req, res) {
  try {
    const post = await Post.findById(req.params.id);

    if (!post) return res.status(404).json({ message: "Post not found" });

    // Ensure the logged-in user is the author
    if (post.author.toString() !== req.user.id) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    await post.remove();
    res.status(200).json({ message: "Post deleted" });
  } catch (error) {
    res.status(500).json({ message: "Error deleting post", error });
  }
};

module.exports.toggleLike = async function (req, res) {
  try {
    const { postId } = req.params;

    // Ensure postId is valid
    if (!postId) return res.status(400).json({ message: "Post ID is required" });

    const post = await Post.findById(postId);

    if (!post) return res.status(404).json({ message: "Post not found" });

    // Check if the user has already liked the post
    const isLiked = post.likes.find((userId) => userId.toString() === req.user.id);

    if (isLiked) {
      // Unlike: Remove the user ID from the likes array
      post.likes = post.likes.filter((userId) => userId.toString() !== req.user.id);
    } else {
      // Like: Add the user ID to the likes array
      post.likes.push(req.user._id);
    }

    // Save the updated post
    await post.save();

    // Return updated like count and user's like status
    return res.status(200).json({
      likes: post.likes.length,
      liked: !isLiked,
      message: isLiked ? "Post unliked" : "Post liked",
    });
  } catch (error) {
    console.error("Error toggling like:", error);
    return res.status(500).json({ message: "Error toggling like", error: error.message });
  }
};

