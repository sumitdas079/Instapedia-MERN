import Post from "../models/Post.js";
import User from "../models/User.js";

// @desc Create a post
export const createPost = async (req, res) => {
    try {
        const { userId, description, picturePath } = req.body;
        const user = await User.findById(userId);
        const newPost = new Post({
            userId,
            firstName: user.firstName,
            lastName: user.lastName,
            location: user.location,
            description,
            userPicturePath: user.picturePath,
            picturePath,
            likes: {},
            comments: [],
        });
        await newPost.save();

        const post = await Post.find();
        res.status(201).json(post);
    } catch (error) {
        res.status(409).json({ message: error.message });
    }
}

// @desc Get all posts in your feed
export const getFeedPosts = async (req, res) => {
    try {
        const post = await Post.find();
        res.status(200).json(post);
    } catch (err) {
        res.status(404).json({ message: err.message });
    }
};

// @desc Get a user's posts
export const getUserPosts = async (req, res) => {
    try {
        const { userId } = req.params.id;
        const post = await Post.find({ userId });
        res.status(200).json(post);
    } catch (error) {
        res.status(404).json({ message: error.message });
    }
}

export const likePost = async (req, res) => {
    try {
        const { id } = req.params;
        const { userId } = req.body;
        const post = await Post.findById(id);
        const isLiked = post.likes.get(userId); //check if that post has already been liked by the logged in user

        if (isLiked) {
            post.likes.delete(userId); //deletes the like if already exist
        } else {
            post.likes.set(userId, true); //sets the like if already liked
        }

        const updatedPost = await Post.findByIdAndUpdate(
            id,
            { likes: post.likes }, //list of liked that we modified
            { new: true } //setting new object
        );

        res.status(200).json(updatedPost);
    } catch (err) {
        res.status(404).json({ message: err.message });
    }
}