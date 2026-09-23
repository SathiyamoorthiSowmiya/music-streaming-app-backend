require('dotenv').config();
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const Song = require('./models/Song');
const User = require('./models/User');

const trackList = [
    { title: 'Midnight Drive', artist: 'Aria Waves', album: 'City Lights', movieName: '', genre: 'Electronic' },
    { title: 'Golden Horizon', artist: 'The Skyline', album: 'Golden Horizon', movieName: 'Dawnfall', genre: 'Pop' },
    { title: 'Rainy Streets', artist: 'Nova Chen', album: 'Monsoon', movieName: '', genre: 'Jazz' },
    { title: 'Electric Heart', artist: 'Volt Kids', album: 'Circuit', movieName: 'Neon Runner', genre: 'Electronic' },
    { title: 'Wildflower', artist: 'Maren Oaks', album: 'Wildflower', movieName: '', genre: 'Folk' },
    { title: 'Skyward', artist: 'The Skyline', album: 'Golden Horizon', movieName: 'Dawnfall', genre: 'Pop' },
    { title: 'Velvet Nights', artist: 'Nova Chen', album: 'Monsoon', movieName: '', genre: 'Jazz' },
    { title: 'Fire & Stone', artist: 'Ironclad', album: 'Fire & Stone', movieName: 'The Last Forge', genre: 'Rock' },
    { title: 'Paper Moon', artist: 'Maren Oaks', album: 'Wildflower', movieName: '', genre: 'Folk' },
    { title: 'Neon Pulse', artist: 'Volt Kids', album: 'Circuit', movieName: 'Neon Runner', genre: 'Electronic' },
    { title: 'Broken Chords', artist: 'Ironclad', album: 'Fire & Stone', movieName: 'The Last Forge', genre: 'Rock' },
    { title: 'Quiet Harbor', artist: 'Aria Waves', album: 'City Lights', movieName: '', genre: 'Electronic' },
    { title: 'Street Symphony', artist: 'MC Ronin', album: 'Concrete Dreams', movieName: 'Block Kings', genre: 'Hip-Hop' },
    { title: 'Rhyme Machine', artist: 'MC Ronin', album: 'Concrete Dreams', movieName: 'Block Kings', genre: 'Hip-Hop' },
    { title: 'City Hustle', artist: 'Lyric Lane', album: 'Uptown', movieName: '', genre: 'Hip-Hop' },
    { title: 'Moonlit Sonata Reimagined', artist: 'Elena Voss', album: 'Chamber Echoes', movieName: '', genre: 'Classical' },
    { title: 'Strings of Dawn', artist: 'Elena Voss', album: 'Chamber Echoes', movieName: '', genre: 'Classical' },
    { title: 'Orchestral Tides', artist: 'The Philharmonics', album: 'Symphony No. 4', movieName: 'Ocean\'s Reach', genre: 'Classical' },
    { title: 'Temple Bells', artist: 'Ragaverse', album: 'Sacred Sounds', movieName: '', genre: 'Devotional' },
    { title: 'Morning Prayer', artist: 'Ragaverse', album: 'Sacred Sounds', movieName: '', genre: 'Devotional' },
    { title: 'Inner Peace', artist: 'Zen Grove', album: 'Stillness', movieName: '', genre: 'Devotional' },
    { title: 'Heart on Fire', artist: 'Lush Avenue', album: 'Heartstrings', movieName: 'Falling Slowly', genre: 'Romantic' },
    { title: 'First Glance', artist: 'Lush Avenue', album: 'Heartstrings', movieName: 'Falling Slowly', genre: 'Romantic' },
    { title: 'Forever Yours', artist: 'Mira Song', album: 'Endless', movieName: '', genre: 'Romantic' },
    { title: 'Dancefloor Royalty', artist: 'DJ Kairo', album: 'Bass Nation', movieName: '', genre: 'Party' },
    { title: 'Turn It Up', artist: 'DJ Kairo', album: 'Bass Nation', movieName: '', genre: 'Party' },
    { title: 'Saturday Nights', artist: 'Pulse Crew', album: 'Weekend Mode', movieName: 'Club Chronicles', genre: 'Party' },
    { title: 'Highway Rebels', artist: 'Ironclad', album: 'Fire & Stone', movieName: 'The Last Forge', genre: 'Rock' },
    { title: 'Autumn Letters', artist: 'Maren Oaks', album: 'Wildflower', movieName: '', genre: 'Folk' },
    { title: 'Blue Note Cafe', artist: 'Nova Chen', album: 'Monsoon', movieName: '', genre: 'Jazz' },
];

const TOTAL_DEMO_TRACKS = 16;

const songs = trackList.map((song, index) => {
    const trackNumber = (index % TOTAL_DEMO_TRACKS) + 1;
    return {
        ...song,
        audioUrl: `https://www.soundhelix.com/examples/mp3/SoundHelix-Song-${trackNumber}.mp3`,
        coverImage: `https://picsum.photos/seed/song${index + 1}/400/400`,
    };
});

async function seed() {
    try {
        await mongoose.connect(process.env.MONGO_URI);
        console.log('MongoDB connected');

        await Song.deleteMany({});
        await Song.insertMany(songs);
        console.log(`Seeded ${songs.length} songs`);

        const adminExists = await User.findOne({ email: 'admin@musicapp.com' });
        if (!adminExists) {
            const hashedPassword = await bcrypt.hash('Admin@123', 10);
            await User.create({
                username: 'admin',
                email: 'admin@musicapp.com',
                password: hashedPassword,
                role: 'admin',
            });
            console.log('Admin user created: admin@musicapp.com / Admin@123');
        } else {
            console.log('Admin user already exists');
        }

        console.log('Seed complete');
        process.exit(0);
    } catch (err) {
        console.error('Seed failed:', err);
        process.exit(1);
    }
}

seed();
