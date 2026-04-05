import dotenv from 'dotenv';
dotenv.config();

export const PORT = process.env.PORT || 7000;
export const MongoURI = process.env.MONGO_URI;
export const JWT_SECRET = process.env.JWT_SECRET || 'fallback_secret';