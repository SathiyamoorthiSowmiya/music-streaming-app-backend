const mongoose = require('mongoose');

const songSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true,
        trim: true,
    },
    artist: {
        type: String,
        required: true,
        trim: true,
    },
    album: {
        type: String,
        trim: true,
    },
    movieName: {
        type: String,
        trim: true,
    },
    genre: {
        type: String,
        trim: true,
    },
    coverImage: {
        type: String,
        default: '',
    },
    audioUrl: {
        type: String,
        required: true,
    },
    duration: {
        type: Number,
        default: 0,
    },
    likes: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
    }],
}, { timestamps: true });

songSchema.index({ title: 'text', artist: 'text', album: 'text', movieName: 'text' });

module.exports = mongoose.model('Song', songSchema);
