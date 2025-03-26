export default {
  preset: "ts-jest",
  testEnvironment: "node",
  testMatch: ["**/*.tests.ts"],
  collectCoverage: true,
  collectCoverageFrom: [
    "core/**/*.ts",
    "lib/**/*.ts",
    "!**/*.d.ts",
  ],
  coverageDirectory: "coverage",
  coverageReporters: ["text", "json", "html"],
  coverageThreshold: {
    global: {
      branches: 79,
      functions: 100,
      lines: 80,
      statements: 80,
    },
  },
};