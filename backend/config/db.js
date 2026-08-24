const dns = require('dns');
try {
  dns.setServers(['8.8.8.8', '1.1.1.1']);
} catch (e) {}

const mongoose = require('mongoose');

const connectDB = async () => {
  try {
    const connString = process.env.MONGODB_URI;
    if (!connString || connString.includes('your_mongodb_atlas_connection_string')) {
      console.warn('⚠️ MONGODB_URI is not configured in backend/.env file.');
      console.warn('⚠️ Server will run with fallback mock data.');
      return false;
    }

    console.log('📡 Connecting to MongoDB Atlas database...');
    const conn = await mongoose.connect(connString, {
      dbName: 'online_shopping_db',
      serverSelectionTimeoutMS: 8000
    });

    console.log(`✅ MongoDB Atlas Connected Successfully: ${conn.connection.host} [Database: online_shopping_db]`);
    return true;
  } catch (error) {
    console.warn(`\n⚠️ MongoDB Atlas Notice: ${error.message}`);
    if (error.message.includes('bad auth')) {
      console.warn('🔑 Quick Fix for "bad auth":');
      console.warn('   1. Log into https://cloud.mongodb.com');
      console.warn('   2. Go to "Security" -> "Database Access"');
      console.warn('   3. Edit user "premkumar08012005_db_user" and click "Edit Password"');
      console.warn('   4. Set password to simple alphanumeric password like "Prem12345"');
      console.warn('   5. Update MONGODB_URI in backend/.env to use "Prem12345"\n');
    }
    console.log('🚀 Express Server will continue running to serve the website catalog!');
    return false;
  }
};

module.exports = connectDB;
