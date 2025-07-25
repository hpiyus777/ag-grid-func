// This file contains global type declarations

interface Window {
  selectedDate?: string;
  debugTimeCards?: () => void;
}

// Add process.env for development environment checks
declare const process: {
  env: {
    NODE_ENV: "development" | "production" | "test";
  };
};
