module.exports = {
  testEnvironment: "node",
  transform: { "^.+\\.ts$": "ts-jest" },
  testMatch: ["<rootDir>/tests/**/*.test.ts"],
  clearMocks: true,
};
