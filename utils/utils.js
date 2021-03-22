require('dotenv').config();

const { NODE_ENV, JWT_SECRET } = process.env;

// Mongo server address
const mongoServer = 'mongodb://localhost:27017/news-explorer';

// Secret key for hashing passwords
const secretKey = NODE_ENV === 'production' ? JWT_SECRET : 'dev-secret';

// URL validation
const regex = /https?:\/\/(www\.)?[a-zA-Z0-9-@:%_+.~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b([a-zA-Z0-9-@:%_+.~#=?&/]*)/;

module.exports = { regex, secretKey, mongoServer };
