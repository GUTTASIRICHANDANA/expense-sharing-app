const mongoose = require('mongoose');
const dotenv = require('dotenv');
const User = require('./src/models/User');
const Group = require('./src/models/Group');

dotenv.config();

const seedData = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI, {
            useNewUrlParser: true,
            useUnifiedTopology: true
        });
        console.log('MongoDB Connected for Seeding');

        // Clear existing data
        await User.deleteMany({});
        await Group.deleteMany({});

        // Create Users
        const users = await User.insertMany([
            { name: 'Alice', email: 'alice@example.com' },
            { name: 'Bob', email: 'bob@example.com' },
            { name: 'Charlie', email: 'charlie@example.com' }
        ]);
        console.log('Users created');

        // Create Group
        const group = await Group.create({
            name: 'Trip to Vegas',
            members: users.map(user => user._id)
        });
        console.log('Group created');

        process.exit();
    } catch (error) {
        console.error(`Error: ${error.message}`);
        process.exit(1);
    }
};

seedData();
