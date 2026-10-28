// Single source of truth for the backend origin used by the browser app.
// Every API call must build its URL from API_ORIGIN / API_BASE_URL.
//
// Local development:
//   - defaults to http://localhost:5000 when VITE_API_URL is unset
//   - refuses to start if VITE_API_URL points at a production host
//
// Production builds:
//   - use VITE_API_URL when provided
//   - otherwise keep the existing deployed origin so current deployments are unchanged

const LOCAL_ORIGIN = "http://localhost:5000";
const PRODUCTION_ORIGIN = "https://lecharlotlimo-aucd.onrender.com";

const PRODUCTION_HOSTS = [
  "lecharlotlimo-aucd.onrender.com",
  "lecharlotlimo.onrender.com",
];

const isProductionHost = (value) => {
  try {
    return PRODUCTION_HOSTS.includes(new URL(value).hostname.toLowerCase());
  } catch {
    return false;
  }
};

const configured = (import.meta.env.VITE_API_URL || "")
  .trim()
  .replace(/\/+$/, "");

if (import.meta.env.DEV && configured && isProductionHost(configured)) {
  throw new Error(
    "[api] VITE_API_URL points at a production host during local development. " +
      "Set it to http://localhost:5000 (or leave it unset) and restart the dev server."
  );
}

export const API_ORIGIN =
  configured || (import.meta.env.DEV ? LOCAL_ORIGIN : PRODUCTION_ORIGIN);

export const API_BASE_URL = `${API_ORIGIN}/api`;
