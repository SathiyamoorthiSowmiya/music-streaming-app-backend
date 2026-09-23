const express = require('express');
const router = express.Router();
const Playlist = require('../models/Playlist');
const { requireAuth } = require('../middleware/auth');

// GET all playlists for the logged-in user
router.get('/', requireAuth, async (req, res) => {
    try {
        const playlists = await Playlist.find({ user: req.user.id }).populate('songs');
        res.json(playlists);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

// GET single playlist (must belong to the user)
router.get('/:id', requireAuth, async (req, res) => {
    try {
        const playlist = await Playlist.findOne({ _id: req.params.id, user: req.user.id }).populate('songs');
        if (!playlist) return res.status(404).json({ message: 'Playlist not found' });
        res.json(playlist);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

// POST create playlist
router.post('/', requireAuth, async (req, res) => {
    try {
        const playlist = await Playlist.create({ name: req.body.name, user: req.user.id, songs: [] });
        res.status(201).json(playlist);
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
});

// PUT rename playlist
router.put('/:id', requireAuth, async (req, res) => {
    try {
        const playlist = await Playlist.findOneAndUpdate(
            { _id: req.params.id, user: req.user.id },
            { name: req.body.name },
            { new: true }
        );
        if (!playlist) return res.status(404).json({ message: 'Playlist not found' });
        res.json(playlist);
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
});

// DELETE playlist
router.delete('/:id', requireAuth, async (req, res) => {
    try {
        const playlist = await Playlist.findOneAndDelete({ _id: req.params.id, user: req.user.id });
        if (!playlist) return res.status(404).json({ message: 'Playlist not found' });
        res.json({ message: 'Playlist deleted successfully' });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

// PATCH add a song to a playlist
router.patch('/:id/add-song', requireAuth, async (req, res) => {
    try {
        const playlist = await Playlist.findOne({ _id: req.params.id, user: req.user.id });
        if (!playlist) return res.status(404).json({ message: 'Playlist not found' });

        const { songId } = req.body;
        if (!playlist.songs.some(id => id.toString() === songId)) {
            playlist.songs.push(songId);
            await playlist.save();
        }

        const updated = await playlist.populate('songs');
        res.json(updated);
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
});

// PATCH remove a song from a playlist
router.patch('/:id/remove-song', requireAuth, async (req, res) => {
    try {
        const playlist = await Playlist.findOne({ _id: req.params.id, user: req.user.id });
        if (!playlist) return res.status(404).json({ message: 'Playlist not found' });

        const { songId } = req.body;
        playlist.songs = playlist.songs.filter(id => id.toString() !== songId);
        await playlist.save();

        const updated = await playlist.populate('songs');
        res.json(updated);
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
});

module.exports = router;
