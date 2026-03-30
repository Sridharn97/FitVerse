const mongoose = require('mongoose');

const connectDB = async () => {
  const mongoURI = process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/fitverse';

  const autoIndexEnv = String(process.env.MONGOOSE_AUTO_INDEX || '').toLowerCase();
  const autoIndex =
    autoIndexEnv === 'true'
      ? true
      : autoIndexEnv === 'false'
        ? false
        : process.env.NODE_ENV !== 'production';

  await mongoose.connect(mongoURI, {
    autoIndex,
  });

  console.log(`MongoDB connected: ${mongoose.connection.host}`);
};

module.exports = connectDB;
