/** @type {import('ts-jest').JestConfigWithTsJest} */
import type { Config } from "jest";
const config: Config = {
  preset: "ts-jest",
  testEnvironment: "node",
  testMatch: ["**/**/*.test.ts", "**/test/**/*.test.ts"],
  verbose: true,
  forceExit: true,
  moduleFileExtensions: ["js", "ts"],
  clearMocks: true,
  transform: { "\\.[jt]sx?$": "ts-jest" },
};

export default config;
