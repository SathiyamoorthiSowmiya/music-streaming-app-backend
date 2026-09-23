const express = require('express');
const router = express.Router();
const Comment = require('../models/Comment');
const { requireAuth } = require('../middleware/auth');

// GET all comments for a song
router.get('/song/:songId', async (req, res) => {
    try {
        const comments = await Comment.find({ song: req.params.songId })
            .populate('user', 'username')
            .sort({ createdAt: -1 });
        res.json(comments);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

// POST add a comment to a song
router.post('/song/:songId', requireAuth, async (req, res) => {
    try {
        const comment = await Comment.create({
            song: req.params.songId,
            user: req.user.id,
            text: req.body.text,
        });
        const populated = await comment.populate('user', 'username');
        res.status(201).json(populated);
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
});

// DELETE a comment (only the author can delete)
router.delete('/:id', requireAuth, async (req, res) => {
    try {
        const comment = await Comment.findOne({ _id: req.params.id, user: req.user.id });
        if (!comment) return res.status(404).json({ message: 'Comment not found' });

        await comment.deleteOne();
        res.json({ message: 'Comment deleted successfully' });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

module.exports = router;
