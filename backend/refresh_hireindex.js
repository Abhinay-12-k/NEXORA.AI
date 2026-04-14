const dotenv = require('dotenv');
const path = require('path');
dotenv.config({ path: path.join(__dirname, '.env') });

const mongoose = require('mongoose');
const User = require('./src/modules/users/user.model');
const hireIndexService = require('./src/modules/hireIndex/hireIndex.service');

const refresh = async () => {
    try {
        await mongoose.connect('mongodb://localhost:27017/sipa');
        const interns = await User.find({ role: 'intern' });
        console.log(`Refreshing HireIndex for ${interns.length} interns...`);

        for (const intern of interns) {
            try {
                const result = await hireIndexService.calculateHireIndex(intern._id);
                console.log(`✅ ${intern.name}: Score ${result.score}%`);
            } catch (e) {
                console.error(`❌ ${intern.name}: ${e.message}`);
            }
        }

    } catch (err) {
        console.error('FATAL:', err);
    } finally {
        await mongoose.connection.close();
        process.exit();
    }
};

refresh();
