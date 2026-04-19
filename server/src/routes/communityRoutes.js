const express = require('express');
const { body } = require('express-validator');
const multer = require('multer');

const {
  getPosts,
  createPost,
  updatePost,
  deletePost,
  toggleLike,
  addComment,
  uploadPostImage,
} = require('../controllers/communityController');
const { protect } = require('../middleware/authMiddleware');
const validateRequest = require('../middleware/validateRequest');

const router = express.Router();
const upload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: 5 * 1024 * 1024 },
});

const uploadCommunityImages = upload.fields([
  { name: 'images', maxCount: 4 },
  { name: 'image', maxCount: 4 },
]);

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

router.post('/upload-images', protect, uploadCommunityImages, uploadPostImage);
router.post('/upload-image', protect, uploadCommunityImages, uploadPostImage);

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
