import Redis from "ioredis";
import dotenv from "dotenv";

dotenv.config();

export const redis = new Redis(process.env.UPSTASH_REDIS_URL, {
	tls: {
		rejectUnauthorized: false
	}
});

redis.on('error', (err) => {
	console.log('Redis connection error:', err.message);
});

redis.on('connect', () => {
	console.log('Redis connected successfully');
});
