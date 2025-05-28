// routes/posts.js
import express from 'express';
import {
  savePost,
  unsavePost,
  getSavedPosts,
  checkSavedStatus
} from '../controller/savePostController.js';
import authVerification from '../middleware/authMIddleware.js';

const router = express.Router();

// Save a post
router.post('/save', authVerification, savePost);

// Unsave a post
router.delete('/:id/save', authVerification, unsavePost);

// Check if post is saved
router.get('/:id/saved', authVerification, checkSavedStatus);

// Get all saved posts
router.get('/saved', authVerification, getSavedPosts);

export default router;