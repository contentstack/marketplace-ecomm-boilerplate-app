module.exports = {
  testEnvironment: "node",
  transform: { "^.+\\.ts$": "ts-jest" },
  testMatch: ["<rootDir>/tests/**/*.test.ts"],
  clearMocks: true,
  collectCoverageFrom: [
    "index.ts",
    "handler/**/*.ts",
    "constants/**/*.ts",
    "root_config/**/*.ts",
  ],
  coverageDirectory: "coverage",
  coverageReporters: ["text-summary", "text"],
  // ratchet target 90 — MKT-19936
  coverageThreshold: { global: { lines: 98, branches: 79 } },
};
