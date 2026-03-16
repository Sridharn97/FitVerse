const CommunityPost = require('../models/CommunityPost');

const getPosts = async (_req, res) => {
  const posts = await CommunityPost.find()
    .populate('user', 'name avatarUrl isAnonymous')
    .populate('comments.user', 'name avatarUrl isAnonymous')
    .sort({ createdAt: -1 });

  res.status(200).json({ success: true, data: posts });
};

const createPost = async (req, res) => {
  const post = await CommunityPost.create({ ...req.body, user: req.user._id });
  const populated = await post.populate('user', 'name avatarUrl isAnonymous');

  res.status(201).json({ success: true, message: 'Post created', data: populated });
};

const updatePost = async (req, res) => {
  const post = await CommunityPost.findOneAndUpdate(
    { _id: req.params.id, user: req.user._id },
    req.body,
    { returnDocument: 'after', runValidators: true }
  )
    .populate('user', 'name avatarUrl isAnonymous')
    .populate('comments.user', 'name avatarUrl isAnonymous');

  if (!post) {
    return res.status(404).json({ success: false, message: 'Post not found' });
  }

  res.status(200).json({ success: true, message: 'Post updated', data: post });
};

const deletePost = async (req, res) => {
  const post = await CommunityPost.findOneAndDelete({ _id: req.params.id, user: req.user._id });

  if (!post) {
    return res.status(404).json({ success: false, message: 'Post not found' });
  }

  res.status(200).json({ success: true, message: 'Post deleted' });
};

const toggleLike = async (req, res) => {
  const post = await CommunityPost.findById(req.params.id);

  if (!post) {
    return res.status(404).json({ success: false, message: 'Post not found' });
  }

  const userId = req.user._id.toString();
  const alreadyLiked = post.likes.some((id) => id.toString() === userId);

  if (alreadyLiked) {
    post.likes = post.likes.filter((id) => id.toString() !== userId);
  } else {
    post.likes.push(req.user._id);
  }

  await post.save();

  const populated = await CommunityPost.findById(post._id)
    .populate('user', 'name avatarUrl isAnonymous')
    .populate('comments.user', 'name avatarUrl isAnonymous');

  res.status(200).json({ success: true, message: 'Like updated', data: populated });
};

const addComment = async (req, res) => {
  const post = await CommunityPost.findById(req.params.id);

  if (!post) {
    return res.status(404).json({ success: false, message: 'Post not found' });
  }

  post.comments.push({
    user: req.user._id,
    content: req.body.content,
  });

  await post.save();

  const populated = await CommunityPost.findById(post._id)
    .populate('user', 'name avatarUrl isAnonymous')
    .populate('comments.user', 'name avatarUrl isAnonymous');

  res.status(201).json({ success: true, message: 'Comment added', data: populated });
};

module.exports = { getPosts, createPost, updatePost, deletePost, toggleLike, addComment };
