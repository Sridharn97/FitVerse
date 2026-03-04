const express = require('express');
const { body } = require('express-validator');

const {
  getPosts,
  createPost,
  updatePost,
  deletePost,
  toggleLike,
  addComment,
} = require('../controllers/communityController');
const { protect } = require('../middleware/authMiddleware');
const validateRequest = require('../middleware/validateRequest');

const router = express.Router();

router
  .route('/')
  .get(getPosts)
  .post(
    protect,
    [
      body('title').trim().notEmpty().withMessage('Title is required'),
      body('content').trim().notEmpty().withMessage('Content is required'),
    ],
    validateRequest,
    createPost
  );

router.route('/:id').put(protect, updatePost).delete(protect, deletePost);
router.post('/:id/like', protect, toggleLike);
router.post(
  '/:id/comments',
  protect,
  [body('content').trim().notEmpty().withMessage('Comment content is required')],
  validateRequest,
  addComment
);

module.exports = router;
