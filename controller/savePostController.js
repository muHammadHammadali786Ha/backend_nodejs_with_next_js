// controllers/savedPosts.js
import SavedPost from '../model/SavedPost.js';

// Save a post
export const savePost = async (req, res) => {
    console.log("Saving post...");
    
  try {
    const { jobID } = req.body;
    const userId = req.user.id;
    // console.log(jobID);
    
    // Check if already saved
    const existingSave = await SavedPost.findOne({ user: userId, post: jobID });
    if (existingSave) {
      return res.status(400).json({ message: 'Post already saved' });
    }

    const savedPost = new SavedPost({
      user: userId,
      post: jobID,
      createdAt: new Date()
    });

    await savedPost.save();
    return res.status(201).json({success:true,message:"Post Saved Successfully",savedPost});
  } catch (error) {
   return res.status(500).json({ message: error.message });
  }
};

// Unsave a post
export const unsavePost = async (req, res) => {
  try {
    const { id } = req.params;
    // console.log("Checking saved status...",id);

    const userId = req.user.id;

    const result = await SavedPost.findOneAndDelete({ 
      user: userId, 
      post: id
    });

    if (!result) {
      return res.status(404).json({ message: 'Saved post not found' });
    }

    return res.json({ message: 'Post unsaved successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get user's saved posts
export const getSavedPosts = async (req, res) => {
  try {
    const userId = req.user.id;
    
    const savedPosts = await SavedPost.find({ user: userId })
      .populate('post')
      .sort({ createdAt: -1 });

    return res.json(savedPosts.map(item => item.post));
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Check if a post is saved by the user
export const checkSavedStatus = async (req, res) => {
  try {
    const { postId } = req.params;
    // console.log("Checking saved status...",postId);
    
    const userId = req.user.id;

    const isSaved = await SavedPost.exists({ 
      user: userId, 
      post: postId 
    });

    res.json({ isSaved: !!isSaved });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};