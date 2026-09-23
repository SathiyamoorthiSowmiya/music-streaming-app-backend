const express = require('express');
const router = express.Router();
const Song = require('../models/Song');
const { requireAuth, requireAdmin } = require('../middleware/auth');

// GET all songs, with optional search: /api/songs?search=xyz
router.get('/', async (req, res) => {
    try {
        const { search, genre } = req.query;
        const filter = {};

        if (search) {
            filter.$or = [
                { title: { $regex: search, $options: 'i' } },
                { artist: { $regex: search, $options: 'i' } },
                { album: { $regex: search, $options: 'i' } },
                { movieName: { $regex: search, $options: 'i' } },
            ];
        }

        if (genre) filter.genre = genre;

        const songs = await Song.find(filter).sort({ createdAt: -1 });
        res.json(songs);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

// GET songs liked by the logged-in user
router.get('/liked/mine', requireAuth, async (req, res) => {
    try {
        const songs = await Song.find({ likes: req.user.id }).sort({ createdAt: -1 });
        res.json(songs);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

// GET single song
router.get('/:id', async (req, res) => {
    try {
        const song = await Song.findById(req.params.id);
        if (!song) return res.status(404).json({ message: 'Song not found' });
        res.json(song);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

// POST create song (admin only)
router.post('/', requireAuth, requireAdmin, async (req, res) => {
    try {
        const song = await Song.create(req.body);
        res.status(201).json(song);
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
});

// PUT update song (admin only)
router.put('/:id', requireAuth, requireAdmin, async (req, res) => {
    try {
        const song = await Song.findByIdAndUpdate(req.params.id, req.body, {
            new: true,
            runValidators: true,
        });
        if (!song) return res.status(404).json({ message: 'Song not found' });
        res.json(song);
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
});

// DELETE song (admin only)
router.delete('/:id', requireAuth, requireAdmin, async (req, res) => {
    try {
        const song = await Song.findByIdAndDelete(req.params.id);
        if (!song) return res.status(404).json({ message: 'Song not found' });
        res.json({ message: 'Song deleted successfully' });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

// PATCH like/unlike a song (toggle)
router.patch('/:id/like', requireAuth, async (req, res) => {
    try {
        const song = await Song.findById(req.params.id);
        if (!song) return res.status(404).json({ message: 'Song not found' });

        const userId = req.user.id;
        const alreadyLiked = song.likes.some(id => id.toString() === userId);

        if (alreadyLiked) {
            song.likes = song.likes.filter(id => id.toString() !== userId);
        } else {
            song.likes.push(userId);
        }

        await song.save();
        res.json({ likes: song.likes, liked: !alreadyLiked });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

module.exports = router;
