import type N from "@neutralinojs/lib";

declare global {
  const Neutralino: typeof N;
  // https://neutralino.js.org/docs/api/global-variables
  const NL_OS: string; // Operating system name: Linux, Windows, or Darwin
  const NL_APPID: string; // Application identifier
  const NL_APPVERSION: string; // Application version
  const NL_PORT: string; // Application port
  const NL_MODE: string; // Mode of the application: window, browser, cloud, or chrome
  const NL_VERSION: string; // Neutralinojs framework version
  const NL_CVERSION: string; // Neutralinojs client version
  const NL_CWD: string; // Current working directory
  const NL_PATH: string; // Application path
  const NL_ARGS: string; // Command-line arguments
  const NL_PID: string; // Identifier of the current process
  const NL_RESMODE: string; // Source of application resources: bundle or directory
  const NL_EXTENABLED: string; // Returns true if extensions are enabled
  const NL_COMMIT: string; // Framework binary's release commit hash
  const NL_CCOMMIT: string; // Client librar's release commit hash
  const NL_CMETHODS: string; // Custom method identifiers (Returns the same output that custom.getMethods https://neutralino.js.org/docs/api/custom#customgetmethods returns).
}

export {};
