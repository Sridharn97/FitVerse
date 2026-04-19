const CommunityPost = require('../models/CommunityPost');
const { cloudinary, isCloudinaryConfigured } = require('../config/cloudinary');

const uploadBufferToCloudinary = (buffer, folder) =>
  new Promise((resolve, reject) => {
    const stream = cloudinary.uploader.upload_stream(
      {
        folder,
        resource_type: 'image',
      },
      (error, result) => {
        if (error) return reject(error);
        return resolve(result);
      }
    );

    stream.end(buffer);
  });

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

const uploadPostImage = async (req, res) => {
  const normalizedFiles = Array.isArray(req.files)
    ? req.files
    : req.files && typeof req.files === 'object'
      ? Object.values(req.files).flat().filter(Boolean)
      : req.file
        ? [req.file]
        : [];

  if (normalizedFiles.length === 0) {
    return res.status(400).json({ success: false, message: 'Image files are required' });
  }

  // Check if all files are images
  for (const file of normalizedFiles) {
    if (!String(file.mimetype || '').startsWith('image/')) {
      return res.status(400).json({ success: false, message: 'Only image files are allowed' });
    }
  }

  if (!isCloudinaryConfigured()) {
    return res.status(500).json({ success: false, message: 'Cloudinary is not configured on the server' });
  }

  try {
    const uploadPromises = normalizedFiles.map((file) => uploadBufferToCloudinary(file.buffer, 'fitverse/community'));
    const uploadedArray = await Promise.all(uploadPromises);

    const urls = uploadedArray.map((uploaded) => uploaded.secure_url);

    return res.status(201).json({
      success: true,
      message: 'Images uploaded',
      data: {
        url: urls[0] || '',
        urls,
      },
    });
  } catch (error) {
    return res.status(502).json({
      success: false,
      message: `Cloudinary upload failed: ${error?.message || 'unknown error'}`,
    });
  }
};

module.exports = { getPosts, createPost, updatePost, deletePost, toggleLike, addComment, uploadPostImage };
