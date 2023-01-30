declare global {
  interface Window {
    ENV: { app_env: string };
  }
}

window.ENV.app_env = "development";

export {};
