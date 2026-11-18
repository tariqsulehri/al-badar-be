// Runs before each test file, before any app module is loaded.
process.env.NODE_ENV = "test";
process.env.NODE_SECRET_KEY = "test-secret-key-that-is-at-least-32-characters-long";
process.env.DB = process.env.TEST_DB_URI || "mongodb://127.0.0.1:27017/slides_test";
process.env.CORS_ORIGINS = "http://localhost:3000";
process.env.LOGIN_RATE_LIMIT = "1000";
