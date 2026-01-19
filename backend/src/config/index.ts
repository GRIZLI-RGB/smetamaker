import dotenv from "dotenv";

dotenv.config();

export const config = {
	env: process.env.NODE_ENV || "development",
	port: parseInt(process.env.PORT || "8000", 10),

	deepseek: {
		apiKey: process.env.DEEPSEEK_API_KEY!,
		baseURL: process.env.DEEPSEEK_BASE_URL || "https://api.deepseek.com",
		timeout: parseInt(process.env.DEEPSEEK_TIMEOUT || "30000", 10),
		model: process.env.DEEPSEEK_MODEL || "deepseek-chat",
	},

	rateLimit: {
		windowMs: 15 * 60 * 1000, // 15 минут
		max: 100, // 100 запросов за окно
	},

	cache: {
		ttl: 3600, // 1 час в секундах
	},
};

// Валидация обязательных переменных
if (!config.deepseek.apiKey) {
	throw new Error("DEEPSEEK_API_KEY is required");
}
