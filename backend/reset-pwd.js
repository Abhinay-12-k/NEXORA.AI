const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const resetPassword = async () => {
    try {
        await mongoose.connect('mongodb://localhost:27017/sipa');
        const salt = await bcrypt.genSalt(10);
        const hash = await bcrypt.hash('password123', salt);
        const result = await mongoose.connection.db.collection('users').updateOne(
            { email: 'abhinaykamagonda@gmail.com' },
            { $set: { password: hash } }
        );
        console.log('Password updated successfully for abhinaykamagonda@gmail.com');
        console.log('Result:', result);
        process.exit(0);
    } catch (error) {
        console.error('Error updating password:', error);
        process.exit(1);
    }
};

resetPassword();
